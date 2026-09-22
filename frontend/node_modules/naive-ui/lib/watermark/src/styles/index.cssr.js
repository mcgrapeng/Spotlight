const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/watermark/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("watermark-container", `
 position: relative;
 `, [require__utils_cssr_index.cNotM("selectable", `
 user-select: none;
 -webkit-user-select: none;
 `), require__utils_cssr_index.cM("global-rotate", `
 overflow: hidden;
 `), require__utils_cssr_index.cM("fullscreen", `
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 pointer-events: none;
 position: fixed;
 `)]), require__utils_cssr_index.cB("watermark", `
 position: absolute;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 pointer-events: none;
 background-repeat: repeat;
 `, [require__utils_cssr_index.cM("fullscreen", `
 position: fixed;
 `), require__utils_cssr_index.cM("global-rotate", `
 position: absolute;
 height: max(284vh, 284vw);
 width: max(284vh, 284vw);
 `)])]);
//#endregion
module.exports = index_cssr_default;