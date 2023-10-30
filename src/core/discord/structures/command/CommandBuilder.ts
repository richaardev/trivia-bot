import { ApplicationCommandTypes, Collection } from "oceanic.js";

import { Command } from "./Command";
import {
  ChatInputCommandOptions,
  UserContextCommandOptions,
  MessageContextCommandOptions,
  ChatInputCommand,
  MessageContextCommand,
  UserContextCommand,
} from "./types";

export type AnyCommandOptions =
  | ChatInputCommandOptions
  | UserContextCommandOptions
  | MessageContextCommandOptions;

export class CommandBuilder {
  public static commands = new Collection<string, Command>();

  public static find<T extends ApplicationCommandTypes>(
    name: string,
    type: T,
  ): Command | undefined {
    const c = CommandBuilder.commands.find((c) => c.name === name && c.type === type);

    return c;
  }

  constructor(data: ChatInputCommandOptions);
  constructor(data: UserContextCommandOptions);
  constructor(data: MessageContextCommandOptions);
  constructor(data: AnyCommandOptions) {
    let command: Command | null = null;

    const { CHAT_INPUT, USER, MESSAGE } = ApplicationCommandTypes;
    if (data.type === CHAT_INPUT) command = new ChatInputCommand(data);
    if (data.type === MESSAGE) command = new MessageContextCommand(data);
    if (data.type === USER) command = new UserContextCommand(data);

    if (command) CommandBuilder.commands.set(data.name, command);
  }
}
