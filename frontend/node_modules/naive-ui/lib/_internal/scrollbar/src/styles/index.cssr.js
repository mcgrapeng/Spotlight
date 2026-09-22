const require__utils_cssr_index = require("../../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_cssr = require("../../../../_styles/transitions/fade-in.cssr.js");
//#region src/_internal/scrollbar/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("scrollbar", `
 overflow: hidden;
 position: relative;
 z-index: auto;
 height: 100%;
 width: 100%;
`, [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("scrollbar-container", `
 width: 100%;
 overflow: scroll;
 height: 100%;
 min-height: inherit;
 max-height: inherit;
 scrollbar-width: none;
 `, [require__utils_cssr_index.c("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb", `
 width: 0;
 height: 0;
 display: none;
 `), require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("scrollbar-content", `
 box-sizing: border-box;
 min-width: 100%;
 `)])])]), require__utils_cssr_index.c(">, +", [require__utils_cssr_index.cB("scrollbar-rail", `
 position: absolute;
 pointer-events: none;
 user-select: none;
 background: var(--n-scrollbar-rail-color);
 -webkit-user-select: none;
 `, [require__utils_cssr_index.cM("horizontal", `
 height: var(--n-scrollbar-height);
 `, [require__utils_cssr_index.c(">", [require__utils_cssr_index.cE("scrollbar", `
 height: var(--n-scrollbar-height);
 border-radius: var(--n-scrollbar-border-radius);
 right: 0;
 `)])]), require__utils_cssr_index.cM("horizontal--top", `
 top: var(--n-scrollbar-rail-top-horizontal-top); 
 right: var(--n-scrollbar-rail-right-horizontal-top); 
 bottom: var(--n-scrollbar-rail-bottom-horizontal-top); 
 left: var(--n-scrollbar-rail-left-horizontal-top); 
 `), require__utils_cssr_index.cM("horizontal--bottom", `
 top: var(--n-scrollbar-rail-top-horizontal-bottom); 
 right: var(--n-scrollbar-rail-right-horizontal-bottom); 
 bottom: var(--n-scrollbar-rail-bottom-horizontal-bottom); 
 left: var(--n-scrollbar-rail-left-horizontal-bottom); 
 `), require__utils_cssr_index.cM("vertical", `
 width: var(--n-scrollbar-width);
 `, [require__utils_cssr_index.c(">", [require__utils_cssr_index.cE("scrollbar", `
 width: var(--n-scrollbar-width);
 border-radius: var(--n-scrollbar-border-radius);
 bottom: 0;
 `)])]), require__utils_cssr_index.cM("vertical--left", `
 top: var(--n-scrollbar-rail-top-vertical-left); 
 right: var(--n-scrollbar-rail-right-vertical-left); 
 bottom: var(--n-scrollbar-rail-bottom-vertical-left); 
 left: var(--n-scrollbar-rail-left-vertical-left); 
 `), require__utils_cssr_index.cM("vertical--right", `
 top: var(--n-scrollbar-rail-top-vertical-right); 
 right: var(--n-scrollbar-rail-right-vertical-right); 
 bottom: var(--n-scrollbar-rail-bottom-vertical-right); 
 left: var(--n-scrollbar-rail-left-vertical-right); 
 `), require__utils_cssr_index.cM("disabled", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cE("scrollbar", "pointer-events: none;")])]), require__utils_cssr_index.c(">", [require__utils_cssr_index.cE("scrollbar", `
 z-index: 1;
 position: absolute;
 cursor: pointer;
 pointer-events: all;
 background-color: var(--n-scrollbar-color);
 transition: background-color .2s var(--n-scrollbar-bezier);
 `, [require__styles_transitions_fade_in_cssr.fadeInTransition(), require__utils_cssr_index.c("&:hover", "background-color: var(--n-scrollbar-color-hover);")])])])])]);
//#endregion
module.exports = index_cssr_default;