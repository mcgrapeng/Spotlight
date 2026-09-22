const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/radio/src/styles/radio-group.cssr.ts
var radio_group_cssr_default = require__utils_cssr_index.cB("radio-group", `
 display: inline-block;
 font-size: var(--n-font-size);
`, [require__utils_cssr_index.cE("splitor", `
 display: inline-block;
 vertical-align: bottom;
 width: 1px;
 transition:
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 background: var(--n-button-border-color);
 `, [require__utils_cssr_index.cM("checked", {
  backgroundColor: "var(--n-button-border-color-active)"
}), require__utils_cssr_index.cM("disabled", {
  opacity: "var(--n-opacity-disabled)"
})]), require__utils_cssr_index.cM("button-group", `
 white-space: nowrap;
 height: var(--n-height);
 line-height: var(--n-height);
 `, [require__utils_cssr_index.cB("radio-button", {
  height: "var(--n-height)",
  lineHeight: "var(--n-height)"
}), require__utils_cssr_index.cE("splitor", {
  height: "var(--n-height)"
})]), require__utils_cssr_index.cB("radio-button", `
 vertical-align: bottom;
 outline: none;
 position: relative;
 user-select: none;
 -webkit-user-select: none;
 display: inline-block;
 box-sizing: border-box;
 padding-left: 14px;
 padding-right: 14px;
 white-space: nowrap;
 transition:
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 background: var(--n-button-color);
 color: var(--n-button-text-color);
 border-top: 1px solid var(--n-button-border-color);
 border-bottom: 1px solid var(--n-button-border-color);
 `, [require__utils_cssr_index.cB("radio-input", `
 pointer-events: none;
 position: absolute;
 border: 0;
 border-radius: inherit;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 opacity: 0;
 z-index: 1;
 `), require__utils_cssr_index.cE("state-border", `
 z-index: 1;
 pointer-events: none;
 position: absolute;
 box-shadow: var(--n-button-box-shadow);
 transition: box-shadow .3s var(--n-bezier);
 left: -1px;
 bottom: -1px;
 right: -1px;
 top: -1px;
 `), require__utils_cssr_index.c("&:first-child", `
 border-top-left-radius: var(--n-button-border-radius);
 border-bottom-left-radius: var(--n-button-border-radius);
 border-left: 1px solid var(--n-button-border-color);
 `, [require__utils_cssr_index.cE("state-border", `
 border-top-left-radius: var(--n-button-border-radius);
 border-bottom-left-radius: var(--n-button-border-radius);
 `)]), require__utils_cssr_index.c("&:last-child", `
 border-top-right-radius: var(--n-button-border-radius);
 border-bottom-right-radius: var(--n-button-border-radius);
 border-right: 1px solid var(--n-button-border-color);
 `, [require__utils_cssr_index.cE("state-border", `
 border-top-right-radius: var(--n-button-border-radius);
 border-bottom-right-radius: var(--n-button-border-radius);
 `)]), require__utils_cssr_index.cNotM("disabled", `
 cursor: pointer;
 `, [require__utils_cssr_index.c("&:hover", [require__utils_cssr_index.cE("state-border", `
 transition: box-shadow .3s var(--n-bezier);
 box-shadow: var(--n-button-box-shadow-hover);
 `), require__utils_cssr_index.cNotM("checked", {
  color: "var(--n-button-text-color-hover)"
})]), require__utils_cssr_index.cM("focus", [require__utils_cssr_index.c("&:not(:active)", [require__utils_cssr_index.cE("state-border", {
  boxShadow: "var(--n-button-box-shadow-focus)"
})])])]), require__utils_cssr_index.cM("checked", `
 background: var(--n-button-color-active);
 color: var(--n-button-text-color-active);
 border-color: var(--n-button-border-color-active);
 `), require__utils_cssr_index.cM("disabled", `
 cursor: not-allowed;
 opacity: var(--n-opacity-disabled);
 `)])]);
//#endregion
module.exports = radio_group_cssr_default;