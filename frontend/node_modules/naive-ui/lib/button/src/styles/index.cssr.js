const require__utils_env_is_browser = require("../../../_utils/env/is-browser.js");
const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_icon_switch_cssr = require("../../../_styles/transitions/icon-switch.cssr.js");
const require__styles_transitions_fade_in_width_expand_cssr = require("../../../_styles/transitions/fade-in-width-expand.cssr.js");
//#region src/button/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("button", `
 margin: 0;
 font-weight: var(--n-font-weight);
 line-height: 1;
 font-family: inherit;
 padding: var(--n-padding);
 height: var(--n-height);
 font-size: var(--n-font-size);
 border-radius: var(--n-border-radius);
 color: var(--n-text-color);
 background-color: var(--n-color);
 width: var(--n-width);
 white-space: nowrap;
 outline: none;
 position: relative;
 z-index: auto;
 border: none;
 display: inline-flex;
 flex-wrap: nowrap;
 flex-shrink: 0;
 align-items: center;
 justify-content: center;
 user-select: none;
 -webkit-user-select: none;
 text-align: center;
 cursor: pointer;
 text-decoration: none;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cM("color", [require__utils_cssr_index.cE("border", {
  borderColor: "var(--n-border-color)"
}), require__utils_cssr_index.cM("disabled", [require__utils_cssr_index.cE("border", {
  borderColor: "var(--n-border-color-disabled)"
})]), require__utils_cssr_index.cNotM("disabled", [require__utils_cssr_index.c("&:focus", [require__utils_cssr_index.cE("state-border", {
  borderColor: "var(--n-border-color-focus)"
})]), require__utils_cssr_index.c("&:hover", [require__utils_cssr_index.cE("state-border", {
  borderColor: "var(--n-border-color-hover)"
})]), require__utils_cssr_index.c("&:active", [require__utils_cssr_index.cE("state-border", {
  borderColor: "var(--n-border-color-pressed)"
})]), require__utils_cssr_index.cM("pressed", [require__utils_cssr_index.cE("state-border", {
  borderColor: "var(--n-border-color-pressed)"
})])])]), require__utils_cssr_index.cM("disabled", {
  backgroundColor: "var(--n-color-disabled)",
  color: "var(--n-text-color-disabled)"
}, [require__utils_cssr_index.cE("border", {
  border: "var(--n-border-disabled)"
})]), require__utils_cssr_index.cNotM("disabled", [require__utils_cssr_index.c("&:focus", {
  backgroundColor: "var(--n-color-focus)",
  color: "var(--n-text-color-focus)"
}, [require__utils_cssr_index.cE("state-border", {
  border: "var(--n-border-focus)"
})]), require__utils_cssr_index.c("&:hover", {
  backgroundColor: "var(--n-color-hover)",
  color: "var(--n-text-color-hover)"
}, [require__utils_cssr_index.cE("state-border", {
  border: "var(--n-border-hover)"
})]), require__utils_cssr_index.c("&:active", {
  backgroundColor: "var(--n-color-pressed)",
  color: "var(--n-text-color-pressed)"
}, [require__utils_cssr_index.cE("state-border", {
  border: "var(--n-border-pressed)"
})]), require__utils_cssr_index.cM("pressed", {
  backgroundColor: "var(--n-color-pressed)",
  color: "var(--n-text-color-pressed)"
}, [require__utils_cssr_index.cE("state-border", {
  border: "var(--n-border-pressed)"
})])]), require__utils_cssr_index.cM("loading", "cursor: wait;"), require__utils_cssr_index.cB("base-wave", `
 pointer-events: none;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 animation-iteration-count: 1;
 animation-duration: var(--n-ripple-duration);
 animation-timing-function: var(--n-bezier-ease-out), var(--n-bezier-ease-out);
 `, [require__utils_cssr_index.cM("active", {
  zIndex: 1,
  animationName: "button-wave-spread, button-wave-opacity"
})]), require__utils_env_is_browser.isBrowser && "MozBoxSizing" in document.createElement("div").style ? require__utils_cssr_index.c("&::moz-focus-inner", {
  border: 0
}) : null, require__utils_cssr_index.cE("border, state-border", `
 position: absolute;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 border-radius: inherit;
 transition: border-color .3s var(--n-bezier);
 pointer-events: none;
 `), require__utils_cssr_index.cE("border", `
 border: var(--n-border);
 `), require__utils_cssr_index.cE("state-border", `
 border: var(--n-border);
 border-color: #0000;
 z-index: 1;
 `), require__utils_cssr_index.cE("icon", `
 margin: var(--n-icon-margin);
 margin-left: 0;
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 max-width: var(--n-icon-size);
 font-size: var(--n-icon-size);
 position: relative;
 flex-shrink: 0;
 `, [require__utils_cssr_index.cB("icon-slot", `
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 position: absolute;
 left: 0;
 top: 50%;
 transform: translateY(-50%);
 display: flex;
 align-items: center;
 justify-content: center;
 `, [require__styles_transitions_icon_switch_cssr.iconSwitchTransition({
  top: "50%",
  originalTransform: "translateY(-50%)"
})]), require__styles_transitions_fade_in_width_expand_cssr.fadeInWidthExpandTransition()]), require__utils_cssr_index.cE("content", `
 display: flex;
 align-items: center;
 flex-wrap: nowrap;
 min-width: 0;
 `, [require__utils_cssr_index.c("~", [require__utils_cssr_index.cE("icon", {
  margin: "var(--n-icon-margin)",
  marginRight: 0
})])]), require__utils_cssr_index.cM("block", `
 display: flex;
 width: 100%;
 `), require__utils_cssr_index.cM("dashed", [require__utils_cssr_index.cE("border, state-border", {
  borderStyle: "dashed !important"
})]), require__utils_cssr_index.cM("disabled", {
  cursor: "not-allowed",
  opacity: "var(--n-opacity-disabled)"
})]), require__utils_cssr_index.c("@keyframes button-wave-spread", {
  from: {
    boxShadow: "0 0 0.5px 0 var(--n-ripple-color)"
  },
  to: {
    boxShadow: "0 0 0.5px 4.5px var(--n-ripple-color)"
  }
}), require__utils_cssr_index.c("@keyframes button-wave-opacity", {
  from: {
    opacity: "var(--n-wave-opacity)"
  },
  to: {
    opacity: 0
  }
})]);
//#endregion
module.exports = index_cssr_default;