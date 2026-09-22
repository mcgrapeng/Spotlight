const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/float-button-group/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("float-button-group", [require__utils_cssr_index.cB("float-button", `
 position: relative;
 `), require__utils_cssr_index.cM("square-shape", `
 background-color: var(--n-color);
 cursor: pointer;
 display: flex;
 width: fit-content;
 align-items: center;
 justify-content: center;
 border-radius: var(--n-border-radius-square);
 flex-direction: column;
 box-shadow: var(--n-box-shadow);
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cB("float-button", `
 background-color: unset;
 border-radius: 0;
 box-shadow: none;
 box-sizing: content-box;
 `, [require__utils_cssr_index.c("&:not(:last-child)", `
 border-bottom: 1px solid var(--n-button-border-color); 
 `), require__utils_cssr_index.c("&:first-child", `
 border-top-left-radius: 4px;
 border-top-right-radius: 4px;
 `), require__utils_cssr_index.c("&:last-child", `
 border-bottom-left-radius: 4px;
 border-bottom-right-radius: 4px;
 `), require__utils_cssr_index.cE("fill", `
 top: 4px;
 right: 4px;
 bottom: 4px;
 left: 4px;
 border-radius: var(--n-border-radius-square); 
 `)])]), require__utils_cssr_index.cM("circle-shape", [require__utils_cssr_index.c(">:not(:last-child)", `
 margin-bottom: 16px;
 `)])]);
//#endregion
module.exports = index_cssr_default;