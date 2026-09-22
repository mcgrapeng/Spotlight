import { c, cB, cE, cM } from "../../../../_utils/cssr/index.mjs";
//#region src/_internal/scrollbar/src/styles/rtl.cssr.ts
var rtl_cssr_default = cB("scrollbar", [cM("rtl", `
 direction: rtl;
 `, [c(">", [cB("scrollbar-rail", [cM("horizontal", [c(">", [cE("scrollbar", `
 left: 0;
 right: unset;
 `)])])])])])]);
//#endregion
export { rtl_cssr_default as default };