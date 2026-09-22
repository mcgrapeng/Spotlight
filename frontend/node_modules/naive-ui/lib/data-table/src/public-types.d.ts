import { SharedSpinProps } from "../../_internal/loading/src/Loading.js";
import "../../_internal/index.js";
import { TableBaseColumn } from "./interface.js";
//#region src/data-table/src/public-types.d.ts
type DataTableGetCsvCell = (value: any, rowData: object, column: TableBaseColumn) => string;
type DataTableGetCsvHeader = (column: TableBaseColumn) => string;
type DataTableSize = 'small' | 'medium' | 'large';
type DataTableSpinProps = SharedSpinProps;
//#endregion
export { DataTableGetCsvCell, DataTableGetCsvHeader, DataTableSize, DataTableSpinProps };