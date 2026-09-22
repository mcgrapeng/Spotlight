const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/page-header/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("page-header-header", `
 margin-bottom: 20px;
 `), require__utils_cssr_index.cB("page-header", `
 display: flex;
 align-items: center;
 justify-content: space-between;
 line-height: 1.5;
 font-size: var(--n-font-size);
 `, [require__utils_cssr_index.cE("main", `
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 `), require__utils_cssr_index.cE("back", `
 display: flex;
 margin-right: 16px;
 font-size: var(--n-back-size);
 cursor: pointer;
 color: var(--n-back-color);
 transition: color .3s var(--n-bezier);
 `, [require__utils_cssr_index.c("&:hover", "color: var(--n-back-color-hover);"), require__utils_cssr_index.c("&:active", "color: var(--n-back-color-pressed);")]), require__utils_cssr_index.cE("avatar", `
 display: flex;
 margin-right: 12px
 `), require__utils_cssr_index.cE("title", `
 margin-right: 16px;
 transition: color .3s var(--n-bezier);
 font-size: var(--n-title-font-size);
 font-weight: var(--n-title-font-weight);
 color: var(--n-title-text-color);
 `), require__utils_cssr_index.cE("subtitle", `
 font-size: 14px;
 transition: color .3s var(--n-bezier);
 color: var(--n-subtitle-text-color);
 `)]), require__utils_cssr_index.cB("page-header-content", `
 font-size: var(--n-font-size);
 `, [require__utils_cssr_index.c("&:not(:first-child)", "margin-top: 20px;")]), require__utils_cssr_index.cB("page-header-footer", `
 font-size: var(--n-font-size);
 `, [require__utils_cssr_index.c("&:not(:first-child)", "margin-top: 20px;")])]);
//#endregion
module.exports = index_cssr_default;