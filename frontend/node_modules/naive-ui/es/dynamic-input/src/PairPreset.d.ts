import { ThemeCommonVars } from "../../_styles/common/light.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { DynamicInputThemeVars } from "../styles/light.js";
import "../styles/index.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { PropType } from "vue";
//#region src/dynamic-input/src/PairPreset.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  value: {
    type: PropType<{
      key: string;
      value: string;
    }>;
    default: () => {
      key: string;
      value: string;
    };
  };
  disabled: BooleanConstructor;
  parentPath: StringConstructor;
  path: StringConstructor;
  onUpdateValue: {
    type: PropType<(data: {
      key: string;
      value: string;
    }) => void>;
    required: true;
  };
}>, {
  mergedTheme: import("vue").Ref<{
    common: ThemeCommonVars;
    self: DynamicInputThemeVars;
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
  }, {
    common: ThemeCommonVars;
    self: DynamicInputThemeVars;
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
  keyPlaceholder: import("vue").Ref<string | undefined, string | undefined>;
  valuePlaceholder: import("vue").Ref<string | undefined, string | undefined>;
  handleKeyInput(key: string): void;
  handleValueInput(value: string): void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  value: {
    type: PropType<{
      key: string;
      value: string;
    }>;
    default: () => {
      key: string;
      value: string;
    };
  };
  disabled: BooleanConstructor;
  parentPath: StringConstructor;
  path: StringConstructor;
  onUpdateValue: {
    type: PropType<(data: {
      key: string;
      value: string;
    }) => void>;
    required: true;
  };
}>> & Readonly<{}>, {
  disabled: boolean;
  value: {
    key: string;
    value: string;
  };
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };