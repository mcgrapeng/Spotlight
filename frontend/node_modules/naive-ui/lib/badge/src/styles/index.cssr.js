const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_scale_up_cssr = require("../../../_styles/transitions/fade-in-scale-up.cssr.js");
//#region src/badge/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.c("@keyframes badge-wave-spread", {
  from: {
    boxShadow: "0 0 0.5px 0px var(--n-ripple-color)",
    opacity: .6
  },
  to: {
    boxShadow: "0 0 0.5px 4.5px var(--n-ripple-color)",
    opacity: 0
  }
}), require__utils_cssr_index.cB("badge", `
 display: inline-flex;
 position: relative;
 vertical-align: middle;
 font-family: var(--n-font-family);
 `, [require__utils_cssr_index.cM("as-is", [require__utils_cssr_index.cB("badge-sup", {
  position: "static",
  transform: "translateX(0)"
}, [require__styles_transitions_fade_in_scale_up_cssr.fadeInScaleUpTransition({
  transformOrigin: "left bottom",
  originalTransform: "translateX(0)"
})])]), require__utils_cssr_index.cM("dot", [require__utils_cssr_index.cB("badge-sup", `
 height: 8px;
 width: 8px;
 padding: 0;
 min-width: 8px;
 left: 100%;
 bottom: calc(100% - 4px);
 `, [require__utils_cssr_index.c("::before", "border-radius: 4px;")])]), require__utils_cssr_index.cB("badge-sup", `
 background: var(--n-color);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 color: #FFF;
 position: absolute;
 height: 18px;
 line-height: 18px;
 border-radius: 9px;
 padding: 0 6px;
 text-align: center;
 font-size: var(--n-font-size);
 transform: translateX(-50%);
 left: 100%;
 bottom: calc(100% - 9px);
 font-variant-numeric: tabular-nums;
 z-index: 2;
 display: flex;
 align-items: center;
 `, [require__styles_transitions_fade_in_scale_up_cssr.fadeInScaleUpTransition({
  transformOrigin: "left bottom",
  originalTransform: "translateX(-50%)"
}), require__utils_cssr_index.cB("base-wave", {
  zIndex: 1,
  animationDuration: "2s",
  animationIterationCount: "infinite",
  animationDelay: "1s",
  animationTimingFunction: "var(--n-ripple-bezier)",
  animationName: "badge-wave-spread"
}), require__utils_cssr_index.c("&::before", `
 opacity: 0;
 transform: scale(1);
 border-radius: 9px;
 content: "";
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)])])]);
//#endregion
module.exports = index_cssr_default;