import { cB, cE, cM } from "../../../_utils/cssr/index.mjs";
//#region src/drawer/src/styles/rtl.cssr.ts
var rtl_cssr_default = cB("drawer", [cM("rtl", `
 direction: rtl;
 text-align: right;
 `, [cB("drawer-content", [cB("drawer-header", [cE("close", `
 margin-left: 0;
 margin-right: 6px;
 `)])])])]);
//#endregion
export { rtl_cssr_default as default };