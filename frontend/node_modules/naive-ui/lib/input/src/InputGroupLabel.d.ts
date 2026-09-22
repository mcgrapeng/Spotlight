import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { InputTheme, InputThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { InputSize } from "./public-types.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/input/src/InputGroupLabel.d.ts
declare const inputGroupLabelProps: {
  readonly size: PropType<InputSize>;
  readonly bordered: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly theme: PropType<InputTheme>;
  readonly themeOverrides: PropType<InputThemeOverrides>;
  readonly builtinThemeOverrides: PropType<InputThemeOverrides>;
};
type InputGroupLabelProps = ExtractPublicPropTypes<typeof inputGroupLabelProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly size: PropType<InputSize>;
  readonly bordered: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly theme: PropType<InputTheme>;
  readonly themeOverrides: PropType<InputThemeOverrides>;
  readonly builtinThemeOverrides: PropType<InputThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  mergedBordered: import("vue").ComputedRef<boolean>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly size: PropType<InputSize>;
  readonly bordered: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly theme: PropType<InputTheme>;
  readonly themeOverrides: PropType<InputThemeOverrides>;
  readonly builtinThemeOverrides: PropType<InputThemeOverrides>;
}>> & Readonly<{}>, {
  readonly bordered: boolean | undefined;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { InputGroupLabelProps, _default as default, inputGroupLabelProps };