const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/avatar-group/src/styles/avatar-group-rtl.cssr.ts
var avatar_group_rtl_cssr_default = require__utils_cssr_index.cB("avatar-group", [require__utils_cssr_index.cM("rtl", `
 direction: rtl;
 `, [require__utils_cssr_index.cNotM("vertical", `
 flex-direction: row;
 `, [require__utils_cssr_index.cB("avatar", [require__utils_cssr_index.c("&:not(:first-child)", `
 margin-right: var(--n-gap);
 margin-left: 0;
 `)])])])]);
//#endregion
module.exports = avatar_group_rtl_cssr_default;