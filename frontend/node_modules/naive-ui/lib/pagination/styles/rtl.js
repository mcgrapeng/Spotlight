Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_input_styles_rtl = require("../../input/styles/rtl.js");
const require_select_styles_rtl = require("../../select/styles/rtl.js");
//#region src/pagination/styles/rtl.ts
const paginationRtl = {
	name: "Pagination",
	style: require("../src/styles/rtl.cssr.js"),
	peers: [require_input_styles_rtl.inputRtl, require_select_styles_rtl.selectRtl]
};
//#endregion
exports.paginationRtl = paginationRtl;
