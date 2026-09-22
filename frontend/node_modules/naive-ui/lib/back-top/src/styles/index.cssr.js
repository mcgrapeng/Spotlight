const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_scale_up_cssr = require("../../../_styles/transitions/fade-in-scale-up.cssr.js");
//#region src/back-top/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("back-top", `
 position: fixed;
 right: 40px;
 bottom: 40px;
 cursor: pointer;
 display: flex;
 align-items: center;
 justify-content: center;
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: var(--n-border-radius);
 height: var(--n-height);
 min-width: var(--n-width);
 box-shadow: var(--n-box-shadow);
 background-color: var(--n-color);
`, [require__styles_transitions_fade_in_scale_up_cssr.fadeInScaleUpTransition(), require__utils_cssr_index.cM("transition-disabled", {
  transition: "none !important"
}), require__utils_cssr_index.cB("base-icon", `
 font-size: var(--n-icon-size);
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 `), require__utils_cssr_index.c("svg", {
  pointerEvents: "none"
}), require__utils_cssr_index.c("&:hover", {
  boxShadow: "var(--n-box-shadow-hover)"
}, [require__utils_cssr_index.cB("base-icon", {
  color: "var(--n-icon-color-hover)"
})]), require__utils_cssr_index.c("&:active", {
  boxShadow: "var(--n-box-shadow-pressed)"
}, [require__utils_cssr_index.cB("base-icon", {
  color: "var(--n-icon-color-pressed)"
})])]);
//#endregion
module.exports = index_cssr_default;