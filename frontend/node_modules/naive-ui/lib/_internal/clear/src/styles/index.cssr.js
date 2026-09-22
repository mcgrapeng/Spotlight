const require__utils_cssr_index = require("../../../../_utils/cssr/index.js");
const require__styles_transitions_icon_switch_cssr = require("../../../../_styles/transitions/icon-switch.cssr.js");
//#region src/_internal/clear/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("base-clear", `
 flex-shrink: 0;
 height: 1em;
 width: 1em;
 position: relative;
`, [require__utils_cssr_index.c(">", [require__utils_cssr_index.cE("clear", `
 font-size: var(--n-clear-size);
 height: 1em;
 width: 1em;
 cursor: pointer;
 color: var(--n-clear-color);
 transition: color .3s var(--n-bezier);
 display: flex;
 `, [require__utils_cssr_index.c("&:hover", `
 color: var(--n-clear-color-hover)!important;
 `), require__utils_cssr_index.c("&:active", `
 color: var(--n-clear-color-pressed)!important;
 `)]), require__utils_cssr_index.cE("placeholder", `
 display: flex;
 `), require__utils_cssr_index.cE("clear, placeholder", `
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `, [require__styles_transitions_icon_switch_cssr.iconSwitchTransition({
  originalTransform: "translateX(-50%) translateY(-50%)",
  left: "50%",
  top: "50%"
})])])]);
//#endregion
module.exports = index_cssr_default;