const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/typography/src/styles/p.cssr.ts
var p_cssr_default = require__utils_cssr_index.cB("p", `
 box-sizing: border-box;
 transition: color .3s var(--n-bezier);
 margin: var(--n-margin);
 font-size: var(--n-font-size);
 line-height: var(--n-line-height);
 color: var(--n-text-color);
`, [require__utils_cssr_index.c("&:first-child", "margin-top: 0;"), require__utils_cssr_index.c("&:last-child", "margin-bottom: 0;")]);
//#endregion
module.exports = p_cssr_default;