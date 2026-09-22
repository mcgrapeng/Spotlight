import { c, cB, cE, cM } from "../../../_utils/cssr/index.mjs";
//#region src/button/src/styles/rtl.cssr.ts
var rtl_cssr_default = cB("button", [cM("rtl", `
 direction: rtl;
 `, [cE("icon", {
  margin: "var(--n-icon-margin)",
  marginRight: 0
}), cE("content", [c("~", [cE("icon", {
  margin: "var(--n-icon-margin)",
  marginLeft: 0
})])])])]);
//#endregion
export { rtl_cssr_default as default };