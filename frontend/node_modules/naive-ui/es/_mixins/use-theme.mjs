import { configProviderInjectionKey } from "../config-provider/src/context.mjs";
import { cssrAnchorMetaName } from "./common.mjs";
import index_cssr_default from "../_styles/global/index.cssr.mjs";
import { computed, inject, onBeforeMount } from "vue";
import { useSsrAdapter } from "@css-render/vue3-ssr";
import { merge } from "lodash-es";
//#region src/_mixins/use-theme.ts
function createTheme(theme) {
  return theme;
}
function useTheme(resolveId, mountId, style, defaultTheme, props, clsPrefixRef) {
  const ssrAdapter = useSsrAdapter();
  const NConfigProvider = inject(configProviderInjectionKey, null);
  if (style) {
    const mountStyle = () => {
      const clsPrefix = clsPrefixRef?.value;
      style.mount({
        id: clsPrefix === void 0 ? mountId : clsPrefix + mountId,
        head: true,
        props: {
          bPrefix: clsPrefix ? `.${clsPrefix}-` : void 0
        },
        anchorMetaName: cssrAnchorMetaName,
        ssr: ssrAdapter,
        parent: NConfigProvider?.styleMountTarget
      });
      if (!NConfigProvider?.preflightStyleDisabled) index_cssr_default.mount({
        id: "n-global",
        head: true,
        anchorMetaName: cssrAnchorMetaName,
        ssr: ssrAdapter,
        parent: NConfigProvider?.styleMountTarget
      });
    };
    if (ssrAdapter) mountStyle();else onBeforeMount(mountStyle);
  }
  return computed(() => {
    const {
      theme: {
        common: selfCommon,
        self,
        peers = {}
      } = {},
      themeOverrides: selfOverrides = {},
      builtinThemeOverrides: builtinOverrides = {}
    } = props;
    const {
      common: selfCommonOverrides,
      peers: peersOverrides
    } = selfOverrides;
    const {
      common: globalCommon = void 0,
      [resolveId]: {
        common: globalSelfCommon = void 0,
        self: globalSelf = void 0,
        peers: globalPeers = {}
      } = {}
    } = NConfigProvider?.mergedThemeRef.value || {};
    const {
      common: globalCommonOverrides = void 0,
      [resolveId]: globalSelfOverrides = {}
    } = NConfigProvider?.mergedThemeOverridesRef.value || {};
    const {
      common: globalSelfCommonOverrides,
      peers: globalPeersOverrides = {}
    } = globalSelfOverrides;
    const mergedCommon = merge({}, selfCommon || globalSelfCommon || globalCommon || defaultTheme.common, globalCommonOverrides, globalSelfCommonOverrides, selfCommonOverrides);
    return {
      common: mergedCommon,
      self: merge((self || globalSelf || defaultTheme.self)?.(mergedCommon), builtinOverrides, globalSelfOverrides, selfOverrides),
      peers: merge({}, defaultTheme.peers, globalPeers, peers),
      peerOverrides: merge({}, builtinOverrides.peers, globalPeersOverrides, peersOverrides)
    };
  });
}
useTheme.props = {
  theme: Object,
  themeOverrides: Object,
  builtinThemeOverrides: Object
};
//#endregion
export { createTheme, useTheme as default };