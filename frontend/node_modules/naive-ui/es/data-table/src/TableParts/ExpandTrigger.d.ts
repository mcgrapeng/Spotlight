import { RenderExpandIcon, RowData } from "../interface.js";
import { PropType } from "vue";
//#region src/data-table/src/TableParts/ExpandTrigger.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  expanded: BooleanConstructor;
  loading: BooleanConstructor;
  onClick: {
    type: PropType<() => void>;
    required: true;
  };
  renderExpandIcon: {
    type: PropType<RenderExpandIcon>;
  };
  rowData: {
    type: PropType<RowData>;
    required: true;
  };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  expanded: BooleanConstructor;
  loading: BooleanConstructor;
  onClick: {
    type: PropType<() => void>;
    required: true;
  };
  renderExpandIcon: {
    type: PropType<RenderExpandIcon>;
  };
  rowData: {
    type: PropType<RowData>;
    required: true;
  };
}>> & Readonly<{}>, {
  loading: boolean;
  expanded: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };