import { DataTableTheme } from "../../styles/light.js";
import "../../styles/index.js";
import { InternalRowData, TableBaseColumn } from "../interface.js";
import { MergedTheme } from "../../../_mixins/use-theme.js";
import "../../../_mixins/index.js";
import { PropType, VNodeChild } from "vue";
//#region src/data-table/src/TableParts/Cell.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  row: {
    type: PropType<InternalRowData>;
    required: true;
  };
  index: {
    type: NumberConstructor;
    required: true;
  };
  column: {
    type: PropType<TableBaseColumn>;
    required: true;
  };
  isSummary: BooleanConstructor;
  mergedTheme: {
    type: PropType<MergedTheme<DataTableTheme>>;
    required: true;
  };
  renderCell: PropType<(value: any, rowData: object, column: any) => VNodeChild>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  row: {
    type: PropType<InternalRowData>;
    required: true;
  };
  index: {
    type: NumberConstructor;
    required: true;
  };
  column: {
    type: PropType<TableBaseColumn>;
    required: true;
  };
  isSummary: BooleanConstructor;
  mergedTheme: {
    type: PropType<MergedTheme<DataTableTheme>>;
    required: true;
  };
  renderCell: PropType<(value: any, rowData: object, column: any) => VNodeChild>;
}>> & Readonly<{}>, {
  isSummary: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };