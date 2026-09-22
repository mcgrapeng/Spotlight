import { c, cB, cM } from "../../../_utils/cssr/index.mjs";
//#region src/typography/src/styles/blockquote.cssr.ts
var blockquote_cssr_default = cB("blockquote", `
 font-size: var(--n-font-size);
 line-height: var(--n-line-height);
 margin: 0;
 margin-top: 12px;
 margin-bottom: 12px;
 box-sizing: border-box;
 padding-left: 12px;
 border-left: 4px solid var(--n-prefix-color);
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
`, [c("&:first-child", {
  marginTop: 0
}), c("&:last-child", {
  marginBottom: 0
}), cM("align-text", {
  marginLeft: "-16px"
})]);
//#endregion
export { blockquote_cssr_default as default };