import { Hljs } from "../../_mixins/use-hljs.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { CodeTheme, CodeThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import "../../_mixins/index.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/code/src/Code.d.ts
declare const codeProps: {
  language: StringConstructor;
  code: {
    type: StringConstructor;
    default: string;
  };
  trim: {
    type: BooleanConstructor;
    default: boolean;
  };
  hljs: PropType<Hljs>;
  uri: BooleanConstructor;
  inline: BooleanConstructor;
  wordWrap: BooleanConstructor;
  showLineNumbers: BooleanConstructor;
  internalFontSize: NumberConstructor;
  internalNoHighlight: BooleanConstructor;
  theme: PropType<CodeTheme>;
  themeOverrides: PropType<CodeThemeOverrides>;
  builtinThemeOverrides: PropType<CodeThemeOverrides>;
};
type CodeProps = ExtractPublicPropTypes<typeof codeProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  language: StringConstructor;
  code: {
    type: StringConstructor;
    default: string;
  };
  trim: {
    type: BooleanConstructor;
    default: boolean;
  };
  hljs: PropType<Hljs>;
  uri: BooleanConstructor;
  inline: BooleanConstructor;
  wordWrap: BooleanConstructor;
  showLineNumbers: BooleanConstructor;
  internalFontSize: NumberConstructor;
  internalNoHighlight: BooleanConstructor;
  theme: PropType<CodeTheme>;
  themeOverrides: PropType<CodeThemeOverrides>;
  builtinThemeOverrides: PropType<CodeThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  codeRef: Ref<HTMLElement | null, HTMLElement | null>;
  mergedShowLineNumbers: import("vue").ComputedRef<boolean>;
  lineNumbers: import("vue").ComputedRef<string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  language: StringConstructor;
  code: {
    type: StringConstructor;
    default: string;
  };
  trim: {
    type: BooleanConstructor;
    default: boolean;
  };
  hljs: PropType<Hljs>;
  uri: BooleanConstructor;
  inline: BooleanConstructor;
  wordWrap: BooleanConstructor;
  showLineNumbers: BooleanConstructor;
  internalFontSize: NumberConstructor;
  internalNoHighlight: BooleanConstructor;
  theme: PropType<CodeTheme>;
  themeOverrides: PropType<CodeThemeOverrides>;
  builtinThemeOverrides: PropType<CodeThemeOverrides>;
}>> & Readonly<{}>, {
  code: string;
  inline: boolean;
  trim: boolean;
  uri: boolean;
  wordWrap: boolean;
  showLineNumbers: boolean;
  internalNoHighlight: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { CodeProps, codeProps, _default as default };