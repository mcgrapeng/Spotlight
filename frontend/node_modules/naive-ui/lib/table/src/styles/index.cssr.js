const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/table/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("table", `
 font-size: var(--n-font-size);
 font-variant-numeric: tabular-nums;
 line-height: var(--n-line-height);
 width: 100%;
 border-radius: var(--n-border-radius) var(--n-border-radius) 0 0;
 text-align: left;
 border-collapse: separate;
 border-spacing: 0;
 overflow: hidden;
 background-color: var(--n-td-color);
 border-color: var(--n-merged-border-color);
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 --n-merged-border-color: var(--n-border-color);
 `, [require__utils_cssr_index.c("th", `
 white-space: nowrap;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 text-align: inherit;
 padding: var(--n-th-padding);
 vertical-align: inherit;
 text-transform: none;
 border: 0px solid var(--n-merged-border-color);
 font-weight: var(--n-th-font-weight);
 color: var(--n-th-text-color);
 background-color: var(--n-th-color);
 border-bottom: 1px solid var(--n-merged-border-color);
 border-right: 1px solid var(--n-merged-border-color);
 `, [require__utils_cssr_index.c("&:last-child", `
 border-right: 0px solid var(--n-merged-border-color);
 `)]), require__utils_cssr_index.c("td", `
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 padding: var(--n-td-padding);
 color: var(--n-td-text-color);
 background-color: var(--n-td-color);
 border: 0px solid var(--n-merged-border-color);
 border-right: 1px solid var(--n-merged-border-color);
 border-bottom: 1px solid var(--n-merged-border-color);
 `, [require__utils_cssr_index.c("&:last-child", `
 border-right: 0px solid var(--n-merged-border-color);
 `)]), require__utils_cssr_index.cM("bordered", `
 border: 1px solid var(--n-merged-border-color);
 border-radius: var(--n-border-radius);
 `, [require__utils_cssr_index.c("tr", [require__utils_cssr_index.c("&:last-child", [require__utils_cssr_index.c("td", `
 border-bottom: 0 solid var(--n-merged-border-color);
 `)])])]), require__utils_cssr_index.cM("single-line", [require__utils_cssr_index.c("th", `
 border-right: 0px solid var(--n-merged-border-color);
 `), require__utils_cssr_index.c("td", `
 border-right: 0px solid var(--n-merged-border-color);
 `)]), require__utils_cssr_index.cM("single-column", [require__utils_cssr_index.c("tr", [require__utils_cssr_index.c("&:not(:last-child)", [require__utils_cssr_index.c("td", `
 border-bottom: 0px solid var(--n-merged-border-color);
 `)])])]), require__utils_cssr_index.cM("striped", [require__utils_cssr_index.c("tr:nth-of-type(even)", [require__utils_cssr_index.c("td", "background-color: var(--n-td-color-striped)")])]), require__utils_cssr_index.cNotM("bottom-bordered", [require__utils_cssr_index.c("tr", [require__utils_cssr_index.c("&:last-child", [require__utils_cssr_index.c("td", `
 border-bottom: 0px solid var(--n-merged-border-color);
 `)])])])]), require__utils_cssr_index.insideModal(require__utils_cssr_index.cB("table", `
 background-color: var(--n-td-color-modal);
 --n-merged-border-color: var(--n-border-color-modal);
 `, [require__utils_cssr_index.c("th", `
 background-color: var(--n-th-color-modal);
 `), require__utils_cssr_index.c("td", `
 background-color: var(--n-td-color-modal);
 `)])), require__utils_cssr_index.insidePopover(require__utils_cssr_index.cB("table", `
 background-color: var(--n-td-color-popover);
 --n-merged-border-color: var(--n-border-color-popover);
 `, [require__utils_cssr_index.c("th", `
 background-color: var(--n-th-color-popover);
 `), require__utils_cssr_index.c("td", `
 background-color: var(--n-td-color-popover);
 `)]))]);
//#endregion
module.exports = index_cssr_default;