const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require_button_group_src_styles_index_cssr = require("./index.cssr.js");
//#region src/button-group/src/styles/rtl.cssr.ts
function createRightBorderStyle(type) {
  return require__utils_cssr_index.cM(`${type}-type`, [require__utils_cssr_index.c("& +", [require__utils_cssr_index.cB("button", {}, [require__utils_cssr_index.cM(`${type}-type`, [require__utils_cssr_index.cE("border", {
    borderRightWidth: require_button_group_src_styles_index_cssr.zero
  }), require__utils_cssr_index.cE("state-border", {
    left: require_button_group_src_styles_index_cssr.n1
  })])])])]);
}
var rtl_cssr_default = require__utils_cssr_index.cB("button-group", [require__utils_cssr_index.cNotM("vertical", [require__utils_cssr_index.cM("rtl", `
 direction: rtl;
 `, [require__utils_cssr_index.cB("button", [require__utils_cssr_index.c("&:last-child:not(:first-child)", `
 margin-right: ${require_button_group_src_styles_index_cssr.zero};
 border-top-right-radius: ${require_button_group_src_styles_index_cssr.zero};
 border-bottom-right-radius: ${require_button_group_src_styles_index_cssr.zero};
 `), require__utils_cssr_index.c("&:first-child:not(:last-child)", `
 margin-left: ${require_button_group_src_styles_index_cssr.zero};
 border-top-left-radius: ${require_button_group_src_styles_index_cssr.zero};
 border-bottom-left-radius: ${require_button_group_src_styles_index_cssr.zero};
 `), require__utils_cssr_index.c("&:not(:last-child):not(:first-child)", `
 margin-left: ${require_button_group_src_styles_index_cssr.zero};
 margin-right: ${require_button_group_src_styles_index_cssr.zero};
 border-radius: ${require_button_group_src_styles_index_cssr.zero};
 `), createRightBorderStyle("default"), require__utils_cssr_index.cM("ghost", [createRightBorderStyle("primary"), createRightBorderStyle("info"), createRightBorderStyle("success"), createRightBorderStyle("warning"), createRightBorderStyle("error")])])])])]);
//#endregion
module.exports = rtl_cssr_default;