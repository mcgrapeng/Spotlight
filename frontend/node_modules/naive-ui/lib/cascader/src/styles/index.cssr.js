const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_scale_up_cssr = require("../../../_styles/transitions/fade-in-scale-up.cssr.js");
//#region src/cascader/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("cascader-menu", `
 outline: none;
 position: relative;
 margin: 4px 0;
 display: flex;
 flex-flow: column nowrap;
 border-radius: var(--n-menu-border-radius);
 overflow: hidden;
 box-shadow: var(--n-menu-box-shadow);
 color: var(--n-option-text-color);
 background-color: var(--n-menu-color);
 `, [require__styles_transitions_fade_in_scale_up_cssr.fadeInScaleUpTransition({
  transformOrigin: "inherit",
  duration: "0.2s"
}), require__utils_cssr_index.cE("empty", `
 display: flex;
 padding: 12px 32px;
 flex: 1;
 justify-content: center;
 `), require__utils_cssr_index.cB("scrollbar", `
 width: 100%;
 `), require__utils_cssr_index.cB("base-menu-mask", `
 background-color: var(--n-menu-mask-color);
 `), require__utils_cssr_index.cB("base-loading", `
 color: var(--n-loading-color);
 `), require__utils_cssr_index.cB("cascader-submenu-wrapper", `
 position: relative;
 display: flex;
 flex-wrap: nowrap;
 `), require__utils_cssr_index.cB("cascader-submenu", `
 height: var(--n-menu-height);
 min-width: var(--n-column-width);
 position: relative;
 `, [require__utils_cssr_index.cM("virtual", `
 width: var(--n-column-width);
 `), require__utils_cssr_index.cB("scrollbar-content", `
 position: relative;
 `), require__utils_cssr_index.c("&:first-child", `
 border-top-left-radius: var(--n-menu-border-radius);
 border-bottom-left-radius: var(--n-menu-border-radius);
 `), require__utils_cssr_index.c("&:last-child", `
 border-top-right-radius: var(--n-menu-border-radius);
 border-bottom-right-radius: var(--n-menu-border-radius);
 `), require__utils_cssr_index.c("&:not(:first-child)", `
 border-left: 1px solid var(--n-menu-divider-color);
 `)]), require__utils_cssr_index.cB("cascader-menu-action", `
 box-sizing: border-box;
 padding: 8px;
 border-top: 1px solid var(--n-menu-divider-color);
 `), require__utils_cssr_index.cB("cascader-option", `
 height: var(--n-option-height);
 line-height: var(--n-option-height);
 font-size: var(--n-option-font-size);
 padding: 0 0 0 18px;
 box-sizing: border-box;
 min-width: 182px;
 background-color: #0000;
 display: flex;
 align-items: center;
 white-space: nowrap;
 position: relative;
 cursor: pointer;
 transition:
 background-color .2s var(--n-bezier),
 color 0.2s var(--n-bezier);
 `, [require__utils_cssr_index.cM("show-prefix", `
 padding-left: 0;
 `), require__utils_cssr_index.cE("label", `
 flex: 1 0 0;
 overflow: hidden;
 text-overflow: ellipsis;
 `), require__utils_cssr_index.cE("prefix", `
 min-width: 32px;
 display: flex;
 align-items: center;
 justify-content: center;
 `), require__utils_cssr_index.cE("suffix", `
 min-width: 32px;
 display: flex;
 align-items: center;
 justify-content: center;
 `), require__utils_cssr_index.cB("cascader-option-icon-placeholder", `
 line-height: 0;
 position: relative;
 width: 16px;
 height: 16px;
 font-size: 16px;
 `, [require__utils_cssr_index.cB("cascader-option-icon", [require__utils_cssr_index.cM("checkmark", `
 color: var(--n-option-check-mark-color);
 `, [require__styles_transitions_fade_in_scale_up_cssr.fadeInScaleUpTransition({
  originalTransition: "background-color .3s var(--n-bezier), box-shadow .3s var(--n-bezier)"
})]), require__utils_cssr_index.cM("arrow", `
 color: var(--n-option-arrow-color);
 `)])]), require__utils_cssr_index.cM("selected", `
 color: var(--n-option-text-color-active);
 `), require__utils_cssr_index.cM("active", `
 color: var(--n-option-text-color-active);
 background-color: var(--n-option-color-hover);
 `), require__utils_cssr_index.cM("pending", `
 background-color: var(--n-option-color-hover);
 `), require__utils_cssr_index.c("&:hover", `
 background-color: var(--n-option-color-hover);
 `), require__utils_cssr_index.cM("disabled", `
 color: var(--n-option-text-color-disabled);
 background-color: #0000;
 cursor: not-allowed;
 `, [require__utils_cssr_index.cB("cascader-option-icon", [require__utils_cssr_index.cM("arrow", `
 color: var(--n-option-text-color-disabled);
 `)])])])]), require__utils_cssr_index.cB("cascader", `
 z-index: auto;
 position: relative;
 width: 100%;
 `)]);
//#endregion
module.exports = index_cssr_default;