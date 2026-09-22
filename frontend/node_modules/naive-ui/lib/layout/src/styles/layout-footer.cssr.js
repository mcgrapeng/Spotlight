const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/layout/src/styles/layout-footer.cssr.ts
var layout_footer_cssr_default = require__utils_cssr_index.cB("layout-footer", `
 transition:
 box-shadow .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 color: var(--n-text-color);
 background-color: var(--n-color);
 box-sizing: border-box;
`, [require__utils_cssr_index.cM("absolute-positioned", `
 position: absolute;
 left: 0;
 right: 0;
 bottom: 0;
 `), require__utils_cssr_index.cM("bordered", `
 border-top: solid 1px var(--n-border-color);
 `)]);
//#endregion
module.exports = layout_footer_cssr_default;