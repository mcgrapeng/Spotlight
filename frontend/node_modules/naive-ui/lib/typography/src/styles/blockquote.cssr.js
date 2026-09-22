const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/typography/src/styles/blockquote.cssr.ts
var blockquote_cssr_default = require__utils_cssr_index.cB("blockquote", `
 font-size: var(--n-font-size);
 line-height: var(--n-line-height);
 margin: 0;
 margin-top: 12px;
 margin-bottom: 12px;
 box-sizing: border-box;
 padding-left: 12px;
 border-left: 4px solid var(--n-prefix-color);
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
`, [require__utils_cssr_index.c("&:first-child", {
  marginTop: 0
}), require__utils_cssr_index.c("&:last-child", {
  marginBottom: 0
}), require__utils_cssr_index.cM("align-text", {
  marginLeft: "-16px"
})]);
//#endregion
module.exports = blockquote_cssr_default;