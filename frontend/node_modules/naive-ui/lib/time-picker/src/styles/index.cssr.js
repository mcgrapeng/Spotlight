const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_scale_up_cssr = require("../../../_styles/transitions/fade-in-scale-up.cssr.js");
//#region src/time-picker/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("time-picker", `
 z-index: auto;
 position: relative;
 `, [require__utils_cssr_index.cB("time-picker-icon", `
 color: var(--n-icon-color-override);
 transition: color .3s var(--n-bezier);
 `), require__utils_cssr_index.cM("disabled", [require__utils_cssr_index.cB("time-picker-icon", `
 color: var(--n-icon-color-disabled-override);
 `)])]), require__utils_cssr_index.cB("time-picker-panel", `
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 outline: none;
 font-size: var(--n-item-font-size);
 border-radius: var(--n-border-radius);
 margin: 4px 0;
 min-width: 104px;
 overflow: hidden;
 background-color: var(--n-panel-color);
 box-shadow: var(--n-panel-box-shadow);
 `, [require__styles_transitions_fade_in_scale_up_cssr.fadeInScaleUpTransition(), require__utils_cssr_index.cB("time-picker-actions", `
 padding: var(--n-panel-action-padding);
 align-items: center;
 display: flex;
 justify-content: space-evenly;
 `), require__utils_cssr_index.cB("time-picker-cols", `
 height: calc(var(--n-item-height) * 6);
 display: flex;
 position: relative;
 transition: border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-panel-divider-color);
 `), require__utils_cssr_index.cB("time-picker-col", `
 flex-grow: 1;
 min-width: var(--n-item-width);
 height: calc(var(--n-item-height) * 6);
 flex-direction: column;
 transition: box-shadow .3s var(--n-bezier);
 `, [require__utils_cssr_index.cM("transition-disabled", [require__utils_cssr_index.cE("item", "transition: none;", [require__utils_cssr_index.c("&::before", "transition: none;")])]), require__utils_cssr_index.cE("padding", `
 height: calc(var(--n-item-height) * 5);
 `), require__utils_cssr_index.c("&:first-child", "min-width: calc(var(--n-item-width) + 4px);", [require__utils_cssr_index.cE("item", [require__utils_cssr_index.c("&::before", "left: 4px;")])]), require__utils_cssr_index.cE("item", `
 cursor: pointer;
 height: var(--n-item-height);
 display: flex;
 align-items: center;
 justify-content: center;
 transition: 
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 text-decoration-color .3s var(--n-bezier);
 background: #0000;
 text-decoration-color: #0000;
 color: var(--n-item-text-color);
 z-index: 0;
 box-sizing: border-box;
 padding-top: 4px;
 position: relative;
 `, [require__utils_cssr_index.c("&::before", `
 content: "";
 transition: background-color .3s var(--n-bezier);
 z-index: -1;
 position: absolute;
 left: 0;
 right: 4px;
 top: 4px;
 bottom: 0;
 border-radius: var(--n-item-border-radius);
 `), require__utils_cssr_index.cNotM("disabled", [require__utils_cssr_index.c("&:hover::before", `
 background-color: var(--n-item-color-hover);
 `)]), require__utils_cssr_index.cM("active", `
 color: var(--n-item-text-color-active);
 `, [require__utils_cssr_index.c("&::before", `
 background-color: var(--n-item-color-hover);
 `)]), require__utils_cssr_index.cM("disabled", `
 opacity: var(--n-item-opacity-disabled);
 cursor: not-allowed;
 `)]), require__utils_cssr_index.cM("invalid", [require__utils_cssr_index.cE("item", [require__utils_cssr_index.cM("active", `
 text-decoration: line-through;
 text-decoration-color: var(--n-item-text-color-active);
 `)])])])])]);
//#endregion
module.exports = index_cssr_default;