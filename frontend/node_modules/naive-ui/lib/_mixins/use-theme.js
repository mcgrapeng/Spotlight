Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require_config_provider_src_context = require("../config-provider/src/context.js");
const require__mixins_common = require("./common.js");
const require__styles_global_index_cssr = require("../_styles/global/index.cssr.js");
let vue = require("vue");
let _css_render_vue3_ssr = require("@css-render/vue3-ssr");
let lodash_es = require("lodash");
//#region src/_mixins/use-theme.ts
function createTheme(theme) {
	return theme;
}
function useTheme(resolveId, mountId, style, defaultTheme, props, clsPrefixRef) {
	const ssrAdapter = (0, _css_render_vue3_ssr.useSsrAdapter)();
	const NConfigProvider = (0, vue.inject)(require_config_provider_src_context.configProviderInjectionKey, null);
	if (style) {
		const mountStyle = () => {
			const clsPrefix = clsPrefixRef?.value;
			style.mount({
				id: clsPrefix === void 0 ? mountId : clsPrefix + mountId,
				head: true,
				props: { bPrefix: clsPrefix ? `.${clsPrefix}-` : void 0 },
				anchorMetaName: require__mixins_common.cssrAnchorMetaName,
				ssr: ssrAdapter,
				parent: NConfigProvider?.styleMountTarget
			});
			if (!NConfigProvider?.preflightStyleDisabled) require__styles_global_index_cssr.mount({
				id: "n-global",
				head: true,
				anchorMetaName: require__mixins_common.cssrAnchorMetaName,
				ssr: ssrAdapter,
				parent: NConfigProvider?.styleMountTarget
			});
		};
		if (ssrAdapter) mountStyle();
		else (0, vue.onBeforeMount)(mountStyle);
	}
	return (0, vue.computed)(() => {
		const { theme: { common: selfCommon, self, peers = {} } = {}, themeOverrides: selfOverrides = {}, builtinThemeOverrides: builtinOverrides = {} } = props;
		const { common: selfCommonOverrides, peers: peersOverrides } = selfOverrides;
		const { common: globalCommon = void 0, [resolveId]: { common: globalSelfCommon = void 0, self: globalSelf = void 0, peers: globalPeers = {} } = {} } = NConfigProvider?.mergedThemeRef.value || {};
		const { common: globalCommonOverrides = void 0, [resolveId]: globalSelfOverrides = {} } = NConfigProvider?.mergedThemeOverridesRef.value || {};
		const { common: globalSelfCommonOverrides, peers: globalPeersOverrides = {} } = globalSelfOverrides;
		const mergedCommon = (0, lodash_es.merge)({}, selfCommon || globalSelfCommon || globalCommon || defaultTheme.common, globalCommonOverrides, globalSelfCommonOverrides, selfCommonOverrides);
		return {
			common: mergedCommon,
			self: (0, lodash_es.merge)((self || globalSelf || defaultTheme.self)?.(mergedCommon), builtinOverrides, globalSelfOverrides, selfOverrides),
			peers: (0, lodash_es.merge)({}, defaultTheme.peers, globalPeers, peers),
			peerOverrides: (0, lodash_es.merge)({}, builtinOverrides.peers, globalPeersOverrides, peersOverrides)
		};
	});
}
useTheme.props = {
	theme: Object,
	themeOverrides: Object,
	builtinThemeOverrides: Object
};
//#endregion
exports.createTheme = createTheme;
exports.default = useTheme;
