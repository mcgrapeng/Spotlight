import { CNode } from "css-render";
//#region src/_styles/transitions/slide-in-from-right.d.ts
interface SlideInFromRightTransitionOptions {
  duration?: string;
  leaveDuration?: string;
  name?: string;
}
declare function slideInFromRightTransition({ duration, leaveDuration, name }?: SlideInFromRightTransitionOptions): CNode[];
//#endregion
export { slideInFromRightTransition };