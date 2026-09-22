const require__utils_cssr_index = require("../../../../_utils/cssr/index.js");
const require__styles_transitions_icon_switch_cssr = require("../../../../_styles/transitions/icon-switch.cssr.js");
//#region src/_internal/loading/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.c("@keyframes rotator", `
 0% {
 -webkit-transform: rotate(0deg);
 transform: rotate(0deg);
 }
 100% {
 -webkit-transform: rotate(360deg);
 transform: rotate(360deg);
 }`), require__utils_cssr_index.cB("base-loading", `
 position: relative;
 line-height: 0;
 width: 1em;
 height: 1em;
 `, [require__utils_cssr_index.cE("transition-wrapper", `
 position: absolute;
 width: 100%;
 height: 100%;
 `, [require__styles_transitions_icon_switch_cssr.iconSwitchTransition()]), require__utils_cssr_index.cE("placeholder", `
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `, [require__styles_transitions_icon_switch_cssr.iconSwitchTransition({
  left: "50%",
  top: "50%",
  originalTransform: "translateX(-50%) translateY(-50%)"
})]), require__utils_cssr_index.cE("container", `
 animation: rotator 3s linear infinite both;
 `, [require__utils_cssr_index.cE("icon", `
 height: 1em;
 width: 1em;
 `)])])]);
//#endregion
module.exports = index_cssr_default;