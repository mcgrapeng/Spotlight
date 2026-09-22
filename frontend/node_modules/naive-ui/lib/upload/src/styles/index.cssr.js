const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_icon_switch_cssr = require("../../../_styles/transitions/icon-switch.cssr.js");
const require__styles_transitions_fade_in_height_expand_cssr = require("../../../_styles/transitions/fade-in-height-expand.cssr.js");
//#region src/upload/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("upload", "width: 100%;", [require__utils_cssr_index.cM("dragger-inside", [require__utils_cssr_index.cB("upload-trigger", `
 display: block;
 `)]), require__utils_cssr_index.cM("drag-over", [require__utils_cssr_index.cB("upload-dragger", `
 border: var(--n-dragger-border-hover);
 `)])]), require__utils_cssr_index.cB("upload-dragger", `
 cursor: pointer;
 box-sizing: border-box;
 width: 100%;
 text-align: center;
 border-radius: var(--n-border-radius);
 padding: 24px;
 opacity: 1;
 transition:
 opacity .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 background-color: var(--n-dragger-color);
 border: var(--n-dragger-border);
 `, [require__utils_cssr_index.c("&:hover", `
 border: var(--n-dragger-border-hover);
 `), require__utils_cssr_index.cM("disabled", `
 cursor: not-allowed;
 `)]), require__utils_cssr_index.cB("upload-trigger", `
 display: inline-block;
 box-sizing: border-box;
 opacity: 1;
 transition: opacity .3s var(--n-bezier);
 `, [require__utils_cssr_index.c("+", [require__utils_cssr_index.cB("upload-file-list", "margin-top: 8px;")]), require__utils_cssr_index.cM("disabled", `
 opacity: var(--n-item-disabled-opacity);
 cursor: not-allowed;
 `), require__utils_cssr_index.cM("image-card", `
 width: 96px;
 height: 96px;
 `, [require__utils_cssr_index.cB("base-icon", `
 font-size: 24px;
 `), require__utils_cssr_index.cB("upload-dragger", `
 padding: 0;
 height: 100%;
 width: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
 `)])]), require__utils_cssr_index.cB("upload-file-list", `
 line-height: var(--n-line-height);
 opacity: 1;
 transition: opacity .3s var(--n-bezier);
 `, [require__utils_cssr_index.c("a, img", "outline: none;"), require__utils_cssr_index.cM("disabled", `
 opacity: var(--n-item-disabled-opacity);
 cursor: not-allowed;
 `, [require__utils_cssr_index.cB("upload-file", "cursor: not-allowed;")]), require__utils_cssr_index.cM("grid", `
 display: grid;
 grid-template-columns: repeat(auto-fill, 96px);
 grid-gap: 8px;
 margin-top: 0;
 `), require__utils_cssr_index.cB("upload-file", `
 display: block;
 box-sizing: border-box;
 cursor: default;
 padding: 0px 12px 0 6px;
 transition: background-color .3s var(--n-bezier);
 border-radius: var(--n-border-radius);
 `, [require__styles_transitions_fade_in_height_expand_cssr.fadeInHeightExpandTransition(), require__utils_cssr_index.cB("progress", [require__styles_transitions_fade_in_height_expand_cssr.fadeInHeightExpandTransition({
  foldPadding: true
})]), require__utils_cssr_index.c("&:hover", `
 background-color: var(--n-item-color-hover);
 `, [require__utils_cssr_index.cB("upload-file-info", [require__utils_cssr_index.cE("action", `
 opacity: 1;
 `)])]), require__utils_cssr_index.cM("image-type", `
 border-radius: var(--n-border-radius);
 text-decoration: underline;
 text-decoration-color: #0000;
 `, [require__utils_cssr_index.cB("upload-file-info", `
 padding-top: 0px;
 padding-bottom: 0px;
 width: 100%;
 height: 100%;
 display: flex;
 justify-content: space-between;
 align-items: center;
 padding: 6px 0;
 `, [require__utils_cssr_index.cB("progress", `
 padding: 2px 0;
 margin-bottom: 0;
 `), require__utils_cssr_index.cE("name", `
 padding: 0 8px;
 `), require__utils_cssr_index.cE("thumbnail", `
 width: 32px;
 height: 32px;
 font-size: 28px;
 display: flex;
 justify-content: center;
 align-items: center;
 `, [require__utils_cssr_index.c("img", `
 width: 100%;
 `)])])]), require__utils_cssr_index.cM("text-type", [require__utils_cssr_index.cB("progress", `
 box-sizing: border-box;
 padding-bottom: 6px;
 margin-bottom: 6px;
 `)]), require__utils_cssr_index.cM("image-card-type", `
 position: relative;
 width: 96px;
 height: 96px;
 border: var(--n-item-border-image-card);
 border-radius: var(--n-border-radius);
 padding: 0;
 display: flex;
 align-items: center;
 justify-content: center;
 transition: border-color .3s var(--n-bezier), background-color .3s var(--n-bezier);
 border-radius: var(--n-border-radius);
 overflow: hidden;
 `, [require__utils_cssr_index.cB("progress", `
 position: absolute;
 left: 8px;
 bottom: 8px;
 right: 8px;
 width: unset;
 `), require__utils_cssr_index.cB("upload-file-info", `
 padding: 0;
 width: 100%;
 height: 100%;
 `, [require__utils_cssr_index.cE("thumbnail", `
 width: 100%;
 height: 100%;
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;
 font-size: 36px;
 `, [require__utils_cssr_index.c("img", `
 width: 100%;
 `)])]), require__utils_cssr_index.c("&::before", `
 position: absolute;
 z-index: 1;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
 opacity: 0;
 transition: opacity .2s var(--n-bezier);
 content: "";
 `), require__utils_cssr_index.c("&:hover", [require__utils_cssr_index.c("&::before", "opacity: 1;"), require__utils_cssr_index.cB("upload-file-info", [require__utils_cssr_index.cE("thumbnail", "opacity: .12;")])]), require__utils_cssr_index.cM("always-show-actions", [require__utils_cssr_index.c("&::before", "opacity: 1;"), require__utils_cssr_index.cB("upload-file-info", [require__utils_cssr_index.cE("thumbnail", "opacity: .12;")])])]), require__utils_cssr_index.cM("error-status", [require__utils_cssr_index.c("&:hover", `
 background-color: var(--n-item-color-hover-error);
 `), require__utils_cssr_index.cB("upload-file-info", [require__utils_cssr_index.cE("name", "color: var(--n-item-text-color-error);"), require__utils_cssr_index.cE("thumbnail", "color: var(--n-item-text-color-error);")]), require__utils_cssr_index.cM("image-card-type", `
 border: var(--n-item-border-image-card-error);
 `)]), require__utils_cssr_index.cM("with-url", `
 cursor: pointer;
 `, [require__utils_cssr_index.cB("upload-file-info", [require__utils_cssr_index.cE("name", `
 color: var(--n-item-text-color-success);
 text-decoration-color: var(--n-item-text-color-success);
 `, [require__utils_cssr_index.c("a", `
 text-decoration: underline;
 `)])])]), require__utils_cssr_index.cB("upload-file-info", `
 position: relative;
 padding-top: 6px;
 padding-bottom: 6px;
 display: flex;
 flex-wrap: nowrap;
 `, [require__utils_cssr_index.cE("thumbnail", `
 font-size: 18px;
 opacity: 1;
 transition: opacity .2s var(--n-bezier);
 color: var(--n-item-icon-color);
 `, [require__utils_cssr_index.cB("base-icon", `
 margin-right: 2px;
 vertical-align: middle;
 transition: color .3s var(--n-bezier);
 `)]), require__utils_cssr_index.cE("action", `
 padding-top: inherit;
 padding-bottom: inherit;
 position: absolute;
 right: 0;
 top: 0;
 bottom: 0;
 width: 80px;
 display: flex;
 align-items: center;
 transition: opacity .2s var(--n-bezier);
 justify-content: flex-end;
 opacity: 0;
 `, [require__utils_cssr_index.cB("button", [require__utils_cssr_index.c("&:not(:last-child)", {
  marginRight: "4px"
}), require__utils_cssr_index.cB("base-icon", [require__utils_cssr_index.c("svg", [require__styles_transitions_icon_switch_cssr.iconSwitchTransition()])])]), require__utils_cssr_index.cM("image-type", `
 position: relative;
 max-width: 80px;
 width: auto;
 `), require__utils_cssr_index.cM("image-card-type", `
 z-index: 2;
 position: absolute;
 width: 100%;
 height: 100%;
 left: 0;
 right: 0;
 bottom: 0;
 top: 0;
 display: flex;
 justify-content: center;
 align-items: center;
 `), require__utils_cssr_index.cM("always-show", `
 opacity: 1;
 `)]), require__utils_cssr_index.cE("name", `
 color: var(--n-item-text-color);
 flex: 1;
 display: flex;
 justify-content: center;
 text-overflow: ellipsis;
 overflow: hidden;
 flex-direction: column;
 text-decoration-color: #0000;
 font-size: var(--n-font-size);
 transition:
 color .3s var(--n-bezier),
 text-decoration-color .3s var(--n-bezier); 
 `, [require__utils_cssr_index.c("a", `
 color: inherit;
 text-decoration: underline;
 `)])])])]), require__utils_cssr_index.cB("upload-file-input", `
 display: none;
 width: 0;
 height: 0;
 opacity: 0;
 `)]);
//#endregion
module.exports = index_cssr_default;