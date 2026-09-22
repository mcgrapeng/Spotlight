const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/descriptions/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("descriptions", {
  fontSize: "var(--n-font-size)"
}, [require__utils_cssr_index.cB("descriptions-separator", `
 display: inline-block;
 margin: 0 8px 0 2px;
 `), require__utils_cssr_index.cB("descriptions-table-wrapper", [require__utils_cssr_index.cB("descriptions-table", [require__utils_cssr_index.cB("descriptions-table-row", [require__utils_cssr_index.cB("descriptions-table-header", {
  padding: "var(--n-th-padding)"
}), require__utils_cssr_index.cB("descriptions-table-content", {
  padding: "var(--n-td-padding)"
})])])]), require__utils_cssr_index.cNotM("bordered", [require__utils_cssr_index.cB("descriptions-table-wrapper", [require__utils_cssr_index.cB("descriptions-table", [require__utils_cssr_index.cB("descriptions-table-row", [require__utils_cssr_index.c("&:last-child", [require__utils_cssr_index.cB("descriptions-table-content", {
  paddingBottom: 0
})])])])])]), require__utils_cssr_index.cM("left-label-placement", [require__utils_cssr_index.cB("descriptions-table-content", [require__utils_cssr_index.c("> *", {
  verticalAlign: "top"
})])]), require__utils_cssr_index.cM("left-label-align", [require__utils_cssr_index.c("th", {
  textAlign: "left"
})]), require__utils_cssr_index.cM("center-label-align", [require__utils_cssr_index.c("th", {
  textAlign: "center"
})]), require__utils_cssr_index.cM("right-label-align", [require__utils_cssr_index.c("th", {
  textAlign: "right"
})]), require__utils_cssr_index.cM("bordered", [require__utils_cssr_index.cB("descriptions-table-wrapper", `
 border-radius: var(--n-border-radius);
 overflow: hidden;
 background: var(--n-merged-td-color);
 border: 1px solid var(--n-merged-border-color);
 `, [require__utils_cssr_index.cB("descriptions-table", [require__utils_cssr_index.cB("descriptions-table-row", [require__utils_cssr_index.c("&:not(:last-child)", [require__utils_cssr_index.cB("descriptions-table-content", {
  borderBottom: "1px solid var(--n-merged-border-color)"
}), require__utils_cssr_index.cB("descriptions-table-header", {
  borderBottom: "1px solid var(--n-merged-border-color)"
})]), require__utils_cssr_index.cB("descriptions-table-header", `
 font-weight: 400;
 background-clip: padding-box;
 background-color: var(--n-merged-th-color);
 `, [require__utils_cssr_index.c("&:not(:last-child)", {
  borderRight: "1px solid var(--n-merged-border-color)"
})]), require__utils_cssr_index.cB("descriptions-table-content", [require__utils_cssr_index.c("&:not(:last-child)", {
  borderRight: "1px solid var(--n-merged-border-color)"
})])])])])]), require__utils_cssr_index.cB("descriptions-header", `
 font-weight: var(--n-th-font-weight);
 font-size: 18px;
 transition: color .3s var(--n-bezier);
 line-height: var(--n-line-height);
 margin-bottom: 16px;
 color: var(--n-title-text-color);
 `), require__utils_cssr_index.cB("descriptions-table-wrapper", `
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cB("descriptions-table", `
 width: 100%;
 border-collapse: separate;
 border-spacing: 0;
 box-sizing: border-box;
 `, [require__utils_cssr_index.cB("descriptions-table-row", `
 box-sizing: border-box;
 transition: border-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cB("descriptions-table-header", `
 font-weight: var(--n-th-font-weight);
 line-height: var(--n-line-height);
 display: table-cell;
 box-sizing: border-box;
 color: var(--n-th-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cB("descriptions-table-content", `
 vertical-align: top;
 line-height: var(--n-line-height);
 display: table-cell;
 box-sizing: border-box;
 color: var(--n-td-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cE("content", `
 transition: color .3s var(--n-bezier);
 display: inline-block;
 color: var(--n-td-text-color);
 `)]), require__utils_cssr_index.cE("label", `
 font-weight: var(--n-th-font-weight);
 transition: color .3s var(--n-bezier);
 display: inline-block;
 margin-right: 14px;
 color: var(--n-th-text-color);
 `)])])])]), require__utils_cssr_index.cB("descriptions-table-wrapper", `
 --n-merged-th-color: var(--n-th-color);
 --n-merged-td-color: var(--n-td-color);
 --n-merged-border-color: var(--n-border-color);
 `), require__utils_cssr_index.insideModal(require__utils_cssr_index.cB("descriptions-table-wrapper", `
 --n-merged-th-color: var(--n-th-color-modal);
 --n-merged-td-color: var(--n-td-color-modal);
 --n-merged-border-color: var(--n-border-color-modal);
 `)), require__utils_cssr_index.insidePopover(require__utils_cssr_index.cB("descriptions-table-wrapper", `
 --n-merged-th-color: var(--n-th-color-popover);
 --n-merged-td-color: var(--n-td-color-popover);
 --n-merged-border-color: var(--n-border-color-popover);
 `))]);
//#endregion
module.exports = index_cssr_default;