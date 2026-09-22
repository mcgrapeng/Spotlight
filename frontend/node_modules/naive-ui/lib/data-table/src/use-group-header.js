Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_css_format_length = require("../../_utils/css/format-length.js");
const require_data_table_src_utils = require("./utils.js");
let vue = require("vue");
//#region src/data-table/src/use-group-header.ts
function getRowsAndCols(columns, getResizableWidth) {
	const rows = [];
	const cols = [];
	const dataRelatedCols = [];
	const rowItemMap = /* @__PURE__ */ new WeakMap();
	let maxDepth = -1;
	let totalRowSpan = 0;
	let hasEllipsis = false;
	let currentLeafIndex = 0;
	function ensureMaxDepth(columns, currentDepth) {
		if (currentDepth > maxDepth) {
			rows[currentDepth] = [];
			maxDepth = currentDepth;
		}
		columns.forEach((column) => {
			if ("children" in column) ensureMaxDepth(column.children, currentDepth + 1);
			else {
				const key = "key" in column ? column.key : void 0;
				cols.push({
					key: require_data_table_src_utils.getColKey(column),
					style: require_data_table_src_utils.createCustomWidthStyle(column, key !== void 0 ? require__utils_css_format_length.formatLength(getResizableWidth(key)) : void 0),
					column,
					index: currentLeafIndex++,
					width: column.width === void 0 ? 128 : Number(column.width)
				});
				totalRowSpan += 1;
				if (!hasEllipsis) hasEllipsis = !!column.ellipsis;
				dataRelatedCols.push(column);
			}
		});
	}
	ensureMaxDepth(columns, 0);
	currentLeafIndex = 0;
	function ensureColLayout(columns, currentDepth) {
		let hideUntilIndex = 0;
		columns.forEach((column) => {
			if ("children" in column) {
				const cachedCurrentLeafIndex = currentLeafIndex;
				const rowItem = {
					column,
					colIndex: currentLeafIndex,
					colSpan: 0,
					rowSpan: 1,
					isLast: false
				};
				ensureColLayout(column.children, currentDepth + 1);
				column.children.forEach((childColumn) => {
					rowItem.colSpan += rowItemMap.get(childColumn)?.colSpan ?? 0;
				});
				if (cachedCurrentLeafIndex + rowItem.colSpan === totalRowSpan) rowItem.isLast = true;
				rowItemMap.set(column, rowItem);
				rows[currentDepth].push(rowItem);
			} else {
				if (currentLeafIndex < hideUntilIndex) {
					currentLeafIndex += 1;
					return;
				}
				let colSpan = 1;
				if ("titleColSpan" in column) colSpan = column.titleColSpan ?? 1;
				if (colSpan > 1) hideUntilIndex = currentLeafIndex + colSpan;
				const isLast = currentLeafIndex + colSpan === totalRowSpan;
				const rowItem = {
					column,
					colSpan,
					colIndex: currentLeafIndex,
					rowSpan: maxDepth - currentDepth + 1,
					isLast
				};
				rowItemMap.set(column, rowItem);
				rows[currentDepth].push(rowItem);
				currentLeafIndex += 1;
			}
		});
	}
	ensureColLayout(columns, 0);
	return {
		hasEllipsis,
		rows,
		cols,
		dataRelatedCols
	};
}
function useGroupHeader(props, getResizableWidth) {
	const rowsAndCols = (0, vue.computed)(() => getRowsAndCols(props.columns, getResizableWidth));
	return {
		rowsRef: (0, vue.computed)(() => rowsAndCols.value.rows),
		colsRef: (0, vue.computed)(() => rowsAndCols.value.cols),
		hasEllipsisRef: (0, vue.computed)(() => rowsAndCols.value.hasEllipsis),
		dataRelatedColsRef: (0, vue.computed)(() => rowsAndCols.value.dataRelatedCols)
	};
}
//#endregion
exports.useGroupHeader = useGroupHeader;
