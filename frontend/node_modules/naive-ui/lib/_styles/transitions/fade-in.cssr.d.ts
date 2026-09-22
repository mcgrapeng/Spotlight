import { CNode } from "css-render";
//#region src/_styles/transitions/fade-in.cssr.d.ts
interface FadeInTransitionOptions {
  name?: string;
  enterDuration?: string;
  leaveDuration?: string;
  enterCubicBezier?: string;
  leaveCubicBezier?: string;
}
declare function fadeInTransition({ name, enterDuration, leaveDuration, enterCubicBezier, leaveCubicBezier }?: FadeInTransitionOptions): CNode[];
//#endregion
export { fadeInTransition };