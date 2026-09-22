import { CNode } from "css-render";
//#region src/_styles/transitions/icon-switch.cssr.d.ts
interface IconSwitchTransitionOptions {
  originalTransform?: string;
  left?: string | number;
  top?: string | number;
  transition?: string;
}
declare function iconSwitchTransition({ originalTransform, left, top, transition }?: IconSwitchTransitionOptions): CNode[];
//#endregion
export { iconSwitchTransition };