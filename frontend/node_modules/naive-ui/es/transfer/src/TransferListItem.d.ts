import { ThemeCommonVars } from "../../_styles/common/light.js";
import { EmptyTheme } from "../../empty/styles/light.js";
import "../../empty/styles/index.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { CheckboxTheme } from "../../checkbox/styles/light.js";
import "../../checkbox/styles/index.js";
import { TransferThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { Option, TransferRenderSourceLabel, TransferRenderTargetLabel } from "./interface.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { PropType } from "vue";
//#region src/transfer/src/TransferListItem.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  source: BooleanConstructor;
  label: {
    type: StringConstructor;
    required: true;
  };
  value: {
    type: (StringConstructor | NumberConstructor)[];
    required: true;
  };
  disabled: BooleanConstructor;
  option: {
    type: PropType<Option>;
    required: true;
  };
}>, {
  mergedClsPrefix: import("vue").Ref<string, string>;
  mergedTheme: import("vue").Ref<{
    common: ThemeCommonVars;
    self: TransferThemeVars;
    peers: {
      Checkbox: CheckboxTheme;
      Scrollbar: ScrollbarTheme;
      Input: InputTheme;
      Empty: EmptyTheme;
      Button: ButtonTheme;
    };
    peerOverrides: {
      Checkbox?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Input?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
      Empty?: {
        peers?: {
          [x: string]: any;
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
    self: TransferThemeVars;
    peers: {
      Checkbox: CheckboxTheme;
      Scrollbar: ScrollbarTheme;
      Input: InputTheme;
      Empty: EmptyTheme;
      Button: ButtonTheme;
    };
    peerOverrides: {
      Checkbox?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Input?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
      Empty?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Button?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
  checked: import("vue").ComputedRef<boolean>;
  showSelected: import("vue").Ref<boolean, boolean>;
  renderSourceLabel: import("vue").Ref<TransferRenderSourceLabel | undefined, TransferRenderSourceLabel | undefined>;
  renderTargetLabel: import("vue").Ref<TransferRenderTargetLabel | undefined, TransferRenderTargetLabel | undefined>;
  handleClick: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  source: BooleanConstructor;
  label: {
    type: StringConstructor;
    required: true;
  };
  value: {
    type: (StringConstructor | NumberConstructor)[];
    required: true;
  };
  disabled: BooleanConstructor;
  option: {
    type: PropType<Option>;
    required: true;
  };
}>> & Readonly<{}>, {
  source: boolean;
  disabled: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };