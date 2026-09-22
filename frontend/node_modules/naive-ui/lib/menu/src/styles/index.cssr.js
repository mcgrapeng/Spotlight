const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_height_expand_cssr = require("../../../_styles/transitions/fade-in-height-expand.cssr.js");
//#region src/menu/src/styles/index.cssr.ts
const hoverStyleChildren = [require__utils_cssr_index.c("&::before", "background-color: var(--n-item-color-hover);"), require__utils_cssr_index.cE("arrow", `
 color: var(--n-arrow-color-hover);
 `), require__utils_cssr_index.cE("icon", `
 color: var(--n-item-icon-color-hover);
 `), require__utils_cssr_index.cB("menu-item-content-header", `
 color: var(--n-item-text-color-hover);
 `, [require__utils_cssr_index.c("a", `
 color: var(--n-item-text-color-hover);
 `), require__utils_cssr_index.cE("extra", `
 color: var(--n-item-text-color-hover);
 `)])];
const horizontalHoverStyleChildren = [require__utils_cssr_index.cE("icon", `
 color: var(--n-item-icon-color-hover-horizontal);
 `), require__utils_cssr_index.cB("menu-item-content-header", `
 color: var(--n-item-text-color-hover-horizontal);
 `, [require__utils_cssr_index.c("a", `
 color: var(--n-item-text-color-hover-horizontal);
 `), require__utils_cssr_index.cE("extra", `
 color: var(--n-item-text-color-hover-horizontal);
 `)])];
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("menu", `
 background-color: var(--n-color);
 color: var(--n-item-text-color);
 overflow: hidden;
 transition: background-color .3s var(--n-bezier);
 box-sizing: border-box;
 font-size: var(--n-font-size);
 padding-bottom: 6px;
 `, [require__utils_cssr_index.cM("horizontal", `
 max-width: 100%;
 width: 100%;
 display: flex;
 overflow: hidden;
 padding-bottom: 0;
 `, [require__utils_cssr_index.cB("submenu", "margin: 0;"), require__utils_cssr_index.cB("menu-item", "margin: 0;"), require__utils_cssr_index.cB("menu-item-content", `
 padding: 0 20px;
 border-bottom: 2px solid #0000;
 `, [require__utils_cssr_index.c("&::before", "display: none;"), require__utils_cssr_index.cM("selected", "border-bottom: 2px solid var(--n-border-color-horizontal)")]), require__utils_cssr_index.cB("menu-item-content", [require__utils_cssr_index.cM("selected", [require__utils_cssr_index.cE("icon", "color: var(--n-item-icon-color-active-horizontal);"), require__utils_cssr_index.cB("menu-item-content-header", `
 color: var(--n-item-text-color-active-horizontal);
 `, [require__utils_cssr_index.c("a", "color: var(--n-item-text-color-active-horizontal);"), require__utils_cssr_index.cE("extra", "color: var(--n-item-text-color-active-horizontal);")])]), require__utils_cssr_index.cM("child-active", `
 border-bottom: 2px solid var(--n-border-color-horizontal);
 `, [require__utils_cssr_index.cB("menu-item-content-header", `
 color: var(--n-item-text-color-child-active-horizontal);
 `, [require__utils_cssr_index.c("a", `
 color: var(--n-item-text-color-child-active-horizontal);
 `), require__utils_cssr_index.cE("extra", `
 color: var(--n-item-text-color-child-active-horizontal);
 `)]), require__utils_cssr_index.cE("icon", `
 color: var(--n-item-icon-color-child-active-horizontal);
 `)]), require__utils_cssr_index.cNotM("disabled", [require__utils_cssr_index.cNotM("selected, child-active", [require__utils_cssr_index.c("&:focus-within", horizontalHoverStyleChildren)]), require__utils_cssr_index.cM("selected", [hoverStyle(null, [require__utils_cssr_index.cE("icon", "color: var(--n-item-icon-color-active-hover-horizontal);"), require__utils_cssr_index.cB("menu-item-content-header", `
 color: var(--n-item-text-color-active-hover-horizontal);
 `, [require__utils_cssr_index.c("a", "color: var(--n-item-text-color-active-hover-horizontal);"), require__utils_cssr_index.cE("extra", "color: var(--n-item-text-color-active-hover-horizontal);")])])]), require__utils_cssr_index.cM("child-active", [hoverStyle(null, [require__utils_cssr_index.cE("icon", "color: var(--n-item-icon-color-child-active-hover-horizontal);"), require__utils_cssr_index.cB("menu-item-content-header", `
 color: var(--n-item-text-color-child-active-hover-horizontal);
 `, [require__utils_cssr_index.c("a", "color: var(--n-item-text-color-child-active-hover-horizontal);"), require__utils_cssr_index.cE("extra", "color: var(--n-item-text-color-child-active-hover-horizontal);")])])]), hoverStyle("border-bottom: 2px solid var(--n-border-color-horizontal);", horizontalHoverStyleChildren)]), require__utils_cssr_index.cB("menu-item-content-header", [require__utils_cssr_index.c("a", "color: var(--n-item-text-color-horizontal);")])])]), require__utils_cssr_index.cNotM("responsive", [require__utils_cssr_index.cB("menu-item-content-header", `
 overflow: hidden;
 text-overflow: ellipsis;
 `)]), require__utils_cssr_index.cM("collapsed", [require__utils_cssr_index.cB("menu-item-content", [require__utils_cssr_index.cM("selected", [require__utils_cssr_index.c("&::before", `
 background-color: var(--n-item-color-active-collapsed) !important;
 `)]), require__utils_cssr_index.cB("menu-item-content-header", "opacity: 0;"), require__utils_cssr_index.cE("arrow", "opacity: 0;"), require__utils_cssr_index.cE("icon", "color: var(--n-item-icon-color-collapsed);")])]), require__utils_cssr_index.cB("menu-item", `
 height: var(--n-item-height);
 margin-top: 6px;
 position: relative;
 `), require__utils_cssr_index.cB("menu-item-content", `
 box-sizing: border-box;
 line-height: 1.75;
 height: 100%;
 display: grid;
 grid-template-areas: "icon content arrow";
 grid-template-columns: auto 1fr auto;
 align-items: center;
 cursor: pointer;
 position: relative;
 padding-right: 18px;
 transition:
 background-color .3s var(--n-bezier),
 padding-left .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `, [require__utils_cssr_index.c("> *", "z-index: 1;"), require__utils_cssr_index.c("&::before", `
 z-index: auto;
 content: "";
 background-color: #0000;
 position: absolute;
 left: 8px;
 right: 8px;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cM("disabled", `
 opacity: .45;
 cursor: not-allowed;
 `), require__utils_cssr_index.cM("collapsed", [require__utils_cssr_index.cE("arrow", "transform: rotate(0);")]), require__utils_cssr_index.cM("selected", [require__utils_cssr_index.c("&::before", "background-color: var(--n-item-color-active);"), require__utils_cssr_index.cE("arrow", "color: var(--n-arrow-color-active);"), require__utils_cssr_index.cE("icon", "color: var(--n-item-icon-color-active);"), require__utils_cssr_index.cB("menu-item-content-header", `
 color: var(--n-item-text-color-active);
 `, [require__utils_cssr_index.c("a", "color: var(--n-item-text-color-active);"), require__utils_cssr_index.cE("extra", "color: var(--n-item-text-color-active);")])]), require__utils_cssr_index.cM("child-active", [require__utils_cssr_index.cB("menu-item-content-header", `
 color: var(--n-item-text-color-child-active);
 `, [require__utils_cssr_index.c("a", `
 color: var(--n-item-text-color-child-active);
 `), require__utils_cssr_index.cE("extra", `
 color: var(--n-item-text-color-child-active);
 `)]), require__utils_cssr_index.cE("arrow", `
 color: var(--n-arrow-color-child-active);
 `), require__utils_cssr_index.cE("icon", `
 color: var(--n-item-icon-color-child-active);
 `)]), require__utils_cssr_index.cNotM("disabled", [require__utils_cssr_index.cNotM("selected, child-active", [require__utils_cssr_index.c("&:focus-within", hoverStyleChildren)]), require__utils_cssr_index.cM("selected", [hoverStyle(null, [require__utils_cssr_index.cE("arrow", "color: var(--n-arrow-color-active-hover);"), require__utils_cssr_index.cE("icon", "color: var(--n-item-icon-color-active-hover);"), require__utils_cssr_index.cB("menu-item-content-header", `
 color: var(--n-item-text-color-active-hover);
 `, [require__utils_cssr_index.c("a", "color: var(--n-item-text-color-active-hover);"), require__utils_cssr_index.cE("extra", "color: var(--n-item-text-color-active-hover);")])])]), require__utils_cssr_index.cM("child-active", [hoverStyle(null, [require__utils_cssr_index.cE("arrow", "color: var(--n-arrow-color-child-active-hover);"), require__utils_cssr_index.cE("icon", "color: var(--n-item-icon-color-child-active-hover);"), require__utils_cssr_index.cB("menu-item-content-header", `
 color: var(--n-item-text-color-child-active-hover);
 `, [require__utils_cssr_index.c("a", "color: var(--n-item-text-color-child-active-hover);"), require__utils_cssr_index.cE("extra", "color: var(--n-item-text-color-child-active-hover);")])])]), require__utils_cssr_index.cM("selected", [hoverStyle(null, [require__utils_cssr_index.c("&::before", "background-color: var(--n-item-color-active-hover);")])]), hoverStyle(null, hoverStyleChildren)]), require__utils_cssr_index.cE("icon", `
 grid-area: icon;
 color: var(--n-item-icon-color);
 transition:
 color .3s var(--n-bezier),
 font-size .3s var(--n-bezier),
 margin-right .3s var(--n-bezier);
 box-sizing: content-box;
 display: inline-flex;
 align-items: center;
 justify-content: center;
 `), require__utils_cssr_index.cE("arrow", `
 grid-area: arrow;
 font-size: 16px;
 color: var(--n-arrow-color);
 transform: rotate(180deg);
 opacity: 1;
 transition:
 color .3s var(--n-bezier),
 transform 0.2s var(--n-bezier),
 opacity 0.2s var(--n-bezier);
 `), require__utils_cssr_index.cB("menu-item-content-header", `
 grid-area: content;
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 opacity: 1;
 white-space: nowrap;
 color: var(--n-item-text-color);
 `, [require__utils_cssr_index.c("a", `
 outline: none;
 text-decoration: none;
 transition: color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 `, [require__utils_cssr_index.c("&::before", `
 content: "";
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]), require__utils_cssr_index.cE("extra", `
 font-size: .93em;
 color: var(--n-group-text-color);
 transition: color .3s var(--n-bezier);
 `)])]), require__utils_cssr_index.cB("submenu", `
 cursor: pointer;
 position: relative;
 margin-top: 6px;
 `, [require__utils_cssr_index.cB("menu-item-content", `
 height: var(--n-item-height);
 `), require__utils_cssr_index.cB("submenu-children", `
 overflow: hidden;
 padding: 0;
 `, [require__styles_transitions_fade_in_height_expand_cssr.fadeInHeightExpandTransition({
  duration: ".2s"
})])]), require__utils_cssr_index.cB("menu-item-group", [require__utils_cssr_index.cB("menu-item-group-title", `
 margin-top: 6px;
 color: var(--n-group-text-color);
 cursor: default;
 font-size: .93em;
 height: 36px;
 display: flex;
 align-items: center;
 transition:
 padding-left .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)])]), require__utils_cssr_index.cB("menu-tooltip", [require__utils_cssr_index.c("a", `
 color: inherit;
 text-decoration: none;
 `)]), require__utils_cssr_index.cB("menu-divider", `
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-divider-color);
 height: 1px;
 margin: 6px 18px;
 `)]);
function hoverStyle(props, children) {
  return [require__utils_cssr_index.cM("hover", props, children), require__utils_cssr_index.c("&:hover", props, children)];
}
//#endregion
module.exports = index_cssr_default;