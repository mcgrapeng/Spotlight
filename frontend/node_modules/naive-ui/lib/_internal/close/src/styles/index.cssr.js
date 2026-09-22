const require__utils_cssr_index = require("../../../../_utils/cssr/index.js");
//#region src/_internal/close/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("base-close", `
 display: flex;
 align-items: center;
 justify-content: center;
 cursor: pointer;
 background-color: transparent;
 color: var(--n-close-icon-color);
 border-radius: var(--n-close-border-radius);
 height: var(--n-close-size);
 width: var(--n-close-size);
 font-size: var(--n-close-icon-size);
 outline: none;
 border: none;
 position: relative;
 padding: 0;
`, [require__utils_cssr_index.cM("absolute", `
 height: var(--n-close-icon-size);
 width: var(--n-close-icon-size);
 `), require__utils_cssr_index.c("&::before", `
 content: "";
 position: absolute;
 width: var(--n-close-size);
 height: var(--n-close-size);
 left: 50%;
 top: 50%;
 transform: translateY(-50%) translateX(-50%);
 transition: inherit;
 border-radius: inherit;
 `), require__utils_cssr_index.cNotM("disabled", [require__utils_cssr_index.c("&:hover", `
 color: var(--n-close-icon-color-hover);
 `), require__utils_cssr_index.c("&:hover::before", `
 background-color: var(--n-close-color-hover);
 `), require__utils_cssr_index.c("&:focus::before", `
 background-color: var(--n-close-color-hover);
 `), require__utils_cssr_index.c("&:active", `
 color: var(--n-close-icon-color-pressed);
 `), require__utils_cssr_index.c("&:active::before", `
 background-color: var(--n-close-color-pressed);
 `)]), require__utils_cssr_index.cM("disabled", `
 cursor: not-allowed;
 color: var(--n-close-icon-color-disabled);
 background-color: transparent;
 `), require__utils_cssr_index.cM("round", [require__utils_cssr_index.c("&::before", `
 border-radius: 50%;
 `)])]);
//#endregion
module.exports = index_cssr_default;