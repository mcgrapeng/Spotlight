import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { IconWrapperTheme, IconWrapperThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
//#region src/icon-wrapper/src/IconWrapper.d.ts
declare const iconWrapperProps: {
  readonly size: {
    readonly type: NumberConstructor;
    readonly default: 24;
  };
  readonly borderRadius: {
    readonly type: NumberConstructor;
    readonly default: 6;
  };
  readonly color: StringConstructor;
  readonly iconColor: StringConstructor;
  readonly theme: import("vue").PropType<IconWrapperTheme>;
  readonly themeOverrides: import("vue").PropType<IconWrapperThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<IconWrapperThemeOverrides>;
};
type IconWrapperProps = ExtractPublicPropTypes<typeof iconWrapperProps>;
declare const NIconWrapper: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly size: {
    readonly type: NumberConstructor;
    readonly default: 24;
  };
  readonly borderRadius: {
    readonly type: NumberConstructor;
    readonly default: 6;
  };
  readonly color: StringConstructor;
  readonly iconColor: StringConstructor;
  readonly theme: import("vue").PropType<IconWrapperTheme>;
  readonly themeOverrides: import("vue").PropType<IconWrapperThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<IconWrapperThemeOverrides>;
}>, () => JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly size: {
    readonly type: NumberConstructor;
    readonly default: 24;
  };
  readonly borderRadius: {
    readonly type: NumberConstructor;
    readonly default: 6;
  };
  readonly color: StringConstructor;
  readonly iconColor: StringConstructor;
  readonly theme: import("vue").PropType<IconWrapperTheme>;
  readonly themeOverrides: import("vue").PropType<IconWrapperThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<IconWrapperThemeOverrides>;
}>> & Readonly<{}>, {
  readonly borderRadius: number;
  readonly size: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { IconWrapperProps, NIconWrapper, iconWrapperProps };