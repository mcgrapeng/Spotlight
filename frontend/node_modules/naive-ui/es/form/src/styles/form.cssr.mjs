import { c, cB, cM } from "../../../_utils/cssr/index.mjs";
//#region src/form/src/styles/form.cssr.ts
var form_cssr_default = cB("form", [cM("inline", `
 width: 100%;
 display: inline-flex;
 align-items: flex-start;
 align-content: space-around;
 `, [cB("form-item", {
  width: "auto",
  marginRight: "18px"
}, [c("&:last-child", {
  marginRight: 0
})])])]);
//#endregion
export { form_cssr_default as default };