const require__utils_cssr_index = require("../../../../_utils/cssr/index.js");
const require__styles_transitions_fade_in_cssr = require("../../../../_styles/transitions/fade-in.cssr.js");
//#region src/_internal/menu-mask/src/styles/index.cssr.ts
var index_cssr_default = require__utils_cssr_index.cB("base-menu-mask", `
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 align-items: center;
 justify-content: center;
 text-align: center;
 padding: 14px;
 overflow: hidden;
`, [require__styles_transitions_fade_in_cssr.fadeInTransition()]);
//#endregion
module.exports = index_cssr_default;