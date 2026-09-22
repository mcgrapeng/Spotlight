const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/layout/src/styles/layout-sider.cssr.ts
var layout_sider_cssr_default = require__utils_cssr_index.cB("layout-sider", `
 flex-shrink: 0;
 box-sizing: border-box;
 position: relative;
 z-index: 1;
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 min-width .3s var(--n-bezier),
 max-width .3s var(--n-bezier),
 transform .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 display: flex;
 justify-content: flex-end;
`, [require__utils_cssr_index.cM("bordered", [require__utils_cssr_index.cE("border", `
 content: "";
 position: absolute;
 top: 0;
 bottom: 0;
 width: 1px;
 background-color: var(--n-border-color);
 transition: background-color .3s var(--n-bezier);
 `)]), require__utils_cssr_index.cE("left-placement", [require__utils_cssr_index.cM("bordered", [require__utils_cssr_index.cE("border", `
 right: 0;
 `)])]), require__utils_cssr_index.cM("right-placement", `
 justify-content: flex-start;
 `, [require__utils_cssr_index.cM("bordered", [require__utils_cssr_index.cE("border", `
 left: 0;
 `)]), require__utils_cssr_index.cM("collapsed", [require__utils_cssr_index.cB("layout-toggle-button", [require__utils_cssr_index.cB("base-icon", `
 transform: rotate(180deg);
 `)]), require__utils_cssr_index.cB("layout-toggle-bar", [require__utils_cssr_index.c("&:hover", [require__utils_cssr_index.cE("top", {
  transform: "rotate(-12deg) scale(1.15) translateY(-2px)"
}), require__utils_cssr_index.cE("bottom", {
  transform: "rotate(12deg) scale(1.15) translateY(2px)"
})])])]), require__utils_cssr_index.cB("layout-toggle-button", `
 left: 0;
 transform: translateX(-50%) translateY(-50%);
 `, [require__utils_cssr_index.cB("base-icon", `
 transform: rotate(0);
 `)]), require__utils_cssr_index.cB("layout-toggle-bar", `
 left: -28px;
 transform: rotate(180deg);
 `, [require__utils_cssr_index.c("&:hover", [require__utils_cssr_index.cE("top", {
  transform: "rotate(12deg) scale(1.15) translateY(-2px)"
}), require__utils_cssr_index.cE("bottom", {
  transform: "rotate(-12deg) scale(1.15) translateY(2px)"
})])])]), require__utils_cssr_index.cM("collapsed", [require__utils_cssr_index.cB("layout-toggle-bar", [require__utils_cssr_index.c("&:hover", [require__utils_cssr_index.cE("top", {
  transform: "rotate(-12deg) scale(1.15) translateY(-2px)"
}), require__utils_cssr_index.cE("bottom", {
  transform: "rotate(12deg) scale(1.15) translateY(2px)"
})])]), require__utils_cssr_index.cB("layout-toggle-button", [require__utils_cssr_index.cB("base-icon", `
 transform: rotate(0);
 `)])]), require__utils_cssr_index.cB("layout-toggle-button", `
 transition:
 color .3s var(--n-bezier),
 right .3s var(--n-bezier),
 left .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 cursor: pointer;
 width: 24px;
 height: 24px;
 position: absolute;
 top: 50%;
 right: 0;
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 font-size: 18px;
 color: var(--n-toggle-button-icon-color);
 border: var(--n-toggle-button-border);
 background-color: var(--n-toggle-button-color);
 box-shadow: 0 2px 4px 0px rgba(0, 0, 0, .06);
 transform: translateX(50%) translateY(-50%);
 z-index: 1;
 `, [require__utils_cssr_index.cB("base-icon", `
 transition: transform .3s var(--n-bezier);
 transform: rotate(180deg);
 `)]), require__utils_cssr_index.cB("layout-toggle-bar", `
 cursor: pointer;
 height: 72px;
 width: 32px;
 position: absolute;
 top: calc(50% - 36px);
 right: -28px;
 `, [require__utils_cssr_index.cE("top, bottom", `
 position: absolute;
 width: 4px;
 border-radius: 2px;
 height: 38px;
 left: 14px;
 transition: 
 background-color .3s var(--n-bezier),
 transform .3s var(--n-bezier);
 `), require__utils_cssr_index.cE("bottom", `
 position: absolute;
 top: 34px;
 `), require__utils_cssr_index.c("&:hover", [require__utils_cssr_index.cE("top", {
  transform: "rotate(12deg) scale(1.15) translateY(-2px)"
}), require__utils_cssr_index.cE("bottom", {
  transform: "rotate(-12deg) scale(1.15) translateY(2px)"
})]), require__utils_cssr_index.cE("top, bottom", {
  backgroundColor: "var(--n-toggle-bar-color)"
}), require__utils_cssr_index.c("&:hover", [require__utils_cssr_index.cE("top, bottom", {
  backgroundColor: "var(--n-toggle-bar-color-hover)"
})])]), require__utils_cssr_index.cE("border", `
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 width: 1px;
 transition: background-color .3s var(--n-bezier);
 `), require__utils_cssr_index.cB("layout-sider-scroll-container", `
 flex-grow: 1;
 flex-shrink: 0;
 box-sizing: border-box;
 height: 100%;
 opacity: 0;
 transition: opacity .3s var(--n-bezier);
 max-width: 100%;
 `), require__utils_cssr_index.cM("show-content", [require__utils_cssr_index.cB("layout-sider-scroll-container", {
  opacity: 1
})]), require__utils_cssr_index.cM("absolute-positioned", `
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 `)]);
//#endregion
module.exports = layout_sider_cssr_default;