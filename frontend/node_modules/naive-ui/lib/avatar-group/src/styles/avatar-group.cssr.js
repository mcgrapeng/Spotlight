const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/avatar-group/src/styles/avatar-group.cssr.ts
var avatar_group_cssr_default = require__utils_cssr_index.cB("avatar-group", `
 flex-wrap: nowrap;
 display: inline-flex;
 position: relative;
`, [require__utils_cssr_index.cM("expand-on-hover", [require__utils_cssr_index.cB("avatar", [require__utils_cssr_index.c("&:not(:first-child)", `
 transition: margin .3s var(--n-bezier);
 `)]), require__utils_cssr_index.c("&:hover", [require__utils_cssr_index.cNotM("vertical", [require__utils_cssr_index.cB("avatar", [require__utils_cssr_index.c("&:not(:first-child)", `
 margin-left: 0 !important;
 `)])]), require__utils_cssr_index.cM("vertical", [require__utils_cssr_index.cB("avatar", [require__utils_cssr_index.c("&:not(:first-child)", `
 margin-top: 0 !important;
 `)])])])]), require__utils_cssr_index.cNotM("vertical", `
 flex-direction: row;
 `, [require__utils_cssr_index.cB("avatar", [require__utils_cssr_index.c("&:not(:first-child)", `
 margin-left: var(--n-gap);
 `)])]), require__utils_cssr_index.cM("vertical", `
 flex-direction: column;
 `, [require__utils_cssr_index.cB("avatar", [require__utils_cssr_index.c("&:not(:first-child)", `
 margin-top: var(--n-gap);
 `)])])]);
//#endregion
module.exports = avatar_group_cssr_default;