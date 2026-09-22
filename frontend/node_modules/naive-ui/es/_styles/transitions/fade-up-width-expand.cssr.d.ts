import { CNode } from "css-render";
//#region src/_styles/transitions/fade-up-width-expand.cssr.d.ts
interface FadeUpWidthExpandTransition {
  duration?: string;
}
declare function fadeUpWidthExpandTransition({ duration }?: FadeUpWidthExpandTransition): CNode[];
//#endregion
export { fadeUpWidthExpandTransition };