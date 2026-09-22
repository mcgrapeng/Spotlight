const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/ellipsis/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("ellipsis", {
  overflow: "hidden"
}, [require__utils_cssr_index.cNotM("line-clamp", `
 white-space: nowrap;
 display: inline-block;
 vertical-align: bottom;
 max-width: 100%;
 `), require__utils_cssr_index.cM("line-clamp", `
 display: -webkit-inline-box;
 -webkit-box-orient: vertical;
 `), require__utils_cssr_index.cM("cursor-pointer", `
 cursor: pointer;
 `)]);
//#endregion
module.exports = index_cssr_default;