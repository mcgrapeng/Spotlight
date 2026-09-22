const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/card/src/styles/index.cssr.ts
const contentBaseStyle = require__utils_cssr_index.cB("card-content", `
 flex: 1;
 min-width: 0;
 box-sizing: border-box;
 padding: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left);
 font-size: var(--n-font-size);
`);
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("card", `
 font-size: var(--n-font-size);
 line-height: var(--n-line-height);
 display: flex;
 flex-direction: column;
 width: 100%;
 box-sizing: border-box;
 position: relative;
 border-radius: var(--n-border-radius);
 background-color: var(--n-color);
 color: var(--n-text-color);
 word-break: break-word;
 transition: 
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.asModal({
  background: "var(--n-color-modal)"
}), require__utils_cssr_index.cM("hoverable", [require__utils_cssr_index.c("&:hover", "box-shadow: var(--n-box-shadow);")]), require__utils_cssr_index.cM("content-segmented", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("card-content", `
 padding-top: var(--n-padding-bottom);
 `), require__utils_cssr_index.cE("content-scrollbar", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("scrollbar-container", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("card-content", `
 padding-top: var(--n-padding-bottom);
 `)])])])])])]), require__utils_cssr_index.cM("content-soft-segmented", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("card-content", `
 margin: 0 var(--n-padding-left);
 padding: var(--n-padding-bottom) 0;
 `), require__utils_cssr_index.cE("content-scrollbar", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("scrollbar-container", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("card-content", `
 margin: 0 var(--n-padding-left);
 padding: var(--n-padding-bottom) 0;
 `)])])])])])]), require__utils_cssr_index.cM("footer-segmented", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cE("footer", `
 padding-top: var(--n-padding-bottom);
 `)])]), require__utils_cssr_index.cM("footer-soft-segmented", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cE("footer", `
 padding: var(--n-padding-bottom) 0;
 margin: 0 var(--n-padding-left);
 `)])]), require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("card-header", `
 box-sizing: border-box;
 display: flex;
 align-items: center;
 font-size: var(--n-title-font-size);
 padding:
 var(--n-padding-top)
 var(--n-padding-left)
 var(--n-padding-bottom)
 var(--n-padding-left);
 `, [require__utils_cssr_index.cE("main", `
 font-weight: var(--n-title-font-weight);
 transition: color .3s var(--n-bezier);
 flex: 1;
 min-width: 0;
 color: var(--n-title-text-color);
 `), require__utils_cssr_index.cE("extra", `
 display: flex;
 align-items: center;
 font-size: var(--n-font-size);
 font-weight: 400;
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `), require__utils_cssr_index.cE("close", `
 margin: 0 0 0 8px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)]), require__utils_cssr_index.cE("action", `
 box-sizing: border-box;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 background-clip: padding-box;
 background-color: var(--n-action-color);
 `), contentBaseStyle, require__utils_cssr_index.cB("card-content", [require__utils_cssr_index.c("&:first-child", `
 padding-top: var(--n-padding-bottom);
 `)]), require__utils_cssr_index.cE("content-scrollbar", `
 display: flex;
 flex-direction: column;
 `, [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("scrollbar-container", [require__utils_cssr_index.c(">", [contentBaseStyle])])]), require__utils_cssr_index.c("&:first-child >", [require__utils_cssr_index.cB("scrollbar-container", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("card-content", `
 padding-top: var(--n-padding-bottom);
 `)])])])]), require__utils_cssr_index.cE("footer", `
 box-sizing: border-box;
 padding: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left);
 font-size: var(--n-font-size);
 `, [require__utils_cssr_index.c("&:first-child", `
 padding-top: var(--n-padding-bottom);
 `)]), require__utils_cssr_index.cE("action", `
 background-color: var(--n-action-color);
 padding: var(--n-padding-bottom) var(--n-padding-left);
 border-bottom-left-radius: var(--n-border-radius);
 border-bottom-right-radius: var(--n-border-radius);
 `)]), require__utils_cssr_index.cB("card-cover", `
 overflow: hidden;
 width: 100%;
 border-radius: var(--n-border-radius) var(--n-border-radius) 0 0;
 `, [require__utils_cssr_index.c("img", `
 display: block;
 width: 100%;
 `)]), require__utils_cssr_index.cM("bordered", `
 border: 1px solid var(--n-border-color);
 `, [require__utils_cssr_index.c("&:target", "border-color: var(--n-color-target);")]), require__utils_cssr_index.cM("action-segmented", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cE("action", [require__utils_cssr_index.c("&:not(:first-child)", `
 border-top: 1px solid var(--n-border-color);
 `)])])]), require__utils_cssr_index.cM("content-segmented, content-soft-segmented", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("card-content", `
 transition: border-color 0.3s var(--n-bezier);
 `, [require__utils_cssr_index.c("&:not(:first-child)", `
 border-top: 1px solid var(--n-border-color);
 `)]), require__utils_cssr_index.cE("content-scrollbar", `
 transition: border-color 0.3s var(--n-bezier);
 `, [require__utils_cssr_index.c("&:not(:first-child)", `
 border-top: 1px solid var(--n-border-color);
 `)])])]), require__utils_cssr_index.cM("footer-segmented, footer-soft-segmented", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cE("footer", `
 transition: border-color 0.3s var(--n-bezier);
 `, [require__utils_cssr_index.c("&:not(:first-child)", `
 border-top: 1px solid var(--n-border-color);
 `)])])]), require__utils_cssr_index.cM("embedded", `
 background-color: var(--n-color-embedded);
 `)]), require__utils_cssr_index.insideModal(require__utils_cssr_index.cB("card", `
 background: var(--n-color-modal);
 `, [require__utils_cssr_index.cM("embedded", `
 background-color: var(--n-color-embedded-modal);
 `)])), require__utils_cssr_index.insidePopover(require__utils_cssr_index.cB("card", `
 background: var(--n-color-popover);
 `, [require__utils_cssr_index.cM("embedded", `
 background-color: var(--n-color-embedded-popover);
 `)]))]);
//#endregion
module.exports = index_cssr_default;