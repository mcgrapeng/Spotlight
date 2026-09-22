const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/empty/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("empty", `
 display: flex;
 flex-direction: column;
 align-items: center;
 font-size: var(--n-font-size);
`, [require__utils_cssr_index.cE("icon", `
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 line-height: var(--n-icon-size);
 color: var(--n-icon-color);
 transition:
 color .3s var(--n-bezier);
 `, [require__utils_cssr_index.c("+", [require__utils_cssr_index.cE("description", `
 margin-top: 8px;
 `)])]), require__utils_cssr_index.cE("description", `
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `), require__utils_cssr_index.cE("extra", `
 text-align: center;
 transition: color .3s var(--n-bezier);
 margin-top: 12px;
 color: var(--n-extra-text-color);
 `)]);
//#endregion
module.exports = index_cssr_default;