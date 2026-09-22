import { cB, cM } from "../../../_utils/cssr/index.mjs";
//#region src/layout/src/styles/layout-header.cssr.ts
var layout_header_cssr_default = cB("layout-header", `
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 box-sizing: border-box;
 width: 100%;
 background-color: var(--n-color);
 color: var(--n-text-color);
`, [cM("absolute-positioned", `
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 `), cM("bordered", `
 border-bottom: solid 1px var(--n-border-color);
 `)]);
//#endregion
export { layout_header_cssr_default as default };