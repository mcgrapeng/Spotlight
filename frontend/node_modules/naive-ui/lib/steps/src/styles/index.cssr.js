const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_icon_switch_cssr = require("../../../_styles/transitions/icon-switch.cssr.js");
//#region src/steps/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("steps", `
 width: 100%;
 display: flex;
`, [require__utils_cssr_index.cB("step", `
 position: relative;
 display: flex;
 flex: 1;
 `, [require__utils_cssr_index.cM("disabled", "cursor: not-allowed"), require__utils_cssr_index.cM("clickable", `
 cursor: pointer;
 `), require__utils_cssr_index.c("&:last-child", [require__utils_cssr_index.cB("step-splitor", "display: none;")])]), require__utils_cssr_index.cB("step-splitor", `
 background-color: var(--n-splitor-color);
 margin-top: calc(var(--n-step-header-font-size) / 2);
 height: 1px;
 flex: 1;
 align-self: flex-start;
 margin-left: 12px;
 margin-right: 12px;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cB("step-content", "flex: 1;", [require__utils_cssr_index.cB("step-content-header", `
 color: var(--n-header-text-color);
 margin-top: calc(var(--n-indicator-size) / 2 - var(--n-step-header-font-size) / 2);
 line-height: var(--n-step-header-font-size);
 font-size: var(--n-step-header-font-size);
 position: relative;
 display: flex;
 font-weight: var(--n-step-header-font-weight);
 margin-left: 9px;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cE("title", `
 white-space: nowrap;
 flex: 0;
 `)]), require__utils_cssr_index.cE("description", `
 color: var(--n-description-text-color);
 margin-top: 12px;
 margin-left: 9px;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `)]), require__utils_cssr_index.cB("step-indicator", `
 background-color: var(--n-indicator-color);
 box-shadow: 0 0 0 1px var(--n-indicator-border-color);
 height: var(--n-indicator-size);
 width: var(--n-indicator-size);
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 `, [require__utils_cssr_index.cB("step-indicator-slot", `
 position: relative;
 width: var(--n-indicator-icon-size);
 height: var(--n-indicator-icon-size);
 font-size: var(--n-indicator-icon-size);
 line-height: var(--n-indicator-icon-size);
 `, [require__utils_cssr_index.cE("index", `
 display: inline-block;
 text-align: center;
 position: absolute;
 left: 0;
 top: 0;
 white-space: nowrap;
 font-size: var(--n-indicator-index-font-size);
 width: var(--n-indicator-icon-size);
 height: var(--n-indicator-icon-size);
 line-height: var(--n-indicator-icon-size);
 color: var(--n-indicator-text-color);
 transition: color .3s var(--n-bezier);
 `, [require__styles_transitions_icon_switch_cssr.iconSwitchTransition()]), require__utils_cssr_index.cB("icon", `
 color: var(--n-indicator-text-color);
 transition: color .3s var(--n-bezier);
 `, [require__styles_transitions_icon_switch_cssr.iconSwitchTransition()]), require__utils_cssr_index.cB("base-icon", `
 color: var(--n-indicator-text-color);
 transition: color .3s var(--n-bezier);
 `, [require__styles_transitions_icon_switch_cssr.iconSwitchTransition()])])]), require__utils_cssr_index.cM("vertical", "flex-direction: column;", [require__utils_cssr_index.cNotM("show-description", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("step", "padding-bottom: 8px;")])]), require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("step", "margin-bottom: 16px;", [require__utils_cssr_index.c("&:last-child", "margin-bottom: 0;"), require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("step-indicator", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("step-splitor", `
 position: absolute;
 bottom: -8px;
 width: 1px;
 margin: 0 !important;
 left: calc(var(--n-indicator-size) / 2);
 height: calc(100% - var(--n-indicator-size));
 `)])]), require__utils_cssr_index.cB("step-content", [require__utils_cssr_index.cE("description", "margin-top: 8px;")])])])])]), require__utils_cssr_index.cM("content-bottom", [require__utils_cssr_index.cNotM("vertical", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("step", "flex-direction: column", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("step-line", "display: flex;", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("step-splitor", `
 margin-top: 0;
 align-self: center;
 `)])])]), require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("step-content", "margin-top: calc(var(--n-indicator-size) / 2 - var(--n-step-header-font-size) / 2);", [require__utils_cssr_index.cB("step-content-header", `
 margin-left: 0;
 `), require__utils_cssr_index.cB("step-content__description", `
 margin-left: 0;
 `)])])])])])])]);
//#endregion
module.exports = index_cssr_default;