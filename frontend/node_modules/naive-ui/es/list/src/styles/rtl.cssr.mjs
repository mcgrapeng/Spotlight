import { cB, cE, cM } from "../../../_utils/cssr/index.mjs";
//#region src/list/src/styles/rtl.cssr.ts
var rtl_cssr_default = cB("list", [cM("rtl", `
 direction: rtl;
 text-align: right;
 `, [cB("list-item", [cE("prefix", `
 margin-right: 0;
 margin-left: 20px;
 `), cE("suffix", `
 margin-right: 20px;
 margin-left: 0;
 `)])])]);
//#endregion
export { rtl_cssr_default as default };