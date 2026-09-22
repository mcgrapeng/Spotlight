import { cB, cE, cM } from "../../../_utils/cssr/index.mjs";
//#region src/collapse/src/styles/rtl.cssr.ts
var rtl_cssr_default = cB("collapse", [cM("rtl", `
 direction: rtl;
 `, [cB("collapse-item", [cB("collapse-item", {
  marginRight: "32px",
  marginLeft: 0
}), cM("left-arrow-placement", [cE("header", [cB("collapse-item-arrow", {
  marginRight: 0,
  marginLeft: "4px"
})])]), cM("right-arrow-placement", [cE("header", [cB("collapse-item-arrow", {
  marginLeft: 0,
  marginRight: "4px"
})])]), cM("active", [cE("header", [cM("active", [cB("collapse-item-arrow", {
  transform: "rotate(-90deg)"
})])])])])])]);
//#endregion
export { rtl_cssr_default as default };