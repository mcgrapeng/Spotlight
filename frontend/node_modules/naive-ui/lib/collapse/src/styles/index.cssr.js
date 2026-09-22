const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_height_expand_cssr = require("../../../_styles/transitions/fade-in-height-expand.cssr.js");
//#region src/collapse/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("collapse", "width: 100%;", [require__utils_cssr_index.cB("collapse-item", `
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 margin: var(--n-item-margin);
 `, [require__utils_cssr_index.cM("disabled", [require__utils_cssr_index.cE("header", "cursor: not-allowed;", [require__utils_cssr_index.cE("header-main", `
 color: var(--n-title-text-color-disabled);
 `), require__utils_cssr_index.cB("collapse-item-arrow", `
 color: var(--n-arrow-color-disabled);
 `)])]), require__utils_cssr_index.cB("collapse-item", "margin-left: 32px;"), require__utils_cssr_index.c("&:first-child", "margin-top: 0;"), require__utils_cssr_index.c("&:first-child >", [require__utils_cssr_index.cE("header", "padding-top: 0;")]), require__utils_cssr_index.cM("left-arrow-placement", [require__utils_cssr_index.cE("header", [require__utils_cssr_index.cB("collapse-item-arrow", "margin-right: 4px;")])]), require__utils_cssr_index.cM("right-arrow-placement", [require__utils_cssr_index.cE("header", [require__utils_cssr_index.cB("collapse-item-arrow", "margin-left: 4px;")])]), require__utils_cssr_index.cE("content-wrapper", [require__utils_cssr_index.cE("content-inner", "padding-top: 16px;"), require__styles_transitions_fade_in_height_expand_cssr.fadeInHeightExpandTransition({
  duration: "0.15s"
})]), require__utils_cssr_index.cM("active", [require__utils_cssr_index.cE("header", [require__utils_cssr_index.cM("active", [require__utils_cssr_index.cB("collapse-item-arrow", "transform: rotate(90deg);")])])]), require__utils_cssr_index.c("&:not(:first-child)", "border-top: 1px solid var(--n-divider-color);"), require__utils_cssr_index.cNotM("disabled", [require__utils_cssr_index.cM("trigger-area-main", [require__utils_cssr_index.cE("header", [require__utils_cssr_index.cE("header-main", "cursor: pointer;"), require__utils_cssr_index.cB("collapse-item-arrow", "cursor: default;")])]), require__utils_cssr_index.cM("trigger-area-arrow", [require__utils_cssr_index.cE("header", [require__utils_cssr_index.cB("collapse-item-arrow", "cursor: pointer;")])]), require__utils_cssr_index.cM("trigger-area-extra", [require__utils_cssr_index.cE("header", [require__utils_cssr_index.cE("header-extra", "cursor: pointer;")])])]), require__utils_cssr_index.cE("header", `
 font-size: var(--n-title-font-size);
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 transition: color .3s var(--n-bezier);
 position: relative;
 padding: var(--n-title-padding);
 color: var(--n-title-text-color);
 `, [require__utils_cssr_index.cE("header-main", `
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 font-weight: var(--n-title-font-weight);
 transition: color .3s var(--n-bezier);
 flex: 1;
 color: var(--n-title-text-color);
 `), require__utils_cssr_index.cE("header-extra", `
 display: flex;
 align-items: center;
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `), require__utils_cssr_index.cB("collapse-item-arrow", `
 display: flex;
 transition:
 transform .15s var(--n-bezier),
 color .3s var(--n-bezier);
 font-size: 18px;
 color: var(--n-arrow-color);
 `)])])]);
//#endregion
module.exports = index_cssr_default;