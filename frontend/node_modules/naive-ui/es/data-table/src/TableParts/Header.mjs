import { formatLength } from "../../../_utils/css/format-length.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import Checkbox_default from "../../../checkbox/src/Checkbox.mjs";
import { dataTableInjectionKey } from "../interface.mjs";
import { clampValueFollowCSSRules, createNextSorter, getColKey, isColumnFilterable, isColumnResizable, isColumnSortable, isColumnSorting } from "../utils.mjs";
import Ellipsis_default from "../../../ellipsis/src/Ellipsis.mjs";
import FilterButton_default from "../HeaderButton/FilterButton.mjs";
import ResizeButton_default from "../HeaderButton/ResizeButton.mjs";
import SortButton_default from "../HeaderButton/SortButton.mjs";
import SelectionMenu_default from "./SelectionMenu.mjs";
import { happensIn, pxfy } from "seemly";
import { Fragment, createBlock, createElementBlock, createElementVNode, defineComponent, inject, mergeProps, normalizeStyle, openBlock, ref, withCtx } from "vue";
import { VVirtualList } from "vueuc";
//#region src/data-table/src/TableParts/Header.tsx
const _hoisted_1 = ["data-n-id"];
const _hoisted_2 = ["colspan"];
const _hoisted_3 = {
  style: {
    position: "relative"
  }
};
const _hoisted_4 = ["data-n-id"];
const _hoisted_5 = ["onScroll"];
function renderTitle(column) {
  return typeof column.title === "function" ? column.title(column) : column.title;
}
const VirtualListItemWrapper = defineComponent({
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
    const {
      clsPrefix,
      id,
      cols,
      width
    } = this;
    return openBlock(), createElementBlock("table", {
      style: normalizeStyle({
        tableLayout: "fixed",
        width
      }),
      class: normalizeClass$1(`${clsPrefix}-data-table-table`)
    }, [createElementVNode("colgroup", null, [normalizeVNode(() => cols.map(col => (openBlock(), createElementBlock("col", {
      key: col.key,
      style: normalizeStyle(col.style)
    }, null, 4))))]), createElementVNode("thead", {
      "data-n-id": id,
      class: normalizeClass$1(`${clsPrefix}-data-table-thead`)
    }, [normalizeVNode(() => this.$slots.default?.())], 10, _hoisted_1)], 6);
  }
});
var Header_default = defineComponent({
  name: "DataTableHeader",
  props: {
    discrete: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const {
      mergedClsPrefixRef,
      scrollXRef,
      fixedColumnLeftMapRef,
      fixedColumnRightMapRef,
      mergedCurrentPageRef,
      allRowsCheckedRef,
      someRowsCheckedRef,
      rowsRef,
      colsRef,
      mergedThemeRef,
      checkOptionsRef,
      mergedSortStateRef,
      componentId,
      mergedTableLayoutRef,
      headerCheckboxDisabledRef,
      virtualScrollHeaderRef,
      headerHeightRef,
      onUnstableColumnResize,
      doUpdateResizableWidth,
      handleTableHeaderScroll,
      deriveNextSorter,
      doUncheckAll,
      doCheckAll
    } = inject(dataTableInjectionKey);
    const virtualListRef = ref();
    const cellElsRef = ref({});
    function getCellActualWidth(key) {
      return cellElsRef.value[key]?.getBoundingClientRect().width;
    }
    function handleCheckboxUpdateChecked() {
      if (allRowsCheckedRef.value) doUncheckAll();else doCheckAll();
    }
    function handleColHeaderClick(e, column) {
      if (happensIn(e, "dataTableFilter") || happensIn(e, "dataTableResizable")) return;
      if (!isColumnSortable(column)) return;
      const activeSorter = mergedSortStateRef.value.find(state => state.columnKey === column.key) || null;
      const nextSorter = createNextSorter(column, activeSorter);
      deriveNextSorter(nextSorter);
    }
    const resizeStartWidthMap = /* @__PURE__ */new Map();
    function handleColumnResizeStart(column) {
      resizeStartWidthMap.set(column.key, getCellActualWidth(column.key));
    }
    function handleColumnResize(column, displacementX) {
      const startWidth = resizeStartWidthMap.get(column.key);
      if (startWidth === void 0) return;
      const widthAfterResize = startWidth + displacementX;
      const limitWidth = clampValueFollowCSSRules(widthAfterResize, column.minWidth, column.maxWidth);
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
    const {
      cellElsRef,
      mergedClsPrefix,
      fixedColumnLeftMap,
      fixedColumnRightMap,
      currentPage,
      allRowsChecked,
      someRowsChecked,
      rows,
      cols,
      mergedTheme,
      checkOptions,
      componentId,
      discrete,
      mergedTableLayout,
      headerCheckboxDisabled,
      mergedSortState,
      virtualScrollHeader,
      handleColHeaderClick,
      handleCheckboxUpdateChecked,
      handleColumnResizeStart,
      handleColumnResize
    } = this;
    let hasEllipsis = false;
    const renderRow = (row, getLeft, headerHeightPx) => row.map(({
      column,
      colIndex,
      colSpan,
      rowSpan,
      isLast
    }) => {
      const key = getColKey(column);
      const {
        ellipsis
      } = column;
      if (!hasEllipsis && ellipsis) hasEllipsis = true;
      const createColumnVNode = () => {
        if (column.type === "selection") return column.multiple !== false ? (openBlock(), createElementBlock(Fragment, {
          key: 1
        }, [(openBlock(), createBlock(Checkbox_default, {
          key: currentPage,
          privateInsideTable: true,
          checked: allRowsChecked,
          indeterminate: someRowsChecked,
          disabled: headerCheckboxDisabled,
          onUpdateChecked: handleCheckboxUpdateChecked
        }, null, 8, ["checked", "indeterminate", "disabled", "onUpdateChecked"])), checkOptions ? (openBlock(), createBlock(SelectionMenu_default, {
          key: 0,
          clsPrefix: mergedClsPrefix
        }, null, 8, ["clsPrefix"])) : normalizeVNode(() => null)], 64)) : null;
        return openBlock(), createElementBlock(Fragment, null, [createElementVNode("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-data-table-th__title-wrapper`)
        }, [createElementVNode("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-data-table-th__title`)
        }, [ellipsis === true || ellipsis && !ellipsis.tooltip ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass$1(`${mergedClsPrefix}-data-table-th__ellipsis`)
        }, [normalizeVNode(() => renderTitle(column))], 2)) : (openBlock(), createElementBlock(Fragment, {
          key: 1
        }, [ellipsis && typeof ellipsis === "object" ? (openBlock(), createBlock(Ellipsis_default, mergeProps({
          key: 0
        }, ellipsis, {
          theme: mergedTheme.peers.Ellipsis,
          themeOverrides: mergedTheme.peerOverrides.Ellipsis
        }), {
          default: () => renderTitle(column)
        }, 1040, ["theme", "themeOverrides"])) : (openBlock(), createElementBlock(Fragment, {
          key: 1
        }, [normalizeVNode(() => renderTitle(column))], 64))], 64))], 2), isColumnSortable(column) ? (openBlock(), createBlock(SortButton_default, {
          key: 0,
          column
        }, null, 8, ["column"])) : normalizeVNode(() => null)], 2), isColumnFilterable(column) ? (openBlock(), createBlock(FilterButton_default, {
          key: 0,
          column,
          options: column.filterOptions
        }, null, 8, ["column", "options"])) : normalizeVNode(() => null), isColumnResizable(column) ? (openBlock(), createBlock(ResizeButton_default, {
          key: 2,
          onResizeStart: () => {
            handleColumnResizeStart(column);
          },
          onResize: displacementX => {
            handleColumnResize(column, displacementX);
          }
        }, null, 8, ["onResizeStart", "onResize"])) : normalizeVNode(() => null)], 64);
      };
      const leftFixed = key in fixedColumnLeftMap;
      const rightFixed = key in fixedColumnRightMap;
      const CellComponent = getLeft && !column.fixed ? "div" : "th";
      return openBlock(), createBlock(CellComponent, {
        ref: el => cellElsRef[key] = el,
        key,
        style: normalizeStyle([getLeft && !column.fixed ? {
          position: "absolute",
          left: pxfy(getLeft(colIndex)),
          top: 0,
          bottom: 0
        } : {
          left: pxfy(fixedColumnLeftMap[key]?.start),
          right: pxfy(fixedColumnRightMap[key]?.start)
        }, {
          width: pxfy(column.width),
          textAlign: column.titleAlign || column.align,
          height: headerHeightPx
        }]),
        colspan: colSpan,
        rowspan: rowSpan,
        "data-col-key": key,
        class: normalizeClass$1([`${mergedClsPrefix}-data-table-th`, (leftFixed || rightFixed) && `${mergedClsPrefix}-data-table-th--fixed-${leftFixed ? "left" : "right"}`, {
          [`${mergedClsPrefix}-data-table-th--sorting`]: isColumnSorting(column, mergedSortState),
          [`${mergedClsPrefix}-data-table-th--filterable`]: isColumnFilterable(column),
          [`${mergedClsPrefix}-data-table-th--sortable`]: isColumnSortable(column),
          [`${mergedClsPrefix}-data-table-th--selection`]: column.type === "selection",
          [`${mergedClsPrefix}-data-table-th--last`]: isLast
        }, column.className]),
        onClick: column.type !== "selection" && column.type !== "expand" && !("children" in column) ? e => {
          handleColHeaderClick(e, column);
        } : void 0
      }, {
        default: withCtx(() => [normalizeVNode(() => createColumnVNode())]),
        _: 2
      }, 1032, ["style", "colspan", "rowspan", "data-col-key", "class", "onClick"]);
    });
    if (virtualScrollHeader) {
      const {
        headerHeight
      } = this;
      let leftFixedColsCount = 0;
      let rightFixedColsCount = 0;
      cols.forEach(col => {
        if (col.column.fixed === "left") leftFixedColsCount++;else if (col.column.fixed === "right") rightFixedColsCount++;
      });
      return openBlock(), createBlock(VVirtualList, {
        key: 2,
        ref: "virtualListRef",
        class: normalizeClass$1(`${mergedClsPrefix}-data-table-base-table-header`),
        style: normalizeStyle({
          height: pxfy(headerHeight)
        }),
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
          width: formatLength(this.scrollX)
        },
        renderItemWithCols: ({
          startColIndex,
          endColIndex,
          getLeft
        }) => {
          const row = cols.map((col, index) => {
            return {
              column: col.column,
              isLast: index === cols.length - 1,
              colIndex: col.index,
              colSpan: 1,
              rowSpan: 1
            };
          }).filter(({
            column
          }, index) => {
            if (startColIndex <= index && index <= endColIndex) return true;
            if (column.fixed) return true;
            return false;
          });
          const cells = renderRow(row, getLeft, pxfy(headerHeight));
          cells.splice(leftFixedColsCount, 0, (openBlock(), createElementBlock("th", {
            colspan: cols.length - leftFixedColsCount - rightFixedColsCount,
            style: {
              pointerEvents: "none",
              visibility: "hidden",
              height: 0
            }
          }, null, 8, _hoisted_2)));
          return openBlock(), createElementBlock("tr", _hoisted_3, [normalizeVNode(() => cells)]);
        }
      }, {
        default: ({
          renderedItemWithCols
        }) => renderedItemWithCols
      }, 1032, ["class", "style", "onScroll", "columns", "itemSize", "visibleItemsTag", "visibleItemsProps", "renderItemWithCols"]);
    }
    const theadVNode = (openBlock(), createElementBlock("thead", {
      class: normalizeClass$1(`${mergedClsPrefix}-data-table-thead`),
      "data-n-id": componentId
    }, [normalizeVNode(() => rows.map(row => {
      return openBlock(), createElementBlock("tr", {
        class: normalizeClass$1(`${mergedClsPrefix}-data-table-tr`)
      }, [normalizeVNode(() => renderRow(row, null, void 0))], 2);
    }))], 10, _hoisted_4));
    if (!discrete) return theadVNode;
    const {
      handleTableHeaderScroll,
      scrollX
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-data-table-base-table-header`),
      onScroll: handleTableHeaderScroll
    }, [createElementVNode("table", {
      class: normalizeClass$1(`${mergedClsPrefix}-data-table-table`),
      style: normalizeStyle({
        minWidth: formatLength(scrollX),
        tableLayout: mergedTableLayout
      })
    }, [createElementVNode("colgroup", null, [normalizeVNode(() => cols.map(col => (openBlock(), createElementBlock("col", {
      key: col.key,
      style: normalizeStyle(col.style)
    }, null, 4))))]), normalizeVNode(() => theadVNode)], 6)], 42, _hoisted_5);
  }
});
//#endregion
export { Header_default as default };