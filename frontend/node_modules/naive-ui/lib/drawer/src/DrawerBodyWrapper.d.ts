import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ScrollbarProps } from "../../_internal/scrollbar/src/Scrollbar.js";
import "../../_internal/index.js";
import { DrawerThemeVars } from "../styles/light.js";
import "../styles/index.js";
import "../../index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, DirectiveArguments, PropType } from "vue";
//#region src/drawer/src/DrawerBodyWrapper.d.ts
type Placement = 'left' | 'right' | 'top' | 'bottom';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  blockScroll: BooleanConstructor;
  show: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  displayDirective: {
    type: PropType<"if" | "show">;
    required: true;
  };
  placement: {
    type: PropType<Placement>;
    required: true;
  };
  contentClass: StringConstructor;
  contentStyle: PropType<string | CSSProperties>;
  nativeScrollbar: {
    type: BooleanConstructor;
    required: true;
  };
  scrollbarProps: PropType<ScrollbarProps>;
  trapFocus: {
    type: BooleanConstructor;
    default: boolean;
  };
  autoFocus: {
    type: BooleanConstructor;
    default: boolean;
  };
  showMask: {
    type: PropType<boolean | "transparent">;
    required: true;
  };
  maxWidth: NumberConstructor;
  maxHeight: NumberConstructor;
  minWidth: NumberConstructor;
  minHeight: NumberConstructor;
  resizable: BooleanConstructor;
  onClickoutside: PropType<(e: MouseEvent) => void>;
  onAfterLeave: PropType<() => void>;
  onAfterEnter: PropType<() => void>;
  onEsc: PropType<(e: KeyboardEvent) => void>;
}>, {
  bodyRef: import("vue").Ref<HTMLElement | null, HTMLElement | null>;
  rtlEnabled: import("vue").Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedClsPrefix: import("vue").Ref<string, string>;
  isMounted: import("vue").Ref<boolean, boolean>;
  mergedTheme: import("vue").Ref<{
    common: ThemeCommonVars;
    self: DrawerThemeVars;
    peers: {
      Scrollbar: ScrollbarTheme;
    };
    peerOverrides: {
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }, {
    common: ThemeCommonVars;
    self: DrawerThemeVars;
    peers: {
      Scrollbar: ScrollbarTheme;
    };
    peerOverrides: {
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
  displayed: import("vue").Ref<boolean, boolean>;
  transitionName: import("vue").ComputedRef<string>;
  handleAfterLeave: () => void;
  bodyDirectives: import("vue").ComputedRef<DirectiveArguments>;
  handleMousedownResizeTrigger: (e: MouseEvent) => void;
  handleMouseenterResizeTrigger: () => void;
  handleMouseleaveResizeTrigger: () => void;
  isDragging: import("vue").Ref<boolean, boolean>;
  isHoverOnResizeTrigger: import("vue").Ref<boolean, boolean>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  blockScroll: BooleanConstructor;
  show: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  displayDirective: {
    type: PropType<"if" | "show">;
    required: true;
  };
  placement: {
    type: PropType<Placement>;
    required: true;
  };
  contentClass: StringConstructor;
  contentStyle: PropType<string | CSSProperties>;
  nativeScrollbar: {
    type: BooleanConstructor;
    required: true;
  };
  scrollbarProps: PropType<ScrollbarProps>;
  trapFocus: {
    type: BooleanConstructor;
    default: boolean;
  };
  autoFocus: {
    type: BooleanConstructor;
    default: boolean;
  };
  showMask: {
    type: PropType<boolean | "transparent">;
    required: true;
  };
  maxWidth: NumberConstructor;
  maxHeight: NumberConstructor;
  minWidth: NumberConstructor;
  minHeight: NumberConstructor;
  resizable: BooleanConstructor;
  onClickoutside: PropType<(e: MouseEvent) => void>;
  onAfterLeave: PropType<() => void>;
  onAfterEnter: PropType<() => void>;
  onEsc: PropType<(e: KeyboardEvent) => void>;
}>> & Readonly<{}>, {
  show: boolean | undefined;
  resizable: boolean;
  blockScroll: boolean;
  autoFocus: boolean;
  trapFocus: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { Placement, _default as default };