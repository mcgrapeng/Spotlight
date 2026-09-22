import { ColumnKey, TableColumn } from "./interface.js";
//#region src/data-table/src/use-resizable.d.ts
declare function useResizable(): {
  getResizableWidth: (key: ColumnKey) => number | undefined;
  doUpdateResizableWidth: (column: TableColumn, width: number) => void;
  clearResizableWidth: () => void;
};
//#endregion
export { useResizable };