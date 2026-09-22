import { CNode } from "css-render";
//#region src/_styles/transitions/fade-down.cssr.d.ts
interface FadeDownTransitionOptions {
  name?: string;
  fromOffset?: string;
  enterDuration?: string;
  leaveDuration?: string;
  enterCubicBezier?: string;
  leaveCubicBezier?: string;
}
declare function fadeDownTransition({ name, fromOffset, enterDuration, leaveDuration, enterCubicBezier, leaveCubicBezier }?: FadeDownTransitionOptions): CNode[];
//#endregion
export { fadeDownTransition };