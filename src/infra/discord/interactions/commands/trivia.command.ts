import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from "oceanic.js";

import { CommandBuilder } from "@/core/discord/structures/command";
import { fetchTrivia } from "@/infra/trivia";
import { TriviaGame } from "@/shared/modules/TriviaGame";

new CommandBuilder({
  name: "trivia",
  description: "Start a trivia game.",
  type: ApplicationCommandTypes.CHAT_INPUT,
  options: [
    {
      name: "questions",
      description: "Number of questions.",
      type: ApplicationCommandOptionTypes.NUMBER,
      minValue: 1,
      maxValue: 30,
    },
    {
      name: "seconds",
      description: "Seconds to answer each question.",
      type: ApplicationCommandOptionTypes.NUMBER,
      minValue: 5,
      maxValue: 30,
    },
  ],
  async execute(interaction) {
    await interaction.defer();
    if (!interaction.inCachedGuildChannel()) {
      interaction.editOriginal({
        content: "Trivia game only can be executed in guild!",
      });
      return;
    }

    const questions = interaction.data.options.getNumber("questions") ?? 5;
    let time = interaction.data.options.getNumber("seconds") ?? 30;
    if (time <= 5) time = 5;

    const response = await fetchTrivia({
      amount: Number(questions),
    });

    const game = new TriviaGame({
      channelId: interaction.channelID,
      guildId: interaction.guildID,
      questions: response.results,
      interaction,
      time,
    });

    await game.start();
  },
});
