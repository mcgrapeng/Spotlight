const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/input/src/styles/rtl.cssr.ts
var rtl_cssr_default = require__utils_cssr_index.cB("input", [require__utils_cssr_index.cM("rtl", `
 direction: rtl;
 `, [require__utils_cssr_index.cE("prefix", {
  marginRight: 0,
  marginLeft: "4px"
}), require__utils_cssr_index.cE("suffix", {
  marginRight: "4px",
  marginLeft: 0
}), require__utils_cssr_index.cM("textarea", "width: 100%;", [require__utils_cssr_index.cB("input-word-count", `
 left: var(--n-padding-right);
 right: unset;
 `)]), require__utils_cssr_index.cB("input-word-count", `
 margin-left: 0;
 margin-right: 4px;
 `)])]);
//#endregion
module.exports = rtl_cssr_default;