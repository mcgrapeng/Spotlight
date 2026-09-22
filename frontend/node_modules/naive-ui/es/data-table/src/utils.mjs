import { formatLength } from "../../_utils/css/format-length.mjs";
import { depx } from "seemly";
//#region src/data-table/src/utils.ts
const SELECTION_COL_WIDTH = 40;
const EXPAND_COL_WIDTH = 40;
function getNumberColWidth(col) {
  if (col.type === "selection") return col.width === void 0 ? 40 : depx(col.width);
  if (col.type === "expand") return col.width === void 0 ? 40 : depx(col.width);
  if ("children" in col) return void 0;
  if (typeof col.width === "string") return depx(col.width);
  return col.width;
}
function getStringColWidth(col) {
  if (col.type === "selection") return formatLength(col.width ?? 40);
  if (col.type === "expand") return formatLength(col.width ?? 40);
  if ("children" in col) return;
  return formatLength(col.width);
}
function getColKey(col) {
  if (col.type === "selection") return "__n_selection__";
  if (col.type === "expand") return "__n_expand__";
  return col.key;
}
function createShallowClonedObject(object) {
  if (!object) return object;
  if (typeof object === "object") return Object.assign({}, object);
  return object;
}
function getFlagOfOrder(order) {
  if (order === "ascend") return 1;else if (order === "descend") return -1;
  return 0;
}
function clampValueFollowCSSRules(value, min, max) {
  if (max !== void 0) value = Math.min(value, typeof max === "number" ? max : Number.parseFloat(max));
  if (min !== void 0) value = Math.max(value, typeof min === "number" ? min : Number.parseFloat(min));
  return value;
}
function createCustomWidthStyle(column, resizedWidth) {
  if (resizedWidth !== void 0) return {
    width: resizedWidth,
    minWidth: resizedWidth,
    maxWidth: resizedWidth
  };
  const width = getStringColWidth(column);
  const {
    minWidth,
    maxWidth
  } = column;
  return {
    width,
    minWidth: formatLength(minWidth) || width,
    maxWidth: formatLength(maxWidth)
  };
}
function createRowClassName(row, index, rowClassName) {
  if (typeof rowClassName === "function") return rowClassName(row, index);
  return rowClassName || "";
}
function shouldUseArrayInSingleMode(column) {
  return column.filterOptionValues !== void 0 || column.filterOptionValue === void 0 && column.defaultFilterOptionValues !== void 0;
}
function isColumnSortable(column) {
  if ("children" in column) return false;
  return !!column.sorter;
}
function isColumnResizable(column) {
  if ("children" in column && !!column.children.length) return false;
  return !!column.resizable;
}
function isColumnFilterable(column) {
  if ("children" in column) return false;
  return !!column.filter && (!!column.filterOptions || !!column.renderFilterMenu);
}
function getNextOrderOf(order) {
  if (!order) return "descend";else if (order === "descend") return "ascend";
  return false;
}
function createNextSorter(column, currentSortState) {
  if (column.sorter === void 0) return null;
  const {
    customNextSortOrder
  } = column;
  if (currentSortState === null || currentSortState.columnKey !== column.key) return {
    columnKey: column.key,
    sorter: column.sorter,
    order: getNextOrderOf(false)
  };else return {
    ...currentSortState,
    order: (customNextSortOrder || getNextOrderOf)(currentSortState.order)
  };
}
function isColumnSorting(column, mergedSortState) {
  return mergedSortState.find(state => state.columnKey === column.key && state.order) !== void 0;
}
function formatCsvCell(value) {
  if (typeof value === "string") return value.replace(/,/g, "\\,");else if (value === null || value === void 0) return "";else return `${value}`.replace(/,/g, "\\,");
}
function generateCsv(columns, data, getCsvCell, getCsvHeader) {
  const exportableColumns = columns.filter(column => column.type !== "expand" && column.type !== "selection" && column.allowExport !== false);
  return [exportableColumns.map(col => {
    return getCsvHeader ? getCsvHeader(col) : col.title;
  }).join(","), ...data.map(row => {
    return exportableColumns.map(col => {
      return getCsvCell ? getCsvCell(row[col.key], row, col) : formatCsvCell(row[col.key]);
    }).join(",");
  })].join("\n");
}
//#endregion
export { EXPAND_COL_WIDTH, SELECTION_COL_WIDTH, clampValueFollowCSSRules, createCustomWidthStyle, createNextSorter, createRowClassName, createShallowClonedObject, generateCsv, getColKey, getFlagOfOrder, getNumberColWidth, getStringColWidth, isColumnFilterable, isColumnResizable, isColumnSortable, isColumnSorting, shouldUseArrayInSingleMode };