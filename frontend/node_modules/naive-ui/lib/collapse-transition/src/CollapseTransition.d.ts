import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { CollapseTransitionTheme, CollapseTransitionThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/collapse-transition/src/CollapseTransition.d.ts
declare const collapseTransitionProps: {
  readonly show: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly appear: BooleanConstructor;
  readonly displayDirective: {
    readonly type: PropType<"if" | "show">;
    readonly default: "if";
  };
  /** @deprecated */
  readonly collapsed: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly theme: PropType<CollapseTransitionTheme>;
  readonly themeOverrides: PropType<CollapseTransitionThemeOverrides>;
  readonly builtinThemeOverrides: PropType<CollapseTransitionThemeOverrides>;
};
type CollapseTransitionProps = ExtractPublicPropTypes<typeof collapseTransitionProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly show: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly appear: BooleanConstructor;
  readonly displayDirective: {
    readonly type: PropType<"if" | "show">;
    readonly default: "if";
  };
  /** @deprecated */
  readonly collapsed: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly theme: PropType<CollapseTransitionTheme>;
  readonly themeOverrides: PropType<CollapseTransitionThemeOverrides>;
  readonly builtinThemeOverrides: PropType<CollapseTransitionThemeOverrides>;
}>, {
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedShow: import("vue").ComputedRef<boolean>;
  onceTrue: Readonly<Ref<boolean, boolean>>;
  mergedClsPrefix: Ref<string, string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly show: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly appear: BooleanConstructor;
  readonly displayDirective: {
    readonly type: PropType<"if" | "show">;
    readonly default: "if";
  };
  /** @deprecated */
  readonly collapsed: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly theme: PropType<CollapseTransitionTheme>;
  readonly themeOverrides: PropType<CollapseTransitionThemeOverrides>;
  readonly builtinThemeOverrides: PropType<CollapseTransitionThemeOverrides>;
}>> & Readonly<{}>, {
  readonly show: boolean;
  readonly displayDirective: "show" | "if";
  readonly appear: boolean;
  readonly collapsed: boolean | undefined;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { CollapseTransitionProps, collapseTransitionProps, _default as default };