const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/input/src/styles/input-group.cssr.ts
var input_group_cssr_default = require__utils_cssr_index.cB("input-group", `
 display: inline-flex;
 width: 100%;
 flex-wrap: nowrap;
 vertical-align: bottom;
`, [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("input", [require__utils_cssr_index.c("&:not(:last-child)", `
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `), require__utils_cssr_index.c("&:not(:first-child)", `
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 margin-left: -1px!important;
 `)]), require__utils_cssr_index.cB("button", [require__utils_cssr_index.c("&:not(:last-child)", `
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `, [require__utils_cssr_index.cE("state-border, border", `
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `)]), require__utils_cssr_index.c("&:not(:first-child)", `
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `, [require__utils_cssr_index.cE("state-border, border", `
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `)])]), require__utils_cssr_index.c("*", [require__utils_cssr_index.c("&:not(:last-child)", `
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `, [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("input", `
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `), require__utils_cssr_index.cB("base-selection", [require__utils_cssr_index.cB("base-selection-label", `
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `), require__utils_cssr_index.cB("base-selection-tags", `
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `), require__utils_cssr_index.cE("box-shadow, border, state-border", `
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `)])])]), require__utils_cssr_index.c("&:not(:first-child)", `
 margin-left: -1px!important;
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `, [require__utils_cssr_index.c(">", [require__utils_cssr_index.cB("input", `
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `), require__utils_cssr_index.cB("base-selection", [require__utils_cssr_index.cB("base-selection-label", `
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `), require__utils_cssr_index.cB("base-selection-tags", `
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `), require__utils_cssr_index.cE("box-shadow, border, state-border", `
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `)])])])])])]);
//#endregion
module.exports = input_group_cssr_default;