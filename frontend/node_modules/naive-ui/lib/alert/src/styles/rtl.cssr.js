const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/alert/src/styles/rtl.cssr.ts
var rtl_cssr_default = require__utils_cssr_index.cB("alert", [require__utils_cssr_index.cM("rtl", `
 direction: rtl;
 `, [require__utils_cssr_index.cE("icon", `
 left: unset;
 right: 0;
 margin: var(--n-icon-margin-rtl);
 `), require__utils_cssr_index.cM("show-icon", [require__utils_cssr_index.cB("alert-body", `
 padding-left: var(--n-padding);
 padding-right: calc(var(--n-icon-margin-left) + var(--n-icon-size) + var(--n-icon-margin-right));
 `)]), require__utils_cssr_index.cE("close", `
 position: absolute;
 right: unset;
 left: 0;
 margin: var(--n-close-margin-rtl);
 `)])]);
//#endregion
module.exports = rtl_cssr_default;