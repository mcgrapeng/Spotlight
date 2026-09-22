import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { BreadcrumbTheme, BreadcrumbThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, Ref } from "vue";
//#region src/breadcrumb/src/Breadcrumb.d.ts
interface BreadcrumbInjection {
  separatorRef: Ref<string>;
  mergedClsPrefixRef: Ref<string>;
}
declare const breadcrumbInjectionKey: import("vue").InjectionKey<BreadcrumbInjection>;
declare const breadcrumbProps: {
  readonly separator: {
    readonly type: StringConstructor;
    readonly default: "/";
  };
  readonly theme: import("vue").PropType<BreadcrumbTheme>;
  readonly themeOverrides: import("vue").PropType<BreadcrumbThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<BreadcrumbThemeOverrides>;
};
type BreadcrumbProps = ExtractPublicPropTypes<typeof breadcrumbProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly separator: {
    readonly type: StringConstructor;
    readonly default: "/";
  };
  readonly theme: import("vue").PropType<BreadcrumbTheme>;
  readonly themeOverrides: import("vue").PropType<BreadcrumbThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<BreadcrumbThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly separator: {
    readonly type: StringConstructor;
    readonly default: "/";
  };
  readonly theme: import("vue").PropType<BreadcrumbTheme>;
  readonly themeOverrides: import("vue").PropType<BreadcrumbThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<BreadcrumbThemeOverrides>;
}>> & Readonly<{}>, {
  readonly separator: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { BreadcrumbInjection, BreadcrumbProps, breadcrumbInjectionKey, breadcrumbProps, _default as default };