const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_cssr = require("../../../_styles/transitions/fade-in.cssr.js");
const require__styles_transitions_fade_in_scale_up_cssr = require("../../../_styles/transitions/fade-in-scale-up.cssr.js");
const require_modal_src_composables = require("../composables.js");
//#region src/modal/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("modal-container", `
 position: fixed;
 left: 0;
 top: 0;
 height: 0;
 width: 0;
 display: flex;
 `), require__utils_cssr_index.cB("modal-mask", `
 position: fixed;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 background-color: rgba(0, 0, 0, .4);
 `, [require__styles_transitions_fade_in_cssr.fadeInTransition({
  enterDuration: ".25s",
  leaveDuration: ".25s",
  enterCubicBezier: "var(--n-bezier-ease-out)",
  leaveCubicBezier: "var(--n-bezier-ease-out)"
})]), require__utils_cssr_index.cB("modal-body-wrapper", `
 position: fixed;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 overflow: visible;
 `, [require__utils_cssr_index.cB("modal-scroll-content", `
 min-height: 100%;
 display: flex;
 position: relative;
 `), require__utils_cssr_index.cM("mask-hidden", `pointer-events: none;`, [require__utils_cssr_index.cB("modal-scroll-content", [require__utils_cssr_index.c("> *", `
 pointer-events: all;
 `)])])]), require__utils_cssr_index.cB("modal", `
 position: relative;
 align-self: center;
 color: var(--n-text-color);
 margin: auto;
 box-shadow: var(--n-box-shadow);
 `, [require__styles_transitions_fade_in_scale_up_cssr.fadeInScaleUpTransition({
  duration: ".25s",
  enterScale: ".5"
}), require__utils_cssr_index.c(`.${require_modal_src_composables.DRAGGABLE_CLASS}`, `
 cursor: move;
 user-select: none;
 `)])]);
//#endregion
module.exports = index_cssr_default;