import { VNode } from "vue";
//#region src/anchor/src/public-types.d.ts
interface AnchorLinkSlots {
  default?: () => VNode[];
  title?: () => VNode[];
}
//#endregion
export { AnchorLinkSlots };