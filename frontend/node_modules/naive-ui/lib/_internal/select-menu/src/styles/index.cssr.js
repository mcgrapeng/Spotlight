const require__utils_cssr_index = require("../../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_scale_up_cssr = require("../../../../_styles/transitions/fade-in-scale-up.cssr.js");
//#region src/_internal/select-menu/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("base-select-menu", `
 line-height: 1.5;
 outline: none;
 z-index: 0;
 position: relative;
 border-radius: var(--n-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-color);
`, [require__utils_cssr_index.cB("scrollbar", `
 max-height: var(--n-height);
 `), require__utils_cssr_index.cB("virtual-list", `
 max-height: var(--n-height);
 `), require__utils_cssr_index.cB("base-select-option", `
 min-height: var(--n-option-height);
 font-size: var(--n-option-font-size);
 display: flex;
 align-items: center;
 `, [require__utils_cssr_index.cE("content", `
 z-index: 1;
 white-space: nowrap;
 text-overflow: ellipsis;
 overflow: hidden;
 `)]), require__utils_cssr_index.cB("base-select-group-header", `
 min-height: var(--n-option-height);
 font-size: .93em;
 display: flex;
 align-items: center;
 `), require__utils_cssr_index.cB("base-select-menu-option-wrapper", `
 position: relative;
 width: 100%;
 `), require__utils_cssr_index.cE("loading, empty", `
 display: flex;
 padding: 12px 32px;
 flex: 1;
 justify-content: center;
 `), require__utils_cssr_index.cE("loading", `
 color: var(--n-loading-color);
 font-size: var(--n-loading-size);
 `), require__utils_cssr_index.cE("header", `
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `), require__utils_cssr_index.cE("action", `
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-top: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `), require__utils_cssr_index.cB("base-select-group-header", `
 position: relative;
 cursor: default;
 padding: var(--n-option-padding);
 color: var(--n-group-header-text-color);
 `), require__utils_cssr_index.cB("base-select-option", `
 cursor: pointer;
 position: relative;
 padding: var(--n-option-padding);
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 box-sizing: border-box;
 color: var(--n-option-text-color);
 opacity: 1;
 `, [require__utils_cssr_index.cM("show-checkmark", `
 padding-right: calc(var(--n-option-padding-right) + 20px);
 `), require__utils_cssr_index.c("&::before", `
 content: "";
 position: absolute;
 left: 4px;
 right: 4px;
 top: 0;
 bottom: 0;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `), require__utils_cssr_index.c("&:active", `
 color: var(--n-option-text-color-pressed);
 `), require__utils_cssr_index.cM("grouped", `
 padding-left: calc(var(--n-option-padding-left) * 1.5);
 `), require__utils_cssr_index.cM("pending", [require__utils_cssr_index.c("&::before", `
 background-color: var(--n-option-color-pending);
 `)]), require__utils_cssr_index.cM("selected", `
 color: var(--n-option-text-color-active);
 `, [require__utils_cssr_index.c("&::before", `
 background-color: var(--n-option-color-active);
 `), require__utils_cssr_index.cM("pending", [require__utils_cssr_index.c("&::before", `
 background-color: var(--n-option-color-active-pending);
 `)])]), require__utils_cssr_index.cM("disabled", `
 cursor: not-allowed;
 `, [require__utils_cssr_index.cNotM("selected", `
 color: var(--n-option-text-color-disabled);
 `), require__utils_cssr_index.cM("selected", `
 opacity: var(--n-option-opacity-disabled);
 `)]), require__utils_cssr_index.cE("check", `
 font-size: 16px;
 position: absolute;
 right: calc(var(--n-option-padding-right) - 4px);
 top: calc(50% - 7px);
 color: var(--n-option-check-color);
 transition: color .3s var(--n-bezier);
 `, [require__styles_transitions_fade_in_scale_up_cssr.fadeInScaleUpTransition({
  enterScale: "0.5"
})])])]);
//#endregion
module.exports = index_cssr_default;