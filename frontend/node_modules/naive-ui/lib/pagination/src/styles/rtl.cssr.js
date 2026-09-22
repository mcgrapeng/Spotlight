const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/pagination/src/styles/rtl.cssr.ts
var rtl_cssr_default = require__utils_cssr_index.cB("pagination", [require__utils_cssr_index.cM("rtl", `
 direction: rtl;
 `, [require__utils_cssr_index.c("> *:not(:first-child)", `
 margin: var(--n-item-margin-rtl);
 `), require__utils_cssr_index.cB("pagination-quick-jumper", [require__utils_cssr_index.cB("input", `
 margin: var(--n-input-margin-rtl);
 `)])])]);
//#endregion
module.exports = rtl_cssr_default;