const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/popconfirm/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("popconfirm", [require__utils_cssr_index.cE("body", `
 font-size: var(--n-font-size);
 display: flex;
 align-items: center;
 flex-wrap: nowrap;
 position: relative;
 `, [require__utils_cssr_index.cE("icon", `
 display: flex;
 font-size: var(--n-icon-size);
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 margin: 0 8px 0 0;
 `)]), require__utils_cssr_index.cE("action", `
 display: flex;
 justify-content: flex-end;
 `, [require__utils_cssr_index.c("&:not(:first-child)", "margin-top: 8px"), require__utils_cssr_index.cB("button", [require__utils_cssr_index.c("&:not(:last-child)", "margin-right: 8px;")])])]);
//#endregion
module.exports = index_cssr_default;