const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_down_cssr = require("../../../_styles/transitions/fade-down.cssr.js");
//#region src/form/src/styles/form-item.cssr.ts
var form_item_cssr_default = require__utils_cssr_index.cB("form-item", `
 display: grid;
 line-height: var(--n-line-height);
`, [require__utils_cssr_index.cB("form-item-label", `
 grid-area: label;
 align-items: center;
 line-height: 1.25;
 text-align: var(--n-label-text-align);
 font-size: var(--n-label-font-size);
 min-height: var(--n-label-height);
 padding: var(--n-label-padding);
 color: var(--n-label-text-color);
 transition: color .3s var(--n-bezier);
 box-sizing: border-box;
 font-weight: var(--n-label-font-weight);
 `, [require__utils_cssr_index.cE("asterisk", `
 white-space: nowrap;
 user-select: none;
 -webkit-user-select: none;
 color: var(--n-asterisk-color);
 transition: color .3s var(--n-bezier);
 `), require__utils_cssr_index.cE("asterisk-placeholder", `
 grid-area: mark;
 user-select: none;
 -webkit-user-select: none;
 visibility: hidden; 
 `)]), require__utils_cssr_index.cB("form-item-blank", `
 grid-area: blank;
 min-height: var(--n-blank-height);
 `), require__utils_cssr_index.cM("auto-label-width", [require__utils_cssr_index.cB("form-item-label", "white-space: nowrap;")]), require__utils_cssr_index.cM("left-labelled", `
 grid-template-areas:
 "label blank"
 "label feedback";
 grid-template-columns: auto minmax(0, 1fr);
 grid-template-rows: auto 1fr;
 align-items: flex-start;
 `, [require__utils_cssr_index.cB("form-item-label", `
 display: grid;
 grid-template-columns: 1fr auto;
 min-height: var(--n-blank-height);
 height: auto;
 box-sizing: border-box;
 flex-shrink: 0;
 flex-grow: 0;
 `, [require__utils_cssr_index.cM("reverse-columns-space", `
 grid-template-columns: auto 1fr;
 `), require__utils_cssr_index.cM("left-mark", `
 grid-template-areas:
 "mark text"
 ". text";
 `), require__utils_cssr_index.cM("right-mark", `
 grid-template-areas: 
 "text mark"
 "text .";
 `), require__utils_cssr_index.cM("right-hanging-mark", `
 grid-template-areas: 
 "text mark"
 "text .";
 `), require__utils_cssr_index.cE("text", `
 grid-area: text; 
 `), require__utils_cssr_index.cE("asterisk", `
 grid-area: mark; 
 align-self: end;
 `)])]), require__utils_cssr_index.cM("top-labelled", `
 grid-template-areas:
 "label"
 "blank"
 "feedback";
 grid-template-rows: minmax(var(--n-label-height), auto) 1fr;
 grid-template-columns: minmax(0, 100%);
 `, [require__utils_cssr_index.cM("no-label", `
 grid-template-areas:
 "blank"
 "feedback";
 grid-template-rows: 1fr;
 `), require__utils_cssr_index.cB("form-item-label", `
 display: flex;
 align-items: flex-start;
 justify-content: var(--n-label-text-align);
 `)]), require__utils_cssr_index.cB("form-item-blank", `
 box-sizing: border-box;
 display: flex;
 align-items: center;
 position: relative;
 `), require__utils_cssr_index.cB("form-item-feedback-wrapper", `
 grid-area: feedback;
 box-sizing: border-box;
 min-height: var(--n-feedback-height);
 font-size: var(--n-feedback-font-size);
 line-height: 1.25;
 transform-origin: top left;
 `, [require__utils_cssr_index.c("&:not(:empty)", `
 padding: var(--n-feedback-padding);
 `), require__utils_cssr_index.cB("form-item-feedback", {
  transition: "color .3s var(--n-bezier)",
  color: "var(--n-feedback-text-color)"
}, [require__utils_cssr_index.cM("warning", {
  color: "var(--n-feedback-text-color-warning)"
}), require__utils_cssr_index.cM("error", {
  color: "var(--n-feedback-text-color-error)"
}), require__styles_transitions_fade_down_cssr.fadeDownTransition({
  fromOffset: "-3px",
  enterDuration: ".3s",
  leaveDuration: ".2s"
})])])]);
//#endregion
module.exports = form_item_cssr_default;