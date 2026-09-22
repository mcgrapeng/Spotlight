import { formatLength } from "../../_utils/css/format-length.mjs";
import { createCustomWidthStyle, getColKey } from "./utils.mjs";
import { computed } from "vue";
//#region src/data-table/src/use-group-header.ts
function getRowsAndCols(columns, getResizableWidth) {
  const rows = [];
  const cols = [];
  const dataRelatedCols = [];
  const rowItemMap = /* @__PURE__ */new WeakMap();
  let maxDepth = -1;
  let totalRowSpan = 0;
  let hasEllipsis = false;
  let currentLeafIndex = 0;
  function ensureMaxDepth(columns, currentDepth) {
    if (currentDepth > maxDepth) {
      rows[currentDepth] = [];
      maxDepth = currentDepth;
    }
    columns.forEach(column => {
      if ("children" in column) ensureMaxDepth(column.children, currentDepth + 1);else {
        const key = "key" in column ? column.key : void 0;
        cols.push({
          key: getColKey(column),
          style: createCustomWidthStyle(column, key !== void 0 ? formatLength(getResizableWidth(key)) : void 0),
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
    columns.forEach(column => {
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
        column.children.forEach(childColumn => {
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
  const rowsAndCols = computed(() => getRowsAndCols(props.columns, getResizableWidth));
  return {
    rowsRef: computed(() => rowsAndCols.value.rows),
    colsRef: computed(() => rowsAndCols.value.cols),
    hasEllipsisRef: computed(() => rowsAndCols.value.hasEllipsis),
    dataRelatedColsRef: computed(() => rowsAndCols.value.dataRelatedCols)
  };
}
//#endregion
export { useGroupHeader };