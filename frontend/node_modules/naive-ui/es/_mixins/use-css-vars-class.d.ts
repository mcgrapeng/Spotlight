import { ComputedRef, Ref } from "vue";
//#region src/_mixins/use-css-vars-class.d.ts
declare function useThemeClass(componentName: string, hashRef: Ref<string> | undefined, cssVarsRef: ComputedRef<Record<string, string>> | undefined, props: {
  themeOverrides?: unknown;
  builtinThemeOverrides?: unknown;
}): {
  themeClass: Ref<string>;
  onRender: () => void;
};
//#endregion
export { useThemeClass };