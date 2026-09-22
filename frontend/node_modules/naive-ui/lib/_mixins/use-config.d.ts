import { Breakpoints, GlobalComponentConfig, RtlEnabledState } from "../config-provider/src/internal-interface.js";
import { ComputedRef, Ref } from "vue";
//#region src/_mixins/use-config.d.ts
type UseConfigProps = Readonly<{
  bordered?: boolean;
  [key: string]: unknown;
}>;
declare const defaultClsPrefix = "n";
declare function useConfig(props?: UseConfigProps, options?: {
  defaultBordered?: boolean;
}): {
  inlineThemeDisabled: boolean | undefined;
  mergedRtlRef: Ref<RtlEnabledState | undefined> | undefined;
  mergedBorderedRef: ComputedRef<boolean>;
  mergedClsPrefixRef: Ref<string>;
  mergedBreakpointsRef: Ref<Breakpoints> | undefined;
  mergedComponentPropsRef: Ref<GlobalComponentConfig | undefined> | undefined;
  namespaceRef: ComputedRef<string | undefined>;
};
declare function useMergedClsPrefix(): Ref<string>;
//#endregion
export { useConfig as default, defaultClsPrefix, useMergedClsPrefix };