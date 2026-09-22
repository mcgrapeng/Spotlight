const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_height_expand_cssr = require("../../../_styles/transitions/fade-in-height-expand.cssr.js");
//#region src/alert/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("alert", `
 line-height: var(--n-line-height);
 border-radius: var(--n-border-radius);
 position: relative;
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 text-align: start;
 word-break: break-word;
`, [require__utils_cssr_index.cE("border", `
 border-radius: inherit;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 transition: border-color .3s var(--n-bezier);
 border: var(--n-border);
 pointer-events: none;
 `), require__utils_cssr_index.cM("closable", [require__utils_cssr_index.cB("alert-body", [require__utils_cssr_index.cE("title", `
 padding-right: 24px;
 `)])]), require__utils_cssr_index.cE("icon", {
  color: "var(--n-icon-color)"
}), require__utils_cssr_index.cB("alert-body", {
  padding: "var(--n-padding)"
}, [require__utils_cssr_index.cE("title", {
  color: "var(--n-title-text-color)"
}), require__utils_cssr_index.cE("content", {
  color: "var(--n-content-text-color)"
})]), require__styles_transitions_fade_in_height_expand_cssr.fadeInHeightExpandTransition({
  originalTransition: "transform .3s var(--n-bezier)",
  enterToProps: {
    transform: "scale(1)"
  },
  leaveToProps: {
    transform: "scale(0.9)"
  }
}), require__utils_cssr_index.cE("icon", `
 position: absolute;
 left: 0;
 top: 0;
 align-items: center;
 justify-content: center;
 display: flex;
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 margin: var(--n-icon-margin);
 `), require__utils_cssr_index.cE("close", `
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 position: absolute;
 right: 0;
 top: 0;
 margin: var(--n-close-margin);
 `), require__utils_cssr_index.cM("show-icon", [require__utils_cssr_index.cB("alert-body", {
  paddingLeft: "calc(var(--n-icon-margin-left) + var(--n-icon-size) + var(--n-icon-margin-right))"
})]), require__utils_cssr_index.cM("right-adjust", [require__utils_cssr_index.cB("alert-body", {
  paddingRight: "calc(var(--n-close-size) + var(--n-padding) + 2px)"
})]), require__utils_cssr_index.cB("alert-body", `
 border-radius: var(--n-border-radius);
 transition: border-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cE("title", `
 transition: color .3s var(--n-bezier);
 font-size: 16px;
 line-height: 19px;
 font-weight: var(--n-title-font-weight);
 `, [require__utils_cssr_index.c("& +", [require__utils_cssr_index.cE("content", {
  marginTop: "9px"
})])]), require__utils_cssr_index.cE("content", {
  transition: "color .3s var(--n-bezier)",
  fontSize: "var(--n-font-size)"
})]), require__utils_cssr_index.cE("icon", {
  transition: "color .3s var(--n-bezier)"
})]);
//#endregion
module.exports = index_cssr_default;