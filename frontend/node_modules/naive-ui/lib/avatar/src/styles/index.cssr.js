const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/avatar/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("avatar", `
 width: var(--n-merged-size);
 height: var(--n-merged-size);
 color: #FFF;
 font-size: var(--n-font-size);
 display: inline-flex;
 position: relative;
 overflow: hidden;
 text-align: center;
 border: var(--n-border);
 border-radius: var(--n-border-radius);
 --n-merged-color: var(--n-color);
 background-color: var(--n-merged-color);
 transition:
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
`, [require__utils_cssr_index.insideModal(require__utils_cssr_index.c("&", "--n-merged-color: var(--n-color-modal);")), require__utils_cssr_index.insidePopover(require__utils_cssr_index.c("&", "--n-merged-color: var(--n-color-popover);")), require__utils_cssr_index.c("img", `
 width: 100%;
 height: 100%;
 `), require__utils_cssr_index.cE("text", `
 white-space: nowrap;
 display: inline-block;
 position: absolute;
 left: 50%;
 top: 50%;
 `), require__utils_cssr_index.cB("icon", `
 vertical-align: bottom;
 font-size: calc(var(--n-merged-size) - 6px);
 `), require__utils_cssr_index.cE("text", "line-height: 1.25")]);
//#endregion
module.exports = index_cssr_default;