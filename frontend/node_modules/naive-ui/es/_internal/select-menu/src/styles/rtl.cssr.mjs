import { cB, cE, cM } from "../../../../_utils/cssr/index.mjs";
//#region src/_internal/select-menu/src/styles/rtl.cssr.ts
var rtl_cssr_default = cB("base-select-menu", [cM("rtl", `
 direction: rtl;
 `, [cB("base-select-option", [cE("check", `
 right: unset;
 left: calc(var(--n-option-padding-right) - 4px);
 `), cM("show-checkmark", `
 padding-left: calc(var(--n-option-padding-right) + 20px);
 padding-right: var(--n-option-padding-left);
 `)])])]);
//#endregion
export { rtl_cssr_default as default };