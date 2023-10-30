import { createClient } from "@/core";
import { environment } from "@/core/environment";
import { Telemetry } from "@/shared/utils/telemetry";

import "./listeners";
import "./interactions";

export const client = createClient({
  auth: `Bot ${environment.DISCORD_CLIENT_TOKEN}`,
  gateway: {
    intents: ["GUILDS", "GUILD_MESSAGES"],
  },
});

Telemetry.log("Connecting to gateaway...");
client.connect();
