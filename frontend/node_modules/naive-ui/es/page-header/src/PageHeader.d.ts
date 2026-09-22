import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { PageHeaderTheme, PageHeaderThemeOverrides } from "../styles/light.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/page-header/src/PageHeader.d.ts
declare const pageHeaderProps: {
  title: StringConstructor;
  subtitle: StringConstructor;
  extra: StringConstructor;
  onBack: PropType<() => void>;
  theme: PropType<PageHeaderTheme>;
  themeOverrides: PropType<PageHeaderThemeOverrides>;
  builtinThemeOverrides: PropType<PageHeaderThemeOverrides>;
};
type PageHeaderProps = ExtractPublicPropTypes<typeof pageHeaderProps>;
interface PageHeaderSlots {
  avatar?: () => VNode[];
  header?: () => VNode[];
  default?: () => VNode[];
  extra?: () => VNode[];
  footer?: () => VNode[];
  subtitle?: () => VNode[];
  title?: () => VNode[];
  back?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  title: StringConstructor;
  subtitle: StringConstructor;
  extra: StringConstructor;
  onBack: PropType<() => void>;
  theme: PropType<PageHeaderTheme>;
  themeOverrides: PropType<PageHeaderThemeOverrides>;
  builtinThemeOverrides: PropType<PageHeaderThemeOverrides>;
}>, {
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedClsPrefix: Ref<string, string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  title: StringConstructor;
  subtitle: StringConstructor;
  extra: StringConstructor;
  onBack: PropType<() => void>;
  theme: PropType<PageHeaderTheme>;
  themeOverrides: PropType<PageHeaderThemeOverrides>;
  builtinThemeOverrides: PropType<PageHeaderThemeOverrides>;
}>> & Readonly<{}>, {}, SlotsType<PageHeaderSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { PageHeaderProps, PageHeaderSlots, _default as default, pageHeaderProps };