import { c, cB, cM } from "../../../_utils/cssr/index.mjs";
//#region src/pagination/src/styles/rtl.cssr.ts
var rtl_cssr_default = cB("pagination", [cM("rtl", `
 direction: rtl;
 `, [c("> *:not(:first-child)", `
 margin: var(--n-item-margin-rtl);
 `), cB("pagination-quick-jumper", [cB("input", `
 margin: var(--n-input-margin-rtl);
 `)])])]);
//#endregion
export { rtl_cssr_default as default };