const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/pagination/src/styles/index.cssr.ts
const hoverStyleProps = `
 background: var(--n-item-color-hover);
 color: var(--n-item-text-color-hover);
 border: var(--n-item-border-hover);
`;
const hoverStyleChildren = [require__utils_cssr_index.cM("button", `
 background: var(--n-button-color-hover);
 border: var(--n-button-border-hover);
 color: var(--n-button-icon-color-hover);
 `)];
var index_cssr_default = require__utils_cssr_index.cB("pagination", `
 display: flex;
 vertical-align: middle;
 font-size: var(--n-item-font-size);
 flex-wrap: nowrap;
`, [require__utils_cssr_index.cB("pagination-prefix", `
 display: flex;
 align-items: center;
 margin: var(--n-prefix-margin);
 `), require__utils_cssr_index.cB("pagination-suffix", `
 display: flex;
 align-items: center;
 margin: var(--n-suffix-margin);
 `), require__utils_cssr_index.c("> *:not(:first-child)", `
 margin: var(--n-item-margin);
 `), require__utils_cssr_index.cB("select", `
 width: var(--n-select-width);
 `), require__utils_cssr_index.c("&.transition-disabled", [require__utils_cssr_index.cB("pagination-item", "transition: none!important;")]), require__utils_cssr_index.cB("pagination-quick-jumper", `
 white-space: nowrap;
 display: flex;
 color: var(--n-jumper-text-color);
 transition: color .3s var(--n-bezier);
 align-items: center;
 font-size: var(--n-jumper-font-size);
 `, [require__utils_cssr_index.cB("input", `
 margin: var(--n-input-margin);
 width: var(--n-input-width);
 `)]), require__utils_cssr_index.cB("pagination-item", `
 position: relative;
 cursor: pointer;
 user-select: none;
 -webkit-user-select: none;
 display: flex;
 align-items: center;
 justify-content: center;
 box-sizing: border-box;
 min-width: var(--n-item-size);
 height: var(--n-item-size);
 padding: var(--n-item-padding);
 background-color: var(--n-item-color);
 color: var(--n-item-text-color);
 border-radius: var(--n-item-border-radius);
 border: var(--n-item-border);
 fill: var(--n-button-icon-color);
 transition:
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 fill .3s var(--n-bezier);
 `, [require__utils_cssr_index.cM("button", `
 background: var(--n-button-color);
 color: var(--n-button-icon-color);
 border: var(--n-button-border);
 padding: 0;
 `, [require__utils_cssr_index.cB("base-icon", `
 font-size: var(--n-button-icon-size);
 `)]), require__utils_cssr_index.cNotM("disabled", [require__utils_cssr_index.cM("hover", hoverStyleProps, hoverStyleChildren), require__utils_cssr_index.c("&:hover", hoverStyleProps, hoverStyleChildren), require__utils_cssr_index.c("&:active", `
 background: var(--n-item-color-pressed);
 color: var(--n-item-text-color-pressed);
 border: var(--n-item-border-pressed);
 `, [require__utils_cssr_index.cM("button", `
 background: var(--n-button-color-pressed);
 border: var(--n-button-border-pressed);
 color: var(--n-button-icon-color-pressed);
 `)]), require__utils_cssr_index.cM("active", `
 background: var(--n-item-color-active);
 color: var(--n-item-text-color-active);
 border: var(--n-item-border-active);
 `, [require__utils_cssr_index.c("&:hover", `
 background: var(--n-item-color-active-hover);
 `)])]), require__utils_cssr_index.cM("disabled", `
 cursor: not-allowed;
 color: var(--n-item-text-color-disabled);
 `, [require__utils_cssr_index.cM("active, button", `
 background-color: var(--n-item-color-disabled);
 border: var(--n-item-border-disabled);
 `)])]), require__utils_cssr_index.cM("disabled", `
 cursor: not-allowed;
 `, [require__utils_cssr_index.cB("pagination-quick-jumper", `
 color: var(--n-jumper-text-color-disabled);
 `)]), require__utils_cssr_index.cM("simple", `
 display: flex;
 align-items: center;
 flex-wrap: nowrap;
 `, [require__utils_cssr_index.cB("pagination-quick-jumper", [require__utils_cssr_index.cB("input", `
 margin: 0;
 `)])])]);
//#endregion
module.exports = index_cssr_default;