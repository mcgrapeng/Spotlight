const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/tabs/src/styles/rtl.cssr.ts
var rtl_cssr_default = require__utils_cssr_index.cB("tabs", [require__utils_cssr_index.cM("rtl", `
 direction: rtl;
 `, [require__utils_cssr_index.cM("left", `
 flex-direction: row-reverse;
 `), require__utils_cssr_index.cM("right", `
 flex-direction: row;
 `), require__utils_cssr_index.cB("tabs-nav", [require__utils_cssr_index.cE("prefix", `
 padding-left: 16px;
 padding-right: 0;
 `), require__utils_cssr_index.cE("suffix", `
 padding-right: 16px;
 padding-left: 0;
 `)]), require__utils_cssr_index.cM("top, bottom", [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("tabs-nav", [require__utils_cssr_index.cB("tabs-nav-scroll-wrapper", [require__utils_cssr_index.c("&::before", `
 left: unset;
 right: 0;
 `), require__utils_cssr_index.c("&::after", `
 right: unset;
 left: 0;
 `), require__utils_cssr_index.cM("shadow-start", [require__utils_cssr_index.c("&::before", `
 box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, .12);
 `)]), require__utils_cssr_index.cM("shadow-end", [require__utils_cssr_index.c("&::after", `
 box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, .12);
 `)])])])])]), require__utils_cssr_index.cB("tab-pane", [require__utils_cssr_index.c("&.next-transition-enter-from, &.prev-transition-leave-to", `
 transform: translateX(-32px);
 `), require__utils_cssr_index.c("&.next-transition-leave-to, &.prev-transition-enter-from", `
 transform: translateX(32px);
 `)]), require__utils_cssr_index.cB("tabs-scroll-button", [require__utils_cssr_index.cM("start", `
 padding-left: 6px;
 padding-right: 10px;
 `), require__utils_cssr_index.cM("end", `
 padding-right: 6px;
 padding-left: 10px;
 `)])])]);
//#endregion
module.exports = rtl_cssr_default;