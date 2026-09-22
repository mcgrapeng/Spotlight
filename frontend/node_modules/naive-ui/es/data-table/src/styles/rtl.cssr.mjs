import { c, cB, cM } from "../../../_utils/cssr/index.mjs";
//#region src/data-table/src/styles/rtl.cssr.ts
var rtl_cssr_default = c([cB("data-table", [cM("rtl", `
 direction: rtl;
 `, [cB("data-table-th", [cM("filterable", `
 padding-left: 36px;
 padding-right: var(--n-th-padding);
 `, [cM("sortable", `
 padding-right: var(--n-th-padding);
 padding-left: calc(var(--n-th-padding) + 36px);
 `)]), cB("data-table-sorter", `
 margin-left: 0;
 margin-right: 4px;
 `), cB("data-table-filter", `
 right: unset;
 left: 0;
 `)])])]), cB("data-table-filter-menu", [cM("rtl", `
 direction: rtl;
 `)])]);
//#endregion
export { rtl_cssr_default as default };