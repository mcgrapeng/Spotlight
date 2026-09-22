import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { ElementTheme, ElementThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, Ref } from "vue";
//#region src/element/src/Element.d.ts
declare const elementProps: {
  readonly tag: {
    readonly type: StringConstructor;
    readonly default: "div";
  };
  readonly theme: import("vue").PropType<ElementTheme>;
  readonly themeOverrides: import("vue").PropType<ElementThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<ElementThemeOverrides>;
};
type ElementProps = ExtractPublicPropTypes<typeof elementProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly tag: {
    readonly type: StringConstructor;
    readonly default: "div";
  };
  readonly theme: import("vue").PropType<ElementTheme>;
  readonly themeOverrides: import("vue").PropType<ElementThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<ElementThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly tag: {
    readonly type: StringConstructor;
    readonly default: "div";
  };
  readonly theme: import("vue").PropType<ElementTheme>;
  readonly themeOverrides: import("vue").PropType<ElementThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<ElementThemeOverrides>;
}>> & Readonly<{}>, {
  readonly tag: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { ElementProps, _default as default, elementProps };