# Trivia Discord Bot
## Prerequisites

Before running the bot, make sure you have the following prerequisites installed:

- Node.js LTS: You can download and install it from [nodejs.org](https://nodejs.org/en).
- Docker: You can download and install it from [docker.com](https://docker.com).

## Configuration

### Postgres Database
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


## Development

To run the bot in development mode, follow these steps:

1. It is recommended to use Visual Studio Code with the DevContainers extension. If you don't have it, you can install it from the Visual Studio Code marketplace.
2. Open the bot's folder in Visual Studio Code.
3. Press `Ctrl+Shift+P` to open the command palette.
4. Run the command `Dev Containers: Open Folder in Container`.
5. Select the bot's folder in the file explorer.
6. Visual Studio Code will open a new workspace within the Dev Container.
7. The PostgreSQL server will be automatically running with the credentials from the `.env` file.

## Production

To run the bot in production, follow these steps:

1. Configure the `.env` file with your Discord bot token and PostgreSQL credentials (as mentioned in the Configuration section).
2. Install Node.js LTS from [nodejs.org](https://nodejs.org/en).
3. Navigate to the bot's folder in your terminal.
4. Run the following command to build and start the bot: **`npm run build:start`**
