const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/anchor/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("anchor", `
 position: relative;
`, [require__utils_cssr_index.cNotM("block", `
 padding-left: var(--n-rail-width);
 `, [require__utils_cssr_index.cB("anchor-link", [require__utils_cssr_index.c("+, >", [require__utils_cssr_index.cB("anchor-link", `
 margin-top: .5em;
 `)])]), require__utils_cssr_index.cB("anchor-link-background", `
 max-width: 0;
 border-top-right-radius: 10.5px;
 border-bottom-right-radius: 10.5px;
 `), require__utils_cssr_index.cNotM("show-rail", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("anchor-link", "padding-left: 0;")])])]), require__utils_cssr_index.cM("block", [require__utils_cssr_index.cB("anchor-link", `
 margin-bottom: 4px;
 padding: 2px 8px;
 transition: background-color .3s var(--n-bezier);
 background-color: transparent;
 border-radius: var(--n-link-border-radius);
 `, [require__utils_cssr_index.cM("active", `
 background-color: var(--n-link-color);
 `)])]), require__utils_cssr_index.cB("anchor-link-background", `
 position: absolute;
 left: calc(var(--n-rail-width) / 2);
 width: 100%;
 background-color: var(--n-link-color);
 transition:
 top .15s var(--n-bezier),
 max-width .15s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cB("anchor-rail", `
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 width: var(--n-rail-width);
 border-radius: calc(var(--n-rail-width) / 2);
 overflow: hidden;
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-rail-color);
 `, [require__utils_cssr_index.cE("bar", `
 position: absolute;
 left: 0;
 width: var(--n-rail-width);
 height: 21px;
 background-color: #0000;
 transition: 
 top .15s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cM("active", {
  backgroundColor: "var(--n-rail-color-active)"
})])]), require__utils_cssr_index.cB("anchor-link", `
 padding: var(--n-link-padding);
 position: relative;
 line-height: 1.5;
 font-size: var(--n-link-font-size);
 min-height: 1.5em;
 display: flex;
 flex-direction: column;
 `, [require__utils_cssr_index.cM("active", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cE("title", `
 color: var(--n-link-text-color-active);
 `)])]), require__utils_cssr_index.cE("title", `
 outline: none;
 max-width: 100%;
 text-decoration: none;
 white-space: nowrap;
 text-overflow: ellipsis;
 overflow: hidden;
 cursor: pointer;
 display: inline-block;
 padding-right: 16px;
 transition: color .3s var(--n-bezier);
 color: var(--n-link-text-color);
 `, [require__utils_cssr_index.c("&:hover, &:focus", `
 color: var(--n-link-text-color-hover);
 `), require__utils_cssr_index.c("&:active", `
 color: var(--n-link-text-color-pressed);
 `)])])]);
//#endregion
module.exports = index_cssr_default;