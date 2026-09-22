Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require_pagination_src_utils = require("../../pagination/src/utils.js");
const require_data_table_src_utils = require("./utils.js");
const require_data_table_src_use_sorter = require("./use-sorter.js");
let vue = require("vue");
let vooks = require("vooks");
let treemate = require("treemate");
//#region src/data-table/src/use-table-data.ts
function useTableData(props, { dataRelatedColsRef }) {
	const selectionColumnRef = (0, vue.computed)(() => {
		const getSelectionColumn = (cols) => {
			for (let i = 0; i < cols.length; ++i) {
				const col = cols[i];
				if ("children" in col) return getSelectionColumn(col.children);
				else if (col.type === "selection") return col;
			}
			return null;
		};
		return getSelectionColumn(props.columns);
	});
	const treeMateRef = (0, vue.computed)(() => {
		const { childrenKey } = props;
		return (0, treemate.createTreeMate)(props.data, {
			ignoreEmptyChildren: true,
			getKey: props.rowKey,
			getChildren: (rowData) => rowData[childrenKey],
			getDisabled: (rowData) => {
				if (selectionColumnRef.value?.disabled?.(rowData)) return true;
				return false;
			}
		});
	});
	const childTriggerColIndexRef = (0, vooks.useMemo)(() => {
		const { columns } = props;
		const { length } = columns;
		let firstContentfulColIndex = null;
		for (let i = 0; i < length; ++i) {
			const col = columns[i];
			if (!col.type && firstContentfulColIndex === null) firstContentfulColIndex = i;
			if ("tree" in col && col.tree) return i;
		}
		return firstContentfulColIndex || 0;
	});
	const uncontrolledFilterStateRef = (0, vue.ref)({});
	const { pagination } = props;
	const uncontrolledCurrentPageRef = (0, vue.ref)(pagination ? pagination.defaultPage || 1 : 1);
	const uncontrolledPageSizeRef = (0, vue.ref)(require_pagination_src_utils.getDefaultPageSize(pagination));
	const mergedFilterStateRef = (0, vue.computed)(() => {
		const columnsWithControlledFilter = dataRelatedColsRef.value.filter((column) => {
			return column.filterOptionValues !== void 0 || column.filterOptionValue !== void 0;
		});
		const controlledFilterState = {};
		columnsWithControlledFilter.forEach((column) => {
			if (column.type === "selection" || column.type === "expand") return;
			if (column.filterOptionValues === void 0) controlledFilterState[column.key] = column.filterOptionValue ?? null;
			else controlledFilterState[column.key] = column.filterOptionValues;
		});
		return Object.assign(require_data_table_src_utils.createShallowClonedObject(uncontrolledFilterStateRef.value), controlledFilterState);
	});
	const filteredDataRef = (0, vue.computed)(() => {
		const mergedFilterState = mergedFilterStateRef.value;
		const { columns } = props;
		function createDefaultFilter(columnKey) {
			return (filterOptionValue, row) => !!~String(row[columnKey]).indexOf(String(filterOptionValue));
		}
		const { value: { treeNodes: data } } = treeMateRef;
		const columnEntries = [];
		columns.forEach((column) => {
			if (column.type === "selection" || column.type === "expand" || "children" in column) return;
			columnEntries.push([column.key, column]);
		});
		return data ? data.filter((tmNode) => {
			const { rawNode: row } = tmNode;
			for (const [columnKey, column] of columnEntries) {
				let activeFilterOptionValues = mergedFilterState[columnKey];
				if (activeFilterOptionValues == null) continue;
				if (!Array.isArray(activeFilterOptionValues)) activeFilterOptionValues = [activeFilterOptionValues];
				if (!activeFilterOptionValues.length) continue;
				const filter = column.filter === "default" ? createDefaultFilter(columnKey) : column.filter;
				if (column && typeof filter === "function") {
					if (column.filterMode === "and") {
						if (activeFilterOptionValues.some((filterOptionValue) => !filter(filterOptionValue, row))) return false;
					} else if (activeFilterOptionValues.some((filterOptionValue) => filter(filterOptionValue, row))) continue;
					else return false;
				}
			}
			return true;
		}) : [];
	});
	const { sortedDataRef, deriveNextSorter, mergedSortStateRef, sort, clearSorter } = require_data_table_src_use_sorter.useSorter(props, {
		dataRelatedColsRef,
		filteredDataRef
	});
	dataRelatedColsRef.value.forEach((column) => {
		if (column.filter) {
			const defaultFilterOptionValues = column.defaultFilterOptionValues;
			if (column.filterMultiple) uncontrolledFilterStateRef.value[column.key] = defaultFilterOptionValues || [];
			else if (defaultFilterOptionValues !== void 0) uncontrolledFilterStateRef.value[column.key] = defaultFilterOptionValues === null ? [] : defaultFilterOptionValues;
			else uncontrolledFilterStateRef.value[column.key] = column.defaultFilterOptionValue ?? null;
		}
	});
	const controlledCurrentPageRef = (0, vue.computed)(() => {
		const { pagination } = props;
		if (pagination === false) return void 0;
		return pagination.page;
	});
	const controlledPageSizeRef = (0, vue.computed)(() => {
		const { pagination } = props;
		if (pagination === false) return void 0;
		return pagination.pageSize;
	});
	const _mergedCurrentPageRef = (0, vooks.useMergedState)(controlledCurrentPageRef, uncontrolledCurrentPageRef);
	const mergedPageSizeRef = (0, vooks.useMergedState)(controlledPageSizeRef, uncontrolledPageSizeRef);
	const boundedMergedCurrentPageRef = (0, vooks.useMemo)(() => {
		const page = _mergedCurrentPageRef.value;
		return props.remote ? page : Math.max(1, Math.min(Math.ceil(filteredDataRef.value.length / mergedPageSizeRef.value), page));
	});
	const mergedPageCountRef = (0, vue.computed)(() => {
		const { pagination } = props;
		if (pagination) {
			const { pageCount } = pagination;
			if (pageCount !== void 0) return pageCount;
		}
	});
	const paginatedDataRef = (0, vue.computed)(() => {
		if (props.remote) return treeMateRef.value.treeNodes;
		if (!props.pagination) return sortedDataRef.value;
		const pageSize = mergedPageSizeRef.value;
		const startIndex = (boundedMergedCurrentPageRef.value - 1) * pageSize;
		return sortedDataRef.value.slice(startIndex, startIndex + pageSize);
	});
	const rawPaginatedDataRef = (0, vue.computed)(() => {
		return paginatedDataRef.value.map((tmNode) => tmNode.rawNode);
	});
	const rawSortedDataRef = (0, vue.computed)(() => {
		return sortedDataRef.value.map((tmNode) => tmNode.rawNode);
	});
	function mergedOnUpdatePage(page) {
		const { pagination } = props;
		if (pagination) {
			const { onChange, "onUpdate:page": _onUpdatePage, onUpdatePage } = pagination;
			if (onChange) require__utils_vue_call.call(onChange, page);
			if (onUpdatePage) require__utils_vue_call.call(onUpdatePage, page);
			if (_onUpdatePage) require__utils_vue_call.call(_onUpdatePage, page);
			doUpdatePage(page);
		}
	}
	function mergedOnUpdatePageSize(pageSize) {
		const { pagination } = props;
		if (pagination) {
			const { onPageSizeChange, "onUpdate:pageSize": _onUpdatePageSize, onUpdatePageSize } = pagination;
			if (onPageSizeChange) require__utils_vue_call.call(onPageSizeChange, pageSize);
			if (onUpdatePageSize) require__utils_vue_call.call(onUpdatePageSize, pageSize);
			if (_onUpdatePageSize) require__utils_vue_call.call(_onUpdatePageSize, pageSize);
			doUpdatePageSize(pageSize);
		}
	}
	const mergedItemCountRef = (0, vue.computed)(() => {
		if (props.remote) {
			const { pagination } = props;
			if (pagination) {
				const { itemCount } = pagination;
				if (itemCount !== void 0) return itemCount;
			}
			return;
		}
		return filteredDataRef.value.length;
	});
	const mergedPaginationRef = (0, vue.computed)(() => {
		return {
			...props.pagination,
			onChange: void 0,
			onUpdatePage: void 0,
			onUpdatePageSize: void 0,
			onPageSizeChange: void 0,
			"onUpdate:page": mergedOnUpdatePage,
			"onUpdate:pageSize": mergedOnUpdatePageSize,
			page: boundedMergedCurrentPageRef.value,
			pageSize: mergedPageSizeRef.value,
			pageCount: mergedItemCountRef.value === void 0 ? mergedPageCountRef.value : void 0,
			itemCount: mergedItemCountRef.value
		};
	});
	function doUpdatePage(page) {
		const { "onUpdate:page": _onUpdatePage, onPageChange, onUpdatePage } = props;
		if (onUpdatePage) require__utils_vue_call.call(onUpdatePage, page);
		if (_onUpdatePage) require__utils_vue_call.call(_onUpdatePage, page);
		if (onPageChange) require__utils_vue_call.call(onPageChange, page);
		uncontrolledCurrentPageRef.value = page;
	}
	function doUpdatePageSize(pageSize) {
		const { "onUpdate:pageSize": _onUpdatePageSize, onPageSizeChange, onUpdatePageSize } = props;
		if (onPageSizeChange) require__utils_vue_call.call(onPageSizeChange, pageSize);
		if (onUpdatePageSize) require__utils_vue_call.call(onUpdatePageSize, pageSize);
		if (_onUpdatePageSize) require__utils_vue_call.call(_onUpdatePageSize, pageSize);
		uncontrolledPageSizeRef.value = pageSize;
	}
	function doUpdateFilters(filters, sourceColumn) {
		const { onUpdateFilters, "onUpdate:filters": _onUpdateFilters, onFiltersChange } = props;
		if (onUpdateFilters) require__utils_vue_call.call(onUpdateFilters, filters, sourceColumn);
		if (_onUpdateFilters) require__utils_vue_call.call(_onUpdateFilters, filters, sourceColumn);
		if (onFiltersChange) require__utils_vue_call.call(onFiltersChange, filters, sourceColumn);
		uncontrolledFilterStateRef.value = filters;
	}
	function onUnstableColumnResize(resizedWidth, limitedWidth, column, getColumnWidth) {
		props.onUnstableColumnResize?.(resizedWidth, limitedWidth, column, getColumnWidth);
	}
	function page(page) {
		doUpdatePage(page);
	}
	function clearFilter() {
		clearFilters();
	}
	function clearFilters() {
		filters({});
	}
	function filters(filters) {
		filter(filters);
	}
	function filter(filters) {
		if (!filters) uncontrolledFilterStateRef.value = {};
		else if (filters) uncontrolledFilterStateRef.value = require_data_table_src_utils.createShallowClonedObject(filters);
		else if (process.env.NODE_ENV !== "production") require__utils_naive_warn.warn("data-table", "`filters` is not an object");
	}
	return {
		treeMateRef,
		mergedCurrentPageRef: boundedMergedCurrentPageRef,
		mergedPaginationRef,
		paginatedDataRef,
		rawPaginatedDataRef,
		rawSortedDataRef,
		mergedFilterStateRef,
		mergedSortStateRef,
		hoverKeyRef: (0, vue.ref)(null),
		selectionColumnRef,
		childTriggerColIndexRef,
		doUpdateFilters,
		deriveNextSorter,
		doUpdatePageSize,
		doUpdatePage,
		onUnstableColumnResize,
		filter,
		filters,
		clearFilter,
		clearFilters,
		clearSorter,
		page,
		sort
	};
}
//#endregion
exports.useTableData = useTableData;
