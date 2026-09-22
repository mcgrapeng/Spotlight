import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { IconTheme, IconThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, Component, PropType, Ref } from "vue";
//#region src/icon/src/Icon.d.ts
type Depth = 1 | 2 | 3 | 4 | 5 | '1' | '2' | '3' | '4' | '5' | undefined;
declare const iconProps: {
  readonly depth: PropType<Depth>;
  readonly size: PropType<number | string>;
  readonly color: StringConstructor;
  readonly component: PropType<Component>;
  readonly theme: PropType<IconTheme>;
  readonly themeOverrides: PropType<IconThemeOverrides>;
  readonly builtinThemeOverrides: PropType<IconThemeOverrides>;
};
type IconProps = ExtractPublicPropTypes<typeof iconProps>;
declare const NIcon: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly depth: PropType<Depth>;
  readonly size: PropType<number | string>;
  readonly color: StringConstructor;
  readonly component: PropType<Component>;
  readonly theme: PropType<IconTheme>;
  readonly themeOverrides: PropType<IconThemeOverrides>;
  readonly builtinThemeOverrides: PropType<IconThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  mergedStyle: import("vue").ComputedRef<{
    fontSize: string | undefined;
    color: string | undefined;
  }>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly depth: PropType<Depth>;
  readonly size: PropType<number | string>;
  readonly color: StringConstructor;
  readonly component: PropType<Component>;
  readonly theme: PropType<IconTheme>;
  readonly themeOverrides: PropType<IconThemeOverrides>;
  readonly builtinThemeOverrides: PropType<IconThemeOverrides>;
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { Depth, IconProps, NIcon, iconProps };