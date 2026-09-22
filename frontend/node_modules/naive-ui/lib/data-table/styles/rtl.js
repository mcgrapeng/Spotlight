Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__internal_scrollbar_styles_rtl = require("../../_internal/scrollbar/styles/rtl.js");
const require_pagination_styles_rtl = require("../../pagination/styles/rtl.js");
//#region src/data-table/styles/rtl.ts
const DataTableRtl = {
	name: "DataTable",
	style: require("../src/styles/rtl.cssr.js"),
	peers: [require__internal_scrollbar_styles_rtl.default, require_pagination_styles_rtl.paginationRtl]
};
//#endregion
exports.DataTableRtl = DataTableRtl;
