import {
  AnyComponentButtonInteraction,
  AnyComponentInteraction,
  AnyComponentSelectMenuInteraction,
  Collection,
  ComponentTypes,
  SelectMenuTypes,
} from "oceanic.js";

interface BaseComponentRequirements {
  permissions?: bigint;
  botPermissions?: bigint;

  developersOnly?: boolean;
}

interface BaseComponentData<InteractionType extends AnyComponentInteraction> {
  requirements?: BaseComponentRequirements;
  customId: string | RegExp;
  execute(interaction: InteractionType): Promise<void>;
}

type ButtonComponentData = {
  type: ComponentTypes.BUTTON;
} & BaseComponentData<AnyComponentButtonInteraction>;

type SelectComponentData = {
  type: SelectMenuTypes;
} & BaseComponentData<AnyComponentSelectMenuInteraction>;

type AnyComponentData = ButtonComponentData | SelectComponentData;

export class ComponentBuilder {
  public static components = new Collection<string | RegExp, AnyComponentData>();
  public static find<T extends AnyComponentData["type"]>(
    customId: string,
    type: T,
  ): AnyComponentData | undefined {
    const c = ComponentBuilder.components.find(
      (c) =>
        (c.customId instanceof RegExp
          ? c.customId.test(customId)
          : c.customId === customId) && c.type === type,
    );

    return c;
  }

  constructor(data: AnyComponentData) {
    ComponentBuilder.components.set(data.customId, data);
  }
}
