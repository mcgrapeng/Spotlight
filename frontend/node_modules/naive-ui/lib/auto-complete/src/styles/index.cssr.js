const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_scale_up_cssr = require("../../../_styles/transitions/fade-in-scale-up.cssr.js");
//#region src/auto-complete/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("auto-complete", `
 z-index: auto;
 position: relative;
 display: inline-flex;
 width: 100%;
 `), require__utils_cssr_index.cB("auto-complete-menu", `
 margin: 4px 0;
 box-shadow: var(--n-menu-box-shadow);
 `, [require__styles_transitions_fade_in_scale_up_cssr.fadeInScaleUpTransition({
  originalTransition: "background-color .3s var(--n-bezier), box-shadow .3s var(--n-bezier)"
})])]);
//#endregion
module.exports = index_cssr_default;