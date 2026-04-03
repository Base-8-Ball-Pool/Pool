# 🎱 8-Ball Pool — Vercel + Ably + KV Leaderboard

Multiplayer real-time 8-ball pool with random matchmaking and a persistent public leaderboard.

## Deploy in ~7 minutes

### 1. Free Ably API key
1. Sign up at https://ably.com (no credit card)
2. Create an App → copy the **API Key**

### 2. Push to GitHub
```bash
cd pool-game-vercel
git init && git add . && git commit -m "8-ball pool"
git remote add origin https://github.com/YOU/8ball-pool.git
git push -u origin main
```

### 3. Deploy to Vercel
1. **vercel.com** → New Project → import your GitHub repo
2. No build config needed — hit Deploy

### 4. Add Vercel KV (leaderboard storage)
1. In your Vercel project → **Storage** tab → **Create Database** → **KV**
2. Give it a name, click Create — Vercel auto-adds the env vars (`KV_URL`, `KV_REST_API_URL`, etc.)

### 5. Add Ably env var
In your Vercel project → **Settings** → **Environment Variables**:
- `ABLY_API_KEY` = your key from step 1

Redeploy (or it auto-deploys on env var change) ✅

---

## How to play

| Mode | How |
|------|-----|
| ⚡ Quick Match | Auto-paired with a random online player |
| Create Room | Get a code, share with a friend |
| Join Room | Enter friend's code |

After each game, your win/loss is automatically saved to the leaderboard.
Click **🏆 Leaderboard** from the lobby to see the top 20 players.

---

## Stack

| Layer | Tech |
|-------|------|
| Hosting | Vercel |
| Real-time | Ably WebSocket channels |
| Leaderboard storage | Vercel KV (Redis) |
| Physics | Custom HTML5 Canvas engine |
| Auth | Ably token endpoint (keeps API key server-side) |

## Local dev
```bash
npm install -g vercel
vercel link          # link to your Vercel project
vercel env pull      # pulls KV + Ably env vars to .env.local
vercel dev           # http://localhost:3000
```

## File structure
```
pool-game-vercel/
├── api/
│   ├── token.js          # Ably auth token
│   ├── room.js           # Room helper
│   └── leaderboard.js    # GET/POST leaderboard (Vercel KV)
├── public/
│   └── index.html        # Full game — HTML + CSS + JS
├── package.json
├── vercel.json
└── .gitignore
```
