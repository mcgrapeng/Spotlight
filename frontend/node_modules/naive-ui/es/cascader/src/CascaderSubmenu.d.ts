import { ThemeCommonVars } from "../../_styles/common/light.js";
import { EmptyTheme } from "../../empty/styles/light.js";
import "../../empty/styles/index.js";
import { InternalSelectMenuTheme } from "../../_internal/select-menu/styles/light.js";
import "../../_internal/select-menu/styles/index.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import { InternalSelectionTheme } from "../../_internal/selection/styles/light.js";
import "../../_internal/selection/styles/index.js";
import { CheckboxTheme } from "../../checkbox/styles/light.js";
import "../../checkbox/styles/index.js";
import { CascaderThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { TmNode } from "./interface.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { PropType } from "vue";
//#region src/cascader/src/CascaderSubmenu.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  depth: {
    type: NumberConstructor;
    required: true;
  };
  tmNodes: {
    type: PropType<TmNode[]>;
    required: true;
  };
}>, {
  scroll: (index: number, elSize: number) => void;
  mergedClsPrefix: import("vue").Ref<string, string>;
  mergedTheme: import("vue").Ref<{
    common: ThemeCommonVars;
    self: CascaderThemeVars;
    peers: {
      InternalSelectMenu: InternalSelectMenuTheme;
      InternalSelection: InternalSelectionTheme;
      Scrollbar: ScrollbarTheme;
      Checkbox: CheckboxTheme;
      Empty: EmptyTheme;
    };
    peerOverrides: {
      InternalSelectMenu?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
          Empty?: ExtractThemeOverrides<EmptyTheme> | undefined;
        } | undefined;
      } | undefined;
      InternalSelection?: {
        peers?: {
          Popover?: ExtractThemeOverrides<PopoverTheme> | undefined;
        } | undefined;
      } | undefined;
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Checkbox?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Empty?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }, {
    common: ThemeCommonVars;
    self: CascaderThemeVars;
    peers: {
      InternalSelectMenu: InternalSelectMenuTheme;
      InternalSelection: InternalSelectionTheme;
      Scrollbar: ScrollbarTheme;
      Checkbox: CheckboxTheme;
      Empty: EmptyTheme;
    };
    peerOverrides: {
      InternalSelectMenu?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
          Empty?: ExtractThemeOverrides<EmptyTheme> | undefined;
        } | undefined;
      } | undefined;
      InternalSelection?: {
        peers?: {
          Popover?: ExtractThemeOverrides<PopoverTheme> | undefined;
        } | undefined;
      } | undefined;
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Checkbox?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Empty?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
  scrollbarInstRef: unknown;
  vlInstRef: unknown;
  virtualScroll: import("vue").Ref<boolean, boolean>;
  itemSize: import("vue").ComputedRef<number>;
  handleVlScroll: () => void;
  getVlContainer: () => HTMLElement | undefined;
  getVlContent: () => HTMLElement | null | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  depth: {
    type: NumberConstructor;
    required: true;
  };
  tmNodes: {
    type: PropType<TmNode[]>;
    required: true;
  };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };