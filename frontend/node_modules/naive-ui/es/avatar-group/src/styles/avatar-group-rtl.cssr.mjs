import { c, cB, cM, cNotM } from "../../../_utils/cssr/index.mjs";
//#region src/avatar-group/src/styles/avatar-group-rtl.cssr.ts
var avatar_group_rtl_cssr_default = cB("avatar-group", [cM("rtl", `
 direction: rtl;
 `, [cNotM("vertical", `
 flex-direction: row;
 `, [cB("avatar", [c("&:not(:first-child)", `
 margin-right: var(--n-gap);
 margin-left: 0;
 `)])])])]);
//#endregion
export { avatar_group_rtl_cssr_default as default };