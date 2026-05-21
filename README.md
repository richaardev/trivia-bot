# Trivia Bot

**Trivia Bot** is a Discord trivia bot built with TypeScript and [oceanic.js](https://oceanic.ws/). It fetches questions from the [Open Trivia Database (OpenTDB)](https://opentdb.com/) and runs interactive multiplayer trivia games with persistent scoring via PostgreSQL.

## Features

- 🧠 Trivia questions from OpenTDB (multiple categories & difficulties)
- 👥 Multiplayer — everyone in the channel can answer simultaneously
- ⏱️ Configurable question count (1–30) and answer time (5–30s)
- 📊 Persistent player stats (correct/incorrect answers)
- 🏆 Global leaderboard (top 10 by correct answers)
- 👤 Per-user profile with stats
- ⚡ Slash commands
- 🔄 Auto-syncs commands with Discord on startup

## Preview



## Commands

| Command | Description |
|---|---|
| `/trivia` | Start a trivia game (`questions`: 1–30, `seconds`: 5–30) |
| `/profile` | Show your or another user's trivia stats |
| `/leaderboard` | Show the top 10 players with the most correct answers |

## How to Run

### Prerequisites

- Node.js 20+ (LTS)
- PostgreSQL database
- Discord Bot Token ([Discord Developer Portal](https://discord.com/developers/applications))

### 1. Clone and install

```bash
git clone https://github.com/richaardev/trivia-bot.git
cd trivia-bot
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
```

Fill in your Discord bot token and PostgreSQL connection details in `.env`.

### 3. Push database schema

```bash
npm run drizzle:push
```

### 4. Run the bot

```bash
# Development
npm run dev

# Production
npm run build && npm start
```

