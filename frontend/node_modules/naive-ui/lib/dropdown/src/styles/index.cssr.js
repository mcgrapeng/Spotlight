const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_scale_up_cssr = require("../../../_styles/transitions/fade-in-scale-up.cssr.js");
//#region src/dropdown/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("dropdown-menu", `
 transform-origin: var(--v-transform-origin);
 background-color: var(--n-color);
 border-radius: var(--n-border-radius);
 box-shadow: var(--n-box-shadow);
 position: relative;
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
`, [require__styles_transitions_fade_in_scale_up_cssr.fadeInScaleUpTransition(), require__utils_cssr_index.cB("dropdown-option", `
 position: relative;
 `, [require__utils_cssr_index.c("a", `
 text-decoration: none;
 color: inherit;
 outline: none;
 `, [require__utils_cssr_index.c("&::before", `
 content: "";
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]), require__utils_cssr_index.cB("dropdown-option-body", `
 display: flex;
 cursor: pointer;
 position: relative;
 height: var(--n-option-height);
 line-height: var(--n-option-height);
 font-size: var(--n-font-size);
 color: var(--n-option-text-color);
 transition: color .3s var(--n-bezier);
 `, [require__utils_cssr_index.c("&::before", `
 content: "";
 position: absolute;
 top: 0;
 bottom: 0;
 left: 4px;
 right: 4px;
 transition: background-color .3s var(--n-bezier);
 border-radius: var(--n-border-radius);
 `), require__utils_cssr_index.cNotM("disabled", [require__utils_cssr_index.cM("pending", `
 color: var(--n-option-text-color-hover);
 `, [require__utils_cssr_index.cE("prefix, suffix", `
 color: var(--n-option-text-color-hover);
 `), require__utils_cssr_index.c("&::before", "background-color: var(--n-option-color-hover);")]), require__utils_cssr_index.cM("active", `
 color: var(--n-option-text-color-active);
 `, [require__utils_cssr_index.cE("prefix, suffix", `
 color: var(--n-option-text-color-active);
 `), require__utils_cssr_index.c("&::before", "background-color: var(--n-option-color-active);")]), require__utils_cssr_index.cM("child-active", `
 color: var(--n-option-text-color-child-active);
 `, [require__utils_cssr_index.cE("prefix, suffix", `
 color: var(--n-option-text-color-child-active);
 `)])]), require__utils_cssr_index.cM("disabled", `
 cursor: not-allowed;
 opacity: var(--n-option-opacity-disabled);
 `), require__utils_cssr_index.cM("group", `
 font-size: calc(var(--n-font-size) - 1px);
 color: var(--n-group-header-text-color);
 `, [require__utils_cssr_index.cE("prefix", `
 width: calc(var(--n-option-prefix-width) / 2);
 `, [require__utils_cssr_index.cM("show-icon", `
 width: calc(var(--n-option-icon-prefix-width) / 2);
 `)])]), require__utils_cssr_index.cE("prefix", `
 width: var(--n-option-prefix-width);
 display: flex;
 justify-content: center;
 align-items: center;
 color: var(--n-prefix-color);
 transition: color .3s var(--n-bezier);
 z-index: 1;
 `, [require__utils_cssr_index.cM("show-icon", `
 width: var(--n-option-icon-prefix-width);
 `), require__utils_cssr_index.cB("icon", `
 font-size: var(--n-option-icon-size);
 `)]), require__utils_cssr_index.cE("label", `
 white-space: nowrap;
 flex: 1;
 z-index: 1;
 `), require__utils_cssr_index.cE("suffix", `
 box-sizing: border-box;
 flex-grow: 0;
 flex-shrink: 0;
 display: flex;
 justify-content: flex-end;
 align-items: center;
 min-width: var(--n-option-suffix-width);
 padding: 0 8px;
 transition: color .3s var(--n-bezier);
 color: var(--n-suffix-color);
 z-index: 1;
 `, [require__utils_cssr_index.cM("has-submenu", `
 width: var(--n-option-icon-suffix-width);
 `), require__utils_cssr_index.cB("icon", `
 font-size: var(--n-option-icon-size);
 `)]), require__utils_cssr_index.cB("dropdown-menu", "pointer-events: all;")]), require__utils_cssr_index.cB("dropdown-offset-container", `
 pointer-events: none;
 position: absolute;
 left: 0;
 right: 0;
 top: -4px;
 bottom: -4px;
 `)]), require__utils_cssr_index.cB("dropdown-divider", `
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-divider-color);
 height: 1px;
 margin: 4px 0;
 `), require__utils_cssr_index.cB("dropdown-menu-wrapper", `
 transform-origin: var(--v-transform-origin);
 width: fit-content;
 `), require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("scrollbar", `
 height: inherit;
 max-height: inherit;
 `)]), require__utils_cssr_index.cNotM("scrollable", `
 padding: var(--n-padding);
 `), require__utils_cssr_index.cM("scrollable", [require__utils_cssr_index.cE("content", `
 padding: var(--n-padding);
 `)])]);
//#endregion
module.exports = index_cssr_default;