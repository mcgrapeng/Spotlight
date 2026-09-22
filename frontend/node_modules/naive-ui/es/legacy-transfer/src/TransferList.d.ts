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
import { Option } from "./interface.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { PropType } from "vue";
//#region src/legacy-transfer/src/TransferList.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  virtualScroll: {
    type: BooleanConstructor;
    required: true;
  };
  itemSize: {
    type: NumberConstructor;
    required: true;
  };
  options: {
    type: PropType<Option[]>;
    required: true;
  };
  disabled: {
    type: BooleanConstructor;
    required: true;
  };
  isMounted: {
    type: BooleanConstructor;
    required: true;
  };
  isInputing: {
    type: BooleanConstructor;
    required: true;
  };
  source: BooleanConstructor;
}>, {
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
  mergedClsPrefix: import("vue").Ref<string, string>;
  mergedRenderEmpty: import("vue").ComputedRef<(() => import("vue").VNodeChild) | undefined>;
  scrollerInstRef: unknown;
  vlInstRef: unknown;
  syncVLScroller: () => void;
  scrollContainer: () => HTMLElement | null;
  scrollContent: () => HTMLElement | null;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  virtualScroll: {
    type: BooleanConstructor;
    required: true;
  };
  itemSize: {
    type: NumberConstructor;
    required: true;
  };
  options: {
    type: PropType<Option[]>;
    required: true;
  };
  disabled: {
    type: BooleanConstructor;
    required: true;
  };
  isMounted: {
    type: BooleanConstructor;
    required: true;
  };
  isInputing: {
    type: BooleanConstructor;
    required: true;
  };
  source: BooleanConstructor;
}>> & Readonly<{}>, {
  source: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };