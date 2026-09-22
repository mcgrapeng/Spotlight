import { CNode } from "css-render";
//#region src/_styles/transitions/fade-in-width-expand.cssr.d.ts
interface FadeInWidthExpandTransition {
  duration?: string;
  delay?: string;
}
declare function fadeInWidthExpandTransition({ duration, delay }?: FadeInWidthExpandTransition): CNode[];
//#endregion
export { fadeInWidthExpandTransition };