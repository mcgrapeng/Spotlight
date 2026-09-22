const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/breadcrumb/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("breadcrumb", `
 white-space: nowrap;
 cursor: default;
 line-height: var(--n-item-line-height);
`, [require__utils_cssr_index.c("ul", `
 list-style: none;
 padding: 0;
 margin: 0;
 `), require__utils_cssr_index.c("a", `
 color: inherit;
 text-decoration: inherit;
 `), require__utils_cssr_index.cB("breadcrumb-item", `
 font-size: var(--n-font-size);
 transition: color .3s var(--n-bezier);
 display: inline-flex;
 align-items: center;
 `, [require__utils_cssr_index.cB("icon", `
 font-size: 18px;
 vertical-align: -.2em;
 transition: color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 `), require__utils_cssr_index.c("&:not(:last-child)", [require__utils_cssr_index.cM("clickable", [require__utils_cssr_index.cE("link", `
 cursor: pointer;
 `, [require__utils_cssr_index.c("&:hover", `
 background-color: var(--n-item-color-hover);
 `), require__utils_cssr_index.c("&:active", `
 background-color: var(--n-item-color-pressed); 
 `)])])]), require__utils_cssr_index.cE("link", `
 padding: 4px;
 border-radius: var(--n-item-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 position: relative;
 `, [require__utils_cssr_index.c("&:hover", `
 color: var(--n-item-text-color-hover);
 `, [require__utils_cssr_index.cB("icon", `
 color: var(--n-item-text-color-hover);
 `)]), require__utils_cssr_index.c("&:active", `
 color: var(--n-item-text-color-pressed);
 `, [require__utils_cssr_index.cB("icon", `
 color: var(--n-item-text-color-pressed);
 `)])]), require__utils_cssr_index.cE("separator", `
 margin: 0 8px;
 color: var(--n-separator-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 `), require__utils_cssr_index.c("&:last-child", [require__utils_cssr_index.cE("link", `
 font-weight: var(--n-font-weight-active);
 cursor: unset;
 color: var(--n-item-text-color-active);
 `, [require__utils_cssr_index.cB("icon", `
 color: var(--n-item-text-color-active);
 `)]), require__utils_cssr_index.cE("separator", `
 display: none;
 `)])])]);
//#endregion
module.exports = index_cssr_default;