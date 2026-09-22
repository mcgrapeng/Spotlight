const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/thing/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("thing", `
 display: flex;
 transition: color .3s var(--n-bezier);
 font-size: var(--n-font-size);
 color: var(--n-text-color);
`, [require__utils_cssr_index.cB("thing-avatar", `
 margin-right: 12px;
 margin-top: 2px;
 `), require__utils_cssr_index.cB("thing-avatar-header-wrapper", `
 display: flex;
 flex-wrap: nowrap;
 `, [require__utils_cssr_index.cB("thing-header-wrapper", `
 flex: 1;
 `)]), require__utils_cssr_index.cB("thing-main", `
 flex-grow: 1;
 `, [require__utils_cssr_index.cB("thing-header", `
 display: flex;
 margin-bottom: 4px;
 justify-content: space-between;
 align-items: center;
 `, [require__utils_cssr_index.cE("title", `
 font-size: 16px;
 font-weight: var(--n-title-font-weight);
 transition: color .3s var(--n-bezier);
 color: var(--n-title-text-color);
 `)]), require__utils_cssr_index.cE("description", [require__utils_cssr_index.c("&:not(:last-child)", `
 margin-bottom: 4px;
 `)]), require__utils_cssr_index.cE("content", [require__utils_cssr_index.c("&:not(:first-child)", `
 margin-top: 12px;
 `)]), require__utils_cssr_index.cE("footer", [require__utils_cssr_index.c("&:not(:first-child)", `
 margin-top: 12px;
 `)]), require__utils_cssr_index.cE("action", [require__utils_cssr_index.c("&:not(:first-child)", `
 margin-top: 12px;
 `)])])]);
//#endregion
module.exports = index_cssr_default;