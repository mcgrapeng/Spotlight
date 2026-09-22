import { RowKey } from "../interface.js";
import { PropType } from "vue";
//#region src/data-table/src/TableParts/BodyCheckbox.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  rowKey: {
    type: PropType<RowKey>;
    required: true;
  };
  disabled: {
    type: BooleanConstructor;
    required: true;
  };
  onUpdateChecked: {
    type: PropType<(checked: boolean, e: MouseEvent | KeyboardEvent) => void>;
    required: true;
  };
}>, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  rowKey: {
    type: PropType<RowKey>;
    required: true;
  };
  disabled: {
    type: BooleanConstructor;
    required: true;
  };
  onUpdateChecked: {
    type: PropType<(checked: boolean, e: MouseEvent | KeyboardEvent) => void>;
    required: true;
  };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };