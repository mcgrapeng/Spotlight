import { c, cB, cM } from "../../../_utils/cssr/index.mjs";
//#region src/icon/src/styles/index.cssr.ts
var index_cssr_default = cB("icon", `
 height: 1em;
 width: 1em;
 line-height: 1em;
 text-align: center;
 display: inline-block;
 position: relative;
 fill: currentColor;
`, [cM("color-transition", {
  transition: "color .3s var(--n-bezier)"
}), cM("depth", {
  color: "var(--n-color)"
}, [c("svg", {
  opacity: "var(--n-opacity)",
  transition: "opacity .3s var(--n-bezier)"
})]), c("svg", {
  height: "1em",
  width: "1em"
})]);
//#endregion
export { index_cssr_default as default };