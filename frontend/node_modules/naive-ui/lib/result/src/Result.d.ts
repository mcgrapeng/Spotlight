import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { ResultSize } from "./public-types.js";
import { ResultTheme, ResultThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/result/src/Result.d.ts
declare const resultProps: {
  size: PropType<ResultSize>;
  status: {
    type: PropType<"info" | "success" | "warning" | "error" | "404" | "403" | "500" | "418">;
    default: string;
  };
  title: StringConstructor;
  description: StringConstructor;
  theme: PropType<ResultTheme>;
  themeOverrides: PropType<ResultThemeOverrides>;
  builtinThemeOverrides: PropType<ResultThemeOverrides>;
};
type ResultProps = ExtractPublicPropTypes<typeof resultProps>;
interface ResultSlots {
  default?: () => VNode[];
  footer?: () => VNode[];
  icon?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  size: PropType<ResultSize>;
  status: {
    type: PropType<"info" | "success" | "warning" | "error" | "404" | "403" | "500" | "418">;
    default: string;
  };
  title: StringConstructor;
  description: StringConstructor;
  theme: PropType<ResultTheme>;
  themeOverrides: PropType<ResultThemeOverrides>;
  builtinThemeOverrides: PropType<ResultThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  size: PropType<ResultSize>;
  status: {
    type: PropType<"info" | "success" | "warning" | "error" | "404" | "403" | "500" | "418">;
    default: string;
  };
  title: StringConstructor;
  description: StringConstructor;
  theme: PropType<ResultTheme>;
  themeOverrides: PropType<ResultThemeOverrides>;
  builtinThemeOverrides: PropType<ResultThemeOverrides>;
}>> & Readonly<{}>, {
  status: "error" | "info" | "success" | "warning" | "500" | "404" | "403" | "418";
}, SlotsType<ResultSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { ResultProps, ResultSlots, _default as default, resultProps };