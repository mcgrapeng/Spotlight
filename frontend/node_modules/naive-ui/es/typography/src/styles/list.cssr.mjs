import { c, cB, cM } from "../../../_utils/cssr/index.mjs";
//#region src/typography/src/styles/list.cssr.ts
const liStyle = c("li", {
  transition: "color .3s var(--n-bezier)",
  lineHeight: "var(--n-line-height)",
  margin: "var(--n-li-margin)",
  marginBottom: 0,
  color: "var(--n-text-color)"
});
const childStyle = [c("&:first-child", `
 margin-top: 0;
 `), c("&:last-child", `
 margin-bottom: 0;
 `)];
var list_cssr_default = c([cB("ol", {
  fontSize: "var(--n-font-size)",
  padding: "var(--n-ol-padding)"
}, [cM("align-text", {
  paddingLeft: 0
}), liStyle, childStyle]), cB("ul", {
  fontSize: "var(--n-font-size)",
  padding: "var(--n-ul-padding)"
}, [cM("align-text", {
  paddingLeft: 0
}), liStyle, childStyle])]);
//#endregion
export { list_cssr_default as default };