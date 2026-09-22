const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/split/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("split", `
 display: flex;
 width: 100%;
 height: 100%;
`, [require__utils_cssr_index.cM("horizontal", `
 flex-direction: row;
 `), require__utils_cssr_index.cM("vertical", `
 flex-direction: column;
 `), require__utils_cssr_index.cB("split-pane-1", `
 overflow: hidden;
 `), require__utils_cssr_index.cB("split-pane-2", `
 overflow: hidden;
 flex: 1;
 `), require__utils_cssr_index.cE("resize-trigger", `
 background-color: var(--n-resize-trigger-color);
 transition: background-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cM("hover", `
 background-color: var(--n-resize-trigger-color-hover);
 `), require__utils_cssr_index.c("&:hover", `
 background-color: var(--n-resize-trigger-color-hover);
 `)])]);
//#endregion
module.exports = index_cssr_default;