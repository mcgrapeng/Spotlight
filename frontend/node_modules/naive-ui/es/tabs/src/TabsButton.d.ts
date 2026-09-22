import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import { PropType } from "vue";
//#region src/tabs/src/TabsButton.d.ts
type ButtonTypes = 'prev' | 'next';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  type: {
    type: PropType<ButtonTypes>;
    default: string;
  };
  mergedClsPrefix: {
    type: StringConstructor;
    required: true;
  };
  vertical: BooleanConstructor;
  disabled: BooleanConstructor;
  rtl: BooleanConstructor;
  theme: PropType<ButtonTheme>;
  themeOverrides: PropType<ExtractThemeOverrides<ButtonTheme>>;
  onClick: PropType<(type: ButtonTypes) => void>;
}>, {
  handleClick: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  type: {
    type: PropType<ButtonTypes>;
    default: string;
  };
  mergedClsPrefix: {
    type: StringConstructor;
    required: true;
  };
  vertical: BooleanConstructor;
  disabled: BooleanConstructor;
  rtl: BooleanConstructor;
  theme: PropType<ButtonTheme>;
  themeOverrides: PropType<ExtractThemeOverrides<ButtonTheme>>;
  onClick: PropType<(type: ButtonTypes) => void>;
}>> & Readonly<{}>, {
  type: ButtonTypes;
  disabled: boolean;
  vertical: boolean;
  rtl: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };