import { InteractionTypes, MessageFlags } from "oceanic.js";

import { ComponentBuilder } from "@/core/discord/structures/Component";
import { Listener } from "@/core/discord/structures/Listener";
import { CommandBuilder } from "@/core/discord/structures/command";
import { Telemetry } from "@/shared/utils/telemetry";

export const InteractionCreateListener = new Listener({
  listener: "interactionCreate",
  execute: async (interaction) => {
    try {
      if (interaction.type === InteractionTypes.APPLICATION_COMMAND) {
        const command = CommandBuilder.find(interaction.data.name, interaction.data.type);
        await command?.execute(interaction as never);
      }

      if (interaction.type === InteractionTypes.MESSAGE_COMPONENT) {
        await ComponentBuilder.find(
          interaction.data.customID,
          interaction.data.componentType,
        )?.execute(interaction as never);
      }
    } catch (err) {
      if (err instanceof Error) {
        if (interaction.type === InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE)
          return;
        Telemetry.error(err.stack ?? err.message);

        const content = `Ocorreu um erro ao executar o comando: \`${err.message}\``;

        if (interaction.acknowledged) {
          await interaction.editOriginal({ content });
          return;
        }

        await interaction.createMessage({
          content,
          flags: MessageFlags.EPHEMERAL,
        });
      }
    }
  },
});
