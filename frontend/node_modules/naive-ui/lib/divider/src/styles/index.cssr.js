const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/divider/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("divider", `
 position: relative;
 display: flex;
 width: 100%;
 box-sizing: border-box;
 font-size: 16px;
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
`, [require__utils_cssr_index.cNotM("vertical", `
 margin-top: 24px;
 margin-bottom: 24px;
 `, [require__utils_cssr_index.cNotM("no-title", `
 display: flex;
 align-items: center;
 `)]), require__utils_cssr_index.cE("title", `
 display: flex;
 align-items: center;
 margin-left: 12px;
 margin-right: 12px;
 white-space: nowrap;
 font-weight: var(--n-font-weight);
 `), require__utils_cssr_index.cM("title-position-left", [require__utils_cssr_index.cE("line", [require__utils_cssr_index.cM("left", {
  width: "28px"
})])]), require__utils_cssr_index.cM("title-position-right", [require__utils_cssr_index.cE("line", [require__utils_cssr_index.cM("right", {
  width: "28px"
})])]), require__utils_cssr_index.cM("dashed", [require__utils_cssr_index.cE("line", `
 background-color: #0000;
 height: 0px;
 width: 100%;
 border-style: dashed;
 border-width: 1px 0 0;
 `)]), require__utils_cssr_index.cM("vertical", `
 display: inline-block;
 height: 1em;
 margin: 0 8px;
 vertical-align: middle;
 width: 1px;
 `), require__utils_cssr_index.cE("line", `
 border: none;
 transition: background-color .3s var(--n-bezier), border-color .3s var(--n-bezier);
 height: 1px;
 width: 100%;
 margin: 0;
 `), require__utils_cssr_index.cNotM("dashed", [require__utils_cssr_index.cE("line", {
  backgroundColor: "var(--n-color)"
})]), require__utils_cssr_index.cM("dashed", [require__utils_cssr_index.cE("line", {
  borderColor: "var(--n-color)"
})]), require__utils_cssr_index.cM("vertical", {
  backgroundColor: "var(--n-color)"
})]);
//#endregion
module.exports = index_cssr_default;