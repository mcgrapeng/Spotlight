const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/float-button/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("float-button", `
 user-select: none;
 cursor: pointer;
 color: var(--n-text-color);
 background-color: var(--n-color);
 font-size: 18px;
 transition:
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 box-shadow: var(--n-box-shadow);
 display: flex;
 align-items: stretch;
 box-sizing: border-box;
`, [require__utils_cssr_index.cM("circle-shape", `
 border-radius: 4096px;
 `), require__utils_cssr_index.cM("square-shape", `
 border-radius: var(--n-border-radius-square);
 `), require__utils_cssr_index.cE("fill", `
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0
 left: 0;
 transition: background-color .3s var(--n-bezier);
 border-radius: inherit;
 `), require__utils_cssr_index.cE("body", `
 position: relative;
 flex-grow: 1;
 display: flex;
 align-items: center;
 justify-content: center;
 transition: transform .3s var(--n-bezier), opacity .3s var(--n-bezier);
 border-radius: inherit;
 flex-direction: column;
 box-sizing: border-box;
 padding: 2px 4px;
 gap: 2px;
 transform: scale(1);
 `, [require__utils_cssr_index.cE("description", `
 font-size: 12px;
 text-align: center;
 line-height: 14px;
 `)]), require__utils_cssr_index.c("&:hover", "box-shadow: var(--n-box-shadow-hover);", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cE("fill", `
 background-color: var(--n-color-hover);
 `)])]), require__utils_cssr_index.c("&:active", "box-shadow: var(--n-box-shadow-pressed);", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cE("fill", `
 background-color: var(--n-color-pressed);
 `)])]), require__utils_cssr_index.cM("show-menu", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cE("menu", `
 pointer-events: all;
 bottom: 100%;
 opacity: 1;
 `), require__utils_cssr_index.cE("close", `
 transform: scale(1);
 opacity: 1;
 `), require__utils_cssr_index.cE("body", `
 transform: scale(0.75);
 opacity: 0;
 `)])]), require__utils_cssr_index.cE("close", `
 opacity: 0;
 transform: scale(0.75);
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 display: flex;
 align-items: center;
 justify-content: center;
 transition: transform .3s var(--n-bezier), opacity .3s var(--n-bezier);
 `), require__utils_cssr_index.cE("menu", `
 position: absolute;
 bottom: calc(100% - 8px);
 display: flex;
 flex-direction: column;
 opacity: 0;
 pointer-events: none;
 transition:
 opacity .3s var(--n-bezier),
 bottom .3s var(--n-bezier); 
 `, [require__utils_cssr_index.c("> *", `
 margin-bottom: 16px;
 `), require__utils_cssr_index.cB("float-button", `
 position: relative !important;
 `)])]);
//#endregion
module.exports = index_cssr_default;