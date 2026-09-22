Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__internal_scrollbar_styles_rtl = require("../../_internal/scrollbar/styles/rtl.js");
const require__internal_select_menu_styles_rtl = require("../../_internal/select-menu/styles/rtl.js");
const require_tag_styles_rtl = require("../../tag/styles/rtl.js");
const require__internal_selection_styles_rtl = require("../../_internal/selection/styles/rtl.js");
//#region src/select/styles/rtl.ts
const selectRtl = {
	name: "Select",
	style: require__utils_cssr_index.c([]),
	peers: [
		require__internal_selection_styles_rtl.internalSelectionRtl,
		require__internal_select_menu_styles_rtl.internalSelectMenuRtl,
		require_tag_styles_rtl.tagRtl,
		require__internal_scrollbar_styles_rtl.default
	]
};
//#endregion
exports.selectRtl = selectRtl;
