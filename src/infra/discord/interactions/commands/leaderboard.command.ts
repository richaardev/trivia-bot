import { ApplicationCommandTypes } from "oceanic.js";

import { UserRespository } from "@/core/database/repositories/UserRepository";
import { CommandBuilder } from "@/core/discord/structures/command";

import { client } from "../..";

new CommandBuilder({
  name: "leaderboard",
  description: "Shows the top 10 users with highest correct answers.",
  type: ApplicationCommandTypes.CHAT_INPUT,
  requirements: {
    dmPermission: true,
  },
  options: [],
  async execute(interaction) {
    await interaction.defer();
    const top = await UserRespository.getTop();
    const users = await Promise.all(
      top.map(async (u) => client.users.get(u.id) ?? (await client.rest.users.get(u.id))),
    );

    const usersTop10 = top
      .filter((t) => users.some((u) => u?.id === t.id))
      .map((u) => {
        const user = users.find((a) => a?.id === u.id);

        return `${user?.username} - \`${u.answersCorrect}\` correct answers`;
      });

    interaction.editOriginal({
      embeds: [
        {
          color: 0x64ff5e,
          title: "Top 10 users with highest correct answers",
          author: {
            name: interaction.user.username,
            iconURL: interaction.user.avatarURL() ?? interaction.user.defaultAvatarURL(),
          },
          footer: {
            text: interaction.guild!.name,
            iconURL: interaction.guild!.iconURL() ?? undefined,
          },
          description:
            usersTop10.length === 0
              ? "**There is nobody in top 10 now!**"
              : usersTop10.join("\n"),
        },
      ],
    });
  },
});
