import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { TypographyTheme, TypographyThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/typography/src/text.d.ts
declare const textProps: {
  readonly code: BooleanConstructor;
  readonly type: {
    readonly type: StringConstructor;
    readonly default: "default";
  };
  readonly delete: BooleanConstructor;
  readonly strong: BooleanConstructor;
  readonly italic: BooleanConstructor;
  readonly underline: BooleanConstructor;
  readonly depth: PropType<1 | 2 | 3 | "1" | "2" | "3">;
  readonly tag: StringConstructor;
  readonly as: {
    readonly type: StringConstructor;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly theme: PropType<TypographyTheme>;
  readonly themeOverrides: PropType<TypographyThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TypographyThemeOverrides>;
};
type TextProps = ExtractPublicPropTypes<typeof textProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly code: BooleanConstructor;
  readonly type: {
    readonly type: StringConstructor;
    readonly default: "default";
  };
  readonly delete: BooleanConstructor;
  readonly strong: BooleanConstructor;
  readonly italic: BooleanConstructor;
  readonly underline: BooleanConstructor;
  readonly depth: PropType<1 | 2 | 3 | "1" | "2" | "3">;
  readonly tag: StringConstructor;
  readonly as: {
    readonly type: StringConstructor;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly theme: PropType<TypographyTheme>;
  readonly themeOverrides: PropType<TypographyThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TypographyThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  compitableTag: import("vue").ComputedRef<string | undefined>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly code: BooleanConstructor;
  readonly type: {
    readonly type: StringConstructor;
    readonly default: "default";
  };
  readonly delete: BooleanConstructor;
  readonly strong: BooleanConstructor;
  readonly italic: BooleanConstructor;
  readonly underline: BooleanConstructor;
  readonly depth: PropType<1 | 2 | 3 | "1" | "2" | "3">;
  readonly tag: StringConstructor;
  readonly as: {
    readonly type: StringConstructor;
    readonly validator: () => boolean;
    readonly default: undefined;
  };
  readonly theme: PropType<TypographyTheme>;
  readonly themeOverrides: PropType<TypographyThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TypographyThemeOverrides>;
}>> & Readonly<{}>, {
  readonly code: boolean;
  readonly strong: boolean;
  readonly type: string;
  readonly as: string;
  readonly italic: boolean;
  readonly underline: boolean;
  readonly delete: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { TextProps, _default as default, textProps };