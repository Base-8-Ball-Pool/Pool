// Leaderboard API
// GET  /api/leaderboard         → top 20 players
// POST /api/leaderboard         → record a game result { name, result: 'win'|'loss' }

const { kv } = require('@vercel/kv');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

module.exports = async (req, res) => {
  Object.entries(CORS).forEach(([k,v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── GET: fetch leaderboard ──────────────────────────────────────
  if (req.method === 'GET') {
    try {
      // Sorted set: key=pool:lb, score=wins, member=playerName
      // We store detailed stats as hash: pool:player:<name>
      const top = await kv.zrange('pool:lb', 0, 19, { rev: true, withScores: true });
      // top = ['name1', score1, 'name2', score2, ...]
      const rows = [];
      for (let i = 0; i < top.length; i += 2) {
        const name  = top[i];
        const wins  = top[i + 1];
        const stats = await kv.hgetall(`pool:player:${name}`) || {};
        rows.push({
          rank:   rows.length + 1,
          name,
          wins:   Number(wins),
          losses: Number(stats.losses || 0),
          played: Number(stats.played || wins),
        });
      }
      return res.json({ ok: true, rows });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ ok: false, error: e.message });
    }
  }

  // ── POST: record result ─────────────────────────────────────────
  if (req.method === 'POST') {
    const { name, result } = req.body || {};
    if (!name || !result) return res.status(400).json({ ok: false, error: 'Missing name or result' });

    // Sanitise name: max 20 chars, strip control characters
    const safe = String(name).replace(/[^\w\s\-_.]/g, '').slice(0, 20).trim();
    if (!safe) return res.status(400).json({ ok: false, error: 'Invalid name' });

    try {
      const key = `pool:player:${safe}`;
      // Increment counters atomically
      await kv.hincrby(key, 'played', 1);
      if (result === 'win') {
        await kv.hincrby(key, 'wins', 1);
        await kv.zincrby('pool:lb', 1, safe);   // sorted set score = wins
      } else {
        await kv.hincrby(key, 'losses', 1);
      }
      return res.json({ ok: true });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ ok: false, error: e.message });
    }
  }

  res.status(405).json({ ok: false, error: 'Method not allowed' });
};
