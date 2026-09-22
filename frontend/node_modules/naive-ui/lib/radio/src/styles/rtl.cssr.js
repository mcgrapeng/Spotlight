const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/radio/src/styles/rtl.cssr.ts
var rtl_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("radio", [require__utils_cssr_index.cM("rtl", `
 direction: rtl;
 `)]), require__utils_cssr_index.cB("radio-group", [require__utils_cssr_index.cM("rtl", `
 direction: rtl;
 `, [require__utils_cssr_index.cB("radio-button", [require__utils_cssr_index.c("&:first-child", `
 border-radius: 0 var(--n-button-border-radius) var(--n-button-border-radius) 0;
 border-right: 1px solid var(--n-button-border-color);
 border-left: 0;
 `, [require__utils_cssr_index.cE("state-border", `
 border-radius: 0 var(--n-button-border-radius) var(--n-button-border-radius) 0;
 `)]), require__utils_cssr_index.c("&:last-child", `
 border-radius: var(--n-button-border-radius) 0 0 var(--n-button-border-radius);
 border-left: 1px solid var(--n-button-border-color);
 border-right: 0;
 `, [require__utils_cssr_index.cE("state-border", `
 border-radius: var(--n-button-border-radius) 0 0 var(--n-button-border-radius);
 `)]), require__utils_cssr_index.cM("checked", `
 border-color: var(--n-button-border-color-active);
 `)])])])]);
//#endregion
module.exports = rtl_cssr_default;