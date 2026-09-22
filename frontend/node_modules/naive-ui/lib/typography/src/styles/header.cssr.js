const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/typography/src/styles/header.cssr.ts
var header_cssr_default = require__utils_cssr_index.cB("h", `
 font-size: var(--n-font-size);
 font-weight: var(--n-font-weight);
 margin: var(--n-margin);
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
`, [require__utils_cssr_index.c("&:first-child", {
  marginTop: 0
}), require__utils_cssr_index.cM("prefix-bar", {
  position: "relative",
  paddingLeft: "var(--n-prefix-width)"
}, [require__utils_cssr_index.cM("align-text", {
  paddingLeft: 0
}, [require__utils_cssr_index.c("&::before", {
  left: "calc(-1 * var(--n-prefix-width))"
})]), require__utils_cssr_index.c("&::before", `
 content: "";
 width: var(--n-bar-width);
 border-radius: calc(var(--n-bar-width) / 2);
 transition: background-color .3s var(--n-bezier);
 left: 0;
 top: 0;
 bottom: 0;
 position: absolute;
 `), require__utils_cssr_index.c("&::before", {
  backgroundColor: "var(--n-bar-color)"
})])]);
//#endregion
module.exports = header_cssr_default;