const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/tabs/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("tabs", `
 box-sizing: border-box;
 width: 100%;
 display: flex;
 flex-direction: column;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
`, [require__utils_cssr_index.c("&.transition-disabled", [require__utils_cssr_index.cB("tabs-tab", `
 transition: none !important;
 `), require__utils_cssr_index.cB("tabs-nav-scroll-content", `
 transition: none !important;
 `), require__utils_cssr_index.cB("tabs-tab-pad", `
 transition: none !important;
 `)]), require__utils_cssr_index.cM("segment-type", [require__utils_cssr_index.cB("tabs-rail", [require__utils_cssr_index.c("&.transition-disabled", [require__utils_cssr_index.cB("tabs-capsule", `
 transition: none;
 `)])])]), require__utils_cssr_index.cM("top", [require__utils_cssr_index.cB("tab-pane", `
 padding: var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left);
 `)]), require__utils_cssr_index.cM("left", [require__utils_cssr_index.cB("tab-pane", `
 padding: var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left) var(--n-pane-padding-top);
 `)]), require__utils_cssr_index.cM("left, right", `
 flex-direction: row;
 `, [require__utils_cssr_index.cB("tabs-bar", `
 width: 2px;
 right: 0;
 transition:
 top .2s var(--n-bezier),
 max-height .2s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cB("tabs-tab", `
 padding: var(--n-tab-padding-vertical); 
 `)]), require__utils_cssr_index.cM("right", `
 flex-direction: row-reverse;
 `, [require__utils_cssr_index.cB("tab-pane", `
 padding: var(--n-pane-padding-left) var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom);
 `), require__utils_cssr_index.cB("tabs-bar", `
 left: 0;
 `)]), require__utils_cssr_index.cM("bottom", `
 flex-direction: column-reverse;
 justify-content: flex-end;
 `, [require__utils_cssr_index.cB("tab-pane", `
 padding: var(--n-pane-padding-bottom) var(--n-pane-padding-right) var(--n-pane-padding-top) var(--n-pane-padding-left);
 `), require__utils_cssr_index.cB("tabs-bar", `
 top: 0;
 `)]), require__utils_cssr_index.cB("tabs-rail", `
 position: relative;
 padding: 3px;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 background-color: var(--n-color-segment);
 transition: background-color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 `, [require__utils_cssr_index.cB("tabs-capsule", `
 border-radius: var(--n-tab-border-radius);
 position: absolute;
 left: 0;
 top: 0;
 pointer-events: none;
 background-color: var(--n-tab-color-segment);
 box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .08);
 transition: transform 0.3s var(--n-bezier);
 `), require__utils_cssr_index.cB("tabs-tab-wrapper", `
 flex-basis: 0;
 flex-grow: 1;
 display: flex;
 align-items: center;
 justify-content: center;
 `, [require__utils_cssr_index.cB("tabs-tab", `
 overflow: hidden;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
 `, [require__utils_cssr_index.cM("active", `
 font-weight: var(--n-font-weight-strong);
 color: var(--n-tab-text-color-active);
 `), require__utils_cssr_index.c("&:hover", `
 color: var(--n-tab-text-color-hover);
 `)])])]), require__utils_cssr_index.cM("flex", [require__utils_cssr_index.cB("tabs-nav", `
 width: 100%;
 position: relative;
 `, [require__utils_cssr_index.cB("tabs-wrapper", `
 width: 100%;
 `, [require__utils_cssr_index.cB("tabs-tab", `
 margin-right: 0;
 `)])])]), require__utils_cssr_index.cB("tabs-nav", `
 box-sizing: border-box;
 line-height: 1.5;
 display: flex;
 transition: border-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cE("prefix, suffix", `
 display: flex;
 align-items: center;
 `), require__utils_cssr_index.cE("prefix", "padding-right: 16px;"), require__utils_cssr_index.cE("suffix", "padding-left: 16px;")]), require__utils_cssr_index.cM("top, bottom", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("tabs-nav", [require__utils_cssr_index.cB("tabs-nav-scroll-wrapper", [require__utils_cssr_index.c("&::before", `
 top: 0;
 bottom: 0;
 left: 0;
 width: 20px;
 `), require__utils_cssr_index.c("&::after", `
 top: 0;
 bottom: 0;
 right: 0;
 width: 20px;
 `), require__utils_cssr_index.cM("shadow-start", [require__utils_cssr_index.c("&::before", `
 box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, .12);
 `)]), require__utils_cssr_index.cM("shadow-end", [require__utils_cssr_index.c("&::after", `
 box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, .12);
 `)])])])])]), require__utils_cssr_index.cM("left, right", [require__utils_cssr_index.cB("tabs-nav-scroll-content", `
 flex-direction: column;
 `), require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("tabs-nav", [require__utils_cssr_index.cB("tabs-nav-scroll-wrapper", [require__utils_cssr_index.c("&::before", `
 top: 0;
 left: 0;
 right: 0;
 height: 20px;
 `), require__utils_cssr_index.c("&::after", `
 bottom: 0;
 left: 0;
 right: 0;
 height: 20px;
 `), require__utils_cssr_index.cM("shadow-start", [require__utils_cssr_index.c("&::before", `
 box-shadow: inset 0 10px 8px -8px rgba(0, 0, 0, .12);
 `)]), require__utils_cssr_index.cM("shadow-end", [require__utils_cssr_index.c("&::after", `
 box-shadow: inset 0 -10px 8px -8px rgba(0, 0, 0, .12);
 `)])])])])]), require__utils_cssr_index.cB("tabs-nav-scroll-wrapper", `
 flex: 1;
 position: relative;
 overflow: hidden;
 `, [require__utils_cssr_index.cB("tabs-nav-y-scroll", `
 height: 100%;
 width: 100%;
 overflow-y: auto; 
 scrollbar-width: none;
 `, [require__utils_cssr_index.c("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb", `
 width: 0;
 height: 0;
 display: none;
 `)]), require__utils_cssr_index.c("&::before, &::after", `
 transition: box-shadow .3s var(--n-bezier);
 pointer-events: none;
 content: "";
 position: absolute;
 z-index: 1;
 `), require__utils_cssr_index.c("&.transition-disabled", [require__utils_cssr_index.c("&::before, &::after", `
 transition: none;
 `)])]), require__utils_cssr_index.cB("tabs-nav-scroll-content", `
 display: flex;
 position: relative;
 min-width: 100%;
 min-height: 100%;
 width: fit-content;
 box-sizing: border-box;
 `), require__utils_cssr_index.cB("tabs-wrapper", `
 display: inline-flex;
 flex-wrap: nowrap;
 position: relative;
 `), require__utils_cssr_index.cB("tabs-tab-wrapper", `
 display: flex;
 flex-wrap: nowrap;
 flex-shrink: 0;
 flex-grow: 0;
 `), require__utils_cssr_index.cB("tabs-tab", `
 cursor: pointer;
 white-space: nowrap;
 flex-wrap: nowrap;
 display: inline-flex;
 align-items: center;
 color: var(--n-tab-text-color);
 font-size: var(--n-tab-font-size);
 background-clip: padding-box;
 padding: var(--n-tab-padding);
 transition:
 box-shadow .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cM("disabled", {
  cursor: "not-allowed"
}), require__utils_cssr_index.cE("close", `
 margin-inline-start: 6px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `), require__utils_cssr_index.cE("label", `
 display: flex;
 align-items: center;
 z-index: 1;
 `)]), require__utils_cssr_index.cB("tabs-bar", `
 position: absolute;
 bottom: 0;
 height: 2px;
 border-radius: 1px;
 background-color: var(--n-bar-color);
 transition:
 left .2s var(--n-bezier),
 max-width .2s var(--n-bezier),
 opacity .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.c("&.transition-disabled", `
 transition: none;
 `), require__utils_cssr_index.cM("disabled", `
 background-color: var(--n-tab-text-color-disabled)
 `)]), require__utils_cssr_index.cB("tabs-pane-wrapper", `
 position: relative;
 overflow: hidden;
 transition: max-height .2s var(--n-bezier);
 `), require__utils_cssr_index.cB("tab-pane", `
 color: var(--n-pane-text-color);
 width: 100%;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .2s var(--n-bezier);
 left: 0;
 right: 0;
 top: 0;
 `, [require__utils_cssr_index.c("&.next-transition-leave-active, &.prev-transition-leave-active, &.next-transition-enter-active, &.prev-transition-enter-active", `
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 transform .2s var(--n-bezier),
 opacity .2s var(--n-bezier);
 `), require__utils_cssr_index.c("&.next-transition-leave-active, &.prev-transition-leave-active", `
 position: absolute;
 `), require__utils_cssr_index.c("&.next-transition-enter-from, &.prev-transition-leave-to", `
 transform: translateX(32px);
 opacity: 0;
 `), require__utils_cssr_index.c("&.next-transition-leave-to, &.prev-transition-enter-from", `
 transform: translateX(-32px);
 opacity: 0;
 `), require__utils_cssr_index.c("&.next-transition-leave-from, &.next-transition-enter-to, &.prev-transition-leave-from, &.prev-transition-enter-to", `
 transform: translateX(0);
 opacity: 1;
 `)]), require__utils_cssr_index.cB("tabs-tab-pad", `
 box-sizing: border-box;
 width: var(--n-tab-gap);
 flex-grow: 0;
 flex-shrink: 0;
 `), require__utils_cssr_index.cM("line-type, bar-type", [require__utils_cssr_index.cB("tabs-tab", `
 font-weight: var(--n-tab-font-weight);
 box-sizing: border-box;
 vertical-align: bottom;
 `, [require__utils_cssr_index.c("&:hover", {
  color: "var(--n-tab-text-color-hover)"
}), require__utils_cssr_index.cM("active", `
 color: var(--n-tab-text-color-active);
 font-weight: var(--n-tab-font-weight-active);
 `), require__utils_cssr_index.cM("disabled", {
  color: "var(--n-tab-text-color-disabled)"
})])]), require__utils_cssr_index.cB("tabs-nav", [require__utils_cssr_index.cE("prefix, suffix", `
 border-color: var(--n-tab-border-color);
 `), require__utils_cssr_index.cB("tabs-nav-scroll-content", `
 border-color: var(--n-tab-border-color);
 `), require__utils_cssr_index.cM("line-type", [require__utils_cssr_index.cM("top", [require__utils_cssr_index.cE("prefix, suffix", `
 border-bottom: 1px solid var(--n-tab-border-color);
 `), require__utils_cssr_index.cB("tabs-nav-scroll-content", `
 border-bottom: 1px solid var(--n-tab-border-color);
 `), require__utils_cssr_index.cB("tabs-bar", `
 bottom: -1px;
 `)]), require__utils_cssr_index.cM("left", [require__utils_cssr_index.cE("prefix, suffix", `
 border-right: 1px solid var(--n-tab-border-color);
 `), require__utils_cssr_index.cB("tabs-nav-scroll-content", `
 border-right: 1px solid var(--n-tab-border-color);
 `), require__utils_cssr_index.cB("tabs-bar", `
 right: -1px;
 `)]), require__utils_cssr_index.cM("right", [require__utils_cssr_index.cE("prefix, suffix", `
 border-left: 1px solid var(--n-tab-border-color);
 `), require__utils_cssr_index.cB("tabs-nav-scroll-content", `
 border-left: 1px solid var(--n-tab-border-color);
 `), require__utils_cssr_index.cB("tabs-bar", `
 left: -1px;
 `)]), require__utils_cssr_index.cM("bottom", [require__utils_cssr_index.cE("prefix, suffix", `
 border-top: 1px solid var(--n-tab-border-color);
 `), require__utils_cssr_index.cB("tabs-nav-scroll-content", `
 border-top: 1px solid var(--n-tab-border-color);
 `), require__utils_cssr_index.cB("tabs-bar", `
 top: -1px;
 `)]), require__utils_cssr_index.cE("prefix, suffix", `
 transition: border-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cB("tabs-nav-scroll-content", `
 transition: border-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cB("tabs-bar", `
 border-radius: 0;
 `)]), require__utils_cssr_index.cM("card-type", [require__utils_cssr_index.cE("prefix, suffix", `
 transition: border-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cB("tabs-pad", `
 flex-grow: 1;
 transition: border-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cB("tabs-tab-pad", `
 transition: border-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cB("tabs-tab", `
 font-weight: var(--n-tab-font-weight);
 border: 1px solid var(--n-tab-border-color);
 background-color: var(--n-tab-color);
 box-sizing: border-box;
 position: relative;
 vertical-align: bottom;
 display: flex;
 justify-content: space-between;
 font-size: var(--n-tab-font-size);
 color: var(--n-tab-text-color);
 `, [require__utils_cssr_index.cM("addable", `
 padding-left: 8px;
 padding-right: 8px;
 font-size: 16px;
 justify-content: center;
 `, [require__utils_cssr_index.cE("height-placeholder", `
 width: 0;
 font-size: var(--n-tab-font-size);
 `), require__utils_cssr_index.cNotM("disabled", [require__utils_cssr_index.c("&:hover", `
 color: var(--n-tab-text-color-hover);
 `)])]), require__utils_cssr_index.cM("closable", "padding-inline-end: 8px;"), require__utils_cssr_index.cM("active", `
 background-color: #0000;
 font-weight: var(--n-tab-font-weight-active);
 color: var(--n-tab-text-color-active);
 `), require__utils_cssr_index.cM("disabled", "color: var(--n-tab-text-color-disabled);")])]), require__utils_cssr_index.cM("left, right", `
 flex-direction: column; 
 `, [require__utils_cssr_index.cE("prefix, suffix", `
 padding: var(--n-tab-padding-vertical);
 `), require__utils_cssr_index.cB("tabs-wrapper", `
 flex-direction: column;
 `), require__utils_cssr_index.cB("tabs-tab-wrapper", `
 flex-direction: column;
 `, [require__utils_cssr_index.cB("tabs-tab-pad", `
 height: var(--n-tab-gap-vertical);
 width: 100%;
 `)])]), require__utils_cssr_index.cM("top", [require__utils_cssr_index.cM("card-type", [require__utils_cssr_index.cB("tabs-scroll-padding", "border-bottom: 1px solid var(--n-tab-border-color);"), require__utils_cssr_index.cE("prefix, suffix", `
 border-bottom: 1px solid var(--n-tab-border-color);
 `), require__utils_cssr_index.cB("tabs-tab", `
 border-top-left-radius: var(--n-tab-border-radius);
 border-top-right-radius: var(--n-tab-border-radius);
 `, [require__utils_cssr_index.cM("active", `
 border-bottom: 1px solid #0000;
 `)]), require__utils_cssr_index.cB("tabs-tab-pad", `
 border-bottom: 1px solid var(--n-tab-border-color);
 `), require__utils_cssr_index.cB("tabs-pad", `
 border-bottom: 1px solid var(--n-tab-border-color);
 `)])]), require__utils_cssr_index.cM("left", [require__utils_cssr_index.cM("card-type", [require__utils_cssr_index.cB("tabs-scroll-padding", "border-right: 1px solid var(--n-tab-border-color);"), require__utils_cssr_index.cE("prefix, suffix", `
 border-right: 1px solid var(--n-tab-border-color);
 `), require__utils_cssr_index.cB("tabs-tab", `
 border-top-left-radius: var(--n-tab-border-radius);
 border-bottom-left-radius: var(--n-tab-border-radius);
 `, [require__utils_cssr_index.cM("active", `
 border-right: 1px solid #0000;
 `)]), require__utils_cssr_index.cB("tabs-tab-pad", `
 border-right: 1px solid var(--n-tab-border-color);
 `), require__utils_cssr_index.cB("tabs-pad", `
 border-right: 1px solid var(--n-tab-border-color);
 `)])]), require__utils_cssr_index.cM("right", [require__utils_cssr_index.cM("card-type", [require__utils_cssr_index.cB("tabs-scroll-padding", "border-left: 1px solid var(--n-tab-border-color);"), require__utils_cssr_index.cE("prefix, suffix", `
 border-left: 1px solid var(--n-tab-border-color);
 `), require__utils_cssr_index.cB("tabs-tab", `
 border-top-right-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `, [require__utils_cssr_index.cM("active", `
 border-left: 1px solid #0000;
 `)]), require__utils_cssr_index.cB("tabs-tab-pad", `
 border-left: 1px solid var(--n-tab-border-color);
 `), require__utils_cssr_index.cB("tabs-pad", `
 border-left: 1px solid var(--n-tab-border-color);
 `)])]), require__utils_cssr_index.cM("bottom", [require__utils_cssr_index.cM("card-type", [require__utils_cssr_index.cB("tabs-scroll-padding", "border-top: 1px solid var(--n-tab-border-color);"), require__utils_cssr_index.cE("prefix, suffix", `
 border-top: 1px solid var(--n-tab-border-color);
 `), require__utils_cssr_index.cB("tabs-tab", `
 border-bottom-left-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `, [require__utils_cssr_index.cM("active", `
 border-top: 1px solid #0000;
 `)]), require__utils_cssr_index.cB("tabs-tab-pad", `
 border-top: 1px solid var(--n-tab-border-color);
 `), require__utils_cssr_index.cB("tabs-pad", `
 border-top: 1px solid var(--n-tab-border-color);
 `)])])]), require__utils_cssr_index.cB("tabs-scroll-button", [require__utils_cssr_index.cM("start", `
 padding-left: 10px;
 padding-right: 6px;
 `), require__utils_cssr_index.cM("end", `
 padding-right: 10px;
 padding-left: 6px;
 `), require__utils_cssr_index.cM("up", `
 padding-bottom: 10px;
 `), require__utils_cssr_index.cM("down", `
 padding-top: 10px;
 `)])]);
//#endregion
module.exports = index_cssr_default;