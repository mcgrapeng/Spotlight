import { CSSProperties, PropType, Ref } from "vue";
//#region src/loading-bar/src/LoadingBar.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  containerClass: StringConstructor;
  containerStyle: PropType<string | CSSProperties>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  loadingBarRef: Ref<HTMLElement | null, HTMLElement | null>;
  started: Ref<boolean, boolean>;
  loading: Ref<boolean, boolean>;
  entering: Ref<boolean, boolean>;
  transitionDisabled: Ref<boolean, boolean>;
  start: (fromProgress?: number, toProgress?: number, status?: "starting" | "error") => Promise<void>;
  error: () => void;
  finish: () => Promise<void>;
  handleEnter: () => void;
  handleAfterEnter: () => void;
  handleAfterLeave: () => Promise<void>;
  mergedLoadingBarStyle: import("vue").ComputedRef<string | CSSProperties | undefined>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  containerClass: StringConstructor;
  containerStyle: PropType<string | CSSProperties>;
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };