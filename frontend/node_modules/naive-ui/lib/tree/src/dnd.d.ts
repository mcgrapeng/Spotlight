import { DropPosition, TreeOption } from "./interface.js";
import { VNode } from "vue";
//#region src/tree/src/dnd.d.ts
declare function renderDropMark({ position, offsetLevel, indent, el }: {
  position: 'before' | 'inside' | 'after';
  offsetLevel: number;
  indent: number;
  el: HTMLElement;
}): VNode;
declare function defaultAllowDrop({ dropPosition, node }: {
  dropPosition: DropPosition;
  node: TreeOption;
}): boolean;
//#endregion
export { defaultAllowDrop, renderDropMark };