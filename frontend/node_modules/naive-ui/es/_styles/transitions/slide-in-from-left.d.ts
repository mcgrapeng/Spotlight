import { CNode } from "css-render";
//#region src/_styles/transitions/slide-in-from-left.d.ts
interface SlideInFromLeftTransitionOptions {
  duration?: string;
  leaveDuration?: string;
  name?: string;
}
declare function slideInFromLeftTransition({ duration, leaveDuration, name }?: SlideInFromLeftTransitionOptions): CNode[];
//#endregion
export { slideInFromLeftTransition };