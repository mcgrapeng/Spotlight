import { cB } from "../../../_utils/cssr/index.mjs";
//#region src/gradient-text/src/styles/index.cssr.ts
var index_cssr_default = cB("gradient-text", `
 display: inline-block;
 font-weight: var(--n-font-weight);
 -webkit-background-clip: text;
 background-clip: text;
 color: #0000;
 white-space: nowrap;
 background-image: linear-gradient(var(--n-rotate), var(--n-color-start) 0%, var(--n-color-end) 100%);
 transition:
 --n-color-start .3s var(--n-bezier),
 --n-color-end .3s var(--n-bezier);
`);
//#endregion
export { index_cssr_default as default };