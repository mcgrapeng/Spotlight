const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/rate/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("rate", {
  display: "inline-flex",
  flexWrap: "nowrap"
}, [require__utils_cssr_index.c("&:hover", [require__utils_cssr_index.cE("item", `
 transition:
 transform .1s var(--n-bezier),
 color .3s var(--n-bezier);
 `)]), require__utils_cssr_index.cE("item", `
 position: relative;
 display: flex;
 transition:
 transform .1s var(--n-bezier),
 color .3s var(--n-bezier);
 transform: scale(1);
 font-size: var(--n-item-size);
 color: var(--n-item-color);
 `, [require__utils_cssr_index.c("&:not(:first-child)", `
 margin-left: 6px;
 `), require__utils_cssr_index.cM("active", `
 color: var(--n-item-color-active);
 `)]), require__utils_cssr_index.cNotM("readonly", `
 cursor: pointer;
 `, [require__utils_cssr_index.cE("item", [require__utils_cssr_index.c("&:hover", `
 transform: scale(1.05);
 `), require__utils_cssr_index.c("&:active", `
 transform: scale(0.96);
 `)])]), require__utils_cssr_index.cE("half", `
 display: flex;
 transition: inherit;
 position: absolute;
 top: 0;
 left: 0;
 bottom: 0;
 width: 50%;
 overflow: hidden;
 color: rgba(255, 255, 255, 0);
 `, [require__utils_cssr_index.cM("active", `
 color: var(--n-item-color-active);
 `)])]);
//#endregion
module.exports = index_cssr_default;