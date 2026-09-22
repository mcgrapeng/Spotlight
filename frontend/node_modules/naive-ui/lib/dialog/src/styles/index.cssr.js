const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/dialog/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("dialog", `
 --n-icon-margin: var(--n-icon-margin-top) var(--n-icon-margin-right) var(--n-icon-margin-bottom) var(--n-icon-margin-left);
 word-break: break-word;
 line-height: var(--n-line-height);
 position: relative;
 background: var(--n-color);
 color: var(--n-text-color);
 box-sizing: border-box;
 margin: auto;
 border-radius: var(--n-border-radius);
 padding: var(--n-padding);
 transition: 
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cE("icon", `
 color: var(--n-icon-color);
 `), require__utils_cssr_index.cM("bordered", `
 border: var(--n-border);
 `), require__utils_cssr_index.cM("icon-top", [require__utils_cssr_index.cE("close", `
 margin: var(--n-close-margin);
 `), require__utils_cssr_index.cE("icon", `
 margin: var(--n-icon-margin);
 `), require__utils_cssr_index.cE("content", `
 text-align: center;
 `), require__utils_cssr_index.cE("title", `
 justify-content: center;
 `), require__utils_cssr_index.cE("action", `
 justify-content: center;
 `)]), require__utils_cssr_index.cM("icon-left", [require__utils_cssr_index.cE("icon", `
 margin: var(--n-icon-margin);
 `), require__utils_cssr_index.cM("closable", [require__utils_cssr_index.cE("title", `
 padding-right: calc(var(--n-close-size) + 6px);
 `)])]), require__utils_cssr_index.cE("close", `
 position: absolute;
 right: 0;
 top: 0;
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 z-index: 1;
 `), require__utils_cssr_index.cE("content", `
 font-size: var(--n-font-size);
 margin: var(--n-content-margin);
 position: relative;
 word-break: break-word;
 `, [require__utils_cssr_index.cM("last", "margin-bottom: 0;")]), require__utils_cssr_index.cE("action", `
 display: flex;
 justify-content: flex-end;
 `, [require__utils_cssr_index.c("> *:not(:last-child)", `
 margin-right: var(--n-action-space);
 `)]), require__utils_cssr_index.cE("icon", `
 font-size: var(--n-icon-size);
 transition: color .3s var(--n-bezier);
 `), require__utils_cssr_index.cE("title", `
 transition: color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 font-size: var(--n-title-font-size);
 font-weight: var(--n-title-font-weight);
 color: var(--n-title-text-color);
 `), require__utils_cssr_index.cB("dialog-icon-container", `
 display: flex;
 justify-content: center;
 `)]), require__utils_cssr_index.insideModal(require__utils_cssr_index.cB("dialog", `
 width: 446px;
 max-width: calc(100vw - 32px);
 `)), require__utils_cssr_index.cB("dialog", [require__utils_cssr_index.asModal(`
 width: 446px;
 max-width: calc(100vw - 32px);
 `)])]);
//#endregion
module.exports = index_cssr_default;