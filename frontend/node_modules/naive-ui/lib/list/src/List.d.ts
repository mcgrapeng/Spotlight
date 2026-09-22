import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { ListTheme, ListThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/list/src/List.d.ts
declare const listProps: {
  size: {
    type: PropType<"small" | "medium" | "large">;
    default: string;
  };
  bordered: BooleanConstructor;
  clickable: BooleanConstructor;
  hoverable: BooleanConstructor;
  showDivider: {
    type: BooleanConstructor;
    default: boolean;
  };
  theme: PropType<ListTheme>;
  themeOverrides: PropType<ListThemeOverrides>;
  builtinThemeOverrides: PropType<ListThemeOverrides>;
};
type ListProps = ExtractPublicPropTypes<typeof listProps>;
interface ListSlots {
  default?: () => VNode[];
  footer?: () => VNode[];
  header?: () => VNode[];
}
interface ListInjection {
  showDividerRef: Ref<boolean>;
  mergedClsPrefixRef: Ref<string>;
}
declare const listInjectionKey: import("vue").InjectionKey<ListInjection>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  size: {
    type: PropType<"small" | "medium" | "large">;
    default: string;
  };
  bordered: BooleanConstructor;
  clickable: BooleanConstructor;
  hoverable: BooleanConstructor;
  showDivider: {
    type: BooleanConstructor;
    default: boolean;
  };
  theme: PropType<ListTheme>;
  themeOverrides: PropType<ListThemeOverrides>;
  builtinThemeOverrides: PropType<ListThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  size: {
    type: PropType<"small" | "medium" | "large">;
    default: string;
  };
  bordered: BooleanConstructor;
  clickable: BooleanConstructor;
  hoverable: BooleanConstructor;
  showDivider: {
    type: BooleanConstructor;
    default: boolean;
  };
  theme: PropType<ListTheme>;
  themeOverrides: PropType<ListThemeOverrides>;
  builtinThemeOverrides: PropType<ListThemeOverrides>;
}>> & Readonly<{}>, {
  bordered: boolean;
  size: "small" | "medium" | "large";
  hoverable: boolean;
  clickable: boolean;
  showDivider: boolean;
}, SlotsType<ListSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { ListProps, ListSlots, _default as default, listInjectionKey, listProps };