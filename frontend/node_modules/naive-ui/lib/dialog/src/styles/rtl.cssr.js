const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/dialog/src/styles/rtl.cssr.ts
var rtl_cssr_default = require__utils_cssr_index.cB("dialog", [require__utils_cssr_index.cM("rtl", `
 --n-icon-margin: var(--n-icon-margin-top) var(--n-icon-margin-left) var(--n-icon-margin-bottom) var(--n-icon-margin-right);
 direction: rtl;
 `, [require__utils_cssr_index.cE("close", `
 right: unset;
 left: 0;
 margin-left: 1.8rem;
 `), require__utils_cssr_index.cE("action", `
 direction: rtl;
 display: flex;
 `, [require__utils_cssr_index.c("> *:not(:first-child)", `
 margin-right: var(--n-action-space);
 `), require__utils_cssr_index.c("> *", `
 margin-right: 0;
 `)]), require__utils_cssr_index.cM("icon-left", [require__utils_cssr_index.cM("closable", [require__utils_cssr_index.cE("title", `
 padding-right: unset;
 `)])])])]);
//#endregion
module.exports = rtl_cssr_default;