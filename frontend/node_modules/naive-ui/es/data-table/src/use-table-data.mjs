import { warn } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { getDefaultPageSize } from "../../pagination/src/utils.mjs";
import { createShallowClonedObject } from "./utils.mjs";
import { useSorter } from "./use-sorter.mjs";
import { computed, ref } from "vue";
import { useMemo, useMergedState } from "vooks";
import { createTreeMate } from "treemate";
//#region src/data-table/src/use-table-data.ts
function useTableData(props, {
  dataRelatedColsRef
}) {
  const selectionColumnRef = computed(() => {
    const getSelectionColumn = cols => {
      for (let i = 0; i < cols.length; ++i) {
        const col = cols[i];
        if ("children" in col) return getSelectionColumn(col.children);else if (col.type === "selection") return col;
      }
      return null;
    };
    return getSelectionColumn(props.columns);
  });
  const treeMateRef = computed(() => {
    const {
      childrenKey
    } = props;
    return createTreeMate(props.data, {
      ignoreEmptyChildren: true,
      getKey: props.rowKey,
      getChildren: rowData => rowData[childrenKey],
      getDisabled: rowData => {
        if (selectionColumnRef.value?.disabled?.(rowData)) return true;
        return false;
      }
    });
  });
  const childTriggerColIndexRef = useMemo(() => {
    const {
      columns
    } = props;
    const {
      length
    } = columns;
    let firstContentfulColIndex = null;
    for (let i = 0; i < length; ++i) {
      const col = columns[i];
      if (!col.type && firstContentfulColIndex === null) firstContentfulColIndex = i;
      if ("tree" in col && col.tree) return i;
    }
    return firstContentfulColIndex || 0;
  });
  const uncontrolledFilterStateRef = ref({});
  const {
    pagination
  } = props;
  const uncontrolledCurrentPageRef = ref(pagination ? pagination.defaultPage || 1 : 1);
  const uncontrolledPageSizeRef = ref(getDefaultPageSize(pagination));
  const mergedFilterStateRef = computed(() => {
    const columnsWithControlledFilter = dataRelatedColsRef.value.filter(column => {
      return column.filterOptionValues !== void 0 || column.filterOptionValue !== void 0;
    });
    const controlledFilterState = {};
    columnsWithControlledFilter.forEach(column => {
      if (column.type === "selection" || column.type === "expand") return;
      if (column.filterOptionValues === void 0) controlledFilterState[column.key] = column.filterOptionValue ?? null;else controlledFilterState[column.key] = column.filterOptionValues;
    });
    return Object.assign(createShallowClonedObject(uncontrolledFilterStateRef.value), controlledFilterState);
  });
  const filteredDataRef = computed(() => {
    const mergedFilterState = mergedFilterStateRef.value;
    const {
      columns
    } = props;
    function createDefaultFilter(columnKey) {
      return (filterOptionValue, row) => !!~String(row[columnKey]).indexOf(String(filterOptionValue));
    }
    const {
      value: {
        treeNodes: data
      }
    } = treeMateRef;
    const columnEntries = [];
    columns.forEach(column => {
      if (column.type === "selection" || column.type === "expand" || "children" in column) return;
      columnEntries.push([column.key, column]);
    });
    return data ? data.filter(tmNode => {
      const {
        rawNode: row
      } = tmNode;
      for (const [columnKey, column] of columnEntries) {
        let activeFilterOptionValues = mergedFilterState[columnKey];
        if (activeFilterOptionValues == null) continue;
        if (!Array.isArray(activeFilterOptionValues)) activeFilterOptionValues = [activeFilterOptionValues];
        if (!activeFilterOptionValues.length) continue;
        const filter = column.filter === "default" ? createDefaultFilter(columnKey) : column.filter;
        if (column && typeof filter === "function") {
          if (column.filterMode === "and") {
            if (activeFilterOptionValues.some(filterOptionValue => !filter(filterOptionValue, row))) return false;
          } else if (activeFilterOptionValues.some(filterOptionValue => filter(filterOptionValue, row))) continue;else return false;
        }
      }
      return true;
    }) : [];
  });
  const {
    sortedDataRef,
    deriveNextSorter,
    mergedSortStateRef,
    sort,
    clearSorter
  } = useSorter(props, {
    dataRelatedColsRef,
    filteredDataRef
  });
  dataRelatedColsRef.value.forEach(column => {
    if (column.filter) {
      const defaultFilterOptionValues = column.defaultFilterOptionValues;
      if (column.filterMultiple) uncontrolledFilterStateRef.value[column.key] = defaultFilterOptionValues || [];else if (defaultFilterOptionValues !== void 0) uncontrolledFilterStateRef.value[column.key] = defaultFilterOptionValues === null ? [] : defaultFilterOptionValues;else uncontrolledFilterStateRef.value[column.key] = column.defaultFilterOptionValue ?? null;
    }
  });
  const controlledCurrentPageRef = computed(() => {
    const {
      pagination
    } = props;
    if (pagination === false) return void 0;
    return pagination.page;
  });
  const controlledPageSizeRef = computed(() => {
    const {
      pagination
    } = props;
    if (pagination === false) return void 0;
    return pagination.pageSize;
  });
  const _mergedCurrentPageRef = useMergedState(controlledCurrentPageRef, uncontrolledCurrentPageRef);
  const mergedPageSizeRef = useMergedState(controlledPageSizeRef, uncontrolledPageSizeRef);
  const boundedMergedCurrentPageRef = useMemo(() => {
    const page = _mergedCurrentPageRef.value;
    return props.remote ? page : Math.max(1, Math.min(Math.ceil(filteredDataRef.value.length / mergedPageSizeRef.value), page));
  });
  const mergedPageCountRef = computed(() => {
    const {
      pagination
    } = props;
    if (pagination) {
      const {
        pageCount
      } = pagination;
      if (pageCount !== void 0) return pageCount;
    }
  });
  const paginatedDataRef = computed(() => {
    if (props.remote) return treeMateRef.value.treeNodes;
    if (!props.pagination) return sortedDataRef.value;
    const pageSize = mergedPageSizeRef.value;
    const startIndex = (boundedMergedCurrentPageRef.value - 1) * pageSize;
    return sortedDataRef.value.slice(startIndex, startIndex + pageSize);
  });
  const rawPaginatedDataRef = computed(() => {
    return paginatedDataRef.value.map(tmNode => tmNode.rawNode);
  });
  const rawSortedDataRef = computed(() => {
    return sortedDataRef.value.map(tmNode => tmNode.rawNode);
  });
  function mergedOnUpdatePage(page) {
    const {
      pagination
    } = props;
    if (pagination) {
      const {
        onChange,
        "onUpdate:page": _onUpdatePage,
        onUpdatePage
      } = pagination;
      if (onChange) call(onChange, page);
      if (onUpdatePage) call(onUpdatePage, page);
      if (_onUpdatePage) call(_onUpdatePage, page);
      doUpdatePage(page);
    }
  }
  function mergedOnUpdatePageSize(pageSize) {
    const {
      pagination
    } = props;
    if (pagination) {
      const {
        onPageSizeChange,
        "onUpdate:pageSize": _onUpdatePageSize,
        onUpdatePageSize
      } = pagination;
      if (onPageSizeChange) call(onPageSizeChange, pageSize);
      if (onUpdatePageSize) call(onUpdatePageSize, pageSize);
      if (_onUpdatePageSize) call(_onUpdatePageSize, pageSize);
      doUpdatePageSize(pageSize);
    }
  }
  const mergedItemCountRef = computed(() => {
    if (props.remote) {
      const {
        pagination
      } = props;
      if (pagination) {
        const {
          itemCount
        } = pagination;
        if (itemCount !== void 0) return itemCount;
      }
      return;
    }
    return filteredDataRef.value.length;
  });
  const mergedPaginationRef = computed(() => {
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
    const {
      "onUpdate:page": _onUpdatePage,
      onPageChange,
      onUpdatePage
    } = props;
    if (onUpdatePage) call(onUpdatePage, page);
    if (_onUpdatePage) call(_onUpdatePage, page);
    if (onPageChange) call(onPageChange, page);
    uncontrolledCurrentPageRef.value = page;
  }
  function doUpdatePageSize(pageSize) {
    const {
      "onUpdate:pageSize": _onUpdatePageSize,
      onPageSizeChange,
      onUpdatePageSize
    } = props;
    if (onPageSizeChange) call(onPageSizeChange, pageSize);
    if (onUpdatePageSize) call(onUpdatePageSize, pageSize);
    if (_onUpdatePageSize) call(_onUpdatePageSize, pageSize);
    uncontrolledPageSizeRef.value = pageSize;
  }
  function doUpdateFilters(filters, sourceColumn) {
    const {
      onUpdateFilters,
      "onUpdate:filters": _onUpdateFilters,
      onFiltersChange
    } = props;
    if (onUpdateFilters) call(onUpdateFilters, filters, sourceColumn);
    if (_onUpdateFilters) call(_onUpdateFilters, filters, sourceColumn);
    if (onFiltersChange) call(onFiltersChange, filters, sourceColumn);
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
    if (!filters) uncontrolledFilterStateRef.value = {};else if (filters) uncontrolledFilterStateRef.value = createShallowClonedObject(filters);else if (process.env.NODE_ENV !== "production") warn("data-table", "`filters` is not an object");
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
    hoverKeyRef: ref(null),
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
export { useTableData };