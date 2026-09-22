import { PopoverProps } from "../../popover/src/Popover.js";
import { EllipsisTheme, EllipsisThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import "../../index.js";
//#region src/ellipsis/src/PerformantEllipsis.d.ts
declare const NPerformantEllipsis: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly expandTrigger: import("vue").PropType<"click">;
  readonly lineClamp: import("vue").PropType<string | number>;
  readonly tooltip: {
    readonly type: import("vue").PropType<PopoverProps | boolean>;
    readonly default: true;
  };
  readonly theme: import("vue").PropType<EllipsisTheme>;
  readonly themeOverrides: import("vue").PropType<EllipsisThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<EllipsisThemeOverrides>;
}>, {
  mouseEntered: import("vue").Ref<boolean, boolean>;
  renderTrigger: () => JSX.Element;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly expandTrigger: import("vue").PropType<"click">;
  readonly lineClamp: import("vue").PropType<string | number>;
  readonly tooltip: {
    readonly type: import("vue").PropType<PopoverProps | boolean>;
    readonly default: true;
  };
  readonly theme: import("vue").PropType<EllipsisTheme>;
  readonly themeOverrides: import("vue").PropType<EllipsisThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<EllipsisThemeOverrides>;
}>> & Readonly<{}>, {
  readonly tooltip: boolean | PopoverProps;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { NPerformantEllipsis };