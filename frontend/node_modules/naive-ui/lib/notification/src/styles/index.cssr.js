const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/notification/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.c([require__utils_cssr_index.cB("notification-container", `
 z-index: 4000;
 position: fixed;
 overflow: visible;
 display: flex;
 flex-direction: column;
 align-items: flex-end;
 `, [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("scrollbar", `
 width: initial;
 overflow: visible;
 height: -moz-fit-content !important;
 height: fit-content !important;
 max-height: 100vh !important;
 `, [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("scrollbar-container", `
 height: -moz-fit-content !important;
 height: fit-content !important;
 max-height: 100vh !important;
 `, [require__utils_cssr_index.cB("scrollbar-content", `
 padding-top: 12px;
 padding-bottom: 33px;
 `)])])])]), require__utils_cssr_index.cM("top, top-right, top-left", `
 top: 12px;
 `, [require__utils_cssr_index.c("&.transitioning >", [require__utils_cssr_index.cB("scrollbar", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("scrollbar-container", `
 min-height: 100vh !important;
 `)])])])]), require__utils_cssr_index.cM("bottom, bottom-right, bottom-left", `
 bottom: 12px;
 `, [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("scrollbar", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("scrollbar-container", [require__utils_cssr_index.cB("scrollbar-content", `
 padding-bottom: 12px;
 `)])])])]), require__utils_cssr_index.cB("notification-wrapper", `
 display: flex;
 align-items: flex-end;
 margin-bottom: 0;
 margin-top: 12px;
 `)]), require__utils_cssr_index.cM("top, bottom", `
 left: 50%;
 transform: translateX(-50%);
 `, [require__utils_cssr_index.cB("notification-wrapper", [require__utils_cssr_index.c("&.notification-transition-enter-from, &.notification-transition-leave-to", `
 transform: scale(0.85);
 `), require__utils_cssr_index.c("&.notification-transition-leave-from, &.notification-transition-enter-to", `
 transform: scale(1);
 `)])]), require__utils_cssr_index.cM("top", [require__utils_cssr_index.cB("notification-wrapper", `
 transform-origin: top center;
 `)]), require__utils_cssr_index.cM("bottom", [require__utils_cssr_index.cB("notification-wrapper", `
 transform-origin: bottom center;
 `)]), require__utils_cssr_index.cM("top-right, bottom-right", [require__utils_cssr_index.cB("notification", `
 margin-left: 28px;
 margin-right: 16px;
 `)]), require__utils_cssr_index.cM("top-left, bottom-left", [require__utils_cssr_index.cB("notification", `
 margin-left: 16px;
 margin-right: 28px;
 `)]), require__utils_cssr_index.cM("top-right", `
 right: 0;
 `, [placementTransformStyle("top-right")]), require__utils_cssr_index.cM("top-left", `
 left: 0;
 `, [placementTransformStyle("top-left")]), require__utils_cssr_index.cM("bottom-right", `
 right: 0;
 `, [placementTransformStyle("bottom-right")]), require__utils_cssr_index.cM("bottom-left", `
 left: 0;
 `, [placementTransformStyle("bottom-left")]), require__utils_cssr_index.cM("scrollable", [require__utils_cssr_index.cM("top-right", `
 top: 0;
 `), require__utils_cssr_index.cM("top-left", `
 top: 0;
 `), require__utils_cssr_index.cM("bottom-right", `
 bottom: 0;
 `), require__utils_cssr_index.cM("bottom-left", `
 bottom: 0;
 `)]), require__utils_cssr_index.cB("notification-wrapper", `
 margin-bottom: 12px;
 `, [require__utils_cssr_index.c("&.notification-transition-enter-from, &.notification-transition-leave-to", `
 opacity: 0;
 margin-top: 0 !important;
 margin-bottom: 0 !important;
 `), require__utils_cssr_index.c("&.notification-transition-leave-from, &.notification-transition-enter-to", `
 opacity: 1;
 `), require__utils_cssr_index.c("&.notification-transition-leave-active", `
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 transform .3s var(--n-bezier-ease-in),
 max-height .3s var(--n-bezier),
 margin-top .3s linear,
 margin-bottom .3s linear,
 box-shadow .3s var(--n-bezier);
 `), require__utils_cssr_index.c("&.notification-transition-enter-active", `
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 transform .3s var(--n-bezier-ease-out),
 max-height .3s var(--n-bezier),
 margin-top .3s linear,
 margin-bottom .3s linear,
 box-shadow .3s var(--n-bezier);
 `)]), require__utils_cssr_index.cB("notification", `
 background-color: var(--n-color);
 color: var(--n-text-color);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 font-family: inherit;
 font-size: var(--n-font-size);
 font-weight: 400;
 position: relative;
 display: flex;
 overflow: hidden;
 flex-shrink: 0;
 padding-left: var(--n-padding-left);
 padding-right: var(--n-padding-right);
 width: var(--n-width);
 max-width: calc(100vw - 16px - 16px);
 border-radius: var(--n-border-radius);
 box-shadow: var(--n-box-shadow);
 box-sizing: border-box;
 opacity: 1;
 `, [require__utils_cssr_index.cE("avatar", [require__utils_cssr_index.cB("icon", `
 color: var(--n-icon-color);
 `), require__utils_cssr_index.cB("base-icon", `
 color: var(--n-icon-color);
 `)]), require__utils_cssr_index.cM("show-avatar", [require__utils_cssr_index.cB("notification-main", `
 margin-left: 40px;
 width: calc(100% - 40px); 
 `)]), require__utils_cssr_index.cM("closable", [require__utils_cssr_index.cB("notification-main", [require__utils_cssr_index.c("> *:first-child", `
 padding-right: 20px;
 `)]), require__utils_cssr_index.cE("close", `
 position: absolute;
 top: 0;
 right: 0;
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)]), require__utils_cssr_index.cE("avatar", `
 position: absolute;
 top: var(--n-padding-top);
 left: var(--n-padding-left);
 width: 28px;
 height: 28px;
 font-size: 28px;
 display: flex;
 align-items: center;
 justify-content: center;
 `, [require__utils_cssr_index.cB("icon", "transition: color .3s var(--n-bezier);")]), require__utils_cssr_index.cB("notification-main", `
 padding-top: var(--n-padding-top);
 padding-bottom: var(--n-padding-bottom);
 box-sizing: border-box;
 display: flex;
 flex-direction: column;
 margin-left: 8px;
 width: calc(100% - 8px);
 `, [require__utils_cssr_index.cB("notification-main-footer", `
 display: flex;
 align-items: center;
 justify-content: space-between;
 margin-top: 12px;
 `, [require__utils_cssr_index.cE("meta", `
 font-size: var(--n-meta-font-size);
 transition: color .3s var(--n-bezier-ease-out);
 color: var(--n-description-text-color);
 `), require__utils_cssr_index.cE("action", `
 cursor: pointer;
 transition: color .3s var(--n-bezier-ease-out);
 color: var(--n-action-text-color);
 `)]), require__utils_cssr_index.cE("header", `
 font-weight: var(--n-title-font-weight);
 font-size: var(--n-title-font-size);
 transition: color .3s var(--n-bezier-ease-out);
 color: var(--n-title-text-color);
 `), require__utils_cssr_index.cE("description", `
 margin-top: 8px;
 font-size: var(--n-description-font-size);
 white-space: pre-wrap;
 word-wrap: break-word;
 transition: color .3s var(--n-bezier-ease-out);
 color: var(--n-description-text-color);
 `), require__utils_cssr_index.cE("content", `
 line-height: var(--n-line-height);
 margin: 12px 0 0 0;
 font-family: inherit;
 white-space: pre-wrap;
 word-wrap: break-word;
 transition: color .3s var(--n-bezier-ease-out);
 color: var(--n-text-color);
 `, [require__utils_cssr_index.c("&:first-child", "margin: 0;")])])])])]);
function placementTransformStyle(placement) {
  const transformXEnter = placement.split("-")[1] === "left" ? "calc(-100%)" : "calc(100%)";
  return require__utils_cssr_index.cB("notification-wrapper", [require__utils_cssr_index.c("&.notification-transition-enter-from, &.notification-transition-leave-to", `
 transform: translate(${transformXEnter}, 0);
 `), require__utils_cssr_index.c("&.notification-transition-leave-from, &.notification-transition-enter-to", `
 transform: translate(0, 0);
 `)]);
}
//#endregion
module.exports = index_cssr_default;