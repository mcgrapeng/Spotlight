const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/progress/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("progress", {
  display: "inline-block"
}, [require__utils_cssr_index.cB("progress-icon", `
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 `), require__utils_cssr_index.cM("line", `
 width: 100%;
 display: block;
 `, [require__utils_cssr_index.cB("progress-content", `
 display: flex;
 align-items: center;
 `, [require__utils_cssr_index.cB("progress-graph", {
  flex: 1
})]), require__utils_cssr_index.cB("progress-custom-content", {
  marginLeft: "14px"
}), require__utils_cssr_index.cB("progress-icon", `
 width: 30px;
 padding-left: 14px;
 height: var(--n-icon-size-line);
 line-height: var(--n-icon-size-line);
 font-size: var(--n-icon-size-line);
 `, [require__utils_cssr_index.cM("as-text", `
 color: var(--n-text-color-line-outer);
 text-align: center;
 width: 40px;
 font-size: var(--n-font-size);
 padding-left: 4px;
 transition: color .3s var(--n-bezier);
 `)])]), require__utils_cssr_index.cM("circle, dashboard", {
  width: "120px"
}, [require__utils_cssr_index.cB("progress-custom-content", `
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 justify-content: center;
 `), require__utils_cssr_index.cB("progress-text", `
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 color: inherit;
 font-size: var(--n-font-size-circle);
 color: var(--n-text-color-circle);
 font-weight: var(--n-font-weight-circle);
 transition: color .3s var(--n-bezier);
 white-space: nowrap;
 `), require__utils_cssr_index.cB("progress-icon", `
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 color: var(--n-icon-color);
 font-size: var(--n-icon-size-circle);
 `)]), require__utils_cssr_index.cM("multiple-circle", `
 width: 200px;
 color: inherit;
 `, [require__utils_cssr_index.cB("progress-text", `
 font-weight: var(--n-font-weight-circle);
 color: var(--n-text-color-circle);
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 justify-content: center;
 transition: color .3s var(--n-bezier);
 `)]), require__utils_cssr_index.cB("progress-content", {
  position: "relative"
}), require__utils_cssr_index.cB("progress-graph", {
  position: "relative"
}, [require__utils_cssr_index.cB("progress-graph-circle", [require__utils_cssr_index.c("svg", {
  verticalAlign: "bottom"
}), require__utils_cssr_index.cB("progress-graph-circle-fill", `
 stroke: var(--n-fill-color);
 transition:
 opacity .3s var(--n-bezier),
 stroke .3s var(--n-bezier),
 stroke-dasharray .3s var(--n-bezier);
 `, [require__utils_cssr_index.cM("empty", {
  opacity: 0
})]), require__utils_cssr_index.cB("progress-graph-circle-rail", `
 transition: stroke .3s var(--n-bezier);
 overflow: hidden;
 stroke: var(--n-rail-color);
 `)]), require__utils_cssr_index.cB("progress-graph-line", [require__utils_cssr_index.cM("indicator-inside", [require__utils_cssr_index.cB("progress-graph-line-rail", `
 height: 16px;
 line-height: 16px;
 border-radius: 10px;
 `, [require__utils_cssr_index.cB("progress-graph-line-fill", `
 height: inherit;
 border-radius: 10px;
 `), require__utils_cssr_index.cB("progress-graph-line-indicator", `
 background: #0000;
 white-space: nowrap;
 text-align: right;
 margin-left: 14px;
 margin-right: 14px;
 height: inherit;
 font-size: 12px;
 color: var(--n-text-color-line-inner);
 transition: color .3s var(--n-bezier);
 `)])]), require__utils_cssr_index.cM("indicator-inside-label", `
 height: 16px;
 display: flex;
 align-items: center;
 `, [require__utils_cssr_index.cB("progress-graph-line-rail", `
 flex: 1;
 transition: background-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cB("progress-graph-line-indicator", `
 background: var(--n-fill-color);
 font-size: 12px;
 transform: translateZ(0);
 display: flex;
 vertical-align: middle;
 height: 16px;
 line-height: 16px;
 padding: 0 10px;
 border-radius: 10px;
 position: absolute;
 white-space: nowrap;
 color: var(--n-text-color-line-inner);
 transition:
 right .2s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `)]), require__utils_cssr_index.cB("progress-graph-line-rail", `
 position: relative;
 overflow: hidden;
 height: var(--n-rail-height);
 border-radius: 5px;
 background-color: var(--n-rail-color);
 transition: background-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.cB("progress-graph-line-fill", `
 background: var(--n-fill-color);
 position: relative;
 border-radius: 5px;
 height: inherit;
 width: 100%;
 max-width: 0%;
 transition:
 background-color .3s var(--n-bezier),
 max-width .2s var(--n-bezier);
 `, [require__utils_cssr_index.cM("processing", [require__utils_cssr_index.c("&::after", `
 content: "";
 background-image: var(--n-line-bg-processing);
 animation: progress-processing-animation 2s var(--n-bezier) infinite;
 `)])])])])])]), require__utils_cssr_index.c("@keyframes progress-processing-animation", `
 0% {
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 right: 100%;
 opacity: 1;
 }
 66% {
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 right: 0;
 opacity: 0;
 }
 100% {
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 right: 0;
 opacity: 0;
 }
 `)]);
//#endregion
module.exports = index_cssr_default;