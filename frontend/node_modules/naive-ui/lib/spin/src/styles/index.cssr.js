const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_cssr = require("../../../_styles/transitions/fade-in.cssr.js");
//#region src/spin/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.c("@keyframes spin-rotate", `
 from {
 transform: rotate(0);
 }
 to {
 transform: rotate(360deg);
 }
 `), require__utils_cssr_index.cB("spin-container", `
 position: relative;
 `, [require__utils_cssr_index.cB("spin-body", `
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 `, [require__styles_transitions_fade_in_cssr.fadeInTransition()])]), require__utils_cssr_index.cB("spin-body", `
 display: inline-flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 `), require__utils_cssr_index.cB("spin", `
 display: inline-flex;
 height: var(--n-size);
 width: var(--n-size);
 font-size: var(--n-size);
 color: var(--n-color);
 `, [require__utils_cssr_index.cM("rotate", `
 animation: spin-rotate 2s linear infinite;
 `)]), require__utils_cssr_index.cB("spin-description", `
 display: inline-block;
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 margin-top: 8px;
 `), require__utils_cssr_index.cB("spin-content", `
 opacity: 1;
 transition: opacity .3s var(--n-bezier);
 pointer-events: all;
 `, [require__utils_cssr_index.cM("spinning", `
 user-select: none;
 -webkit-user-select: none;
 pointer-events: none;
 opacity: var(--n-opacity-spinning);
 `)])]);
//#endregion
module.exports = index_cssr_default;