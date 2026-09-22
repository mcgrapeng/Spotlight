import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import { PopoverProps } from "../../popover/src/Popover.js";
import { TooltipTheme } from "../../tooltip/styles/light.js";
import "../../tooltip/styles/index.js";
import { EllipsisTheme, EllipsisThemeOverrides, EllipsisThemeVars } from "../styles/light.js";
import "../styles/index.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { PropType, SlotsType, VNode } from "vue";
//#region src/ellipsis/src/Ellipsis.d.ts
declare function createLineClampClass(clsPrefix: string): string;
declare function createCursorClass(clsPrefix: string, cursor: string): string;
declare const ellipsisProps: {
  readonly expandTrigger: PropType<"click">;
  readonly lineClamp: PropType<string | number>;
  readonly tooltip: {
    readonly type: PropType<PopoverProps | boolean>;
    readonly default: true;
  };
  readonly theme: PropType<EllipsisTheme>;
  readonly themeOverrides: PropType<EllipsisThemeOverrides>;
  readonly builtinThemeOverrides: PropType<EllipsisThemeOverrides>;
};
type EllipsisProps = ExtractPublicPropTypes<typeof ellipsisProps>;
interface EllipsisSlots {
  default?: () => VNode[];
  tooltip?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly expandTrigger: PropType<"click">;
  readonly lineClamp: PropType<string | number>;
  readonly tooltip: {
    readonly type: PropType<PopoverProps | boolean>;
    readonly default: true;
  };
  readonly theme: PropType<EllipsisTheme>;
  readonly themeOverrides: PropType<EllipsisThemeOverrides>;
  readonly builtinThemeOverrides: PropType<EllipsisThemeOverrides>;
}>, {
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: EllipsisThemeVars;
    peers: {
      Tooltip: TooltipTheme;
    };
    peerOverrides: {
      Tooltip?: {
        peers?: {
          Popover?: ExtractThemeOverrides<PopoverTheme> | undefined;
        } | undefined;
      } | undefined;
    };
  }>;
  triggerRef: import("vue").Ref<HTMLElement | null, HTMLElement | null>;
  triggerInnerRef: import("vue").Ref<HTMLElement | null, HTMLElement | null>;
  tooltipRef: unknown;
  renderTrigger: () => JSX.Element;
  getTooltipDisabled: () => boolean;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly expandTrigger: PropType<"click">;
  readonly lineClamp: PropType<string | number>;
  readonly tooltip: {
    readonly type: PropType<PopoverProps | boolean>;
    readonly default: true;
  };
  readonly theme: PropType<EllipsisTheme>;
  readonly themeOverrides: PropType<EllipsisThemeOverrides>;
  readonly builtinThemeOverrides: PropType<EllipsisThemeOverrides>;
}>> & Readonly<{}>, {
  readonly tooltip: boolean | PopoverProps;
}, SlotsType<EllipsisSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { EllipsisProps, EllipsisSlots, createCursorClass, createLineClampClass, _default as default, ellipsisProps };