import { CNode } from "css-render";
//#region src/_styles/transitions/fade-in-scale-up.cssr.d.ts
interface FadeInScaleUpTransitionOptions {
  transformOrigin?: string;
  duration?: string;
  enterScale?: string;
  originalTransform?: string;
  originalTransition?: string;
}
declare function fadeInScaleUpTransition({ transformOrigin, duration, enterScale, originalTransform, originalTransition }?: FadeInScaleUpTransitionOptions): CNode[];
//#endregion
export { fadeInScaleUpTransition };