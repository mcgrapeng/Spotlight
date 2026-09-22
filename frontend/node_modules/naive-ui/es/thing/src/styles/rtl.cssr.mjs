import { cB, cM } from "../../../_utils/cssr/index.mjs";
//#region src/thing/src/styles/rtl.cssr.ts
var rtl_cssr_default = cB("thing", [cM("rtl", `
 direction: rtl;
 text-align: right;
 `, [cB("thing-avatar", `
 margin-left: 12px;
 margin-right: 0;
 `)])]);
//#endregion
export { rtl_cssr_default as default };