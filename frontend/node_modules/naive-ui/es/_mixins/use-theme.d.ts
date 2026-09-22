import { ThemeCommonVars } from "../_styles/common/light.js";
import { GlobalTheme } from "../config-provider/src/interface.js";
import "../config-provider/index.js";
import { ComputedRef, PropType, Ref } from "vue";
import { CNode } from "css-render";
//#region src/_mixins/use-theme.d.ts
interface Theme<N, T = Record<string, unknown>, R = any> {
  name: N;
  common?: ThemeCommonVars;
  peers?: R;
  self?: (vars: ThemeCommonVars) => T;
}
interface ThemeProps<T, O = ExtractThemeOverrides<T>> {
  theme: PropType<T>;
  themeOverrides: PropType<O>;
  builtinThemeOverrides: PropType<O>;
}
type ExtractThemeVars<T> = T extends Theme<unknown, infer U, unknown> ? unknown extends U ? Record<string, unknown> : U : Record<string, unknown>;
type ExtractPeerOverrides<T> = T extends Theme<unknown, unknown, infer V> ? {
  peers?: { [k in keyof V]?: ExtractThemeOverrides<V[k]>; };
} : T;
type ExtractMergedPeerOverrides<T> = T extends Theme<unknown, unknown, infer V> ? { [k in keyof V]?: ExtractPeerOverrides<V[k]>; } : T;
type ExtractThemeOverrides<T> = Partial<ExtractThemeVars<T>> & ExtractPeerOverrides<T> & {
  common?: Partial<ThemeCommonVars>;
};
declare function createTheme<N extends string, T, R>(theme: Theme<N, T, R>): Theme<N, T, R>;
type UseThemeProps<T> = Readonly<{
  theme?: T | undefined;
  themeOverrides?: ExtractThemeOverrides<T>;
  builtinThemeOverrides?: ExtractThemeOverrides<T>;
}>;
type MergedTheme<T> = T extends Theme<unknown, infer V, infer W> ? {
  common: ThemeCommonVars;
  self: V;
  peers: W;
  peerOverrides: ExtractMergedPeerOverrides<T>;
} : T;
declare function useTheme<T extends Theme<string, any, any>>(resolveId: Exclude<keyof GlobalTheme, 'common' | 'name'>, mountId: string, style: CNode | undefined, defaultTheme: T, props: UseThemeProps<T>, clsPrefixRef: Ref<string | undefined> | undefined): ComputedRef<MergedTheme<T>>;
declare namespace useTheme {
  var props: {
    readonly theme: ObjectConstructor;
    readonly themeOverrides: ObjectConstructor;
    readonly builtinThemeOverrides: ObjectConstructor;
  };
}
//#endregion
export { ExtractMergedPeerOverrides, ExtractPeerOverrides, ExtractThemeOverrides, ExtractThemeVars, MergedTheme, Theme, ThemeProps, createTheme, useTheme as default };