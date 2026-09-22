const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/legacy-grid/src/styles/rtl.cssr.ts
const positionStyles = (0, require("seemly").repeat)(24, null).map((_, index) => {
  const prefixIndex = index + 1;
  const percent = `calc(100% / 24 * ${prefixIndex})`;
  return [require__utils_cssr_index.cM(`${prefixIndex}-span`, {
    width: percent
  }), require__utils_cssr_index.cM(`${prefixIndex}-offset`, {
    marginLeft: percent
  }), require__utils_cssr_index.cM(`${prefixIndex}-push`, {
    right: percent,
    left: "unset"
  }), require__utils_cssr_index.cM(`${prefixIndex}-pull`, {
    left: percent,
    right: "unset"
  })];
});
var rtl_cssr_default = require__utils_cssr_index.cB("row", [require__utils_cssr_index.cM("rtl", `
 direction: rtl;
 `, [require__utils_cssr_index.cB("col", positionStyles)])]);
//#endregion
module.exports = rtl_cssr_default;