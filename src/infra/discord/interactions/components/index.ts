import { ComponentTypes, MessageFlags } from "oceanic.js";

import { ComponentBuilder } from "@/core/discord/structures/Component";
import { TriviaGame } from "@/shared/modules/TriviaGame";
import { getButtonComponent } from "@/shared/utils/discord";

new ComponentBuilder({
  customId: /^trivia-answer:[0-9]/,
  type: ComponentTypes.BUTTON,
  async execute(interaction) {
    if (!interaction.isButtonComponentInteraction()) return;

    const trivia = TriviaGame.list.find((t) => t.messageId === interaction.message.id);

    if (trivia && trivia.currentQuestion >= 0) {
      if (trivia.isAnswered(interaction.user.id)) {
        await interaction.createMessage({
          content: "You already answered",
          flags: MessageFlags.EPHEMERAL,
        });
        return;
      }

      const buttonText = getButtonComponent(
        interaction.data.customID,
        interaction.message.components,
      )?.label!;
      trivia.answer(interaction.user.id, buttonText);

      await interaction.createMessage({
        content: "Your answer has been registered",
        flags: MessageFlags.EPHEMERAL,
      });
    } else {
      interaction.createMessage({
        content: "This trivia game has not found!",
        flags: MessageFlags.EPHEMERAL,
      });
    }
  },
});
