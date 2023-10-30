# Trivia Discord Bot
## Prerequisites

Before running the bot, make sure you have the following prerequisites installed:

- Node.js LTS: You can download and install it from [nodejs.org](https://nodejs.org/en).
- Docker: You can download and install it from [docker.com](https://docker.com).

## Configuration

### Creating postgres Database
You can run a Postgres database locally using docker, just run the folowing command:
```shell
docker run --name pg -d -p 5432:5432 -e POSTGRES_DB=postgres -e POSTGRES_USER=root -e POSTGRES_PASSWORD=docker postgres
```

Or you can use another postgres database solution like [supabase](https://supabase.com/)

### .env file
1. Rename the `.env.example` file to `.env`.
2. Open the `.env` file and update the following variables with your Discord bot token and PostgreSQL credentials:
```
DISCORD_CLIENT_TOKEN="YOUR_DISCORD_BOT_TOKEN"

POSTGRES_HOST="YOUR_POSTGRES_HOST"
POSTGRES_USERNAME="YOUR_POSTGRES_USERNAME"
POSTGRES_PASSWORD="YOUR_POSTGRES_PASSWORD"
POSTGRES_DATABASE="YOUR_POSTGRES_DATABASE"
POSTGRES_PORT="YOUR_POSTGRES_PORT"
```


## Running the bot
### With docker
If you have docker installed, you can use it to build the project and database automatically using the command 
```
docker compose up -d
```

### With NodeJS
With NodeJS installed, open your terminal in the bot folder and run `npm run build:start`, then your project will be builded and executed

**Don't forget to configure your .env file for BOTH ways**