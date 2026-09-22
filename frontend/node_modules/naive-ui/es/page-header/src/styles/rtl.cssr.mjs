import { cB, cE, cM } from "../../../_utils/cssr/index.mjs";
//#region src/page-header/src/styles/rtl.cssr.ts
var rtl_cssr_default = cB("page-header-wrapper", [cM("rtl", [cB("page-header-header", `
 direction: rtl;
 `), cB("page-header", `
 direction: rtl;
 `, [cE("back", `
 margin-right: 0;
 margin-left: 16px;
 `), cE("avatar", `
 margin-right: 0;
 margin-left: 12px;
 `), cE("title", `
 margin-right: 0;
 margin-left: 16px;
 `)]), cB("page-header-content", `
 direction: rtl;
 `), cB("page-header-footer", `
 direction: rtl;
 `)])]);
//#endregion
export { rtl_cssr_default as default };