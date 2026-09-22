const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/layout/src/styles/layout.cssr.ts
var layout_cssr_default = require__utils_cssr_index.cB("layout", `
 color: var(--n-text-color);
 background-color: var(--n-color);
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 flex: auto;
 overflow: hidden;
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
`, [require__utils_cssr_index.cB("layout-scroll-container", `
 overflow-x: hidden;
 box-sizing: border-box;
 height: 100%;
 `), require__utils_cssr_index.cM("absolute-positioned", `
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]);
//#endregion
module.exports = layout_cssr_default;