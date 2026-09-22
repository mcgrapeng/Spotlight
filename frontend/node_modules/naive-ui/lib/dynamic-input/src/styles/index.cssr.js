const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
//#region src/dynamic-input/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("dynamic-input", {
  width: "100%"
}, [require__utils_cssr_index.cB("dynamic-input-item", `
 margin-bottom: 10px;
 display: flex;
 flex-wrap: nowrap;
 `, [require__utils_cssr_index.cB("dynamic-input-preset-input", {
  flex: 1,
  alignItems: "center"
}), require__utils_cssr_index.cB("dynamic-input-preset-pair", `
 flex: 1;
 display: flex;
 align-items: center;
 `, [require__utils_cssr_index.cB("dynamic-input-pair-input", [require__utils_cssr_index.c("&:first-child", {
  "margin-right": "12px"
})])]), require__utils_cssr_index.cE("action", `
 align-self: flex-start;
 display: flex;
 justify-content: flex-end;
 flex-shrink: 0;
 flex-grow: 0;
 margin: var(--action-margin);
 `, [require__utils_cssr_index.cM("icon", {
  cursor: "pointer"
})]), require__utils_cssr_index.c("&:last-child", {
  marginBottom: 0
})]), require__utils_cssr_index.cB("form-item", `
 padding-top: 0 !important;
 margin-right: 0 !important;
 `, [require__utils_cssr_index.cB("form-item-blank", {
  paddingTop: "0 !important"
})])]);
//#endregion
module.exports = index_cssr_default;