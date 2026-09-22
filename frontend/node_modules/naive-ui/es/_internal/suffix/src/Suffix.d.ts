import { PropType } from "vue";
//#region src/_internal/suffix/src/Suffix.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  showArrow: {
    type: BooleanConstructor;
    default: undefined;
  };
  showClear: {
    type: BooleanConstructor;
    default: undefined;
  };
  loading: BooleanConstructor;
  onClear: PropType<(e: MouseEvent) => void>;
}>, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  showArrow: {
    type: BooleanConstructor;
    default: undefined;
  };
  showClear: {
    type: BooleanConstructor;
    default: undefined;
  };
  loading: BooleanConstructor;
  onClear: PropType<(e: MouseEvent) => void>;
}>> & Readonly<{}>, {
  loading: boolean;
  showArrow: boolean;
  showClear: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };