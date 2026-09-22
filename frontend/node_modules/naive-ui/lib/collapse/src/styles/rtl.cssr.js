const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/collapse/src/styles/rtl.cssr.ts
var rtl_cssr_default = require__utils_cssr_index.cB("collapse", [require__utils_cssr_index.cM("rtl", `
 direction: rtl;
 `, [require__utils_cssr_index.cB("collapse-item", [require__utils_cssr_index.cB("collapse-item", {
  marginRight: "32px",
  marginLeft: 0
}), require__utils_cssr_index.cM("left-arrow-placement", [require__utils_cssr_index.cE("header", [require__utils_cssr_index.cB("collapse-item-arrow", {
  marginRight: 0,
  marginLeft: "4px"
})])]), require__utils_cssr_index.cM("right-arrow-placement", [require__utils_cssr_index.cE("header", [require__utils_cssr_index.cB("collapse-item-arrow", {
  marginLeft: 0,
  marginRight: "4px"
})])]), require__utils_cssr_index.cM("active", [require__utils_cssr_index.cE("header", [require__utils_cssr_index.cM("active", [require__utils_cssr_index.cB("collapse-item-arrow", {
  transform: "rotate(-90deg)"
})])])])])])]);
//#endregion
module.exports = rtl_cssr_default;