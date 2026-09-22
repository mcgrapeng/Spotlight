import { PropType } from "vue";
//#region src/_internal/clear/src/Clear.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  show: BooleanConstructor;
  onClear: PropType<(e: MouseEvent) => void>;
}>, {
  handleMouseDown(e: MouseEvent): void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  show: BooleanConstructor;
  onClear: PropType<(e: MouseEvent) => void>;
}>> & Readonly<{}>, {
  show: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };