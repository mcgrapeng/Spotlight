import { c, cB } from "../../../_utils/cssr/index.mjs";
import { fadeInScaleUpTransition } from "../../../_styles/transitions/fade-in-scale-up.cssr.mjs";
//#region src/mention/src/styles/index.cssr.ts
var index_cssr_default = c([cB("mention", "width: 100%; z-index: auto; position: relative;"), cB("mention-menu", `
 box-shadow: var(--n-menu-box-shadow);
 `, [fadeInScaleUpTransition({
  originalTransition: "background-color .3s var(--n-bezier), box-shadow .3s var(--n-bezier)"
})])]);
//#endregion
export { index_cssr_default as default };