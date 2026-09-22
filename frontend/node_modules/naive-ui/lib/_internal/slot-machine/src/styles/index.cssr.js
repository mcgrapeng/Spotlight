const require__utils_cssr_index = require("../../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_width_expand_cssr = require("../../../../_styles/transitions/fade-in-width-expand.cssr.js");
const require__styles_transitions_fade_up_width_expand_cssr = require("../../../../_styles/transitions/fade-up-width-expand.cssr.js");
//#region src/_internal/slot-machine/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.c("@keyframes n-base-slot-machine-fade-up-in", `
 from {
 transform: translateY(60%);
 opacity: 0;
 }
 to {
 transform: translateY(0);
 opacity: 1;
 }
 `), require__utils_cssr_index.c("@keyframes n-base-slot-machine-fade-down-in", `
 from {
 transform: translateY(-60%);
 opacity: 0;
 }
 to {
 transform: translateY(0);
 opacity: 1;
 }
 `), require__utils_cssr_index.c("@keyframes n-base-slot-machine-fade-up-out", `
 from {
 transform: translateY(0%);
 opacity: 1;
 }
 to {
 transform: translateY(-60%);
 opacity: 0;
 }
 `), require__utils_cssr_index.c("@keyframes n-base-slot-machine-fade-down-out", `
 from {
 transform: translateY(0%);
 opacity: 1;
 }
 to {
 transform: translateY(60%);
 opacity: 0;
 }
 `), require__utils_cssr_index.cB("base-slot-machine", `
 overflow: hidden;
 white-space: nowrap;
 display: inline-block;
 height: 18px;
 line-height: 18px;
 `, [require__utils_cssr_index.cB("base-slot-machine-number", `
 display: inline-block;
 position: relative;
 height: 18px;
 width: .6em;
 max-width: .6em;
 `, [require__styles_transitions_fade_up_width_expand_cssr.fadeUpWidthExpandTransition({
  duration: ".2s"
}), require__styles_transitions_fade_in_width_expand_cssr.fadeInWidthExpandTransition({
  duration: ".2s",
  delay: "0s"
}), require__utils_cssr_index.cB("base-slot-machine-old-number", `
 display: inline-block;
 opacity: 0;
 position: absolute;
 left: 0;
 right: 0;
 `, [require__utils_cssr_index.cM("top", {
  transform: "translateY(-100%)"
}), require__utils_cssr_index.cM("bottom", {
  transform: "translateY(100%)"
}), require__utils_cssr_index.cM("down-scroll", {
  animation: "n-base-slot-machine-fade-down-out .2s cubic-bezier(0, 0, .2, 1)",
  animationIterationCount: 1
}), require__utils_cssr_index.cM("up-scroll", {
  animation: "n-base-slot-machine-fade-up-out .2s cubic-bezier(0, 0, .2, 1)",
  animationIterationCount: 1
})]), require__utils_cssr_index.cB("base-slot-machine-current-number", `
 display: inline-block;
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 right: 0;
 opacity: 1;
 transform: translateY(0);
 width: .6em;
 `, [require__utils_cssr_index.cM("down-scroll", {
  animation: "n-base-slot-machine-fade-down-in .2s cubic-bezier(0, 0, .2, 1)",
  animationIterationCount: 1
}), require__utils_cssr_index.cM("up-scroll", {
  animation: "n-base-slot-machine-fade-up-in .2s cubic-bezier(0, 0, .2, 1)",
  animationIterationCount: 1
}), require__utils_cssr_index.cE("inner", `
 display: inline-block;
 position: absolute;
 right: 0;
 top: 0;
 width: .6em;
 `, [require__utils_cssr_index.cM("not-number", `
 right: unset;
 left: 0;
 `)])])])])]);
//#endregion
module.exports = index_cssr_default;