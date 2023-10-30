import { ApplicationCommandTypes, CommandInteraction } from "oceanic.js";

import { ChatInputCommandOptions, UserContextCommandOptions } from "./types";

export interface CommandRequirements {
  developersOnly?: boolean;
  dmPermission?: boolean;
  permissions?: string;
  botPermissions?: string;
}

export type AnyInteractionFunction = (interaction: CommandInteraction) => Promise<void>;

export interface CommandBaseOptions {
  name: string;
  type: ApplicationCommandTypes;
  requirements?: CommandRequirements;
  execute: AnyInteractionFunction;
}
export class Command {
  public name: string;
  public type: ApplicationCommandTypes;
  public requirements?: CommandRequirements;
  public execute: AnyInteractionFunction;

  constructor({ name, type, requirements, execute }: CommandBaseOptions) {
    this.name = name;
    this.type = type;
    this.requirements = requirements;
    this.execute = execute;
  }

  isChatInput(): this is ChatInputCommandOptions {
    return this.type === ApplicationCommandTypes.CHAT_INPUT;
  }

  isUserCommand(): this is UserContextCommandOptions {
    return this.type === ApplicationCommandTypes.USER;
  }

  isMessageCommand(): this is UserContextCommandOptions {
    return this.type === ApplicationCommandTypes.MESSAGE;
  }
}
