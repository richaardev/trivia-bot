import { ApplicationCommandTypes, CommandInteraction } from "oceanic.js";

import { CommandBaseOptions, Command } from "../Command";

export interface UserContextCommandOptions extends Omit<CommandBaseOptions, "execute"> {
  type: ApplicationCommandTypes.USER;
  execute: (interaction: CommandInteraction) => Promise<void>;
}
export class UserContextCommand extends Command {
  public type: ApplicationCommandTypes.USER;

  constructor({ name, type, requirements, execute }: UserContextCommandOptions) {
    super({
      name,
      type,
      requirements,
      execute,
    });

    this.type = ApplicationCommandTypes.USER;
  }
}
