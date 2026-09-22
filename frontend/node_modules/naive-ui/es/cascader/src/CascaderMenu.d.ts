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
import { CascaderSubmenuInstance, MenuModel, Value } from "./interface.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { PropType } from "vue";
import { FollowerPlacement } from "vueuc";
//#region src/cascader/src/CascaderMenu.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  value: PropType<Value | null>;
  placement: {
    type: PropType<FollowerPlacement>;
    default: string;
  };
  show: BooleanConstructor;
  menuModel: {
    type: PropType<MenuModel>;
    required: true;
  };
  loading: BooleanConstructor;
  onFocus: {
    type: PropType<(e: FocusEvent) => void>;
    required: true;
  };
  onBlur: {
    type: PropType<(e: FocusEvent) => void>;
    required: true;
  };
  onKeydown: {
    type: PropType<(e: KeyboardEvent) => void>;
    required: true;
  };
  onMousedown: {
    type: PropType<(e: MouseEvent) => void>;
    required: true;
  };
  onTabout: {
    type: PropType<() => void>;
    required: true;
  };
}>, {
  scroll: (depth: number, index: number, elSize: number) => void;
  showErrorMessage: (label: string) => void;
  isMounted: import("vue").Ref<boolean, boolean>;
  mergedClsPrefix: import("vue").Ref<string, string>;
  selfElRef: import("vue").Ref<HTMLElement | null, HTMLElement | null>;
  submenuInstRefs: CascaderSubmenuInstance[];
  maskInstRef: unknown;
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
  mergedRenderEmpty: import("vue").ComputedRef<(() => import("vue").VNodeChild) | undefined>;
  getColumnStyle: import("vue").Ref<((detail: {
    level: number;
  }) => string | import("vue").CSSProperties) | undefined, ((detail: {
    level: number;
  }) => string | import("vue").CSSProperties) | undefined>;
  handleFocusin: (e: FocusEvent) => void;
  handleFocusout: (e: FocusEvent) => void;
  handleClickOutside: (e: MouseEvent) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  value: PropType<Value | null>;
  placement: {
    type: PropType<FollowerPlacement>;
    default: string;
  };
  show: BooleanConstructor;
  menuModel: {
    type: PropType<MenuModel>;
    required: true;
  };
  loading: BooleanConstructor;
  onFocus: {
    type: PropType<(e: FocusEvent) => void>;
    required: true;
  };
  onBlur: {
    type: PropType<(e: FocusEvent) => void>;
    required: true;
  };
  onKeydown: {
    type: PropType<(e: KeyboardEvent) => void>;
    required: true;
  };
  onMousedown: {
    type: PropType<(e: MouseEvent) => void>;
    required: true;
  };
  onTabout: {
    type: PropType<() => void>;
    required: true;
  };
}>> & Readonly<{}>, {
  loading: boolean;
  placement: FollowerPlacement;
  show: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };