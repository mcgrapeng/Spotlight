const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_cssr = require("../../../_styles/transitions/fade-in.cssr.js");
const require__styles_transitions_fade_in_scale_up_cssr = require("../../../_styles/transitions/fade-in-scale-up.cssr.js");
//#region src/image/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.c("body >", [require__utils_cssr_index.cB("image-container", "position: fixed;")]), require__utils_cssr_index.cB("image-preview-container", `
 position: fixed;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 `), require__utils_cssr_index.cB("image-preview-overlay", `
 z-index: -1;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 background: rgba(0, 0, 0, .3);
 `, [require__styles_transitions_fade_in_cssr.fadeInTransition()]), require__utils_cssr_index.cB("image-preview-toolbar", `
 z-index: 1;
 position: absolute;
 left: 50%;
 transform: translateX(-50%);
 border-radius: var(--n-toolbar-border-radius);
 height: 48px;
 bottom: 40px;
 padding: 0 12px;
 background: var(--n-toolbar-color);
 box-shadow: var(--n-toolbar-box-shadow);
 color: var(--n-toolbar-icon-color);
 transition: color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 `, [require__utils_cssr_index.cB("base-icon", `
 padding: 0 8px;
 font-size: 28px;
 cursor: pointer;
 `), require__styles_transitions_fade_in_cssr.fadeInTransition()]), require__utils_cssr_index.cB("image-preview-wrapper", `
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 pointer-events: none;
 `, [require__styles_transitions_fade_in_scale_up_cssr.fadeInScaleUpTransition()]), require__utils_cssr_index.cB("image-preview", `
 user-select: none;
 -webkit-user-select: none;
 pointer-events: all;
 margin: auto;
 max-height: calc(100vh - 32px);
 max-width: calc(100vw - 32px);
 transition: transform .3s var(--n-bezier);
 `), require__utils_cssr_index.cB("image", `
 display: inline-flex;
 max-height: 100%;
 max-width: 100%;
 `, [require__utils_cssr_index.cNotM("preview-disabled", `
 cursor: pointer;
 `), require__utils_cssr_index.c("img", `
 border-radius: inherit;
 `)])]);
//#endregion
module.exports = index_cssr_default;