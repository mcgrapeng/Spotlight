const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_scale_up_cssr = require("../../../_styles/transitions/fade-in-scale-up.cssr.js");
//#region src/tree-select/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("tree-select", `
 z-index: auto;
 outline: none;
 width: 100%;
 position: relative;
 `), require__utils_cssr_index.cB("tree-select-menu", `
 position: relative;
 overflow: hidden;
 margin: 4px 0;
 transition: box-shadow .3s var(--n-bezier), background-color .3s var(--n-bezier);
 border-radius: var(--n-menu-border-radius);
 box-shadow: var(--n-menu-box-shadow);
 background-color: var(--n-menu-color);
 outline: none;
 `, [require__utils_cssr_index.cB("tree", "max-height: var(--n-menu-height);"), require__utils_cssr_index.cE("empty", `
 display: flex;
 padding: 12px 32px;
 flex: 1;
 justify-content: center;
 `), require__utils_cssr_index.cE("header", `
 padding: var(--n-header-padding);
 transition: 
 color .3s var(--n-bezier);
 border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-header-divider-color);
 color: var(--n-header-text-color);
 `), require__utils_cssr_index.cE("action", `
 padding: var(--n-action-padding);
 transition: 
 color .3s var(--n-bezier);
 border-color .3s var(--n-bezier);
 border-top: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `), require__styles_transitions_fade_in_scale_up_cssr.fadeInScaleUpTransition()])]);
//#endregion
module.exports = index_cssr_default;