import {
  AnyApplicationCommand,
  ApplicationCommandTypes,
  Client,
  ClientOptions,
  CreateApplicationCommandOptions,
} from "oceanic.js";

import { Telemetry } from "@/shared/utils/telemetry";

import { Listener } from "./structures/Listener";
import { Command, CommandBuilder } from "./structures/command";

export function createClient(options: ClientOptions): Client {
  const client = new Client(options);

  Listener.listeners.forEach((listeners, _listener) => {
    listeners.forEach((listener) => {
      client.on(listener.listener, listener.execute);
    });
  });

  client.once("ready", async () => {
    const commands = await client.application.getGlobalCommands();
    const [oldSlashCommands, _oldMessageContextCommands, _oldUserContextCommands] =
      commands.length > 0
        ? commands.reduce(
            (acc: AnyApplicationCommand[][], v) => {
              const [a, b, c] = acc;

              switch (v.type) {
                case ApplicationCommandTypes.CHAT_INPUT: {
                  a.push(v);
                  break;
                }

                case ApplicationCommandTypes.MESSAGE: {
                  b.push(v);
                  break;
                }

                case ApplicationCommandTypes.USER: {
                  c.push(v);
                  break;
                }
              }

              return [a, b, c];
            },
            [[], [], []],
          )
        : [[], [], []];

    const [
      registeredSlashCommands,
      _registeredMessageContextCommands,
      _registeredUserContextCommand,
    ]: Command[][] = [[], [], []];

    CommandBuilder.commands.forEach((command) => {
      if (command.isChatInput()) {
        const oldSlash = oldSlashCommands.find((cmd) => cmd.name === command.name);
        const slashCommandData: CreateApplicationCommandOptions = {
          name: command.name,
          description: command.description,
          type: ApplicationCommandTypes.CHAT_INPUT,
          defaultMemberPermissions: command.requirements?.permissions,
          dmPermission: command.requirements?.dmPermission ?? false,
          options: command.options ?? [],
        };

        if (!oldSlash) {
          client
            .application!.createGlobalCommand(slashCommandData)
            .then(() => Telemetry.log(`Command ${command.name} has been registered`))
            .catch((err) =>
              Telemetry.error(
                `Unable to create the global command due error: ${err.message}`,
              ),
            );
          return;
        }
        if (
          oldSlash.defaultMemberPermissions !==
            slashCommandData.defaultMemberPermissions ||
          oldSlash.dmPermission !== slashCommandData.dmPermission ||
          oldSlash.name !== slashCommandData.name ||
          oldSlash.description !== slashCommandData.description
        ) {
          client
            .application!.editGlobalCommand(oldSlash.id, slashCommandData)
            .then(() => Telemetry.log(`Command ${command.name} has been edited`))
            .catch((err) =>
              Telemetry.error(
                `Unable to edit the global command due error: ${err.messagw}`,
              ),
            );
        }

        registeredSlashCommands.push(command);
      }
    });

    Promise.all(
      oldSlashCommands
        .filter(
          (oldCmd) => !registeredSlashCommands.some((cmd) => oldCmd.name === cmd.name),
        )
        .map((e) => client.application!.deleteGlobalCommand(e.id)),
    );
  });

  return client;
}
