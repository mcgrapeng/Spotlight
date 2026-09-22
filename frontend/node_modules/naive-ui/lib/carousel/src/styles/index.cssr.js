const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/carousel/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("carousel", `
 position: relative;
 width: 100%;
 height: 100%;
 touch-action: pan-y;
 overflow: hidden;
`, [require__utils_cssr_index.cE("slides", `
 display: flex;
 width: 100%;
 height: 100%;
 transition-timing-function: var(--n-bezier);
 transition-property: transform;
 `, [require__utils_cssr_index.cE("slide", `
 flex-shrink: 0;
 position: relative;
 width: 100%;
 height: 100%;
 outline: none;
 overflow: hidden;
 `, [require__utils_cssr_index.c("> img", `
 display: block;
 `)])]), require__utils_cssr_index.cE("dots", `
 position: absolute;
 display: flex;
 flex-wrap: nowrap;
 `, [require__utils_cssr_index.cM("dot", [require__utils_cssr_index.cE("dot", `
 height: var(--n-dot-size);
 width: var(--n-dot-size);
 background-color: var(--n-dot-color);
 border-radius: 50%;
 cursor: pointer;
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 outline: none;
 `, [require__utils_cssr_index.c("&:focus", `
 background-color: var(--n-dot-color-focus);
 `), require__utils_cssr_index.cM("active", `
 background-color: var(--n-dot-color-active);
 `)])]), require__utils_cssr_index.cM("line", [require__utils_cssr_index.cE("dot", `
 border-radius: 9999px;
 width: var(--n-dot-line-width);
 height: 4px;
 background-color: var(--n-dot-color);
 cursor: pointer;
 transition:
 width .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 outline: none;
 `, [require__utils_cssr_index.c("&:focus", `
 background-color: var(--n-dot-color-focus);
 `), require__utils_cssr_index.cM("active", `
 width: var(--n-dot-line-width-active);
 background-color: var(--n-dot-color-active);
 `)])])]), require__utils_cssr_index.cE("arrow", `
 transition: background-color .3s var(--n-bezier);
 cursor: pointer;
 height: 28px;
 width: 28px;
 display: flex;
 align-items: center;
 justify-content: center;
 background-color: rgba(255, 255, 255, .2);
 color: var(--n-arrow-color);
 border-radius: 8px;
 user-select: none;
 -webkit-user-select: none;
 font-size: 18px;
 `, [require__utils_cssr_index.c("svg", `
 height: 1em;
 width: 1em;
 `), require__utils_cssr_index.c("&:hover", `
 background-color: rgba(255, 255, 255, .3);
 `)]), require__utils_cssr_index.cM("vertical", `
 touch-action: pan-x;
 `, [require__utils_cssr_index.cE("slides", `
 flex-direction: column;
 `), require__utils_cssr_index.cM("fade", [require__utils_cssr_index.cE("slide", `
 top: 50%;
 left: unset;
 transform: translateY(-50%);
 `)]), require__utils_cssr_index.cM("card", [require__utils_cssr_index.cE("slide", `
 top: 50%;
 left: unset;
 transform: translateY(-50%) translateZ(-400px);
 `, [require__utils_cssr_index.cM("current", `
 transform: translateY(-50%) translateZ(0);
 `), require__utils_cssr_index.cM("prev", `
 transform: translateY(-100%) translateZ(-200px);
 `), require__utils_cssr_index.cM("next", `
 transform: translateY(0%) translateZ(-200px);
 `)])])]), require__utils_cssr_index.cM("usercontrol", [require__utils_cssr_index.cE("slides", [require__utils_cssr_index.c(">", [require__utils_cssr_index.c("div", `
 position: absolute;
 top: 50%;
 left: 50%;
 width: 100%;
 height: 100%;
 transform: translate(-50%, -50%);
 `)])])]), require__utils_cssr_index.cM("left", [require__utils_cssr_index.cE("dots", `
 transform: translateY(-50%);
 top: 50%;
 left: 12px;
 flex-direction: column;
 `, [require__utils_cssr_index.cM("line", [require__utils_cssr_index.cE("dot", `
 width: 4px;
 height: var(--n-dot-line-width);
 margin: 4px 0;
 transition:
 height .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 outline: none;
 `, [require__utils_cssr_index.cM("active", `
 height: var(--n-dot-line-width-active);
 `)])])]), require__utils_cssr_index.cE("dot", `
 margin: 4px 0;
 `)]), require__utils_cssr_index.cE("arrow-group", `
 position: absolute;
 display: flex;
 flex-wrap: nowrap;
 `), require__utils_cssr_index.cM("vertical", [require__utils_cssr_index.cE("arrow", `
 transform: rotate(90deg);
 `)]), require__utils_cssr_index.cM("show-arrow", [require__utils_cssr_index.cM("bottom", [require__utils_cssr_index.cE("dots", `
 transform: translateX(0);
 bottom: 18px;
 left: 18px;
 `)]), require__utils_cssr_index.cM("top", [require__utils_cssr_index.cE("dots", `
 transform: translateX(0);
 top: 18px;
 left: 18px;
 `)]), require__utils_cssr_index.cM("left", [require__utils_cssr_index.cE("dots", `
 transform: translateX(0);
 top: 18px;
 left: 18px;
 `)]), require__utils_cssr_index.cM("right", [require__utils_cssr_index.cE("dots", `
 transform: translateX(0);
 top: 18px;
 right: 18px;
 `)])]), require__utils_cssr_index.cM("left", [require__utils_cssr_index.cE("arrow-group", `
 bottom: 12px;
 left: 12px;
 flex-direction: column;
 `, [require__utils_cssr_index.c("> *:first-child", `
 margin-bottom: 12px;
 `)])]), require__utils_cssr_index.cM("right", [require__utils_cssr_index.cE("dots", `
 transform: translateY(-50%);
 top: 50%;
 right: 12px;
 flex-direction: column;
 `, [require__utils_cssr_index.cM("line", [require__utils_cssr_index.cE("dot", `
 width: 4px;
 height: var(--n-dot-line-width);
 margin: 4px 0;
 transition:
 height .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 outline: none;
 `, [require__utils_cssr_index.cM("active", `
 height: var(--n-dot-line-width-active);
 `)])])]), require__utils_cssr_index.cE("dot", `
 margin: 4px 0;
 `), require__utils_cssr_index.cE("arrow-group", `
 bottom: 12px;
 right: 12px;
 flex-direction: column;
 `, [require__utils_cssr_index.c("> *:first-child", `
 margin-bottom: 12px;
 `)])]), require__utils_cssr_index.cM("top", [require__utils_cssr_index.cE("dots", `
 transform: translateX(-50%);
 top: 12px;
 left: 50%;
 `, [require__utils_cssr_index.cM("line", [require__utils_cssr_index.cE("dot", `
 margin: 0 4px;
 `)])]), require__utils_cssr_index.cE("dot", `
 margin: 0 4px;
 `), require__utils_cssr_index.cE("arrow-group", `
 top: 12px;
 right: 12px;
 `, [require__utils_cssr_index.c("> *:first-child", `
 margin-right: 12px;
 `)])]), require__utils_cssr_index.cM("bottom", [require__utils_cssr_index.cE("dots", `
 transform: translateX(-50%);
 bottom: 12px;
 left: 50%;
 `, [require__utils_cssr_index.cM("line", [require__utils_cssr_index.cE("dot", `
 margin: 0 4px;
 `)])]), require__utils_cssr_index.cE("dot", `
 margin: 0 4px;
 `), require__utils_cssr_index.cE("arrow-group", `
 bottom: 12px;
 right: 12px;
 `, [require__utils_cssr_index.c("> *:first-child", `
 margin-right: 12px;
 `)])]), require__utils_cssr_index.cM("fade", [require__utils_cssr_index.cE("slide", `
 position: absolute;
 opacity: 0;
 transition-property: opacity;
 pointer-events: none;
 `, [require__utils_cssr_index.cM("current", `
 opacity: 1;
 pointer-events: auto;
 `)])]), require__utils_cssr_index.cM("card", [require__utils_cssr_index.cE("slides", `
 perspective: 1000px;
 `), require__utils_cssr_index.cE("slide", `
 position: absolute;
 left: 50%;
 opacity: 0;
 transform: translateX(-50%) translateZ(-400px);
 transition-property: opacity, transform;
 `, [require__utils_cssr_index.cM("current", `
 opacity: 1;
 transform: translateX(-50%) translateZ(0);
 z-index: 1;
 `), require__utils_cssr_index.cM("prev", `
 opacity: 0.4;
 transform: translateX(-100%) translateZ(-200px);
 `), require__utils_cssr_index.cM("next", `
 opacity: 0.4;
 transform: translateX(0%) translateZ(-200px);
 `)])])]);
//#endregion
module.exports = index_cssr_default;