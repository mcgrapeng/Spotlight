import { createKey } from "../../_utils/cssr/index.mjs";
import { download } from "../../_utils/dom/download.mjs";
import { warnOnce } from "../../_utils/naive/warn.mjs";
import { resolveSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useLocale from "../../_mixins/use-locale.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Loading_default from "../../_internal/loading/src/Loading.mjs";
import Pagination_default from "../../pagination/src/Pagination.mjs";
import dataTableLight from "../styles/light.mjs";
import { dataTableInjectionKey, dataTableProps } from "./interface.mjs";
import { generateCsv } from "./utils.mjs";
import MainTable_default from "./MainTable.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { useCheck } from "./use-check.mjs";
import { useExpand } from "./use-expand.mjs";
import { useGroupHeader } from "./use-group-header.mjs";
import { useResizable } from "./use-resizable.mjs";
import { useScroll } from "./use-scroll.mjs";
import { useTableData } from "./use-table-data.mjs";
import { createId } from "seemly";
import { Transition, computed, createBlock, createElementBlock, createElementVNode, createVNode, defineComponent, mergeProps, normalizeStyle, openBlock, provide, ref, toRef, watchEffect } from "vue";
//#region src/data-table/src/DataTable.tsx
var DataTable_default = defineComponent({
  name: "DataTable",
  alias: ["AdvancedTable"],
  props: dataTableProps,
  slots: Object,
  setup(props, {
    slots
  }) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.onPageChange !== void 0) warnOnce("data-table", "`on-page-change` is deprecated, please use `on-update:page` instead.");
      if (props.onPageSizeChange !== void 0) warnOnce("data-table", "`on-page-size-change` is deprecated, please use `on-update:page-size` instead.");
      if (props.onSorterChange !== void 0) warnOnce("data-table", "`on-sorter-change` is deprecated, please use `on-update:sorter` instead.");
      if (props.onFiltersChange !== void 0) warnOnce("data-table", "`on-filters-change` is deprecated, please use `on-update:filters` instead.");
      if (props.onCheckedRowKeysChange !== void 0) warnOnce("data-table", "`on-checked-row-keys-change` is deprecated, please use `on-update:checked-row-keys` instead.");
    });
    const {
      mergedBorderedRef,
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef,
      mergedComponentPropsRef
    } = useConfig(props);
    const rtlEnabledRef = useRtl("DataTable", mergedRtlRef, mergedClsPrefixRef);
    const mergedSizeRef = computed(() => {
      return props.size || mergedComponentPropsRef?.value?.DataTable?.size || "medium";
    });
    const mergedBottomBorderedRef = computed(() => {
      const {
        bottomBordered
      } = props;
      if (mergedBorderedRef.value) return false;
      if (bottomBordered !== void 0) return bottomBordered;
      return true;
    });
    const themeRef = useTheme("DataTable", "-data-table", index_cssr_default, dataTableLight, props, mergedClsPrefixRef);
    const bodyWidthRef = ref(null);
    const mainTableInstRef = ref(null);
    const {
      getResizableWidth,
      clearResizableWidth,
      doUpdateResizableWidth
    } = useResizable();
    const {
      rowsRef,
      colsRef,
      dataRelatedColsRef,
      hasEllipsisRef
    } = useGroupHeader(props, getResizableWidth);
    const {
      treeMateRef,
      mergedCurrentPageRef,
      paginatedDataRef,
      rawPaginatedDataRef,
      rawSortedDataRef,
      selectionColumnRef,
      hoverKeyRef,
      mergedPaginationRef,
      mergedFilterStateRef,
      mergedSortStateRef,
      childTriggerColIndexRef,
      doUpdatePage,
      doUpdateFilters,
      onUnstableColumnResize,
      deriveNextSorter,
      filter,
      filters,
      clearFilter,
      clearFilters,
      clearSorter,
      page,
      sort
    } = useTableData(props, {
      dataRelatedColsRef
    });
    const mergedEmptyRef = computed(() => paginatedDataRef.value.length === 0);
    const downloadCsv = options => {
      const {
        fileName = "data.csv",
        keepOriginalData = false
      } = options || {};
      const data = keepOriginalData ? props.data : rawPaginatedDataRef.value;
      const csvData = generateCsv(props.columns, data, props.getCsvCell, props.getCsvHeader);
      const blob = new Blob([csvData], {
        type: "text/csv;charset=utf-8"
      });
      const downloadUrl = URL.createObjectURL(blob);
      download(downloadUrl, fileName.endsWith(".csv") ? fileName : `${fileName}.csv`);
      URL.revokeObjectURL(downloadUrl);
    };
    const {
      doCheckAll,
      doUncheckAll,
      doCheck,
      doUncheck,
      headerCheckboxDisabledRef,
      someRowsCheckedRef,
      allRowsCheckedRef,
      mergedCheckedRowKeySetRef,
      mergedInderminateRowKeySetRef
    } = useCheck(props, {
      selectionColumnRef,
      treeMateRef,
      paginatedDataRef
    });
    const {
      stickyExpandedRowsRef,
      mergedExpandedRowKeysRef,
      renderExpandRef,
      expandableRef,
      doUpdateExpandedRowKeys
    } = useExpand(props, treeMateRef);
    const maxHeightRef = toRef(props, "maxHeight");
    const mergedTableLayoutRef = computed(() => {
      if (props.virtualScroll || props.flexHeight || props.maxHeight !== void 0 || hasEllipsisRef.value) return "fixed";
      return props.tableLayout;
    });
    const {
      handleTableBodyScroll,
      handleTableHeaderScroll,
      syncScrollState,
      setHeaderScrollLeft,
      leftActiveFixedColKeyRef,
      leftActiveFixedChildrenColKeysRef,
      rightActiveFixedColKeyRef,
      rightActiveFixedChildrenColKeysRef,
      leftFixedColumnsRef,
      rightFixedColumnsRef,
      fixedColumnLeftMapRef,
      fixedColumnRightMapRef,
      xScrollableRef,
      explicitlyScrollableRef
    } = useScroll(props, {
      bodyWidthRef,
      mainTableInstRef,
      mergedCurrentPageRef,
      maxHeightRef,
      mergedTableLayoutRef,
      mergedEmptyRef
    });
    const {
      localeRef
    } = useLocale("DataTable");
    provide(dataTableInjectionKey, {
      xScrollableRef,
      explicitlyScrollableRef,
      props,
      treeMateRef,
      renderExpandIconRef: toRef(props, "renderExpandIcon"),
      loadingKeySetRef: ref(/* @__PURE__ */new Set()),
      slots,
      indentRef: toRef(props, "indent"),
      childTriggerColIndexRef,
      bodyWidthRef,
      componentId: createId(),
      hoverKeyRef,
      mergedClsPrefixRef,
      mergedThemeRef: themeRef,
      scrollXRef: computed(() => props.scrollX),
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
      loadingRef: toRef(props, "loading"),
      rowClassNameRef: toRef(props, "rowClassName"),
      mergedCheckedRowKeySetRef,
      mergedExpandedRowKeysRef,
      mergedInderminateRowKeySetRef,
      localeRef,
      expandableRef,
      stickyExpandedRowsRef,
      rowKeyRef: toRef(props, "rowKey"),
      renderExpandRef,
      summaryRef: toRef(props, "summary"),
      virtualScrollRef: toRef(props, "virtualScroll"),
      virtualScrollXRef: toRef(props, "virtualScrollX"),
      heightForRowRef: toRef(props, "heightForRow"),
      minRowHeightRef: toRef(props, "minRowHeight"),
      virtualScrollHeaderRef: toRef(props, "virtualScrollHeader"),
      headerHeightRef: toRef(props, "headerHeight"),
      rowPropsRef: toRef(props, "rowProps"),
      stripedRef: toRef(props, "striped"),
      checkOptionsRef: computed(() => {
        const {
          value: selectionColumn
        } = selectionColumnRef;
        return selectionColumn?.options;
      }),
      rawPaginatedDataRef,
      filterMenuCssVarsRef: computed(() => {
        const {
          self: {
            actionDividerColor,
            actionPadding,
            actionButtonMargin
          }
        } = themeRef.value;
        return {
          "--n-action-padding": actionPadding,
          "--n-action-button-margin": actionButtonMargin,
          "--n-action-divider-color": actionDividerColor
        };
      }),
      onLoadRef: toRef(props, "onLoad"),
      mergedTableLayoutRef,
      maxHeightRef,
      minHeightRef: toRef(props, "minHeight"),
      flexHeightRef: toRef(props, "flexHeight"),
      headerCheckboxDisabledRef,
      paginationBehaviorOnFilterRef: toRef(props, "paginationBehaviorOnFilter"),
      summaryPlacementRef: toRef(props, "summaryPlacement"),
      filterIconPopoverPropsRef: toRef(props, "filterIconPopoverProps"),
      scrollbarPropsRef: toRef(props, "scrollbarProps"),
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
      renderCell: toRef(props, "renderCell")
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
    const cssVarsRef = computed(() => {
      const mergedSize = mergedSizeRef.value;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          borderColor,
          tdColorHover,
          tdColorSorting,
          tdColorSortingModal,
          tdColorSortingPopover,
          thColorSorting,
          thColorSortingModal,
          thColorSortingPopover,
          thColor,
          thColorHover,
          tdColor,
          tdTextColor,
          thTextColor,
          thFontWeight,
          thButtonColorHover,
          thIconColor,
          thIconColorActive,
          filterSize,
          borderRadius,
          lineHeight,
          tdColorModal,
          thColorModal,
          borderColorModal,
          thColorHoverModal,
          tdColorHoverModal,
          borderColorPopover,
          thColorPopover,
          tdColorPopover,
          tdColorHoverPopover,
          thColorHoverPopover,
          paginationMargin,
          emptyPadding,
          boxShadowAfter,
          boxShadowBefore,
          sorterSize,
          resizableContainerSize,
          resizableSize,
          loadingColor,
          loadingSize,
          opacityLoading,
          tdColorStriped,
          tdColorStripedModal,
          tdColorStripedPopover,
          [createKey("fontSize", mergedSize)]: fontSize,
          [createKey("thPadding", mergedSize)]: thPadding,
          [createKey("tdPadding", mergedSize)]: tdPadding
        }
      } = themeRef.value;
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
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("data-table", computed(() => mergedSizeRef.value[0]), cssVarsRef, props) : void 0;
    return {
      mainTableInstRef,
      mergedClsPrefix: mergedClsPrefixRef,
      rtlEnabled: rtlEnabledRef,
      mergedTheme: themeRef,
      paginatedData: paginatedDataRef,
      mergedBordered: mergedBorderedRef,
      mergedBottomBordered: mergedBottomBorderedRef,
      mergedPagination: mergedPaginationRef,
      mergedShowPagination: computed(() => {
        if (!props.pagination) return false;
        if (props.paginateSinglePage) return true;
        const mergedPagination = mergedPaginationRef.value;
        const {
          pageCount
        } = mergedPagination;
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
    const {
      mergedClsPrefix,
      themeClass,
      onRender,
      $slots,
      spinProps
    } = this;
    onRender?.();
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-data-table`, this.rtlEnabled && `${mergedClsPrefix}-data-table--rtl`, themeClass, {
        [`${mergedClsPrefix}-data-table--bordered`]: this.mergedBordered,
        [`${mergedClsPrefix}-data-table--bottom-bordered`]: this.mergedBottomBordered,
        [`${mergedClsPrefix}-data-table--single-line`]: this.singleLine,
        [`${mergedClsPrefix}-data-table--single-column`]: this.singleColumn,
        [`${mergedClsPrefix}-data-table--loading`]: this.loading,
        [`${mergedClsPrefix}-data-table--flex-height`]: this.flexHeight,
        [`${mergedClsPrefix}-data-table--empty`]: this.mergedEmpty
      }]),
      style: normalizeStyle(this.cssVars)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-data-table-wrapper`)
    }, [createVNode(MainTable_default, {
      ref: "mainTableInstRef"
    }, null, 512)], 2), this.mergedShowPagination ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-data-table__pagination`)
    }, [(openBlock(), createBlock(Pagination_default, mergeProps({
      theme: this.mergedTheme.peers.Pagination,
      themeOverrides: this.mergedTheme.peerOverrides.Pagination,
      disabled: this.loading
    }, this.mergedPagination), null, 16, ["theme", "themeOverrides", "disabled"]))], 2)) : normalizeVNode(() => null), createVNode(Transition, {
      name: "fade-in-scale-up-transition"
    }, {
      default: () => {
        return this.loading ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass$1(`${mergedClsPrefix}-data-table-loading-wrapper`)
        }, [normalizeVNode(() => resolveSlot($slots.loading, () => [(openBlock(), createBlock(Loading_default, mergeProps({
          clsPrefix: mergedClsPrefix,
          strokeWidth: 20
        }, spinProps), null, 16, ["clsPrefix"]))]))], 2)) : null;
      }
    }, 1024)], 6);
  }
});
//#endregion
export { DataTable_default as default };