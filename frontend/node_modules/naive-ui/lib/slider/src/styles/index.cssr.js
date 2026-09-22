const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_scale_up_cssr = require("../../../_styles/transitions/fade-in-scale-up.cssr.js");
//#region src/slider/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("slider", `
 display: block;
 padding: calc((var(--n-handle-size) - var(--n-rail-height)) / 2) 0;
 position: relative;
 z-index: 0;
 width: 100%;
 cursor: pointer;
 user-select: none;
 -webkit-user-select: none;
 `, [require__utils_cssr_index.cM("reverse", [require__utils_cssr_index.cB("slider-handles", [require__utils_cssr_index.cB("slider-handle-wrapper", `
 transform: translate(50%, -50%);
 `)]), require__utils_cssr_index.cB("slider-dots", [require__utils_cssr_index.cB("slider-dot", `
 transform: translateX(50%, -50%);
 `)]), require__utils_cssr_index.cM("vertical", [require__utils_cssr_index.cB("slider-handles", [require__utils_cssr_index.cB("slider-handle-wrapper", `
 transform: translate(-50%, -50%);
 `)]), require__utils_cssr_index.cB("slider-marks", [require__utils_cssr_index.cB("slider-mark", `
 transform: translateY(calc(-50% + var(--n-dot-height) / 2));
 `)]), require__utils_cssr_index.cB("slider-dots", [require__utils_cssr_index.cB("slider-dot", `
 transform: translateX(-50%) translateY(0);
 `)])])]), require__utils_cssr_index.cM("vertical", `
 box-sizing: content-box;
 padding: 0 calc((var(--n-handle-size) - var(--n-rail-height)) / 2);
 width: var(--n-rail-width-vertical);
 height: 100%;
 `, [require__utils_cssr_index.cB("slider-handles", `
 top: calc(var(--n-handle-size) / 2);
 right: 0;
 bottom: calc(var(--n-handle-size) / 2);
 left: 0;
 `, [require__utils_cssr_index.cB("slider-handle-wrapper", `
 top: unset;
 left: 50%;
 transform: translate(-50%, 50%);
 `)]), require__utils_cssr_index.cB("slider-rail", `
 height: 100%;
 `, [require__utils_cssr_index.cE("fill", `
 top: unset;
 right: 0;
 bottom: unset;
 left: 0;
 `)]), require__utils_cssr_index.cM("with-mark", `
 width: var(--n-rail-width-vertical);
 margin: 0 32px 0 8px;
 `), require__utils_cssr_index.cB("slider-marks", `
 top: calc(var(--n-handle-size) / 2);
 right: unset;
 bottom: calc(var(--n-handle-size) / 2);
 left: 22px;
 font-size: var(--n-mark-font-size);
 `, [require__utils_cssr_index.cB("slider-mark", `
 transform: translateY(50%);
 white-space: nowrap;
 `)]), require__utils_cssr_index.cB("slider-dots", `
 top: calc(var(--n-handle-size) / 2);
 right: unset;
 bottom: calc(var(--n-handle-size) / 2);
 left: 50%;
 `, [require__utils_cssr_index.cB("slider-dot", `
 transform: translateX(-50%) translateY(50%);
 `)])]), require__utils_cssr_index.cM("disabled", `
 cursor: not-allowed;
 opacity: var(--n-opacity-disabled);
 `, [require__utils_cssr_index.cB("slider-handle", `
 cursor: not-allowed;
 `)]), require__utils_cssr_index.cM("with-mark", `
 width: 100%;
 margin: 8px 0 32px 0;
 `), require__utils_cssr_index.c("&:hover", [require__utils_cssr_index.cB("slider-rail", {
  backgroundColor: "var(--n-rail-color-hover)"
}, [require__utils_cssr_index.cE("fill", {
  backgroundColor: "var(--n-fill-color-hover)"
})]), require__utils_cssr_index.cB("slider-handle", {
  boxShadow: "var(--n-handle-box-shadow-hover)"
})]), require__utils_cssr_index.cM("active", [require__utils_cssr_index.cB("slider-rail", {
  backgroundColor: "var(--n-rail-color-hover)"
}, [require__utils_cssr_index.cE("fill", {
  backgroundColor: "var(--n-fill-color-hover)"
})]), require__utils_cssr_index.cB("slider-handle", {
  boxShadow: "var(--n-handle-box-shadow-hover)"
})]), require__utils_cssr_index.cB("slider-marks", `
 position: absolute;
 top: 18px;
 left: calc(var(--n-handle-size) / 2);
 right: calc(var(--n-handle-size) / 2);
 `, [require__utils_cssr_index.cB("slider-mark", `
 position: absolute;
 transform: translateX(-50%);
 white-space: nowrap;
 `)]), require__utils_cssr_index.cB("slider-rail", `
 width: 100%;
 position: relative;
 height: var(--n-rail-height);
 background-color: var(--n-rail-color);
 transition: background-color .3s var(--n-bezier);
 border-radius: calc(var(--n-rail-height) / 2);
 `, [require__utils_cssr_index.cE("fill", `
 position: absolute;
 top: 0;
 bottom: 0;
 border-radius: calc(var(--n-rail-height) / 2);
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-fill-color);
 `)]), require__utils_cssr_index.cB("slider-handles", `
 position: absolute;
 top: 0;
 right: calc(var(--n-handle-size) / 2);
 bottom: 0;
 left: calc(var(--n-handle-size) / 2);
 `, [require__utils_cssr_index.cB("slider-handle-wrapper", `
 outline: none;
 position: absolute;
 top: 50%;
 transform: translate(-50%, -50%);
 cursor: pointer;
 display: flex;
 `, [require__utils_cssr_index.cB("slider-handle", `
 height: var(--n-handle-size);
 width: var(--n-handle-size);
 border-radius: 50%;
 overflow: hidden;
 transition: box-shadow .2s var(--n-bezier), background-color .3s var(--n-bezier);
 background-color: var(--n-handle-color);
 box-shadow: var(--n-handle-box-shadow);
 `, [require__utils_cssr_index.c("&:hover", `
 box-shadow: var(--n-handle-box-shadow-hover);
 `)]), require__utils_cssr_index.c("&:focus", [require__utils_cssr_index.cB("slider-handle", `
 box-shadow: var(--n-handle-box-shadow-focus);
 `, [require__utils_cssr_index.c("&:hover", `
 box-shadow: var(--n-handle-box-shadow-active);
 `)])])])]), require__utils_cssr_index.cB("slider-dots", `
 position: absolute;
 top: 50%;
 left: calc(var(--n-handle-size) / 2);
 right: calc(var(--n-handle-size) / 2);
 `, [require__utils_cssr_index.cM("transition-disabled", [require__utils_cssr_index.cB("slider-dot", "transition: none;")]), require__utils_cssr_index.cB("slider-dot", `
 transition:
 border-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 position: absolute;
 transform: translate(-50%, -50%);
 height: var(--n-dot-height);
 width: var(--n-dot-width);
 border-radius: var(--n-dot-border-radius);
 overflow: hidden;
 box-sizing: border-box;
 border: var(--n-dot-border);
 background-color: var(--n-dot-color);
 `, [require__utils_cssr_index.cM("active", "border: var(--n-dot-border-active);")])])]), require__utils_cssr_index.cB("slider-handle-indicator", `
 font-size: var(--n-font-size);
 padding: 6px 10px;
 border-radius: var(--n-indicator-border-radius);
 color: var(--n-indicator-text-color);
 background-color: var(--n-indicator-color);
 box-shadow: var(--n-indicator-box-shadow);
 `, [require__styles_transitions_fade_in_scale_up_cssr.fadeInScaleUpTransition()]), require__utils_cssr_index.cB("slider-handle-indicator", `
 font-size: var(--n-font-size);
 padding: 6px 10px;
 border-radius: var(--n-indicator-border-radius);
 color: var(--n-indicator-text-color);
 background-color: var(--n-indicator-color);
 box-shadow: var(--n-indicator-box-shadow);
 `, [require__utils_cssr_index.cM("top", `
 margin-bottom: 12px;
 `), require__utils_cssr_index.cM("right", `
 margin-left: 12px;
 `), require__utils_cssr_index.cM("bottom", `
 margin-top: 12px;
 `), require__utils_cssr_index.cM("left", `
 margin-right: 12px;
 `), require__styles_transitions_fade_in_scale_up_cssr.fadeInScaleUpTransition()]), require__utils_cssr_index.insideModal(require__utils_cssr_index.cB("slider", [require__utils_cssr_index.cB("slider-dot", "background-color: var(--n-dot-color-modal);")])), require__utils_cssr_index.insidePopover(require__utils_cssr_index.cB("slider", [require__utils_cssr_index.cB("slider-dot", "background-color: var(--n-dot-color-popover);")]))]);
//#endregion
module.exports = index_cssr_default;