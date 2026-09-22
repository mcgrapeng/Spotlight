Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_data_table_src_utils = require("./utils.js");
let vue = require("vue");
//#region src/data-table/src/use-resizable.ts
function useResizable() {
	const resizableWidthsRef = (0, vue.ref)({});
	function getResizableWidth(key) {
		return resizableWidthsRef.value[key];
	}
	function doUpdateResizableWidth(column, width) {
		if (require_data_table_src_utils.isColumnResizable(column) && "key" in column) resizableWidthsRef.value[column.key] = width;
	}
	function clearResizableWidth() {
		resizableWidthsRef.value = {};
	}
	return {
		getResizableWidth,
		doUpdateResizableWidth,
		clearResizableWidth
	};
}
//#endregion
exports.useResizable = useResizable;
