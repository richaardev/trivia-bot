import { ApplicationCommandTypes, CommandInteraction } from "oceanic.js";

import { CommandBaseOptions, Command } from "../Command";

export interface MessageContextCommandOptions
  extends Omit<CommandBaseOptions, "execute"> {
  type: ApplicationCommandTypes.MESSAGE;
  execute: (interaction: CommandInteraction) => Promise<void>;
}
export class MessageContextCommand extends Command {
  public type: ApplicationCommandTypes.MESSAGE;

  constructor({ name, type, requirements, execute }: MessageContextCommandOptions) {
    super({
      name,
      type,
      requirements,
      execute,
    });

    this.type = ApplicationCommandTypes.MESSAGE;
  }
}
