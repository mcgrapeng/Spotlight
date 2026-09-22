const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_dom_download = require("../../_utils/dom/download.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_loading_src_Loading = require("../../_internal/loading/src/Loading.js");
const require_pagination_src_Pagination = require("../../pagination/src/Pagination.js");
const require_data_table_styles_light = require("../styles/light.js");
const require_data_table_src_interface = require("./interface.js");
const require_data_table_src_utils = require("./utils.js");
const require_data_table_src_MainTable = require("./MainTable.js");
const require_data_table_src_styles_index_cssr = require("./styles/index.cssr.js");
const require_data_table_src_use_check = require("./use-check.js");
const require_data_table_src_use_expand = require("./use-expand.js");
const require_data_table_src_use_group_header = require("./use-group-header.js");
const require_data_table_src_use_resizable = require("./use-resizable.js");
const require_data_table_src_use_scroll = require("./use-scroll.js");
const require_data_table_src_use_table_data = require("./use-table-data.js");
let seemly = require("seemly");
let vue = require("vue");
//#region src/data-table/src/DataTable.tsx
var DataTable_default = (0, vue.defineComponent)({
	name: "DataTable",
	alias: ["AdvancedTable"],
	props: require_data_table_src_interface.dataTableProps,
	slots: Object,
	setup(props, { slots }) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.onPageChange !== void 0) require__utils_naive_warn.warnOnce("data-table", "`on-page-change` is deprecated, please use `on-update:page` instead.");
			if (props.onPageSizeChange !== void 0) require__utils_naive_warn.warnOnce("data-table", "`on-page-size-change` is deprecated, please use `on-update:page-size` instead.");
			if (props.onSorterChange !== void 0) require__utils_naive_warn.warnOnce("data-table", "`on-sorter-change` is deprecated, please use `on-update:sorter` instead.");
			if (props.onFiltersChange !== void 0) require__utils_naive_warn.warnOnce("data-table", "`on-filters-change` is deprecated, please use `on-update:filters` instead.");
			if (props.onCheckedRowKeysChange !== void 0) require__utils_naive_warn.warnOnce("data-table", "`on-checked-row-keys-change` is deprecated, please use `on-update:checked-row-keys` instead.");
		});
		const { mergedBorderedRef, mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("DataTable", mergedRtlRef, mergedClsPrefixRef);
		const mergedSizeRef = (0, vue.computed)(() => {
			return props.size || mergedComponentPropsRef?.value?.DataTable?.size || "medium";
		});
		const mergedBottomBorderedRef = (0, vue.computed)(() => {
			const { bottomBordered } = props;
			if (mergedBorderedRef.value) return false;
			if (bottomBordered !== void 0) return bottomBordered;
			return true;
		});
		const themeRef = require__mixins_use_theme.default("DataTable", "-data-table", require_data_table_src_styles_index_cssr, require_data_table_styles_light.default, props, mergedClsPrefixRef);
		const bodyWidthRef = (0, vue.ref)(null);
		const mainTableInstRef = (0, vue.ref)(null);
		const { getResizableWidth, clearResizableWidth, doUpdateResizableWidth } = require_data_table_src_use_resizable.useResizable();
		const { rowsRef, colsRef, dataRelatedColsRef, hasEllipsisRef } = require_data_table_src_use_group_header.useGroupHeader(props, getResizableWidth);
		const { treeMateRef, mergedCurrentPageRef, paginatedDataRef, rawPaginatedDataRef, rawSortedDataRef, selectionColumnRef, hoverKeyRef, mergedPaginationRef, mergedFilterStateRef, mergedSortStateRef, childTriggerColIndexRef, doUpdatePage, doUpdateFilters, onUnstableColumnResize, deriveNextSorter, filter, filters, clearFilter, clearFilters, clearSorter, page, sort } = require_data_table_src_use_table_data.useTableData(props, { dataRelatedColsRef });
		const mergedEmptyRef = (0, vue.computed)(() => paginatedDataRef.value.length === 0);
		const downloadCsv = (options) => {
			const { fileName = "data.csv", keepOriginalData = false } = options || {};
			const data = keepOriginalData ? props.data : rawPaginatedDataRef.value;
			const csvData = require_data_table_src_utils.generateCsv(props.columns, data, props.getCsvCell, props.getCsvHeader);
			const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
			const downloadUrl = URL.createObjectURL(blob);
			require__utils_dom_download.download(downloadUrl, fileName.endsWith(".csv") ? fileName : `${fileName}.csv`);
			URL.revokeObjectURL(downloadUrl);
		};
		const { doCheckAll, doUncheckAll, doCheck, doUncheck, headerCheckboxDisabledRef, someRowsCheckedRef, allRowsCheckedRef, mergedCheckedRowKeySetRef, mergedInderminateRowKeySetRef } = require_data_table_src_use_check.useCheck(props, {
			selectionColumnRef,
			treeMateRef,
			paginatedDataRef
		});
		const { stickyExpandedRowsRef, mergedExpandedRowKeysRef, renderExpandRef, expandableRef, doUpdateExpandedRowKeys } = require_data_table_src_use_expand.useExpand(props, treeMateRef);
		const maxHeightRef = (0, vue.toRef)(props, "maxHeight");
		const mergedTableLayoutRef = (0, vue.computed)(() => {
			if (props.virtualScroll || props.flexHeight || props.maxHeight !== void 0 || hasEllipsisRef.value) return "fixed";
			return props.tableLayout;
		});
		const { handleTableBodyScroll, handleTableHeaderScroll, syncScrollState, setHeaderScrollLeft, leftActiveFixedColKeyRef, leftActiveFixedChildrenColKeysRef, rightActiveFixedColKeyRef, rightActiveFixedChildrenColKeysRef, leftFixedColumnsRef, rightFixedColumnsRef, fixedColumnLeftMapRef, fixedColumnRightMapRef, xScrollableRef, explicitlyScrollableRef } = require_data_table_src_use_scroll.useScroll(props, {
			bodyWidthRef,
			mainTableInstRef,
			mergedCurrentPageRef,
			maxHeightRef,
			mergedTableLayoutRef,
			mergedEmptyRef
		});
		const { localeRef } = require__mixins_use_locale("DataTable");
		(0, vue.provide)(require_data_table_src_interface.dataTableInjectionKey, {
			xScrollableRef,
			explicitlyScrollableRef,
			props,
			treeMateRef,
			renderExpandIconRef: (0, vue.toRef)(props, "renderExpandIcon"),
			loadingKeySetRef: (0, vue.ref)(/* @__PURE__ */ new Set()),
			slots,
			indentRef: (0, vue.toRef)(props, "indent"),
			childTriggerColIndexRef,
			bodyWidthRef,
			componentId: (0, seemly.createId)(),
			hoverKeyRef,
			mergedClsPrefixRef,
			mergedThemeRef: themeRef,
			scrollXRef: (0, vue.computed)(() => props.scrollX),
			rowsRef,
			colsRef,
			paginatedDataRef,
			leftActiveFixedColKeyRef,
			leftActiveFixedChildrenColKeysRef,
			rightActiveFixedColKeyRef,
			rightActiveFixedChildrenColKeysRef,
			leftFixedColumnsRef,
			rightFixedColumnsRef,
			fixedColumnLeftMapRef,
			fixedColumnRightMapRef,
			mergedCurrentPageRef,
			someRowsCheckedRef,
			allRowsCheckedRef,
			mergedSortStateRef,
			mergedFilterStateRef,
			loadingRef: (0, vue.toRef)(props, "loading"),
			rowClassNameRef: (0, vue.toRef)(props, "rowClassName"),
			mergedCheckedRowKeySetRef,
			mergedExpandedRowKeysRef,
			mergedInderminateRowKeySetRef,
			localeRef,
			expandableRef,
			stickyExpandedRowsRef,
			rowKeyRef: (0, vue.toRef)(props, "rowKey"),
			renderExpandRef,
			summaryRef: (0, vue.toRef)(props, "summary"),
			virtualScrollRef: (0, vue.toRef)(props, "virtualScroll"),
			virtualScrollXRef: (0, vue.toRef)(props, "virtualScrollX"),
			heightForRowRef: (0, vue.toRef)(props, "heightForRow"),
			minRowHeightRef: (0, vue.toRef)(props, "minRowHeight"),
			virtualScrollHeaderRef: (0, vue.toRef)(props, "virtualScrollHeader"),
			headerHeightRef: (0, vue.toRef)(props, "headerHeight"),
			rowPropsRef: (0, vue.toRef)(props, "rowProps"),
			stripedRef: (0, vue.toRef)(props, "striped"),
			checkOptionsRef: (0, vue.computed)(() => {
				const { value: selectionColumn } = selectionColumnRef;
				return selectionColumn?.options;
			}),
			rawPaginatedDataRef,
			filterMenuCssVarsRef: (0, vue.computed)(() => {
				const { self: { actionDividerColor, actionPadding, actionButtonMargin } } = themeRef.value;
				return {
					"--n-action-padding": actionPadding,
					"--n-action-button-margin": actionButtonMargin,
					"--n-action-divider-color": actionDividerColor
				};
			}),
			onLoadRef: (0, vue.toRef)(props, "onLoad"),
			mergedTableLayoutRef,
			maxHeightRef,
			minHeightRef: (0, vue.toRef)(props, "minHeight"),
			flexHeightRef: (0, vue.toRef)(props, "flexHeight"),
			headerCheckboxDisabledRef,
			paginationBehaviorOnFilterRef: (0, vue.toRef)(props, "paginationBehaviorOnFilter"),
			summaryPlacementRef: (0, vue.toRef)(props, "summaryPlacement"),
			filterIconPopoverPropsRef: (0, vue.toRef)(props, "filterIconPopoverProps"),
			scrollbarPropsRef: (0, vue.toRef)(props, "scrollbarProps"),
			syncScrollState,
			doUpdatePage,
			doUpdateFilters,
			getResizableWidth,
			onUnstableColumnResize,
			clearResizableWidth,
			doUpdateResizableWidth,
			deriveNextSorter,
			doCheck,
			doUncheck,
			doCheckAll,
			doUncheckAll,
			doUpdateExpandedRowKeys,
			handleTableHeaderScroll,
			handleTableBodyScroll,
			setHeaderScrollLeft,
			renderCell: (0, vue.toRef)(props, "renderCell")
		});
		const exposedMethods = {
			filter,
			filters,
			clearFilters,
			clearSorter,
			page,
			sort,
			clearFilter,
			downloadCsv,
			scrollTo: (arg0, arg1) => {
				mainTableInstRef.value?.scrollTo(arg0, arg1);
			},
			getFilteredAndSortedData: () => {
				return rawSortedDataRef.value;
			},
			getCurrentPageData: () => {
				return rawPaginatedDataRef.value;
			}
		};
		const cssVarsRef = (0, vue.computed)(() => {
			const mergedSize = mergedSizeRef.value;
			const { common: { cubicBezierEaseInOut }, self: { borderColor, tdColorHover, tdColorSorting, tdColorSortingModal, tdColorSortingPopover, thColorSorting, thColorSortingModal, thColorSortingPopover, thColor, thColorHover, tdColor, tdTextColor, thTextColor, thFontWeight, thButtonColorHover, thIconColor, thIconColorActive, filterSize, borderRadius, lineHeight, tdColorModal, thColorModal, borderColorModal, thColorHoverModal, tdColorHoverModal, borderColorPopover, thColorPopover, tdColorPopover, tdColorHoverPopover, thColorHoverPopover, paginationMargin, emptyPadding, boxShadowAfter, boxShadowBefore, sorterSize, resizableContainerSize, resizableSize, loadingColor, loadingSize, opacityLoading, tdColorStriped, tdColorStripedModal, tdColorStripedPopover, [require__utils_cssr_index.createKey("fontSize", mergedSize)]: fontSize, [require__utils_cssr_index.createKey("thPadding", mergedSize)]: thPadding, [require__utils_cssr_index.createKey("tdPadding", mergedSize)]: tdPadding } } = themeRef.value;
			return {
				"--n-font-size": fontSize,
				"--n-th-padding": thPadding,
				"--n-td-padding": tdPadding,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-border-radius": borderRadius,
				"--n-line-height": lineHeight,
				"--n-border-color": borderColor,
				"--n-border-color-modal": borderColorModal,
				"--n-border-color-popover": borderColorPopover,
				"--n-th-color": thColor,
				"--n-th-color-hover": thColorHover,
				"--n-th-color-modal": thColorModal,
				"--n-th-color-hover-modal": thColorHoverModal,
				"--n-th-color-popover": thColorPopover,
				"--n-th-color-hover-popover": thColorHoverPopover,
				"--n-td-color": tdColor,
				"--n-td-color-hover": tdColorHover,
				"--n-td-color-modal": tdColorModal,
				"--n-td-color-hover-modal": tdColorHoverModal,
				"--n-td-color-popover": tdColorPopover,
				"--n-td-color-hover-popover": tdColorHoverPopover,
				"--n-th-text-color": thTextColor,
				"--n-td-text-color": tdTextColor,
				"--n-th-font-weight": thFontWeight,
				"--n-th-button-color-hover": thButtonColorHover,
				"--n-th-icon-color": thIconColor,
				"--n-th-icon-color-active": thIconColorActive,
				"--n-filter-size": filterSize,
				"--n-pagination-margin": paginationMargin,
				"--n-empty-padding": emptyPadding,
				"--n-box-shadow-before": boxShadowBefore,
				"--n-box-shadow-after": boxShadowAfter,
				"--n-sorter-size": sorterSize,
				"--n-resizable-container-size": resizableContainerSize,
				"--n-resizable-size": resizableSize,
				"--n-loading-size": loadingSize,
				"--n-loading-color": loadingColor,
				"--n-opacity-loading": opacityLoading,
				"--n-td-color-striped": tdColorStriped,
				"--n-td-color-striped-modal": tdColorStripedModal,
				"--n-td-color-striped-popover": tdColorStripedPopover,
				"--n-td-color-sorting": tdColorSorting,
				"--n-td-color-sorting-modal": tdColorSortingModal,
				"--n-td-color-sorting-popover": tdColorSortingPopover,
				"--n-th-color-sorting": thColorSorting,
				"--n-th-color-sorting-modal": thColorSortingModal,
				"--n-th-color-sorting-popover": thColorSortingPopover
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("data-table", (0, vue.computed)(() => mergedSizeRef.value[0]), cssVarsRef, props) : void 0;
		return {
			mainTableInstRef,
			mergedClsPrefix: mergedClsPrefixRef,
			rtlEnabled: rtlEnabledRef,
			mergedTheme: themeRef,
			paginatedData: paginatedDataRef,
			mergedBordered: mergedBorderedRef,
			mergedBottomBordered: mergedBottomBorderedRef,
			mergedPagination: mergedPaginationRef,
			mergedShowPagination: (0, vue.computed)(() => {
				if (!props.pagination) return false;
				if (props.paginateSinglePage) return true;
				const mergedPagination = mergedPaginationRef.value;
				const { pageCount } = mergedPagination;
				if (pageCount !== void 0) return pageCount > 1;
				return mergedPagination.itemCount && mergedPagination.pageSize && mergedPagination.itemCount > mergedPagination.pageSize;
			}),
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender,
			mergedEmpty: mergedEmptyRef,
			...exposedMethods
		};
	},
	render() {
		const { mergedClsPrefix, themeClass, onRender, $slots, spinProps } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-data-table`,
				this.rtlEnabled && `${mergedClsPrefix}-data-table--rtl`,
				themeClass,
				{
					[`${mergedClsPrefix}-data-table--bordered`]: this.mergedBordered,
					[`${mergedClsPrefix}-data-table--bottom-bordered`]: this.mergedBottomBordered,
					[`${mergedClsPrefix}-data-table--single-line`]: this.singleLine,
					[`${mergedClsPrefix}-data-table--single-column`]: this.singleColumn,
					[`${mergedClsPrefix}-data-table--loading`]: this.loading,
					[`${mergedClsPrefix}-data-table--flex-height`]: this.flexHeight,
					[`${mergedClsPrefix}-data-table--empty`]: this.mergedEmpty
				}
			]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-wrapper`) }, [(0, vue.createVNode)(require_data_table_src_MainTable, { ref: "mainTableInstRef" }, null, 512)], 2),
			this.mergedShowPagination ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table__pagination`)
			}, [((0, vue.openBlock)(), (0, vue.createBlock)(require_pagination_src_Pagination.default, (0, vue.mergeProps)({
				theme: this.mergedTheme.peers.Pagination,
				themeOverrides: this.mergedTheme.peerOverrides.Pagination,
				disabled: this.loading
			}, this.mergedPagination), null, 16, [
				"theme",
				"themeOverrides",
				"disabled"
			]))], 2)) : require_vdom.normalizeVNode(() => null),
			(0, vue.createVNode)(vue.Transition, { name: "fade-in-scale-up-transition" }, { default: () => {
				return this.loading ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 1,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-data-table-loading-wrapper`)
				}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot($slots.loading, () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_loading_src_Loading.default, (0, vue.mergeProps)({
					clsPrefix: mergedClsPrefix,
					strokeWidth: 20
				}, spinProps), null, 16, ["clsPrefix"]))]))], 2)) : null;
			} }, 1024)
		], 6);
	}
});
//#endregion
module.exports = DataTable_default;
