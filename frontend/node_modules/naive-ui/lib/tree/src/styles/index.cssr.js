const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_icon_switch_cssr = require("../../../_styles/transitions/icon-switch.cssr.js");
const require__styles_transitions_fade_in_height_expand_cssr = require("../../../_styles/transitions/fade-in-height-expand.cssr.js");
//#region src/tree/src/styles/index.cssr.ts
const iconSwitchTransitionNode = require__styles_transitions_icon_switch_cssr.iconSwitchTransition();
var index_cssr_default = require__utils_cssr_index.cB("tree", `
 font-size: var(--n-font-size);
 outline: none;
`, [require__utils_cssr_index.c("ul, li", `
 margin: 0;
 padding: 0;
 list-style: none;
 `), require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("tree-node", [require__utils_cssr_index.c("&:first-child", "margin-top: 0;")])]), require__utils_cssr_index.cB("tree-motion-wrapper", [require__utils_cssr_index.cM("expand", [require__styles_transitions_fade_in_height_expand_cssr.fadeInHeightExpandTransition({
  duration: "0.2s"
})]), require__utils_cssr_index.cM("collapse", [require__styles_transitions_fade_in_height_expand_cssr.fadeInHeightExpandTransition({
  duration: "0.2s",
  reverse: true
})])]), require__utils_cssr_index.cB("tree-node-wrapper", `
 box-sizing: border-box;
 padding: var(--n-node-wrapper-padding);
 `), require__utils_cssr_index.cB("tree-node", `
 position: relative;
 display: flex;
 border-radius: var(--n-node-border-radius);
 transition: background-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cM("highlight", [require__utils_cssr_index.cB("tree-node-content", [require__utils_cssr_index.cE("text", "border-bottom-color: var(--n-node-text-color-disabled);")])]), require__utils_cssr_index.cM("disabled", [require__utils_cssr_index.cB("tree-node-content", `
 color: var(--n-node-text-color-disabled);
 cursor: not-allowed;
 `)]), require__utils_cssr_index.cNotM("disabled", [require__utils_cssr_index.cM("clickable", [require__utils_cssr_index.cB("tree-node-content", `
 cursor: pointer;
 `)])])]), require__utils_cssr_index.cM("block-node", [require__utils_cssr_index.cB("tree-node-content", `
 flex: 1;
 min-width: 0;
 `)]), require__utils_cssr_index.cNotM("block-line", [require__utils_cssr_index.cB("tree-node", [require__utils_cssr_index.cNotM("disabled", [require__utils_cssr_index.cB("tree-node-content", [require__utils_cssr_index.c("&:hover", "background: var(--n-node-color-hover);")]), require__utils_cssr_index.cM("selectable", [require__utils_cssr_index.cB("tree-node-content", [require__utils_cssr_index.c("&:active", "background: var(--n-node-color-pressed);")])]), require__utils_cssr_index.cM("pending", [require__utils_cssr_index.cB("tree-node-content", `
 background: var(--n-node-color-hover);
 `)]), require__utils_cssr_index.cM("selected", [require__utils_cssr_index.cB("tree-node-content", "background: var(--n-node-color-active);")])]), require__utils_cssr_index.cM("selected", [require__utils_cssr_index.cB("tree-node-content", "background: var(--n-node-color-active);")])])]), require__utils_cssr_index.cM("block-line", [require__utils_cssr_index.cB("tree-node", [require__utils_cssr_index.cNotM("disabled", [require__utils_cssr_index.c("&:hover", "background: var(--n-node-color-hover);"), require__utils_cssr_index.cM("pending", `
 background: var(--n-node-color-hover);
 `), require__utils_cssr_index.cM("selectable", [require__utils_cssr_index.cNotM("selected", [require__utils_cssr_index.c("&:active", "background: var(--n-node-color-pressed);")])]), require__utils_cssr_index.cM("selected", "background: var(--n-node-color-active);")]), require__utils_cssr_index.cM("selected", "background: var(--n-node-color-active);"), require__utils_cssr_index.cM("disabled", `
 cursor: not-allowed;
 `)])]), require__utils_cssr_index.cM("ellipsis", [require__utils_cssr_index.cB("tree-node", [require__utils_cssr_index.cB("tree-node-content", `
 overflow: hidden;
 `, [require__utils_cssr_index.cE("text", `
 text-overflow: ellipsis;
 white-space: nowrap;
 overflow: hidden;
 `)])])]), require__utils_cssr_index.cB("tree-node-indent", `
 flex-grow: 0;
 flex-shrink: 0;
 `, [require__utils_cssr_index.cM("show-line", "position: relative", [require__utils_cssr_index.c("&::before", `
 position: absolute;
 left: 50%;
 border-left: 1px solid var(--n-line-color);
 transition: border-color .3s var(--n-bezier);
 transform: translate(-50%);
 content: "";
 top: var(--n-line-offset-top);
 bottom: var(--n-line-offset-bottom);
 `), require__utils_cssr_index.cM("last-child", [require__utils_cssr_index.c("&::before", `
 bottom: 50%;
 `)]), require__utils_cssr_index.cM("is-leaf", [require__utils_cssr_index.c("&::after", `
 position: absolute;
 content: "";
 left: calc(50% + 0.5px);
 right: 0;
 bottom: 50%;
 transition: border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-line-color);
 `)])]), require__utils_cssr_index.cNotM("show-line", "height: 0;")]), require__utils_cssr_index.cB("tree-node-switcher", `
 cursor: pointer;
 display: inline-flex;
 flex-shrink: 0;
 height: var(--n-node-content-height);
 align-items: center;
 justify-content: center;
 transition: transform .15s var(--n-bezier);
 vertical-align: bottom;
 `, [require__utils_cssr_index.cE("icon", `
 position: relative;
 height: 14px;
 width: 14px;
 display: flex;
 color: var(--n-arrow-color);
 transition: color .3s var(--n-bezier);
 font-size: 14px;
 `, [require__utils_cssr_index.cB("icon", [iconSwitchTransitionNode]), require__utils_cssr_index.cB("base-loading", `
 color: var(--n-loading-color);
 position: absolute;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 `, [iconSwitchTransitionNode]), require__utils_cssr_index.cB("base-icon", [iconSwitchTransitionNode])]), require__utils_cssr_index.cM("hide", "visibility: hidden;"), require__utils_cssr_index.cM("expanded", "transform: rotate(90deg);")]), require__utils_cssr_index.cB("tree-node-checkbox", `
 display: inline-flex;
 height: var(--n-node-content-height);
 vertical-align: bottom;
 align-items: center;
 justify-content: center;
 `), require__utils_cssr_index.cB("tree-node-content", `
 user-select: none;
 position: relative;
 display: inline-flex;
 align-items: center;
 min-height: var(--n-node-content-height);
 box-sizing: border-box;
 line-height: var(--n-line-height);
 vertical-align: bottom;
 padding: 0 6px 0 4px;
 cursor: default;
 border-radius: var(--n-node-border-radius);
 color: var(--n-node-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.c("&:last-child", "margin-bottom: 0;"), require__utils_cssr_index.cE("prefix", `
 display: inline-flex;
 margin-right: 8px;
 `), require__utils_cssr_index.cE("text", `
 border-bottom: 1px solid #0000;
 transition: border-color .3s var(--n-bezier);
 flex-grow: 1;
 max-width: 100%;
 `), require__utils_cssr_index.cE("suffix", `
 display: inline-flex;
 `)]), require__utils_cssr_index.cE("empty", "margin: auto;")]);
//#endregion
module.exports = index_cssr_default;