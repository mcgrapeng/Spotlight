import { ThemeCommonVars } from "../../_styles/common/light.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { ColorPickerThemeVars } from "../styles/light.js";
import "../styles/index.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { PropType } from "vue";
//#region src/color-picker/src/ColorInputUnit.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  label: {
    type: StringConstructor;
    required: true;
  };
  value: {
    type: PropType<number | string | null>;
    default: null;
  };
  showAlpha: BooleanConstructor;
  onUpdateValue: {
    type: PropType<(value: number | string) => void>;
    required: true;
  };
}>, {
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: ColorPickerThemeVars;
    peers: {
      Input: InputTheme;
      Button: ButtonTheme;
    };
    peerOverrides: {
      Input?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
      Button?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
  inputValue: import("vue").Ref<string, string>;
  handleInputChange: (value: string) => void;
  handleInputUpdateValue: (value: string) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  label: {
    type: StringConstructor;
    required: true;
  };
  value: {
    type: PropType<number | string | null>;
    default: null;
  };
  showAlpha: BooleanConstructor;
  onUpdateValue: {
    type: PropType<(value: number | string) => void>;
    required: true;
  };
}>> & Readonly<{}>, {
  value: string | number | null;
  showAlpha: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };