const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/notification/src/styles/rtl.cssr.ts
var rtl_cssr_default = require__utils_cssr_index.cB("notification", [require__utils_cssr_index.cM("rtl", `
 direction: rtl;
 `, [require__utils_cssr_index.cB("notification-main", `
 margin-left: unset;
 margin-right: 8px;
 `, [require__utils_cssr_index.cE("header", `
 margin: var(--n-icon-margin);
 margin-right: 0;
 `)]), require__utils_cssr_index.cE("avatar", `
 left: unset;
 right: var(--n-padding-left);
 `), require__utils_cssr_index.cM("show-avatar", [require__utils_cssr_index.cB("notification-main", `
 margin-right: 40px;
 margin-reft: unset;
 `)]), require__utils_cssr_index.cM("closable", [require__utils_cssr_index.cB("notification-main", [require__utils_cssr_index.c("> *:first-child", `
 padding-left: 20px;
 padding-right: unset;
 `)]), require__utils_cssr_index.cE("close", `
 right: unset;
 left: 0;
 `)])])]);
//#endregion
module.exports = rtl_cssr_default;