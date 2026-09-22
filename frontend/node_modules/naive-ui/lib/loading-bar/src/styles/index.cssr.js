const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_cssr = require("../../../_styles/transitions/fade-in.cssr.js");
//#region src/loading-bar/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("loading-bar-container", `
 z-index: 5999;
 position: fixed;
 top: 0;
 left: 0;
 right: 0;
 height: 2px;
`, [require__styles_transitions_fade_in_cssr.fadeInTransition({
  enterDuration: "0.3s",
  leaveDuration: "0.8s"
}), require__utils_cssr_index.cB("loading-bar", `
 width: 100%;
 transition:
 max-width 4s linear,
 background .2s linear;
 height: var(--n-height);
 `, [require__utils_cssr_index.cM("starting", `
 background: var(--n-color-loading);
 `), require__utils_cssr_index.cM("finishing", `
 background: var(--n-color-loading);
 transition:
 max-width .2s linear,
 background .2s linear;
 `), require__utils_cssr_index.cM("error", `
 background: var(--n-color-error);
 transition:
 max-width .2s linear,
 background .2s linear;
 `)])]);
//#endregion
module.exports = index_cssr_default;