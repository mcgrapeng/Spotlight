import { CNode } from "css-render";
//#region src/_styles/transitions/fade-in-height-expand.cssr.d.ts
interface FadeInHeightExpandTransitionOption {
  overflow?: string;
  duration?: string;
  originalTransition?: string;
  leavingDelay?: string;
  foldPadding?: boolean;
  enterToProps?: Record<string, string | number> | undefined;
  leaveToProps?: Record<string, string | number> | undefined;
  reverse?: boolean;
}
declare function fadeInHeightExpandTransition({ overflow, duration, originalTransition, leavingDelay, foldPadding, enterToProps, leaveToProps, reverse }?: FadeInHeightExpandTransitionOption): CNode[];
//#endregion
export { fadeInHeightExpandTransition };