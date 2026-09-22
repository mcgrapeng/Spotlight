const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/tag/src/styles/rtl.cssr.ts
var rtl_cssr_default = require__utils_cssr_index.cB("tag", [require__utils_cssr_index.cM("rtl", `
 direction: rtl;
 --n-close-margin: var(--n-close-margin-top) var(--n-close-margin-left) var(--n-close-margin-bottom) var(--n-close-margin-right);
 `, [require__utils_cssr_index.cE("icon", `
 margin: 0 0 0 4px;
 `), require__utils_cssr_index.cE("avatar", `
 margin: 0 0 0 6px;
 `), require__utils_cssr_index.cM("round", [require__utils_cssr_index.cE("icon", `
 margin: 0 calc((var(--n-height) - 8px) / -2) 0 4px;
 `), require__utils_cssr_index.cE("avatar", `
 margin: 0 calc((var(--n-height) - 8px) / -2) 0 6px;
 `), require__utils_cssr_index.cM("closable", `
 padding: 0 calc(var(--n-height) / 3) 0 calc(var(--n-height) / 4);
 `)]), require__utils_cssr_index.cM("icon, avatar", [require__utils_cssr_index.cM("round", `
 padding: 0 calc(var(--n-height) / 2) 0 calc(var(--n-height) / 3);
 `)])])]);
//#endregion
module.exports = rtl_cssr_default;