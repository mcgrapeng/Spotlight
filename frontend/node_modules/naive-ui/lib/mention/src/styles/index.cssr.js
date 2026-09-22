const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_scale_up_cssr = require("../../../_styles/transitions/fade-in-scale-up.cssr.js");
//#region src/mention/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("mention", "width: 100%; z-index: auto; position: relative;"), require__utils_cssr_index.cB("mention-menu", `
 box-shadow: var(--n-menu-box-shadow);
 `, [require__styles_transitions_fade_in_scale_up_cssr.fadeInScaleUpTransition({
  originalTransition: "background-color .3s var(--n-bezier), box-shadow .3s var(--n-bezier)"
})])]);
//#endregion
module.exports = index_cssr_default;