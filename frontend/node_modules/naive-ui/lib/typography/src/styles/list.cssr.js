const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/typography/src/styles/list.cssr.ts
const liStyle = require__utils_cssr_index.c("li", {
  transition: "color .3s var(--n-bezier)",
  lineHeight: "var(--n-line-height)",
  margin: "var(--n-li-margin)",
  marginBottom: 0,
  color: "var(--n-text-color)"
});
const childStyle = [require__utils_cssr_index.c("&:first-child", `
 margin-top: 0;
 `), require__utils_cssr_index.c("&:last-child", `
 margin-bottom: 0;
 `)];
var list_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("ol", {
  fontSize: "var(--n-font-size)",
  padding: "var(--n-ol-padding)"
}, [require__utils_cssr_index.cM("align-text", {
  paddingLeft: 0
}), liStyle, childStyle]), require__utils_cssr_index.cB("ul", {
  fontSize: "var(--n-font-size)",
  padding: "var(--n-ul-padding)"
}, [require__utils_cssr_index.cM("align-text", {
  paddingLeft: 0
}), liStyle, childStyle])]);
//#endregion
module.exports = list_cssr_default;