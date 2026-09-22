const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_cssr = require("../../../_styles/transitions/fade-in.cssr.js");
const require__styles_transitions_slide_in_from_bottom = require("../../../_styles/transitions/slide-in-from-bottom.js");
const require__styles_transitions_slide_in_from_left = require("../../../_styles/transitions/slide-in-from-left.js");
const require__styles_transitions_slide_in_from_right = require("../../../_styles/transitions/slide-in-from-right.js");
const require__styles_transitions_slide_in_from_top = require("../../../_styles/transitions/slide-in-from-top.js");
//#region src/drawer/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("drawer", `
 word-break: break-word;
 line-height: var(--n-line-height);
 position: absolute;
 pointer-events: all;
 box-shadow: var(--n-box-shadow);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 background-color: var(--n-color);
 color: var(--n-text-color);
 box-sizing: border-box;
 `, [require__styles_transitions_slide_in_from_right.slideInFromRightTransition(), require__styles_transitions_slide_in_from_left.slideInFromLeftTransition(), require__styles_transitions_slide_in_from_top.slideInFromTopTransition(), require__styles_transitions_slide_in_from_bottom.slideInFromBottomTransition(), require__utils_cssr_index.cM("unselectable", `
 user-select: none; 
 -webkit-user-select: none;
 `), require__utils_cssr_index.cM("native-scrollbar", [require__utils_cssr_index.cB("drawer-content-wrapper", `
 overflow: auto;
 height: 100%;
 `)]), require__utils_cssr_index.cE("resize-trigger", `
 position: absolute;
 background-color: #0000;
 transition: background-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cM("hover", `
 background-color: var(--n-resize-trigger-color-hover);
 `)]), require__utils_cssr_index.cB("drawer-content-wrapper", `
 box-sizing: border-box;
 `), require__utils_cssr_index.cB("drawer-content", `
 height: 100%;
 display: flex;
 flex-direction: column;
 `, [require__utils_cssr_index.cM("native-scrollbar", [require__utils_cssr_index.cB("drawer-body-content-wrapper", `
 height: 100%;
 overflow: auto;
 `)]), require__utils_cssr_index.cB("drawer-body", `
 flex: 1 0 0;
 overflow: hidden;
 `), require__utils_cssr_index.cB("drawer-body-content-wrapper", `
 box-sizing: border-box;
 padding: var(--n-body-padding);
 `), require__utils_cssr_index.cB("drawer-header", `
 font-weight: var(--n-title-font-weight);
 line-height: 1;
 font-size: var(--n-title-font-size);
 color: var(--n-title-text-color);
 padding: var(--n-header-padding);
 transition: border .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-divider-color);
 border-bottom: var(--n-header-border-bottom);
 display: flex;
 justify-content: space-between;
 align-items: center;
 `, [require__utils_cssr_index.cE("main", `
 flex: 1;
 `), require__utils_cssr_index.cE("close", `
 margin-left: 6px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)]), require__utils_cssr_index.cB("drawer-footer", `
 display: flex;
 justify-content: flex-end;
 border-top: var(--n-footer-border-top);
 transition: border .3s var(--n-bezier);
 padding: var(--n-footer-padding);
 `)]), require__utils_cssr_index.cM("right-placement", `
 top: 0;
 bottom: 0;
 right: 0;
 border-top-left-radius: var(--n-border-radius);
 border-bottom-left-radius: var(--n-border-radius);
 `, [require__utils_cssr_index.cE("resize-trigger", `
 width: 3px;
 height: 100%;
 top: 0;
 left: 0;
 transform: translateX(-1.5px);
 cursor: ew-resize;
 `)]), require__utils_cssr_index.cM("left-placement", `
 top: 0;
 bottom: 0;
 left: 0;
 border-top-right-radius: var(--n-border-radius);
 border-bottom-right-radius: var(--n-border-radius);
 `, [require__utils_cssr_index.cE("resize-trigger", `
 width: 3px;
 height: 100%;
 top: 0;
 right: 0;
 transform: translateX(1.5px);
 cursor: ew-resize;
 `)]), require__utils_cssr_index.cM("top-placement", `
 top: 0;
 left: 0;
 right: 0;
 border-bottom-left-radius: var(--n-border-radius);
 border-bottom-right-radius: var(--n-border-radius);
 `, [require__utils_cssr_index.cE("resize-trigger", `
 width: 100%;
 height: 3px;
 bottom: 0;
 left: 0;
 transform: translateY(1.5px);
 cursor: ns-resize;
 `)]), require__utils_cssr_index.cM("bottom-placement", `
 left: 0;
 bottom: 0;
 right: 0;
 border-top-left-radius: var(--n-border-radius);
 border-top-right-radius: var(--n-border-radius);
 `, [require__utils_cssr_index.cE("resize-trigger", `
 width: 100%;
 height: 3px;
 top: 0;
 left: 0;
 transform: translateY(-1.5px);
 cursor: ns-resize;
 `)])]), require__utils_cssr_index.c("body", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("drawer-container", `
 position: fixed;
 `)])]), require__utils_cssr_index.cB("drawer-container", `
 position: relative;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 `, [require__utils_cssr_index.c("> *", `
 pointer-events: all;
 `)]), require__utils_cssr_index.cB("drawer-mask", `
 background-color: rgba(0, 0, 0, .3);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `, [require__utils_cssr_index.cM("invisible", `
 background-color: rgba(0, 0, 0, 0)
 `), require__styles_transitions_fade_in_cssr.fadeInTransition({
  enterDuration: "0.2s",
  leaveDuration: "0.2s",
  enterCubicBezier: "var(--n-bezier-in)",
  leaveCubicBezier: "var(--n-bezier-out)"
})])]);
//#endregion
module.exports = index_cssr_default;