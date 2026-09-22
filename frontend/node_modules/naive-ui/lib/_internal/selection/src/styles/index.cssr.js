const require__utils_cssr_index = require("../../../../_utils/cssr/index.js");
//#region src/_internal/selection/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("base-selection", `
 --n-padding-single: var(--n-padding-single-top) var(--n-padding-single-right) var(--n-padding-single-bottom) var(--n-padding-single-left);
 --n-padding-multiple: var(--n-padding-multiple-top) var(--n-padding-multiple-right) var(--n-padding-multiple-bottom) var(--n-padding-multiple-left);
 position: relative;
 z-index: auto;
 box-shadow: none;
 width: 100%;
 max-width: 100%;
 display: inline-block;
 vertical-align: bottom;
 border-radius: var(--n-border-radius);
 min-height: var(--n-height);
 line-height: 1.5;
 font-size: var(--n-font-size);
 `, [require__utils_cssr_index.cB("base-loading", `
 color: var(--n-loading-color);
 `), require__utils_cssr_index.cB("base-selection-tags", "min-height: var(--n-height);"), require__utils_cssr_index.cE("border, state-border", `
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border: var(--n-border);
 border-radius: inherit;
 transition:
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cE("state-border", `
 z-index: 1;
 border-color: #0000;
 `), require__utils_cssr_index.cB("base-suffix", `
 cursor: pointer;
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 right: 10px;
 `, [require__utils_cssr_index.cE("arrow", `
 font-size: var(--n-arrow-size);
 color: var(--n-arrow-color);
 transition: color .3s var(--n-bezier);
 `)]), require__utils_cssr_index.cB("base-selection-overlay", `
 display: flex;
 align-items: center;
 white-space: nowrap;
 pointer-events: none;
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 padding: var(--n-padding-single);
 transition: color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cE("wrapper", `
 flex-basis: 0;
 flex-grow: 1;
 overflow: hidden;
 text-overflow: ellipsis;
 `)]), require__utils_cssr_index.cB("base-selection-placeholder", `
 color: var(--n-placeholder-color);
 `, [require__utils_cssr_index.cE("inner", `
 max-width: 100%;
 overflow: hidden;
 `)]), require__utils_cssr_index.cB("base-selection-tags", `
 cursor: pointer;
 outline: none;
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 display: flex;
 padding: var(--n-padding-multiple);
 flex-wrap: wrap;
 align-items: center;
 width: 100%;
 vertical-align: bottom;
 background-color: var(--n-color);
 border-radius: inherit;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cB("base-selection-label", `
 height: var(--n-height);
 display: inline-flex;
 width: 100%;
 vertical-align: bottom;
 cursor: pointer;
 outline: none;
 z-index: auto;
 box-sizing: border-box;
 position: relative;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: inherit;
 background-color: var(--n-color);
 align-items: center;
 `, [require__utils_cssr_index.cB("base-selection-input", `
 font-size: inherit;
 line-height: inherit;
 outline: none;
 cursor: pointer;
 box-sizing: border-box;
 border:none;
 width: 100%;
 padding: var(--n-padding-single);
 background-color: #0000;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 caret-color: var(--n-caret-color);
 `, [require__utils_cssr_index.cE("content", `
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap; 
 `)]), require__utils_cssr_index.cE("render-label", `
 color: var(--n-text-color);
 `)]), require__utils_cssr_index.cNotM("disabled", [require__utils_cssr_index.c("&:hover", [require__utils_cssr_index.cE("state-border", `
 box-shadow: var(--n-box-shadow-hover);
 border: var(--n-border-hover);
 `)]), require__utils_cssr_index.cM("focus", [require__utils_cssr_index.cE("state-border", `
 box-shadow: var(--n-box-shadow-focus);
 border: var(--n-border-focus);
 `)]), require__utils_cssr_index.cM("active", [require__utils_cssr_index.cE("state-border", `
 box-shadow: var(--n-box-shadow-active);
 border: var(--n-border-active);
 `), require__utils_cssr_index.cB("base-selection-label", "background-color: var(--n-color-active);"), require__utils_cssr_index.cB("base-selection-tags", "background-color: var(--n-color-active);")])]), require__utils_cssr_index.cM("disabled", "cursor: not-allowed;", [require__utils_cssr_index.cE("arrow", `
 color: var(--n-arrow-color-disabled);
 `), require__utils_cssr_index.cB("base-selection-label", `
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `, [require__utils_cssr_index.cB("base-selection-input", `
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 `), require__utils_cssr_index.cE("render-label", `
 color: var(--n-text-color-disabled);
 `)]), require__utils_cssr_index.cB("base-selection-tags", `
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `), require__utils_cssr_index.cB("base-selection-placeholder", `
 cursor: not-allowed;
 color: var(--n-placeholder-color-disabled);
 `)]), require__utils_cssr_index.cB("base-selection-input-tag", `
 height: calc(var(--n-height) - 6px);
 line-height: calc(var(--n-height) - 6px);
 outline: none;
 display: none;
 position: relative;
 margin-bottom: 3px;
 max-width: 100%;
 vertical-align: bottom;
 `, [require__utils_cssr_index.cE("input", `
 font-size: inherit;
 font-family: inherit;
 min-width: 1px;
 padding: 0;
 background-color: #0000;
 outline: none;
 border: none;
 max-width: 100%;
 overflow: hidden;
 width: 1em;
 line-height: inherit;
 cursor: pointer;
 color: var(--n-text-color);
 caret-color: var(--n-caret-color);
 `), require__utils_cssr_index.cE("mirror", `
 position: absolute;
 left: 0;
 top: 0;
 white-space: pre;
 visibility: hidden;
 user-select: none;
 -webkit-user-select: none;
 opacity: 0;
 `)]), ["warning", "error"].map(status => require__utils_cssr_index.cM(`${status}-status`, [require__utils_cssr_index.cE("state-border", `border: var(--n-border-${status});`), require__utils_cssr_index.cNotM("disabled", [require__utils_cssr_index.c("&:hover", [require__utils_cssr_index.cE("state-border", `
 box-shadow: var(--n-box-shadow-hover-${status});
 border: var(--n-border-hover-${status});
 `)]), require__utils_cssr_index.cM("active", [require__utils_cssr_index.cE("state-border", `
 box-shadow: var(--n-box-shadow-active-${status});
 border: var(--n-border-active-${status});
 `), require__utils_cssr_index.cB("base-selection-label", `background-color: var(--n-color-active-${status});`), require__utils_cssr_index.cB("base-selection-tags", `background-color: var(--n-color-active-${status});`)]), require__utils_cssr_index.cM("focus", [require__utils_cssr_index.cE("state-border", `
 box-shadow: var(--n-box-shadow-focus-${status});
 border: var(--n-border-focus-${status});
 `)])])]))]), require__utils_cssr_index.cB("base-selection-popover", `
 margin-bottom: -3px;
 display: flex;
 flex-wrap: wrap;
 margin-right: -8px;
 `), require__utils_cssr_index.cB("base-selection-tag-wrapper", `
 max-width: 100%;
 display: inline-flex;
 padding: 0 7px 3px 0;
 `, [require__utils_cssr_index.c("&:last-child", "padding-right: 0;"), require__utils_cssr_index.cB("tag", `
 font-size: 14px;
 max-width: 100%;
 `, [require__utils_cssr_index.cE("content", `
 line-height: 1.25;
 text-overflow: ellipsis;
 overflow: hidden;
 `)])])]);
//#endregion
module.exports = index_cssr_default;