const require__utils_cssr_index = require("../../../../_utils/cssr/index.js");
//#region src/_internal/select-menu/src/styles/rtl.cssr.ts
var rtl_cssr_default = require__utils_cssr_index.cB("base-select-menu", [require__utils_cssr_index.cM("rtl", `
 direction: rtl;
 `, [require__utils_cssr_index.cB("base-select-option", [require__utils_cssr_index.cE("check", `
 right: unset;
 left: calc(var(--n-option-padding-right) - 4px);
 `), require__utils_cssr_index.cM("show-checkmark", `
 padding-left: calc(var(--n-option-padding-right) + 20px);
 padding-right: var(--n-option-padding-left);
 `)])])]);
//#endregion
module.exports = rtl_cssr_default;