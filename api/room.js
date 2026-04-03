// Serverless function: create / join rooms using Vercel KV (or in-memory for dev)
// Rooms are stored in Vercel KV (Redis). Falls back to a simple in-memory map for
// local dev (not shared between serverless instances – use Vercel KV in prod).

const Ably = require('ably');

// ---- helpers ----
function code4() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// We use Ably channel state as the source of truth for room presence.
// This endpoint just generates/validates codes and publishes an "init" event.

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action, code, name } = req.body || {};
  const rest = new Ably.Rest(process.env.ABLY_API_KEY);

  if (action === 'create') {
    const roomCode = code4();
    // Publish room-created marker on channel so it "exists"
    const channel = rest.channels.get(`pool:${roomCode}`);
    await channel.publish('room_created', { creator: name || 'Player 1', ts: Date.now() });
    return res.json({ ok: true, code: roomCode });
  }

  if (action === 'join') {
    if (!code || code.length !== 4) return res.json({ ok: false, error: 'Invalid code' });
    // Verify room exists via channel history
    const channel = rest.channels.get(`pool:${code.toUpperCase()}`);
    const history = await channel.history({ limit: 1 });
    if (!history.items.length) return res.json({ ok: false, error: 'Room not found' });
    return res.json({ ok: true, code: code.toUpperCase() });
  }

  res.status(400).json({ ok: false, error: 'Unknown action' });
};
