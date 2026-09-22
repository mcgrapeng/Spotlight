import { CNode } from "css-render";
//#region src/_styles/transitions/slide-in-from-top.d.ts
interface SlideInFromTopTransitionOptions {
  duration?: string;
  leaveDuration?: string;
  name?: string;
}
declare function slideInFromTopTransition({ duration, leaveDuration, name }?: SlideInFromTopTransitionOptions): CNode[];
//#endregion
export { slideInFromTopTransition };