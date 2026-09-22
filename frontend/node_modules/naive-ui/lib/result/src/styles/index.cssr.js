const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/result/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("result", `
 color: var(--n-text-color);
 line-height: var(--n-line-height);
 font-size: var(--n-font-size);
 transition:
 color .3s var(--n-bezier);
`, [require__utils_cssr_index.cB("result-icon", `
 display: flex;
 justify-content: center;
 transition: color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cE("status-image", `
 font-size: var(--n-icon-size);
 width: 1em;
 height: 1em;
 `), require__utils_cssr_index.cB("base-icon", `
 color: var(--n-icon-color);
 font-size: var(--n-icon-size);
 `)]), require__utils_cssr_index.cB("result-content", {
  marginTop: "24px"
}), require__utils_cssr_index.cB("result-footer", `
 margin-top: 24px;
 text-align: center;
 `), require__utils_cssr_index.cB("result-header", [require__utils_cssr_index.cE("title", `
 margin-top: 16px;
 font-weight: var(--n-title-font-weight);
 transition: color .3s var(--n-bezier);
 text-align: center;
 color: var(--n-title-text-color);
 font-size: var(--n-title-font-size);
 `), require__utils_cssr_index.cE("description", `
 margin-top: 4px;
 text-align: center;
 font-size: var(--n-font-size);
 `)])]);
//#endregion
module.exports = index_cssr_default;