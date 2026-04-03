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
