const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/icon/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("icon", `
 height: 1em;
 width: 1em;
 line-height: 1em;
 text-align: center;
 display: inline-block;
 position: relative;
 fill: currentColor;
`, [require__utils_cssr_index.cM("color-transition", {
  transition: "color .3s var(--n-bezier)"
}), require__utils_cssr_index.cM("depth", {
  color: "var(--n-color)"
}, [require__utils_cssr_index.c("svg", {
  opacity: "var(--n-opacity)",
  transition: "opacity .3s var(--n-bezier)"
})]), require__utils_cssr_index.c("svg", {
  height: "1em",
  width: "1em"
})]);
//#endregion
module.exports = index_cssr_default;