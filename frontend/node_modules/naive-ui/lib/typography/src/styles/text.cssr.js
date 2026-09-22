const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/typography/src/styles/text.cssr.ts
var text_cssr_default = require__utils_cssr_index.cB("text", `
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
`, [require__utils_cssr_index.cM("strong", `
 font-weight: var(--n-font-weight-strong);
 `), require__utils_cssr_index.cM("italic", {
  fontStyle: "italic"
}), require__utils_cssr_index.cM("underline", {
  textDecoration: "underline"
}), require__utils_cssr_index.cM("code", `
 line-height: 1.4;
 display: inline-block;
 font-family: var(--n-font-famliy-mono);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 box-sizing: border-box;
 padding: .05em .35em 0 .35em;
 border-radius: var(--n-code-border-radius);
 font-size: .9em;
 color: var(--n-code-text-color);
 background-color: var(--n-code-color);
 border: var(--n-code-border);
 `)]);
//#endregion
module.exports = text_cssr_default;