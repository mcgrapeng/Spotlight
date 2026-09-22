import { DataTableGetCsvCell, DataTableGetCsvHeader } from "./public-types.js";
import { CreateRowClassName, InternalRowData, RowData, SortOrder, SortOrderFlag, SortState, TableBaseColumn, TableColumn, TableExpandColumn, TableSelectionColumn } from "./interface.js";
import { CSSProperties } from "vue";
//#region src/data-table/src/utils.d.ts
declare const SELECTION_COL_WIDTH = 40;
declare const EXPAND_COL_WIDTH = 40;
declare function getNumberColWidth(col: TableColumn): number | undefined;
declare function getStringColWidth(col: TableColumn): string | undefined;
declare function getColKey(col: TableColumn): string | number;
declare function createShallowClonedObject<T>(object: T): T;
declare function getFlagOfOrder(order: SortOrder): SortOrderFlag;
declare function clampValueFollowCSSRules(value: number, min?: number | string, max?: number | string): number;
declare function createCustomWidthStyle(column: TableBaseColumn | TableSelectionColumn | TableExpandColumn, resizedWidth?: string): CSSProperties;
declare function createRowClassName(row: InternalRowData, index: number, rowClassName?: string | CreateRowClassName): string;
declare function shouldUseArrayInSingleMode(column: TableBaseColumn): boolean;
declare function isColumnSortable(column: TableColumn): boolean;
declare function isColumnResizable(column: TableColumn): boolean;
declare function isColumnFilterable(column: TableColumn): boolean;
declare function createNextSorter(column: TableBaseColumn, currentSortState: SortState | null): SortState | null;
declare function isColumnSorting(column: TableColumn, mergedSortState: SortState[]): boolean;
declare function generateCsv(columns: TableColumn[], data: RowData[], getCsvCell: DataTableGetCsvCell | undefined, getCsvHeader: DataTableGetCsvHeader | undefined): string;
//#endregion
export { EXPAND_COL_WIDTH, SELECTION_COL_WIDTH, clampValueFollowCSSRules, createCustomWidthStyle, createNextSorter, createRowClassName, createShallowClonedObject, generateCsv, getColKey, getFlagOfOrder, getNumberColWidth, getStringColWidth, isColumnFilterable, isColumnResizable, isColumnSortable, isColumnSorting, shouldUseArrayInSingleMode };