const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/table/src/styles/rtl.cssr.ts
var rtl_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("table", [require__utils_cssr_index.cM("rtl", `
 direction: rtl;
 text-align: right;
 `, [require__utils_cssr_index.c("th, td", `
 border-right: 0px solid var(--n-merged-border-color);
 border-left: 1px solid var(--n-merged-border-color);
 `, [require__utils_cssr_index.c("&:last-child", `
 border-left: none;
 border-right: inherit;
 `)]), require__utils_cssr_index.cM("single-line", [require__utils_cssr_index.c("th, td", `
 border-left: 0px solid var(--n-merged-border-color);
 `)])])])]);
//#endregion
module.exports = rtl_cssr_default;