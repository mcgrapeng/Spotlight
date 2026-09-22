import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { LoadingBarTheme, LoadingBarThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, ExtractPropTypes, PropType } from "vue";
//#region src/loading-bar/src/LoadingBarProvider.d.ts
interface LoadingBarInst {
  start: () => void;
  error: () => void;
  finish: () => void;
}
type LoadingBarProviderInst = LoadingBarInst;
type LoadingBarApiInjection = LoadingBarInst;
declare const loadingBarProviderProps: {
  to: {
    type: PropType<string | HTMLElement | false>;
    default: undefined;
  };
  containerClass: StringConstructor;
  containerStyle: PropType<string | CSSProperties>;
  loadingBarStyle: {
    type: PropType<{
      loading?: string | CSSProperties;
      error?: string | CSSProperties;
    }>;
  };
  theme: PropType<LoadingBarTheme>;
  themeOverrides: PropType<LoadingBarThemeOverrides>;
  builtinThemeOverrides: PropType<LoadingBarThemeOverrides>;
};
type LoadingBarProviderProps = ExtractPublicPropTypes<typeof loadingBarProviderProps>;
type LoadingBarProviderSetupProps = ExtractPropTypes<typeof loadingBarProviderProps>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
  to: {
    type: PropType<string | HTMLElement | false>;
    default: undefined;
  };
  containerClass: StringConstructor;
  containerStyle: PropType<string | CSSProperties>;
  loadingBarStyle: {
    type: PropType<{
      loading?: string | CSSProperties;
      error?: string | CSSProperties;
    }>;
  };
  theme: PropType<LoadingBarTheme>;
  themeOverrides: PropType<LoadingBarThemeOverrides>;
  builtinThemeOverrides: PropType<LoadingBarThemeOverrides>;
}>, LoadingBarInst & {
  loadingBarRef: unknown;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
  to: {
    type: PropType<string | HTMLElement | false>;
    default: undefined;
  };
  containerClass: StringConstructor;
  containerStyle: PropType<string | CSSProperties>;
  loadingBarStyle: {
    type: PropType<{
      loading?: string | CSSProperties;
      error?: string | CSSProperties;
    }>;
  };
  theme: PropType<LoadingBarTheme>;
  themeOverrides: PropType<LoadingBarThemeOverrides>;
  builtinThemeOverrides: PropType<LoadingBarThemeOverrides>;
}>> & Readonly<{}>, {
  to: string | false | HTMLElement;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { LoadingBarApiInjection, LoadingBarInst, LoadingBarProviderInst, LoadingBarProviderProps, LoadingBarProviderSetupProps, _default as default, loadingBarProviderProps };