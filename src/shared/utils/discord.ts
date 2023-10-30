import { ButtonStyles, ComponentTypes, MessageActionRow } from "oceanic.js";

export function getButtonComponent(id: string, rows: MessageActionRow[]) {
  for (const row of rows) {
    for (const component of row.components) {
      if (component.type !== ComponentTypes.BUTTON) return;
      if (component.style !== ButtonStyles.LINK && component.customID === id)
        return component;
    }
  }

  return null;
}
