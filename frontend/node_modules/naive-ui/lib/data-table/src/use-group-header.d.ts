import { ColumnKey, DataTableSetupProps, TableBaseColumn, TableColumn, TableExpandColumn, TableSelectionColumn } from "./interface.js";
import { CSSProperties, ComputedRef } from "vue";
//#region src/data-table/src/use-group-header.d.ts
interface RowItem {
  colSpan: number;
  rowSpan: number;
  column: TableColumn;
  colIndex: number;
  isLast: boolean;
}
interface ColItem {
  key: string | number;
  style: CSSProperties;
  column: TableSelectionColumn | TableExpandColumn | TableBaseColumn;
  index: number;
  /**
   * The width property is only applied to horizontally virtual scroll table
   */
  width: number;
}
declare function useGroupHeader(props: DataTableSetupProps, getResizableWidth: (key: ColumnKey) => number | undefined): {
  rowsRef: ComputedRef<RowItem[][]>;
  colsRef: ComputedRef<ColItem[]>;
  hasEllipsisRef: ComputedRef<boolean>;
  dataRelatedColsRef: ComputedRef<Array<TableSelectionColumn | TableBaseColumn | TableExpandColumn>>;
};
//#endregion
export { ColItem, RowItem, useGroupHeader };