const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/tree/src/styles/rtl.cssr.ts
var rtl_cssr_default = require__utils_cssr_index.cB("tree", [require__utils_cssr_index.cM("rtl", `
 direction: rtl;
 text-align: right;
 `, [require__utils_cssr_index.cB("tree-node-switcher", `
 transform: rotate(180deg);
 `, [require__utils_cssr_index.cM("expanded", `
 transform: rotate(90deg);
 `)]), require__utils_cssr_index.cB("tree-node-checkbox", `
 margin-right: 0;
 margin-left: 4px;
 `), require__utils_cssr_index.cB("tree-node-content", [require__utils_cssr_index.cE("prefix", `
 margin-right: 0;
 margin-left: 8px;
 `)]), require__utils_cssr_index.cB("tree-node-checkbox", [require__utils_cssr_index.cM("right", `
 margin-right: 4px;
 `)])])]);
//#endregion
module.exports = rtl_cssr_default;