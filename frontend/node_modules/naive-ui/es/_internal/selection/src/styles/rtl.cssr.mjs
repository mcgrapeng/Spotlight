import { cB, cM } from "../../../../_utils/cssr/index.mjs";
//#region src/_internal/selection/src/styles/rtl.cssr.ts
var rtl_cssr_default = cB("base-selection", [cM("rtl", `
 direction: rtl;
 --n-padding-single: var(--n-padding-single-top) var(--n-padding-single-left) var(--n-padding-single-bottom) var(--n-padding-single-right);
 --n-padding-multiple: var(--n-padding-multiple-top) var(--n-padding-multiple-left) var(--n-padding-multiple-bottom) var(--n-padding-multiple-right);
 `, [cB("base-suffix", `
 right: unset;
 left: 10px;
 `)])]);
//#endregion
export { rtl_cssr_default as default };