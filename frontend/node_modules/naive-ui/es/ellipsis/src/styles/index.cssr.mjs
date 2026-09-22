import { cB, cM, cNotM } from "../../../_utils/cssr/index.mjs";
//#region src/ellipsis/src/styles/index.cssr.ts
var index_cssr_default = cB("ellipsis", {
  overflow: "hidden"
}, [cNotM("line-clamp", `
 white-space: nowrap;
 display: inline-block;
 vertical-align: bottom;
 max-width: 100%;
 `), cM("line-clamp", `
 display: -webkit-inline-box;
 -webkit-box-orient: vertical;
 `), cM("cursor-pointer", `
 cursor: pointer;
 `)]);
//#endregion
export { index_cssr_default as default };