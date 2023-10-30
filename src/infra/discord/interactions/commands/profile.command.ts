import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from "oceanic.js";

import { UserRespository } from "@/core/database/repositories/UserRepository";
import { CommandBuilder } from "@/core/discord/structures/command";

new CommandBuilder({
  name: "profile",
  description: "Shows a user trivia profile",
  type: ApplicationCommandTypes.CHAT_INPUT,
  requirements: {
    dmPermission: false,
  },
  options: [
    {
      type: ApplicationCommandOptionTypes.USER,
      name: "user",
      description: "The user you want to see the profile. (Default it's you)",
    },
  ],
  async execute(interaction) {
    const user = interaction.data.options.getUser("user") ?? interaction.user;

    const db = await UserRespository.getUser(user.id);

    interaction.createMessage({
      embeds: [
        {
          author: {
            name: interaction.user.username,
            iconURL: interaction.user.avatarURL() ?? interaction.user.defaultAvatarURL(),
          },
          thumbnail: {
            url: user.avatarURL() ?? user.defaultAvatarURL(),
          },
          footer: {
            text: interaction.guild!.name,
            iconURL: interaction.guild!.iconURL() ?? undefined,
          },
          color: 0x64ff5e,
          description: [
            `**User ID:** \`${user.id}\``,
            `**Username:** \`${user.username}\``,
            `**Questions answered (\`${
              db.answersCorrect + db.answersIncorrect
            }\`):** **\`${db.answersCorrect}\`** correct | **\`${
              db.answersIncorrect
            }\`** incorrect`,
          ].join("\n"),
        },
      ],
    });
  },
});
