const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/radio/src/styles/radio.cssr.ts
var radio_cssr_default = require__utils_cssr_index.cB("radio", `
 line-height: var(--n-label-line-height);
 outline: none;
 position: relative;
 user-select: none;
 -webkit-user-select: none;
 display: inline-flex;
 align-items: flex-start;
 flex-wrap: nowrap;
 font-size: var(--n-font-size);
 word-break: break-word;
`, [require__utils_cssr_index.cM("checked", [require__utils_cssr_index.cE("dot", `
 background-color: var(--n-color-active);
 `)]), require__utils_cssr_index.cE("dot-wrapper", `
 position: relative;
 flex-shrink: 0;
 flex-grow: 0;
 width: var(--n-radio-size);
 `), require__utils_cssr_index.cB("radio-input", `
 position: absolute;
 border: 0;
 width: 0;
 height: 0;
 opacity: 0;
 margin: 0;
 `), require__utils_cssr_index.cE("dot", `
 position: absolute;
 top: 50%;
 left: 0;
 transform: translateY(-50%);
 height: var(--n-radio-size);
 width: var(--n-radio-size);
 background: var(--n-color);
 box-shadow: var(--n-box-shadow);
 border-radius: 50%;
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 `, [require__utils_cssr_index.c("&::before", `
 content: "";
 opacity: 0;
 position: absolute;
 left: 4px;
 top: 4px;
 height: calc(100% - 8px);
 width: calc(100% - 8px);
 border-radius: 50%;
 transform: scale(.8);
 background: var(--n-dot-color-active);
 transition: 
 opacity .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 transform .3s var(--n-bezier);
 `), require__utils_cssr_index.cM("checked", {
  boxShadow: "var(--n-box-shadow-active)"
}, [require__utils_cssr_index.c("&::before", `
 opacity: 1;
 transform: scale(1);
 `)])]), require__utils_cssr_index.cE("label", `
 color: var(--n-text-color);
 padding: var(--n-label-padding);
 font-weight: var(--n-label-font-weight);
 display: inline-block;
 transition: color .3s var(--n-bezier);
 `), require__utils_cssr_index.cNotM("disabled", `
 cursor: pointer;
 `, [require__utils_cssr_index.c("&:hover", [require__utils_cssr_index.cE("dot", {
  boxShadow: "var(--n-box-shadow-hover)"
})]), require__utils_cssr_index.cM("focus", [require__utils_cssr_index.c("&:not(:active)", [require__utils_cssr_index.cE("dot", {
  boxShadow: "var(--n-box-shadow-focus)"
})])])]), require__utils_cssr_index.cM("disabled", `
 cursor: not-allowed;
 `, [require__utils_cssr_index.cE("dot", {
  boxShadow: "var(--n-box-shadow-disabled)",
  backgroundColor: "var(--n-color-disabled)"
}, [require__utils_cssr_index.c("&::before", {
  backgroundColor: "var(--n-dot-color-disabled)"
}), require__utils_cssr_index.cM("checked", `
 opacity: 1;
 `)]), require__utils_cssr_index.cE("label", {
  color: "var(--n-text-color-disabled)"
}), require__utils_cssr_index.cB("radio-input", `
 cursor: not-allowed;
 `)])]);
//#endregion
module.exports = radio_cssr_default;