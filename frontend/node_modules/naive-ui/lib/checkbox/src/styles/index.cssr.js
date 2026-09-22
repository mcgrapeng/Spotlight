const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_icon_switch_cssr = require("../../../_styles/transitions/icon-switch.cssr.js");
//#region src/checkbox/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("checkbox", `
 font-size: var(--n-font-size);
 outline: none;
 cursor: pointer;
 display: inline-flex;
 flex-wrap: nowrap;
 align-items: flex-start;
 word-break: break-word;
 line-height: var(--n-size);
 --n-merged-color-table: var(--n-color-table);
 `, [require__utils_cssr_index.cM("show-label", "line-height: var(--n-label-line-height);"), require__utils_cssr_index.c("&:hover", [require__utils_cssr_index.cB("checkbox-box", [require__utils_cssr_index.cE("border", "border: var(--n-border-checked);")])]), require__utils_cssr_index.c("&:focus:not(:active)", [require__utils_cssr_index.cB("checkbox-box", [require__utils_cssr_index.cE("border", `
 border: var(--n-border-focus);
 box-shadow: var(--n-box-shadow-focus);
 `)])]), require__utils_cssr_index.cM("inside-table", [require__utils_cssr_index.cB("checkbox-box", `
 background-color: var(--n-merged-color-table);
 `)]), require__utils_cssr_index.cM("checked", [require__utils_cssr_index.cB("checkbox-box", `
 background-color: var(--n-color-checked);
 `, [require__utils_cssr_index.cB("checkbox-icon", [require__utils_cssr_index.c(".check-icon", `
 opacity: 1;
 transform: scale(1);
 `)])])]), require__utils_cssr_index.cM("indeterminate", [require__utils_cssr_index.cB("checkbox-box", [require__utils_cssr_index.cB("checkbox-icon", [require__utils_cssr_index.c(".check-icon", `
 opacity: 0;
 transform: scale(.5);
 `), require__utils_cssr_index.c(".line-icon", `
 opacity: 1;
 transform: scale(1);
 `)])])]), require__utils_cssr_index.cM("checked, indeterminate", [require__utils_cssr_index.c("&:focus:not(:active)", [require__utils_cssr_index.cB("checkbox-box", [require__utils_cssr_index.cE("border", `
 border: var(--n-border-checked);
 box-shadow: var(--n-box-shadow-focus);
 `)])]), require__utils_cssr_index.cB("checkbox-box", `
 background-color: var(--n-color-checked);
 border-left: 0;
 border-top: 0;
 `, [require__utils_cssr_index.cE("border", {
  border: "var(--n-border-checked)"
})])]), require__utils_cssr_index.cM("disabled", {
  cursor: "not-allowed"
}, [require__utils_cssr_index.cM("checked", [require__utils_cssr_index.cB("checkbox-box", `
 background-color: var(--n-color-disabled-checked);
 `, [require__utils_cssr_index.cE("border", {
  border: "var(--n-border-disabled-checked)"
}), require__utils_cssr_index.cB("checkbox-icon", [require__utils_cssr_index.c(".check-icon, .line-icon", {
  fill: "var(--n-check-mark-color-disabled-checked)"
})])])]), require__utils_cssr_index.cB("checkbox-box", `
 background-color: var(--n-color-disabled);
 `, [require__utils_cssr_index.cE("border", `
 border: var(--n-border-disabled);
 `), require__utils_cssr_index.cB("checkbox-icon", [require__utils_cssr_index.c(".check-icon, .line-icon", `
 fill: var(--n-check-mark-color-disabled);
 `)])]), require__utils_cssr_index.cE("label", `
 color: var(--n-text-color-disabled);
 `)]), require__utils_cssr_index.cB("checkbox-box-wrapper", `
 position: relative;
 width: var(--n-size);
 flex-shrink: 0;
 flex-grow: 0;
 user-select: none;
 -webkit-user-select: none;
 `), require__utils_cssr_index.cB("checkbox-box", `
 position: absolute;
 left: 0;
 top: 50%;
 transform: translateY(-50%);
 height: var(--n-size);
 width: var(--n-size);
 display: inline-block;
 box-sizing: border-box;
 border-radius: var(--n-border-radius);
 background-color: var(--n-color);
 transition: background-color 0.3s var(--n-bezier);
 `, [require__utils_cssr_index.cE("border", `
 transition:
 border-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 border-radius: inherit;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border: var(--n-border);
 `), require__utils_cssr_index.cB("checkbox-icon", `
 display: flex;
 align-items: center;
 justify-content: center;
 position: absolute;
 left: 1px;
 right: 1px;
 top: 1px;
 bottom: 1px;
 `, [require__utils_cssr_index.c(".check-icon, .line-icon", `
 width: 100%;
 fill: var(--n-check-mark-color);
 opacity: 0;
 transform: scale(0.5);
 transform-origin: center;
 transition:
 fill 0.3s var(--n-bezier),
 transform 0.3s var(--n-bezier),
 opacity 0.3s var(--n-bezier),
 border-color 0.3s var(--n-bezier);
 `), require__styles_transitions_icon_switch_cssr.iconSwitchTransition({
  left: "1px",
  top: "1px"
})])]), require__utils_cssr_index.cE("label", `
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 padding: var(--n-label-padding);
 font-weight: var(--n-label-font-weight);
 `, [require__utils_cssr_index.c("&:empty", {
  display: "none"
})])]), require__utils_cssr_index.insideModal(require__utils_cssr_index.cB("checkbox", `
 --n-merged-color-table: var(--n-color-table-modal);
 `)), require__utils_cssr_index.insidePopover(require__utils_cssr_index.cB("checkbox", `
 --n-merged-color-table: var(--n-color-table-popover);
 `))]);
//#endregion
module.exports = index_cssr_default;