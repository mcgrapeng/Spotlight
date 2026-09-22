import { cB, cE, cM } from "../../../_utils/cssr/index.mjs";
//#region src/statistic/src/styles/rtl.cssr.ts
var rtl_cssr_default = cB("statistic", [cM("rtl", `
 direction: rtl;
 text-align: right;
 `, [cB("statistic-value", [cE("prefix", `
 margin: 0 0 0 4px;
 `), cE("suffix", `
 margin: 0 4px 0 0;
 `)])])]);
//#endregion
export { rtl_cssr_default as default };