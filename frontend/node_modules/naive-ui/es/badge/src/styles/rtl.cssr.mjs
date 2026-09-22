import { cB, cM } from "../../../_utils/cssr/index.mjs";
//#region src/badge/src/styles/rtl.cssr.ts
var rtl_cssr_default = cB("badge", [cM("rtl", `
 direction: rtl;
 `, [cB("badge-sup", `
 right: 100%;
 left: unset;
 transform: translateX(50%);
 direction: initial;
 `)])]);
//#endregion
export { rtl_cssr_default as default };