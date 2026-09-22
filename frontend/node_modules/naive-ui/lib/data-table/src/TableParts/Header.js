const require__utils_css_format_length = require("../../../_utils/css/format-length.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require_checkbox_src_Checkbox = require("../../../checkbox/src/Checkbox.js");
const require_data_table_src_interface = require("../interface.js");
const require_data_table_src_utils = require("../utils.js");
const require_ellipsis_src_Ellipsis = require("../../../ellipsis/src/Ellipsis.js");
const require_data_table_src_HeaderButton_FilterButton = require("../HeaderButton/FilterButton.js");
const require_data_table_src_HeaderButton_ResizeButton = require("../HeaderButton/ResizeButton.js");
const require_data_table_src_HeaderButton_SortButton = require("../HeaderButton/SortButton.js");
const require_data_table_src_TableParts_SelectionMenu = require("./SelectionMenu.js");
let seemly = require("seemly");
let vue = require("vue");
let vueuc = require("vueuc");
//#region src/data-table/src/TableParts/Header.tsx
const _hoisted_1 = ["data-n-id"];
const _hoisted_2 = ["colspan"];
const _hoisted_3 = { style: { position: "relative" } };
const _hoisted_4 = ["data-n-id"];
const _hoisted_5 = ["onScroll"];
function renderTitle(column) {
	return typeof column.title === "function" ? column.title(column) : column.title;
}
const VirtualListItemWrapper = (0, vue.defineComponent)({
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		id: {
			type: String,
			required: true
		},
		cols: {
			type: Array,
			required: true
		},
		width: String
	},
	render() {
		const { clsPrefix, id, cols, width } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("table", {
			style: (0, vue.normalizeStyle)({
				tableLayout: "fixed",
				width
			}),
			class: require_vdom.normalizeClass(`${clsPrefix}-data-table-table`)
		}, [(0, vue.createElementVNode)("colgroup", null, [require_vdom.normalizeVNode(() => cols.map((col) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("col", {
			key: col.key,
			style: (0, vue.normalizeStyle)(col.style)
		}, null, 4))))]), (0, vue.createElementVNode)("thead", {
			"data-n-id": id,
			class: require_vdom.normalizeClass(`${clsPrefix}-data-table-thead`)
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 10, _hoisted_1)], 6);
	}
});
var Header_default = (0, vue.defineComponent)({
	name: "DataTableHeader",
	props: { discrete: {
		type: Boolean,
		default: true
	} },
	setup() {
		const { mergedClsPrefixRef, scrollXRef, fixedColumnLeftMapRef, fixedColumnRightMapRef, mergedCurrentPageRef, allRowsCheckedRef, someRowsCheckedRef, rowsRef, colsRef, mergedThemeRef, checkOptionsRef, mergedSortStateRef, componentId, mergedTableLayoutRef, headerCheckboxDisabledRef, virtualScrollHeaderRef, headerHeightRef, onUnstableColumnResize, doUpdateResizableWidth, handleTableHeaderScroll, deriveNextSorter, doUncheckAll, doCheckAll } = (0, vue.inject)(require_data_table_src_interface.dataTableInjectionKey);
		const virtualListRef = (0, vue.ref)();
		const cellElsRef = (0, vue.ref)({});
		function getCellActualWidth(key) {
			return cellElsRef.value[key]?.getBoundingClientRect().width;
		}
		function handleCheckboxUpdateChecked() {
			if (allRowsCheckedRef.value) doUncheckAll();
			else doCheckAll();
		}
		function handleColHeaderClick(e, column) {
			if ((0, seemly.happensIn)(e, "dataTableFilter") || (0, seemly.happensIn)(e, "dataTableResizable")) return;
			if (!require_data_table_src_utils.isColumnSortable(column)) return;
			const activeSorter = mergedSortStateRef.value.find((state) => state.columnKey === column.key) || null;
			const nextSorter = require_data_table_src_utils.createNextSorter(column, activeSorter);
			deriveNextSorter(nextSorter);
		}
		const resizeStartWidthMap = /* @__PURE__ */ new Map();
		function handleColumnResizeStart(column) {
			resizeStartWidthMap.set(column.key, getCellActualWidth(column.key));
		}
		function handleColumnResize(column, displacementX) {
			const startWidth = resizeStartWidthMap.get(column.key);
			if (startWidth === void 0) return;
			const widthAfterResize = startWidth + displacementX;
			const limitWidth = require_data_table_src_utils.clampValueFollowCSSRules(widthAfterResize, column.minWidth, column.maxWidth);
			onUnstableColumnResize(widthAfterResize, limitWidth, column, getCellActualWidth);
			doUpdateResizableWidth(column, limitWidth);
		}
		return {
			cellElsRef,
			componentId,
			mergedSortState: mergedSortStateRef,
			mergedClsPrefix: mergedClsPrefixRef,
			scrollX: scrollXRef,
			fixedColumnLeftMap: fixedColumnLeftMapRef,
			fixedColumnRightMap: fixedColumnRightMapRef,
			currentPage: mergedCurrentPageRef,
			allRowsChecked: allRowsCheckedRef,
			someRowsChecked: someRowsCheckedRef,
			rows: rowsRef,
			cols: colsRef,
			mergedTheme: mergedThemeRef,
			checkOptions: checkOptionsRef,
			mergedTableLayout: mergedTableLayoutRef,
			headerCheckboxDisabled: headerCheckboxDisabledRef,
			headerHeight: headerHeightRef,
			virtualScrollHeader: virtualScrollHeaderRef,
			virtualListRef,
			handleCheckboxUpdateChecked,
			handleColHeaderClick,
			handleTableHeaderScroll,
			handleColumnResizeStart,
			handleColumnResize
		};
	},
	render() {
		const { cellElsRef, mergedClsPrefix, fixedColumnLeftMap, fixedColumnRightMap, currentPage, allRowsChecked, someRowsChecked, rows, cols, mergedTheme, checkOptions, componentId, discrete, mergedTableLayout, headerCheckboxDisabled, mergedSortState, virtualScrollHeader, handleColHeaderClick, handleCheckboxUpdateChecked, handleColumnResizeStart, handleColumnResize } = this;
		let hasEllipsis = false;
		const renderRow = (row, getLeft, headerHeightPx) => row.map(({ column, colIndex, colSpan, rowSpan, isLast }) => {
			const key = require_data_table_src_utils.getColKey(column);
			const { ellipsis } = column;
			if (!hasEllipsis && ellipsis) hasEllipsis = true;
			const createColumnVNode = () => {
				if (column.type === "selection") return column.multiple !== false ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [((0, vue.openBlock)(), (0, vue.createBlock)(require_checkbox_src_Checkbox.default, {
					key: currentPage,
					privateInsideTable: true,
					checked: allRowsChecked,
					indeterminate: someRowsChecked,
					disabled: headerCheckboxDisabled,
					onUpdateChecked: handleCheckboxUpdateChecked
				}, null, 8, [
					"checked",
					"indeterminate",
					"disabled",
					"onUpdateChecked"
				])), checkOptions ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_data_table_src_TableParts_SelectionMenu, {
					key: 0,
					clsPrefix: mergedClsPrefix
				}, null, 8, ["clsPrefix"])) : require_vdom.normalizeVNode(() => null)], 64)) : null;
				return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [
					(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-th__title-wrapper`) }, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-th__title`) }, [ellipsis === true || ellipsis && !ellipsis.tooltip ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 0,
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-th__ellipsis`)
					}, [require_vdom.normalizeVNode(() => renderTitle(column))], 2)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [ellipsis && typeof ellipsis === "object" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_ellipsis_src_Ellipsis.default, (0, vue.mergeProps)({ key: 0 }, ellipsis, {
						theme: mergedTheme.peers.Ellipsis,
						themeOverrides: mergedTheme.peerOverrides.Ellipsis
					}), { default: () => renderTitle(column) }, 1040, ["theme", "themeOverrides"])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => renderTitle(column))], 64))], 64))], 2), require_data_table_src_utils.isColumnSortable(column) ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_data_table_src_HeaderButton_SortButton, {
						key: 0,
						column
					}, null, 8, ["column"])) : require_vdom.normalizeVNode(() => null)], 2),
					require_data_table_src_utils.isColumnFilterable(column) ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_data_table_src_HeaderButton_FilterButton, {
						key: 0,
						column,
						options: column.filterOptions
					}, null, 8, ["column", "options"])) : require_vdom.normalizeVNode(() => null),
					require_data_table_src_utils.isColumnResizable(column) ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_data_table_src_HeaderButton_ResizeButton, {
						key: 2,
						onResizeStart: () => {
							handleColumnResizeStart(column);
						},
						onResize: (displacementX) => {
							handleColumnResize(column, displacementX);
						}
					}, null, 8, ["onResizeStart", "onResize"])) : require_vdom.normalizeVNode(() => null)
				], 64);
			};
			const leftFixed = key in fixedColumnLeftMap;
			const rightFixed = key in fixedColumnRightMap;
			const CellComponent = getLeft && !column.fixed ? "div" : "th";
			return (0, vue.openBlock)(), (0, vue.createBlock)(CellComponent, {
				ref: (el) => cellElsRef[key] = el,
				key,
				style: (0, vue.normalizeStyle)([getLeft && !column.fixed ? {
					position: "absolute",
					left: (0, seemly.pxfy)(getLeft(colIndex)),
					top: 0,
					bottom: 0
				} : {
					left: (0, seemly.pxfy)(fixedColumnLeftMap[key]?.start),
					right: (0, seemly.pxfy)(fixedColumnRightMap[key]?.start)
				}, {
					width: (0, seemly.pxfy)(column.width),
					textAlign: column.titleAlign || column.align,
					height: headerHeightPx
				}]),
				colspan: colSpan,
				rowspan: rowSpan,
				"data-col-key": key,
				class: require_vdom.normalizeClass([
					`${mergedClsPrefix}-data-table-th`,
					(leftFixed || rightFixed) && `${mergedClsPrefix}-data-table-th--fixed-${leftFixed ? "left" : "right"}`,
					{
						[`${mergedClsPrefix}-data-table-th--sorting`]: require_data_table_src_utils.isColumnSorting(column, mergedSortState),
						[`${mergedClsPrefix}-data-table-th--filterable`]: require_data_table_src_utils.isColumnFilterable(column),
						[`${mergedClsPrefix}-data-table-th--sortable`]: require_data_table_src_utils.isColumnSortable(column),
						[`${mergedClsPrefix}-data-table-th--selection`]: column.type === "selection",
						[`${mergedClsPrefix}-data-table-th--last`]: isLast
					},
					column.className
				]),
				onClick: column.type !== "selection" && column.type !== "expand" && !("children" in column) ? (e) => {
					handleColHeaderClick(e, column);
				} : void 0
			}, {
				default: (0, vue.withCtx)(() => [require_vdom.normalizeVNode(() => createColumnVNode())]),
				_: 2
			}, 1032, [
				"style",
				"colspan",
				"rowspan",
				"data-col-key",
				"class",
				"onClick"
			]);
		});
		if (virtualScrollHeader) {
			const { headerHeight } = this;
			let leftFixedColsCount = 0;
			let rightFixedColsCount = 0;
			cols.forEach((col) => {
				if (col.column.fixed === "left") leftFixedColsCount++;
				else if (col.column.fixed === "right") rightFixedColsCount++;
			});
			return (0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VVirtualList, {
				key: 2,
				ref: "virtualListRef",
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-base-table-header`),
				style: (0, vue.normalizeStyle)({ height: (0, seemly.pxfy)(headerHeight) }),
				onScroll: this.handleTableHeaderScroll,
				columns: cols,
				itemSize: headerHeight,
				showScrollbar: false,
				items: [{}],
				itemResizable: false,
				visibleItemsTag: VirtualListItemWrapper,
				visibleItemsProps: {
					clsPrefix: mergedClsPrefix,
					id: componentId,
					cols,
					width: require__utils_css_format_length.formatLength(this.scrollX)
				},
				renderItemWithCols: ({ startColIndex, endColIndex, getLeft }) => {
					const row = cols.map((col, index) => {
						return {
							column: col.column,
							isLast: index === cols.length - 1,
							colIndex: col.index,
							colSpan: 1,
							rowSpan: 1
						};
					}).filter(({ column }, index) => {
						if (startColIndex <= index && index <= endColIndex) return true;
						if (column.fixed) return true;
						return false;
					});
					const cells = renderRow(row, getLeft, (0, seemly.pxfy)(headerHeight));
					cells.splice(leftFixedColsCount, 0, ((0, vue.openBlock)(), (0, vue.createElementBlock)("th", {
						colspan: cols.length - leftFixedColsCount - rightFixedColsCount,
						style: {
							pointerEvents: "none",
							visibility: "hidden",
							height: 0
						}
					}, null, 8, _hoisted_2)));
					return (0, vue.openBlock)(), (0, vue.createElementBlock)("tr", _hoisted_3, [require_vdom.normalizeVNode(() => cells)]);
				}
			}, { default: ({ renderedItemWithCols }) => renderedItemWithCols }, 1032, [
				"class",
				"style",
				"onScroll",
				"columns",
				"itemSize",
				"visibleItemsTag",
				"visibleItemsProps",
				"renderItemWithCols"
			]);
		}
		const theadVNode = ((0, vue.openBlock)(), (0, vue.createElementBlock)("thead", {
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-thead`),
			"data-n-id": componentId
		}, [require_vdom.normalizeVNode(() => rows.map((row) => {
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("tr", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-tr`) }, [require_vdom.normalizeVNode(() => renderRow(row, null, void 0))], 2);
		}))], 10, _hoisted_4));
		if (!discrete) return theadVNode;
		const { handleTableHeaderScroll, scrollX } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-base-table-header`),
			onScroll: handleTableHeaderScroll
		}, [(0, vue.createElementVNode)("table", {
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-table`),
			style: (0, vue.normalizeStyle)({
				minWidth: require__utils_css_format_length.formatLength(scrollX),
				tableLayout: mergedTableLayout
			})
		}, [(0, vue.createElementVNode)("colgroup", null, [require_vdom.normalizeVNode(() => cols.map((col) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("col", {
			key: col.key,
			style: (0, vue.normalizeStyle)(col.style)
		}, null, 4))))]), require_vdom.normalizeVNode(() => theadVNode)], 6)], 42, _hoisted_5);
	}
});
//#endregion
module.exports = Header_default;
