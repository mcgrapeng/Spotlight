import { c, cB, cE, cM } from "../../../_utils/cssr/index.mjs";
//#region src/dialog/src/styles/rtl.cssr.ts
var rtl_cssr_default = cB("dialog", [cM("rtl", `
 --n-icon-margin: var(--n-icon-margin-top) var(--n-icon-margin-left) var(--n-icon-margin-bottom) var(--n-icon-margin-right);
 direction: rtl;
 `, [cE("close", `
 right: unset;
 left: 0;
 margin-left: 1.8rem;
 `), cE("action", `
 direction: rtl;
 display: flex;
 `, [c("> *:not(:first-child)", `
 margin-right: var(--n-action-space);
 `), c("> *", `
 margin-right: 0;
 `)]), cM("icon-left", [cM("closable", [cE("title", `
 padding-right: unset;
 `)])])])]);
//#endregion
export { rtl_cssr_default as default };