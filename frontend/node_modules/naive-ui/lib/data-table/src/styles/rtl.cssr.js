const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/data-table/src/styles/rtl.cssr.ts
var rtl_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("data-table", [require__utils_cssr_index.cM("rtl", `
 direction: rtl;
 `, [require__utils_cssr_index.cB("data-table-th", [require__utils_cssr_index.cM("filterable", `
 padding-left: 36px;
 padding-right: var(--n-th-padding);
 `, [require__utils_cssr_index.cM("sortable", `
 padding-right: var(--n-th-padding);
 padding-left: calc(var(--n-th-padding) + 36px);
 `)]), require__utils_cssr_index.cB("data-table-sorter", `
 margin-left: 0;
 margin-right: 4px;
 `), require__utils_cssr_index.cB("data-table-filter", `
 right: unset;
 left: 0;
 `)])])]), require__utils_cssr_index.cB("data-table-filter-menu", [require__utils_cssr_index.cM("rtl", `
 direction: rtl;
 `)])]);
//#endregion
module.exports = rtl_cssr_default;