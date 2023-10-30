import { Listener } from "@/core/discord/structures/Listener";
import { Telemetry } from "@/shared/utils/telemetry";

import { client } from "..";

export const ReadyListener = new Listener({
  listener: "ready",
  async execute() {
    Telemetry.log(`${client.user.username} is successufuly connected with discord API`);
  },
});
