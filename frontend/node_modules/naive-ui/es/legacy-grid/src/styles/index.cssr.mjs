import { c, cB, cE, cM } from "../../../_utils/cssr/index.mjs";
import { repeat } from "seemly";
//#region src/legacy-grid/src/styles/index.cssr.ts
const positionStyles = repeat(24, null).map((_, index) => {
  const prefixIndex = index + 1;
  const percent = `calc(100% / 24 * ${prefixIndex})`;
  return [cM(`${prefixIndex}-span`, {
    width: percent
  }), cM(`${prefixIndex}-offset`, {
    marginLeft: percent
  }), cM(`${prefixIndex}-push`, {
    left: percent
  }), cM(`${prefixIndex}-pull`, {
    right: percent
  })];
});
var index_cssr_default = c([cB("row", {
  width: "100%",
  display: "flex",
  flexWrap: "wrap"
}), cB("col", {
  verticalAlign: "top",
  boxSizing: "border-box",
  display: "inline-block",
  position: "relative",
  zIndex: "auto"
}, [cE("box", {
  position: "relative",
  zIndex: "auto",
  width: "100%",
  height: "100%"
}), positionStyles])]);
//#endregion
export { index_cssr_default as default };