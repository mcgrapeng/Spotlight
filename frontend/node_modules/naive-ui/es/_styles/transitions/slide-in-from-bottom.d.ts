import { CNode } from "css-render";
//#region src/_styles/transitions/slide-in-from-bottom.d.ts
interface SlideInFromBottomTransitionOptions {
  duration?: string;
  leaveDuration?: string;
  name?: string;
}
declare function slideInFromBottomTransition({ duration, leaveDuration, name }?: SlideInFromBottomTransitionOptions): CNode[];
//#endregion
export { slideInFromBottomTransition };