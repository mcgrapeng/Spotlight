const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_icon_switch_cssr = require("../../../_styles/transitions/icon-switch.cssr.js");
//#region src/switch/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("switch", `
 height: var(--n-height);
 min-width: var(--n-width);
 vertical-align: middle;
 user-select: none;
 -webkit-user-select: none;
 display: inline-flex;
 outline: none;
 justify-content: center;
 align-items: center;
`, [require__utils_cssr_index.cE("children-placeholder", `
 height: var(--n-rail-height);
 display: flex;
 flex-direction: column;
 overflow: hidden;
 pointer-events: none;
 visibility: hidden;
 `), require__utils_cssr_index.cE("rail-placeholder", `
 display: flex;
 flex-wrap: none;
 `), require__utils_cssr_index.cE("button-placeholder", `
 width: calc(1.75 * var(--n-rail-height));
 height: var(--n-rail-height);
 `), require__utils_cssr_index.cB("base-loading", `
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 font-size: calc(var(--n-button-width) - 4px);
 color: var(--n-loading-color);
 transition: color .3s var(--n-bezier);
 `, [require__styles_transitions_icon_switch_cssr.iconSwitchTransition({
  left: "50%",
  top: "50%",
  originalTransform: "translateX(-50%) translateY(-50%)"
})]), require__utils_cssr_index.cE("checked, unchecked", `
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 box-sizing: border-box;
 position: absolute;
 white-space: nowrap;
 top: 0;
 bottom: 0;
 display: flex;
 align-items: center;
 line-height: 1;
 `), require__utils_cssr_index.cE("checked", `
 right: 0;
 padding-right: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `), require__utils_cssr_index.cE("unchecked", `
 left: 0;
 justify-content: flex-end;
 padding-left: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `), require__utils_cssr_index.c("&:focus", [require__utils_cssr_index.cE("rail", `
 box-shadow: var(--n-box-shadow-focus);
 `)]), require__utils_cssr_index.cM("round", [require__utils_cssr_index.cE("rail", "border-radius: calc(var(--n-rail-height) / 2);", [require__utils_cssr_index.cE("button", "border-radius: calc(var(--n-button-height) / 2);")])]), require__utils_cssr_index.cNotM("disabled", [require__utils_cssr_index.cNotM("icon", [require__utils_cssr_index.cM("rubber-band", [require__utils_cssr_index.cM("pressed", [require__utils_cssr_index.cE("rail", [require__utils_cssr_index.cE("button", "max-width: var(--n-button-width-pressed);")])]), require__utils_cssr_index.cE("rail", [require__utils_cssr_index.c("&:active", [require__utils_cssr_index.cE("button", "max-width: var(--n-button-width-pressed);")])]), require__utils_cssr_index.cM("active", [require__utils_cssr_index.cM("pressed", [require__utils_cssr_index.cE("rail", [require__utils_cssr_index.cE("button", "left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])]), require__utils_cssr_index.cE("rail", [require__utils_cssr_index.c("&:active", [require__utils_cssr_index.cE("button", "left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])])])])])]), require__utils_cssr_index.cM("active", [require__utils_cssr_index.cE("rail", [require__utils_cssr_index.cE("button", "left: calc(100% - var(--n-button-width) - var(--n-offset))")])]), require__utils_cssr_index.cE("rail", `
 overflow: hidden;
 height: var(--n-rail-height);
 min-width: var(--n-rail-width);
 border-radius: var(--n-rail-border-radius);
 cursor: pointer;
 position: relative;
 transition:
 opacity .3s var(--n-bezier),
 background .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-rail-color);
 `, [require__utils_cssr_index.cE("button-icon", `
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 font-size: calc(var(--n-button-height) - 4px);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 justify-content: center;
 align-items: center;
 line-height: 1;
 `, [require__styles_transitions_icon_switch_cssr.iconSwitchTransition()]), require__utils_cssr_index.cE("button", `
 align-items: center; 
 top: var(--n-offset);
 left: var(--n-offset);
 height: var(--n-button-height);
 width: var(--n-button-width-pressed);
 max-width: var(--n-button-width);
 border-radius: var(--n-button-border-radius);
 background-color: var(--n-button-color);
 box-shadow: var(--n-button-box-shadow);
 box-sizing: border-box;
 cursor: inherit;
 content: "";
 position: absolute;
 transition:
 background-color .3s var(--n-bezier),
 left .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 max-width .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 `)]), require__utils_cssr_index.cM("active", [require__utils_cssr_index.cE("rail", "background-color: var(--n-rail-color-active);")]), require__utils_cssr_index.cM("loading", [require__utils_cssr_index.cE("rail", `
 cursor: wait;
 `)]), require__utils_cssr_index.cM("disabled", [require__utils_cssr_index.cE("rail", `
 cursor: not-allowed;
 opacity: .5;
 `)])]);
//#endregion
module.exports = index_cssr_default;