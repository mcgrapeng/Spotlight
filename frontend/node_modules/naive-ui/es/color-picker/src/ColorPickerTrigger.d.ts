import { HSLA } from "seemly";
import { PropType, SlotsType } from "vue";
//#region src/color-picker/src/ColorPickerTrigger.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  value: {
    type: PropType<string | null>;
    default: null;
  };
  hsla: {
    type: PropType<HSLA | null>;
    default: null;
  };
  disabled: BooleanConstructor;
  onClick: PropType<() => void>;
}>, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  value: {
    type: PropType<string | null>;
    default: null;
  };
  hsla: {
    type: PropType<HSLA | null>;
    default: null;
  };
  disabled: BooleanConstructor;
  onClick: PropType<() => void>;
}>> & Readonly<{}>, {
  disabled: boolean;
  value: string | null;
  hsla: HSLA | null;
}, SlotsType<Record<string, never>>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };