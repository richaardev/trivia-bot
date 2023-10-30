import {
  ApplicationCommandOptions,
  ApplicationCommandTypes,
  CommandInteraction,
} from "oceanic.js";

import { CommandBaseOptions, Command } from "../Command";

export interface ChatInputCommandOptions extends Omit<CommandBaseOptions, "execute"> {
  description: string;
  type: ApplicationCommandTypes.CHAT_INPUT;
  options?: ApplicationCommandOptions[];
  execute: (interaction: CommandInteraction) => Promise<void>;
}
export class ChatInputCommand extends Command {
  public type: ApplicationCommandTypes.CHAT_INPUT;
  public description: string;
  public options: ApplicationCommandOptions[];

  constructor({
    description,
    name,
    options,
    type,
    requirements,
    execute,
  }: ChatInputCommandOptions) {
    super({
      name,
      type,
      requirements,
      execute,
    });

    this.type = ApplicationCommandTypes.CHAT_INPUT;
    this.options = options ?? [];
    this.description = description;
  }
}
