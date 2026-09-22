const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/heatmap/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("heatmap", `
 display: flex;
 flex-direction: column;
 max-width: fit-content;
 font-size: var(--n-font-size);
 `, [require__utils_cssr_index.cE("content", `
 display: block;
 `), require__utils_cssr_index.cE("calendar-table", `
 border-collapse: separate;
 border-spacing: var(--n-y-gap) var(--n-x-gap);
 font-size: var(--n-font-size);
 `), require__utils_cssr_index.cE("week-header-cell", `
 width: 27px;
 padding: 0;
 border: none;
 font-size: var(--n-font-size);
 `), require__utils_cssr_index.cE("month-label-cell", `
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 text-align: left;
 height: 15px;
 line-height: 15px;
 font-weight: var(--n-font-weight);
 padding: 0 2px 8px;
 vertical-align: bottom;
 transition: color .3s var(--n-bezier);
 `), require__utils_cssr_index.cE("week-label-cell", `
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 text-align: right;
 width: 27px;
 height: 11px;
 line-height: 11px;
 padding: 0 4px 0 0;
 border: none;
 vertical-align: middle;
 white-space: nowrap;
 font-weight: var(--n-font-weight);
 transition: color .3s var(--n-bezier);
 `), require__utils_cssr_index.cE("day-cell", `
 width: var(--n-rect-size);
 height: var(--n-rect-size);
 padding: 0;
 border: none;
 vertical-align: middle;
 transition: color .3s var(--n-bezier);
 `), require__utils_cssr_index.cE("empty-cell", `
 width: var(--n-rect-size);
 height: var(--n-rect-size);
 border-radius: var(--n-border-radius);
 `), require__utils_cssr_index.cE("footer", `
 display: flex;
 justify-content: space-between;
 margin-left: 17px;
 align-items: center;
 margin-top: 8px;
 &:has(> :only-child) {
 justify-content: flex-end;
 }
 `), require__utils_cssr_index.cE("indicator", `
 display: flex;
 align-items: center;
 justify-content: flex-end;
 `)]), require__utils_cssr_index.cB("heatmap-rect", `
 width: var(--n-rect-size);
 height: var(--n-rect-size);
 border-radius: var(--n-border-radius);
 background-color: var(--n-rect-color);
 transition: background-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cM("loading", `
 cursor: default;
 background: var(--n-loading-color-start);
 `)]), require__utils_cssr_index.cB("heatmap-color-indicator", `
 display: flex;
 align-items: center;
 justify-content: flex-end;
 gap: 4px;
 font-size: var(--n-font-size);
 `, [require__utils_cssr_index.cE("cells", `
 display: flex;
 gap: var(--n-x-gap);
 `), require__utils_cssr_index.cE("cell", `
 width: var(--n-rect-size);
 height: var(--n-rect-size);
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cE("label", `
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 `)])]);
//#endregion
module.exports = index_cssr_default;