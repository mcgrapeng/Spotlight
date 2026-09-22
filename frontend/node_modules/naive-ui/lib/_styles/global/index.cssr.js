const require__utils_cssr_index = require("../../_utils/cssr/index.js");
//#region src/_styles/global/index.cssr.ts
const {
  fontSize,
  fontFamily,
  lineHeight
} = require("../common/_common.js");
var index_cssr_default = require__utils_cssr_index.c("body", `
 margin: 0;
 font-size: ${fontSize};
 font-family: ${fontFamily};
 line-height: ${lineHeight};
 -webkit-text-size-adjust: 100%;
 -webkit-tap-highlight-color: transparent;
`, [require__utils_cssr_index.c("input", `
 font-family: inherit;
 font-size: inherit;
 `)]);
//#endregion
module.exports = index_cssr_default;