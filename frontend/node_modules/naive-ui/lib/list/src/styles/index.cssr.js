const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/list/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("list", `
 --n-merged-border-color: var(--n-border-color);
 --n-merged-color: var(--n-color);
 --n-merged-color-hover: var(--n-color-hover);
 margin: 0;
 font-size: var(--n-font-size);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 padding: 0;
 list-style-type: none;
 color: var(--n-text-color);
 background-color: var(--n-merged-color);
 `, [require__utils_cssr_index.cM("show-divider", [require__utils_cssr_index.cB("list-item", [require__utils_cssr_index.c("&:not(:last-child)", [require__utils_cssr_index.cE("divider", `
 background-color: var(--n-merged-border-color);
 `)])])]), require__utils_cssr_index.cM("clickable", [require__utils_cssr_index.cB("list-item", `
 cursor: pointer;
 `)]), require__utils_cssr_index.cM("bordered", `
 border: 1px solid var(--n-merged-border-color);
 border-radius: var(--n-border-radius);
 `), require__utils_cssr_index.cM("hoverable", [require__utils_cssr_index.cB("list-item", `
 border-radius: var(--n-border-radius);
 `, [require__utils_cssr_index.c("&:hover", `
 background-color: var(--n-merged-color-hover);
 `, [require__utils_cssr_index.cE("divider", `
 background-color: transparent;
 `)])])]), require__utils_cssr_index.cM("bordered, hoverable", [require__utils_cssr_index.cB("list-item", `
 padding: 12px 20px;
 `), require__utils_cssr_index.cE("header, footer", `
 padding: 12px 20px;
 `)]), require__utils_cssr_index.cE("header, footer", `
 padding: 12px 0;
 box-sizing: border-box;
 transition: border-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.c("&:not(:last-child)", `
 border-bottom: 1px solid var(--n-merged-border-color);
 `)]), require__utils_cssr_index.cB("list-item", `
 position: relative;
 padding: 12px 0; 
 box-sizing: border-box;
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cE("prefix", `
 margin-right: 20px;
 flex: 0;
 `), require__utils_cssr_index.cE("suffix", `
 margin-left: 20px;
 flex: 0;
 `), require__utils_cssr_index.cE("main", `
 flex: 1;
 `), require__utils_cssr_index.cE("divider", `
 height: 1px;
 position: absolute;
 bottom: 0;
 left: 0;
 right: 0;
 background-color: transparent;
 transition: background-color .3s var(--n-bezier);
 pointer-events: none;
 `)])]), require__utils_cssr_index.insideModal(require__utils_cssr_index.cB("list", `
 --n-merged-color-hover: var(--n-color-hover-modal);
 --n-merged-color: var(--n-color-modal);
 --n-merged-border-color: var(--n-border-color-modal);
 `)), require__utils_cssr_index.insidePopover(require__utils_cssr_index.cB("list", `
 --n-merged-color-hover: var(--n-color-hover-popover);
 --n-merged-color: var(--n-color-popover);
 --n-merged-border-color: var(--n-border-color-popover);
 `))]);
//#endregion
module.exports = index_cssr_default;