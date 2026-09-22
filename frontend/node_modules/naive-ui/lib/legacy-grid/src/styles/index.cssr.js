const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/legacy-grid/src/styles/index.cssr.ts
const positionStyles = (0, require("seemly").repeat)(24, null).map((_, index) => {
  const prefixIndex = index + 1;
  const percent = `calc(100% / 24 * ${prefixIndex})`;
  return [require__utils_cssr_index.cM(`${prefixIndex}-span`, {
    width: percent
  }), require__utils_cssr_index.cM(`${prefixIndex}-offset`, {
    marginLeft: percent
  }), require__utils_cssr_index.cM(`${prefixIndex}-push`, {
    left: percent
  }), require__utils_cssr_index.cM(`${prefixIndex}-pull`, {
    right: percent
  })];
});
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("row", {
  width: "100%",
  display: "flex",
  flexWrap: "wrap"
}), require__utils_cssr_index.cB("col", {
  verticalAlign: "top",
  boxSizing: "border-box",
  display: "inline-block",
  position: "relative",
  zIndex: "auto"
}, [require__utils_cssr_index.cE("box", {
  position: "relative",
  zIndex: "auto",
  width: "100%",
  height: "100%"
}), positionStyles])]);
//#endregion
module.exports = index_cssr_default;