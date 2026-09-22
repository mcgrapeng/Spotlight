const require__utils_css_format_length = require("../../../_utils/css/format-length.js");
const require__utils_cssr_index = require("../../../_utils/cssr/index.js");
const require__utils_naive_warn = require("../../../_utils/naive/warn.js");
const require__utils_vue_resolve_slot = require("../../../_utils/vue/resolve-slot.js");
const require_config_provider_src_context = require("../../../config-provider/src/context.js");
const require__mixins_common = require("../../../_mixins/common.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_scrollbar_src_Scrollbar = require("../../../_internal/scrollbar/src/Scrollbar.js");
const require_empty_src_Empty = require("../../../empty/src/Empty.js");
const require_data_table_src_interface = require("../interface.js");
const require_data_table_src_utils = require("../utils.js");
const require_data_table_src_TableParts_BodyCheckbox = require("./BodyCheckbox.js");
const require_data_table_src_TableParts_BodyRadio = require("./BodyRadio.js");
const require_data_table_src_TableParts_Cell = require("./Cell.js");
const require_data_table_src_TableParts_ExpandTrigger = require("./ExpandTrigger.js");
const require_data_table_src_TableParts_Header = require("./Header.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
let vueuc = require("vueuc");
//#region src/data-table/src/TableParts/Body.tsx
const _hoisted_1 = ["onMouseenter", "onMouseleave"];
const _hoisted_2 = ["data-n-id"];
const _hoisted_3 = ["colspan"];
const _hoisted_4 = ["colspan"];
const _hoisted_5 = ["onMouseenter"];
const _hoisted_6 = ["onMouseleave"];
function flatten(rowInfos, expandedRowKeys) {
	const fRows = [];
	function traverse(rs, rootIndex) {
		rs.forEach((r) => {
			if (r.children && expandedRowKeys.has(r.key)) {
				fRows.push({
					tmNode: r,
					striped: false,
					key: r.key,
					index: rootIndex
				});
				traverse(r.children, rootIndex);
			} else fRows.push({
				key: r.key,
				tmNode: r,
				striped: false,
				index: rootIndex
			});
		});
	}
	rowInfos.forEach((rowInfo) => {
		fRows.push(rowInfo);
		const { children } = rowInfo.tmNode;
		if (children && expandedRowKeys.has(rowInfo.key)) traverse(children, rowInfo.index);
	});
	return fRows;
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
		onMouseenter: Function,
		onMouseleave: Function
	},
	render() {
		const { clsPrefix, id, cols, onMouseenter, onMouseleave } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("table", {
			style: { tableLayout: "fixed" },
			class: require_vdom.normalizeClass(`${clsPrefix}-data-table-table`),
			onMouseenter,
			onMouseleave
		}, [(0, vue.createElementVNode)("colgroup", null, [require_vdom.normalizeVNode(() => cols.map((col) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("col", {
			key: col.key,
			style: (0, vue.normalizeStyle)(col.style)
		}, null, 4))))]), (0, vue.createElementVNode)("tbody", {
			"data-n-id": id,
			class: require_vdom.normalizeClass(`${clsPrefix}-data-table-tbody`)
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 10, _hoisted_2)], 42, _hoisted_1);
	}
});
var Body_default = (0, vue.defineComponent)({
	name: "DataTableBody",
	props: {
		onResize: Function,
		showHeader: Boolean,
		flexHeight: Boolean,
		bodyStyle: Object
	},
	setup(props) {
		const { slots: dataTableSlots, bodyWidthRef, mergedExpandedRowKeysRef, mergedClsPrefixRef, mergedThemeRef, scrollXRef, colsRef, paginatedDataRef, rawPaginatedDataRef, fixedColumnLeftMapRef, fixedColumnRightMapRef, mergedCurrentPageRef, rowClassNameRef, leftActiveFixedColKeyRef, leftActiveFixedChildrenColKeysRef, rightActiveFixedColKeyRef, rightActiveFixedChildrenColKeysRef, renderExpandRef, hoverKeyRef, summaryRef, mergedSortStateRef, virtualScrollRef, virtualScrollXRef, heightForRowRef, minRowHeightRef, componentId, mergedTableLayoutRef, childTriggerColIndexRef, indentRef, rowPropsRef, stripedRef, loadingRef, onLoadRef, loadingKeySetRef, expandableRef, stickyExpandedRowsRef, renderExpandIconRef, summaryPlacementRef, treeMateRef, scrollbarPropsRef, setHeaderScrollLeft, doUpdateExpandedRowKeys, handleTableBodyScroll, doCheck, doUncheck, renderCell, xScrollableRef, explicitlyScrollableRef } = (0, vue.inject)(require_data_table_src_interface.dataTableInjectionKey);
		const NConfigProvider = (0, vue.inject)(require_config_provider_src_context.configProviderInjectionKey, null);
		const scrollbarInstRef = (0, vue.ref)(null);
		const virtualListRef = (0, vue.ref)(null);
		const emptyElRef = (0, vue.ref)(null);
		const mergedRenderEmptyRef = (0, vue.computed)(() => {
			return NConfigProvider?.mergedComponentPropsRef.value?.DataTable?.renderEmpty;
		});
		const emptyRef = (0, vooks.useMemo)(() => paginatedDataRef.value.length === 0);
		const shouldDisplayVirtualListRef = (0, vooks.useMemo)(() => virtualScrollRef.value && !emptyRef.value);
		let lastSelectedKey = "";
		const mergedExpandedRowKeySetRef = (0, vue.computed)(() => {
			return new Set(mergedExpandedRowKeysRef.value);
		});
		function getRowInfo(key) {
			return treeMateRef.value.getNode(key)?.rawNode;
		}
		function handleCheckboxUpdateChecked(tmNode, checked, shiftKey) {
			const rowInfo = getRowInfo(tmNode.key);
			if (!rowInfo) {
				require__utils_naive_warn.warn("data-table", `fail to get row data with key ${tmNode.key}`);
				return;
			}
			if (shiftKey) {
				const lastIndex = paginatedDataRef.value.findIndex((item) => item.key === lastSelectedKey);
				if (lastIndex !== -1) {
					const currentIndex = paginatedDataRef.value.findIndex((item) => item.key === tmNode.key);
					const start = Math.min(lastIndex, currentIndex);
					const end = Math.max(lastIndex, currentIndex);
					const rowKeysToCheck = [];
					paginatedDataRef.value.slice(start, end + 1).forEach((r) => {
						if (!r.disabled) rowKeysToCheck.push(r.key);
					});
					if (checked) doCheck(rowKeysToCheck, false, rowInfo);
					else doUncheck(rowKeysToCheck, rowInfo);
					lastSelectedKey = tmNode.key;
					return;
				}
			}
			if (checked) doCheck(tmNode.key, false, rowInfo);
			else doUncheck(tmNode.key, rowInfo);
			lastSelectedKey = tmNode.key;
		}
		function handleRadioUpdateChecked(tmNode) {
			const rowInfo = getRowInfo(tmNode.key);
			if (!rowInfo) {
				require__utils_naive_warn.warn("data-table", `fail to get row data with key ${tmNode.key}`);
				return;
			}
			doCheck(tmNode.key, true, rowInfo);
		}
		function getScrollContainer() {
			if (shouldDisplayVirtualListRef.value) return virtualListContainer();
			const { value } = scrollbarInstRef;
			if (value) return value.containerRef;
			return null;
		}
		function handleUpdateExpanded(key, tmNode) {
			if (loadingKeySetRef.value.has(key)) return;
			const { value: mergedExpandedRowKeys } = mergedExpandedRowKeysRef;
			const index = mergedExpandedRowKeys.indexOf(key);
			const nextExpandedKeys = Array.from(mergedExpandedRowKeys);
			if (~index) {
				nextExpandedKeys.splice(index, 1);
				doUpdateExpandedRowKeys(nextExpandedKeys);
			} else if (tmNode && !tmNode.isLeaf && !tmNode.shallowLoaded) {
				loadingKeySetRef.value.add(key);
				onLoadRef.value?.(tmNode.rawNode).then(() => {
					const { value: futureMergedExpandedRowKeys } = mergedExpandedRowKeysRef;
					const futureNextExpandedKeys = Array.from(futureMergedExpandedRowKeys);
					if (!~futureNextExpandedKeys.indexOf(key)) futureNextExpandedKeys.push(key);
					doUpdateExpandedRowKeys(futureNextExpandedKeys);
				}).finally(() => {
					loadingKeySetRef.value.delete(key);
				});
			} else {
				nextExpandedKeys.push(key);
				doUpdateExpandedRowKeys(nextExpandedKeys);
			}
		}
		function handleMouseleaveTable() {
			hoverKeyRef.value = null;
		}
		function virtualListContainer() {
			const { value } = virtualListRef;
			return value?.listElRef || null;
		}
		function virtualListContent() {
			const { value } = virtualListRef;
			return value?.itemsElRef || null;
		}
		function handleVirtualListScroll(e) {
			handleTableBodyScroll(e);
			scrollbarInstRef.value?.sync();
		}
		function handleVirtualListResize(e) {
			const { onResize } = props;
			if (onResize) onResize(e);
			scrollbarInstRef.value?.sync();
		}
		const exposedMethods = {
			getScrollContainer,
			scrollTo(arg0, arg1) {
				if (virtualScrollRef.value) virtualListRef.value?.scrollTo(arg0, arg1);
				else scrollbarInstRef.value?.scrollTo(arg0, arg1);
			}
		};
		const style = require__utils_cssr_index.c([({ props: cProps }) => {
			const createActiveLeftFixedStyle = (leftActiveFixedColKey) => {
				if (leftActiveFixedColKey === null) return null;
				return require__utils_cssr_index.c(`[data-n-id="${cProps.componentId}"] [data-col-key="${leftActiveFixedColKey}"]::after`, { boxShadow: "var(--n-box-shadow-after)" });
			};
			const createActiveRightFixedStyle = (rightActiveFixedColKey) => {
				if (rightActiveFixedColKey === null) return null;
				return require__utils_cssr_index.c(`[data-n-id="${cProps.componentId}"] [data-col-key="${rightActiveFixedColKey}"]::before`, { boxShadow: "var(--n-box-shadow-before)" });
			};
			return require__utils_cssr_index.c([
				createActiveLeftFixedStyle(cProps.leftActiveFixedColKey),
				createActiveRightFixedStyle(cProps.rightActiveFixedColKey),
				cProps.leftActiveFixedChildrenColKeys.map((leftActiveFixedColKey) => createActiveLeftFixedStyle(leftActiveFixedColKey)),
				cProps.rightActiveFixedChildrenColKeys.map((rightActiveFixedColKey) => createActiveRightFixedStyle(rightActiveFixedColKey))
			]);
		}]);
		let fixedStyleMounted = false;
		(0, vue.watchEffect)(() => {
			const { value: leftActiveFixedColKey } = leftActiveFixedColKeyRef;
			const { value: leftActiveFixedChildrenColKeys } = leftActiveFixedChildrenColKeysRef;
			const { value: rightActiveFixedColKey } = rightActiveFixedColKeyRef;
			const { value: rightActiveFixedChildrenColKeys } = rightActiveFixedChildrenColKeysRef;
			if (!fixedStyleMounted && leftActiveFixedColKey === null && rightActiveFixedColKey === null) return;
			const cProps = {
				leftActiveFixedColKey,
				leftActiveFixedChildrenColKeys,
				rightActiveFixedColKey,
				rightActiveFixedChildrenColKeys,
				componentId
			};
			style.mount({
				id: `n-${componentId}`,
				force: true,
				props: cProps,
				anchorMetaName: require__mixins_common.cssrAnchorMetaName,
				parent: NConfigProvider?.styleMountTarget
			});
			fixedStyleMounted = true;
		});
		(0, vue.onUnmounted)(() => {
			style.unmount({
				id: `n-${componentId}`,
				parent: NConfigProvider?.styleMountTarget
			});
		});
		return {
			bodyWidth: bodyWidthRef,
			summaryPlacement: summaryPlacementRef,
			dataTableSlots,
			componentId,
			scrollbarInstRef,
			virtualListRef,
			emptyElRef,
			summary: summaryRef,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedTheme: mergedThemeRef,
			mergedRenderEmpty: mergedRenderEmptyRef,
			scrollX: scrollXRef,
			cols: colsRef,
			loading: loadingRef,
			shouldDisplayVirtualList: shouldDisplayVirtualListRef,
			empty: emptyRef,
			paginatedDataAndInfo: (0, vue.computed)(() => {
				const { value: striped } = stripedRef;
				let hasChildren = false;
				return {
					data: paginatedDataRef.value.map(striped ? (tmNode, index) => {
						if (!tmNode.isLeaf) hasChildren = true;
						return {
							tmNode,
							key: tmNode.key,
							striped: index % 2 === 1,
							index
						};
					} : (tmNode, index) => {
						if (!tmNode.isLeaf) hasChildren = true;
						return {
							tmNode,
							key: tmNode.key,
							striped: false,
							index
						};
					}),
					hasChildren
				};
			}),
			rawPaginatedData: rawPaginatedDataRef,
			fixedColumnLeftMap: fixedColumnLeftMapRef,
			fixedColumnRightMap: fixedColumnRightMapRef,
			currentPage: mergedCurrentPageRef,
			rowClassName: rowClassNameRef,
			renderExpand: renderExpandRef,
			mergedExpandedRowKeySet: mergedExpandedRowKeySetRef,
			hoverKey: hoverKeyRef,
			mergedSortState: mergedSortStateRef,
			virtualScroll: virtualScrollRef,
			virtualScrollX: virtualScrollXRef,
			heightForRow: heightForRowRef,
			minRowHeight: minRowHeightRef,
			mergedTableLayout: mergedTableLayoutRef,
			childTriggerColIndex: childTriggerColIndexRef,
			indent: indentRef,
			rowProps: rowPropsRef,
			loadingKeySet: loadingKeySetRef,
			expandable: expandableRef,
			stickyExpandedRows: stickyExpandedRowsRef,
			renderExpandIcon: renderExpandIconRef,
			scrollbarProps: scrollbarPropsRef,
			setHeaderScrollLeft,
			handleVirtualListScroll,
			handleVirtualListResize,
			handleMouseleaveTable,
			virtualListContainer,
			virtualListContent,
			handleTableBodyScroll,
			handleCheckboxUpdateChecked,
			handleRadioUpdateChecked,
			handleUpdateExpanded,
			renderCell,
			explicitlyScrollable: explicitlyScrollableRef,
			xScrollable: xScrollableRef,
			...exposedMethods
		};
	},
	render() {
		const { mergedTheme, scrollX, mergedClsPrefix, explicitlyScrollable, xScrollable, loadingKeySet, onResize, setHeaderScrollLeft, empty, shouldDisplayVirtualList } = this;
		const contentStyle = { minWidth: require__utils_css_format_length.formatLength(scrollX) || "100%" };
		if (scrollX) contentStyle.width = "100%";
		const createEmptyNode = () => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-data-table-empty`, this.loading && `${mergedClsPrefix}-data-table-empty--hide`]),
			style: (0, vue.normalizeStyle)([this.bodyStyle, xScrollable ? "position: sticky; left: 0; width: var(--n-scrollbar-current-width);" : void 0]),
			ref: "emptyElRef"
		}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(this.dataTableSlots.empty, () => {
			return [this.mergedRenderEmpty?.() || ((0, vue.openBlock)(), (0, vue.createBlock)(require_empty_src_Empty.default, {
				theme: this.mergedTheme.peers.Empty,
				themeOverrides: this.mergedTheme.peerOverrides.Empty
			}, null, 8, ["theme", "themeOverrides"]))];
		}))], 6));
		return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, (0, vue.mergeProps)(this.scrollbarProps, {
			ref: "scrollbarInstRef",
			scrollable: explicitlyScrollable || xScrollable,
			class: `${mergedClsPrefix}-data-table-base-table-body`,
			style: !empty ? this.bodyStyle : void 0,
			theme: mergedTheme.peers.Scrollbar,
			themeOverrides: mergedTheme.peerOverrides.Scrollbar,
			contentStyle,
			container: shouldDisplayVirtualList ? this.virtualListContainer : void 0,
			content: shouldDisplayVirtualList ? this.virtualListContent : void 0,
			horizontalRailStyle: { zIndex: 3 },
			verticalRailStyle: { zIndex: 3 },
			internalExposeWidthCssVar: xScrollable && empty,
			xScrollable,
			onScroll: shouldDisplayVirtualList ? void 0 : this.handleTableBodyScroll,
			internalOnUpdateScrollLeft: setHeaderScrollLeft,
			onResize
		}), { default: () => {
			if (this.empty && !this.showHeader && (this.explicitlyScrollable || this.xScrollable)) return createEmptyNode();
			const cordToPass = {};
			const cordKey = {};
			const { cols, paginatedDataAndInfo, mergedTheme, fixedColumnLeftMap, fixedColumnRightMap, currentPage, rowClassName, mergedSortState, mergedExpandedRowKeySet, stickyExpandedRows, componentId, childTriggerColIndex, expandable, rowProps, handleMouseleaveTable, renderExpand, summary, handleCheckboxUpdateChecked, handleRadioUpdateChecked, handleUpdateExpanded, heightForRow, minRowHeight, virtualScrollX } = this;
			const { length: colCount } = cols;
			let mergedData;
			const { data: paginatedData, hasChildren } = paginatedDataAndInfo;
			const mergedPaginationData = hasChildren ? flatten(paginatedData, mergedExpandedRowKeySet) : paginatedData;
			if (summary) {
				const summaryRows = summary(this.rawPaginatedData);
				if (Array.isArray(summaryRows)) {
					const summaryRowData = summaryRows.map((row, i) => ({
						isSummaryRow: true,
						key: `__n_summary__${i}`,
						tmNode: {
							rawNode: row,
							disabled: true
						},
						index: -1
					}));
					mergedData = this.summaryPlacement === "top" ? [...summaryRowData, ...mergedPaginationData] : [...mergedPaginationData, ...summaryRowData];
				} else {
					const summaryRowData = {
						isSummaryRow: true,
						key: "__n_summary__",
						tmNode: {
							rawNode: summaryRows,
							disabled: true
						},
						index: -1
					};
					mergedData = this.summaryPlacement === "top" ? [summaryRowData, ...mergedPaginationData] : [...mergedPaginationData, summaryRowData];
				}
			} else mergedData = mergedPaginationData;
			const indentStyle = hasChildren ? { width: (0, seemly.pxfy)(this.indent) } : void 0;
			const displayedData = [];
			mergedData.forEach((rowInfo) => {
				if (renderExpand && mergedExpandedRowKeySet.has(rowInfo.key) && (!expandable || expandable(rowInfo.tmNode.rawNode))) displayedData.push(rowInfo, {
					isExpandedRow: true,
					key: `${rowInfo.key}-expand`,
					tmNode: rowInfo.tmNode,
					index: rowInfo.index
				});
				else displayedData.push(rowInfo);
			});
			const { length: rowCount } = displayedData;
			const rowIndexToKey = {};
			paginatedData.forEach(({ tmNode }, rowIndex) => {
				rowIndexToKey[rowIndex] = tmNode.key;
			});
			const bodyWidth = stickyExpandedRows ? this.bodyWidth : null;
			const bodyWidthPx = bodyWidth === null ? void 0 : `${bodyWidth}px`;
			const CellComponent = this.virtualScrollX ? "div" : "td";
			let leftFixedColsCount = 0;
			let rightFixedColsCount = 0;
			if (virtualScrollX) cols.forEach((col) => {
				if (col.column.fixed === "left") leftFixedColsCount++;
				else if (col.column.fixed === "right") rightFixedColsCount++;
			});
			const renderRow = ({ rowInfo, displayedRowIndex, isVirtual, isVirtualX, startColIndex, endColIndex, getLeft }) => {
				const { index: actualRowIndex } = rowInfo;
				if ("isExpandedRow" in rowInfo) {
					const { tmNode: { key, rawNode } } = rowInfo;
					return (0, vue.openBlock)(), (0, vue.createElementBlock)("tr", {
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-tr ${mergedClsPrefix}-data-table-tr--expanded`),
						key: `${key}__expand`
					}, [(0, vue.createElementVNode)("td", {
						class: require_vdom.normalizeClass([
							`${mergedClsPrefix}-data-table-td`,
							`${mergedClsPrefix}-data-table-td--last-col`,
							displayedRowIndex + 1 === rowCount && `${mergedClsPrefix}-data-table-td--last-row`
						]),
						colspan: colCount
					}, [stickyExpandedRows ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 0,
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-expand`),
						style: (0, vue.normalizeStyle)({ width: bodyWidthPx })
					}, [require_vdom.normalizeVNode(() => renderExpand(rawNode, actualRowIndex))], 6)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => renderExpand(rawNode, actualRowIndex))], 64))], 10, _hoisted_3)], 2);
				}
				const isSummary = "isSummaryRow" in rowInfo;
				const striped = !isSummary && rowInfo.striped;
				const { tmNode, key: rowKey } = rowInfo;
				const { rawNode: rowData } = tmNode;
				const expanded = mergedExpandedRowKeySet.has(rowKey);
				const props = rowProps ? rowProps(rowData, actualRowIndex) : void 0;
				const mergedRowClassName = typeof rowClassName === "string" ? rowClassName : require_data_table_src_utils.createRowClassName(rowData, actualRowIndex, rowClassName);
				const iteratedCols = isVirtualX ? cols.filter((col, index) => {
					if (startColIndex <= index && index <= endColIndex) return true;
					if (col.column.fixed) return true;
					return false;
				}) : cols;
				const virtualXRowHeight = isVirtualX ? (0, seemly.pxfy)(heightForRow?.(rowData, actualRowIndex) || minRowHeight) : void 0;
				const cells = iteratedCols.map((col) => {
					const colIndex = col.index;
					if (displayedRowIndex in cordToPass) {
						const cordOfRowToPass = cordToPass[displayedRowIndex];
						const indexInCordOfRowToPass = cordOfRowToPass.indexOf(colIndex);
						if (~indexInCordOfRowToPass) {
							cordOfRowToPass.splice(indexInCordOfRowToPass, 1);
							return null;
						}
					}
					const { column } = col;
					const colKey = require_data_table_src_utils.getColKey(col);
					const { rowSpan, colSpan } = column;
					const mergedColSpan = isSummary ? rowInfo.tmNode.rawNode[colKey]?.colSpan || 1 : colSpan ? colSpan(rowData, actualRowIndex) : 1;
					const mergedRowSpan = isSummary ? rowInfo.tmNode.rawNode[colKey]?.rowSpan || 1 : rowSpan ? rowSpan(rowData, actualRowIndex) : 1;
					const isLastCol = colIndex + mergedColSpan === colCount;
					const isLastRow = displayedRowIndex + mergedRowSpan === rowCount;
					const isCrossRowTd = mergedRowSpan > 1;
					if (isCrossRowTd) cordKey[displayedRowIndex] = { [colIndex]: [] };
					if (mergedColSpan > 1 || isCrossRowTd) for (let i = displayedRowIndex; i < displayedRowIndex + mergedRowSpan; ++i) {
						if (isCrossRowTd) cordKey[displayedRowIndex][colIndex].push(rowIndexToKey[i]);
						for (let j = colIndex; j < colIndex + mergedColSpan; ++j) {
							if (i === displayedRowIndex && j === colIndex) continue;
							if (!(i in cordToPass)) cordToPass[i] = [j];
							else cordToPass[i].push(j);
						}
					}
					const hoverKey = isCrossRowTd ? this.hoverKey : null;
					const { cellProps } = column;
					const resolvedCellProps = cellProps?.(rowData, actualRowIndex);
					const indentOffsetStyle = { "--indent-offset": "" };
					const FinalCellComponent = column.fixed ? "td" : CellComponent;
					return (0, vue.openBlock)(), (0, vue.createBlock)(FinalCellComponent, (0, vue.mergeProps)(resolvedCellProps, {
						key: colKey,
						style: [
							{
								textAlign: column.align || void 0,
								width: (0, seemly.pxfy)(column.width)
							},
							isVirtualX && { height: virtualXRowHeight },
							isVirtualX && !column.fixed ? {
								position: "absolute",
								left: (0, seemly.pxfy)(getLeft(colIndex)),
								top: 0,
								bottom: 0
							} : {
								left: (0, seemly.pxfy)(fixedColumnLeftMap[colKey]?.start),
								right: (0, seemly.pxfy)(fixedColumnRightMap[colKey]?.start)
							},
							indentOffsetStyle,
							resolvedCellProps?.style || ""
						],
						colspan: mergedColSpan,
						rowspan: isVirtual ? void 0 : mergedRowSpan,
						"data-col-key": colKey,
						class: [
							`${mergedClsPrefix}-data-table-td`,
							column.className,
							resolvedCellProps?.class,
							isSummary && `${mergedClsPrefix}-data-table-td--summary`,
							hoverKey !== null && cordKey[displayedRowIndex][colIndex].includes(hoverKey) && `${mergedClsPrefix}-data-table-td--hover`,
							require_data_table_src_utils.isColumnSorting(column, mergedSortState) && `${mergedClsPrefix}-data-table-td--sorting`,
							column.fixed && `${mergedClsPrefix}-data-table-td--fixed-${column.fixed}`,
							column.align && `${mergedClsPrefix}-data-table-td--${column.align}-align`,
							column.type === "selection" && `${mergedClsPrefix}-data-table-td--selection`,
							column.type === "expand" && `${mergedClsPrefix}-data-table-td--expand`,
							isLastCol && `${mergedClsPrefix}-data-table-td--last-col`,
							isLastRow && `${mergedClsPrefix}-data-table-td--last-row`
						]
					}), {
						default: (0, vue.withCtx)(() => [hasChildren && colIndex === childTriggerColIndex ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => [(0, seemly.repeat)(indentOffsetStyle["--indent-offset"] = isSummary ? 0 : rowInfo.tmNode.level, ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
							class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-indent`),
							style: (0, vue.normalizeStyle)(indentStyle)
						}, null, 6))), isSummary || rowInfo.tmNode.isLeaf ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
							key: 2,
							class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-expand-placeholder`)
						}, null, 2)) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_data_table_src_TableParts_ExpandTrigger, {
							key: 3,
							class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-expand-trigger`),
							clsPrefix: mergedClsPrefix,
							expanded,
							rowData,
							renderExpandIcon: this.renderExpandIcon,
							loading: loadingKeySet.has(rowInfo.key),
							onClick: () => {
								handleUpdateExpanded(rowKey, rowInfo.tmNode);
							}
						}, null, 8, [
							"class",
							"clsPrefix",
							"expanded",
							"rowData",
							"renderExpandIcon",
							"loading",
							"onClick"
						]))])], 64)) : require_vdom.normalizeVNode(() => null), column.type === "selection" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 2 }, [!isSummary ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [column.multiple === false ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_data_table_src_TableParts_BodyRadio, {
							key: currentPage,
							rowKey,
							disabled: rowInfo.tmNode.disabled,
							onUpdateChecked: () => {
								handleRadioUpdateChecked(rowInfo.tmNode);
							}
						}, null, 8, [
							"rowKey",
							"disabled",
							"onUpdateChecked"
						])) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_data_table_src_TableParts_BodyCheckbox, {
							key: currentPage,
							rowKey,
							disabled: rowInfo.tmNode.disabled,
							onUpdateChecked: (checked, e) => {
								handleCheckboxUpdateChecked(rowInfo.tmNode, checked, e.shiftKey);
							}
						}, null, 8, [
							"rowKey",
							"disabled",
							"onUpdateChecked"
						]))], 64)) : require_vdom.normalizeVNode(() => null)], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 3 }, [column.type === "expand" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [!isSummary ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [!column.expandable || column.expandable?.(rowData) ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_data_table_src_TableParts_ExpandTrigger, {
							key: 0,
							clsPrefix: mergedClsPrefix,
							rowData,
							expanded,
							renderExpandIcon: this.renderExpandIcon,
							onClick: () => {
								handleUpdateExpanded(rowKey, null);
							}
						}, null, 8, [
							"clsPrefix",
							"rowData",
							"expanded",
							"renderExpandIcon",
							"onClick"
						])) : require_vdom.normalizeVNode(() => null)], 64)) : require_vdom.normalizeVNode(() => null)], 64)) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_data_table_src_TableParts_Cell, {
							key: 1,
							clsPrefix: mergedClsPrefix,
							index: actualRowIndex,
							row: rowData,
							column,
							isSummary,
							mergedTheme,
							renderCell: this.renderCell
						}, null, 8, [
							"clsPrefix",
							"index",
							"row",
							"column",
							"isSummary",
							"mergedTheme",
							"renderCell"
						]))], 64))]),
						_: 2
					}, 1040, [
						"style",
						"colspan",
						"rowspan",
						"data-col-key",
						"class"
					]);
				});
				if (isVirtualX) {
					if (leftFixedColsCount && rightFixedColsCount) cells.splice(leftFixedColsCount, 0, ((0, vue.openBlock)(), (0, vue.createElementBlock)("td", {
						key: 4,
						colspan: cols.length - leftFixedColsCount - rightFixedColsCount,
						style: {
							pointerEvents: "none",
							visibility: "hidden",
							height: 0
						}
					}, null, 8, _hoisted_4)));
				}
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("tr", (0, vue.mergeProps)(props, {
					onMouseenter: (e) => {
						this.hoverKey = rowKey;
						props?.onMouseenter?.(e);
					},
					key: rowKey,
					class: [
						`${mergedClsPrefix}-data-table-tr`,
						isSummary && `${mergedClsPrefix}-data-table-tr--summary`,
						striped && `${mergedClsPrefix}-data-table-tr--striped`,
						expanded && `${mergedClsPrefix}-data-table-tr--expanded`,
						mergedRowClassName,
						props?.class
					],
					style: [props?.style, isVirtualX && { height: virtualXRowHeight }]
				}), [require_vdom.normalizeVNode(() => cells)], 16, _hoisted_5);
			};
			if (!this.shouldDisplayVirtualList) return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 5 }, [(0, vue.createElementVNode)("table", {
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-table`),
				onMouseleave: handleMouseleaveTable,
				style: (0, vue.normalizeStyle)({ tableLayout: this.mergedTableLayout })
			}, [
				(0, vue.createElementVNode)("colgroup", null, [require_vdom.normalizeVNode(() => cols.map((col) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("col", {
					key: col.key,
					style: (0, vue.normalizeStyle)(col.style)
				}, null, 4))))]),
				this.showHeader ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_data_table_src_TableParts_Header, {
					key: 0,
					discrete: false
				})) : require_vdom.normalizeVNode(() => null),
				!this.empty ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("tbody", {
					key: 2,
					"data-n-id": componentId,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-tbody`)
				}, [require_vdom.normalizeVNode(() => displayedData.map((rowInfo, displayedRowIndex) => {
					return renderRow({
						rowInfo,
						displayedRowIndex,
						isVirtual: false,
						isVirtualX: false,
						startColIndex: -1,
						endColIndex: -1,
						getLeft(_index) {
							return -1;
						}
					});
				}))], 10, ["data-n-id"])) : require_vdom.normalizeVNode(() => null)
			], 46, _hoisted_6), this.empty ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => createEmptyNode())], 64)) : require_vdom.normalizeVNode(() => null)], 64);
			else return (0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VirtualList, {
				key: 6,
				ref: "virtualListRef",
				items: displayedData,
				itemSize: this.minRowHeight,
				visibleItemsTag: VirtualListItemWrapper,
				visibleItemsProps: {
					clsPrefix: mergedClsPrefix,
					id: componentId,
					cols,
					onMouseleave: handleMouseleaveTable
				},
				showScrollbar: false,
				onResize: this.handleVirtualListResize,
				onScroll: this.handleVirtualListScroll,
				itemsStyle: contentStyle,
				itemResizable: !virtualScrollX,
				columns: cols,
				renderItemWithCols: virtualScrollX ? ({ itemIndex, item, startColIndex, endColIndex, getLeft }) => {
					return renderRow({
						displayedRowIndex: itemIndex,
						isVirtual: true,
						isVirtualX: true,
						rowInfo: item,
						startColIndex,
						endColIndex,
						getLeft
					});
				} : void 0
			}, { default: ({ item, index, renderedItemWithCols }) => {
				if (renderedItemWithCols) return renderedItemWithCols;
				return renderRow({
					rowInfo: item,
					displayedRowIndex: index,
					isVirtual: true,
					isVirtualX: false,
					startColIndex: 0,
					endColIndex: 0,
					getLeft(_index) {
						return 0;
					}
				});
			} }, 1032, [
				"items",
				"itemSize",
				"visibleItemsTag",
				"visibleItemsProps",
				"onResize",
				"onScroll",
				"itemsStyle",
				"itemResizable",
				"columns",
				"renderItemWithCols"
			]);
		} }, 1040, [
			"scrollable",
			"class",
			"style",
			"theme",
			"themeOverrides",
			"contentStyle",
			"container",
			"content",
			"internalExposeWidthCssVar",
			"xScrollable",
			"onScroll",
			"internalOnUpdateScrollLeft",
			"onResize"
		]);
	}
});
//#endregion
module.exports = Body_default;
