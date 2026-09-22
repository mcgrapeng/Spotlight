const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/timeline/src/styles/index.cssr.ts
const lineHeight = 1.25;
var index_cssr_default = require__utils_cssr_index.cB("timeline", `
 position: relative;
 width: 100%;
 display: flex;
 flex-direction: column;
 line-height: ${lineHeight};
`, [require__utils_cssr_index.cM("horizontal", `
 flex-direction: row;
 `, [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("timeline-item", `
 flex-shrink: 0;
 padding-right: 40px;
 `, [require__utils_cssr_index.cM("dashed-line-type", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("timeline-item-timeline", [require__utils_cssr_index.cE("line", `
 background-image: linear-gradient(90deg, var(--n-color-start), var(--n-color-start) 50%, transparent 50%, transparent 100%);
 background-size: 10px 1px;
 `)])])]), require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("timeline-item-content", `
 margin-top: calc(var(--n-icon-size) + 12px);
 `, [require__utils_cssr_index.c(">", [require__utils_cssr_index.cE("meta", `
 margin-top: 6px;
 margin-bottom: unset;
 `)])]), require__utils_cssr_index.cB("timeline-item-timeline", `
 width: 100%;
 height: calc(var(--n-icon-size) + 12px);
 `, [require__utils_cssr_index.cE("line", `
 left: var(--n-icon-size);
 top: calc(var(--n-icon-size) / 2 - 1px);
 right: 0px;
 width: unset;
 height: 2px;
 `)])])])])]), require__utils_cssr_index.cM("right-placement", [require__utils_cssr_index.cB("timeline-item", [require__utils_cssr_index.cB("timeline-item-content", `
 text-align: right;
 margin-right: calc(var(--n-icon-size) + 12px);
 `), require__utils_cssr_index.cB("timeline-item-timeline", `
 width: var(--n-icon-size);
 right: 0;
 `)])]), require__utils_cssr_index.cM("left-placement", [require__utils_cssr_index.cB("timeline-item", [require__utils_cssr_index.cB("timeline-item-content", `
 margin-left: calc(var(--n-icon-size) + 12px);
 `), require__utils_cssr_index.cB("timeline-item-timeline", `
 left: 0;
 `)])]), require__utils_cssr_index.cB("timeline-item", `
 position: relative;
 `, [require__utils_cssr_index.c("&:last-child", [require__utils_cssr_index.cB("timeline-item-timeline", [require__utils_cssr_index.cE("line", `
 display: none;
 `)]), require__utils_cssr_index.cB("timeline-item-content", [require__utils_cssr_index.cE("meta", `
 margin-bottom: 0;
 `)])]), require__utils_cssr_index.cB("timeline-item-content", [require__utils_cssr_index.cE("title", `
 margin: var(--n-title-margin);
 font-size: var(--n-title-font-size);
 transition: color .3s var(--n-bezier);
 font-weight: var(--n-title-font-weight);
 color: var(--n-title-text-color);
 `), require__utils_cssr_index.cE("content", `
 transition: color .3s var(--n-bezier);
 font-size: var(--n-content-font-size);
 color: var(--n-content-text-color);
 `), require__utils_cssr_index.cE("meta", `
 transition: color .3s var(--n-bezier);
 font-size: 12px;
 margin-top: 6px;
 margin-bottom: 20px;
 color: var(--n-meta-text-color);
 `)]), require__utils_cssr_index.cM("dashed-line-type", [require__utils_cssr_index.cB("timeline-item-timeline", [require__utils_cssr_index.cE("line", `
 --n-color-start: var(--n-line-color);
 transition: --n-color-start .3s var(--n-bezier);
 background-color: transparent;
 background-image: linear-gradient(180deg, var(--n-color-start), var(--n-color-start) 50%, transparent 50%, transparent 100%);
 background-size: 1px 10px;
 `)])]), require__utils_cssr_index.cB("timeline-item-timeline", `
 width: calc(var(--n-icon-size) + 12px);
 position: absolute;
 top: calc(var(--n-title-font-size) * ${lineHeight} / 2 - var(--n-icon-size) / 2);
 height: 100%;
 `, [require__utils_cssr_index.cE("circle", `
 border: var(--n-circle-border);
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 border-radius: var(--n-icon-size);
 box-sizing: border-box;
 `), require__utils_cssr_index.cE("icon", `
 color: var(--n-icon-color);
 font-size: var(--n-icon-size);
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 display: flex;
 align-items: center;
 justify-content: center;
 `), require__utils_cssr_index.cE("line", `
 transition: background-color .3s var(--n-bezier);
 position: absolute;
 top: var(--n-icon-size);
 left: calc(var(--n-icon-size) / 2 - 1px);
 bottom: 0px;
 width: 2px;
 background-color: var(--n-line-color);
 `)])])]);
//#endregion
module.exports = index_cssr_default;