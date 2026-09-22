Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require_config_provider_src_context = require("../config-provider/src/context.js");
let vue = require("vue");
//#region src/_mixins/use-config.ts
const defaultClsPrefix = "n";
function useConfig(props = {}, options = { defaultBordered: true }) {
	const NConfigProvider = (0, vue.inject)(require_config_provider_src_context.configProviderInjectionKey, null);
	return {
		inlineThemeDisabled: NConfigProvider?.inlineThemeDisabled,
		mergedRtlRef: NConfigProvider?.mergedRtlRef,
		mergedComponentPropsRef: NConfigProvider?.mergedComponentPropsRef,
		mergedBreakpointsRef: NConfigProvider?.mergedBreakpointsRef,
		mergedBorderedRef: (0, vue.computed)(() => {
			const { bordered } = props;
			if (bordered !== void 0) return bordered;
			return NConfigProvider?.mergedBorderedRef.value ?? options.defaultBordered ?? true;
		}),
		mergedClsPrefixRef: NConfigProvider ? NConfigProvider.mergedClsPrefixRef : (0, vue.shallowRef)("n"),
		namespaceRef: (0, vue.computed)(() => NConfigProvider?.mergedNamespaceRef.value)
	};
}
function useMergedClsPrefix() {
	const NConfigProvider = (0, vue.inject)(require_config_provider_src_context.configProviderInjectionKey, null);
	return NConfigProvider ? NConfigProvider.mergedClsPrefixRef : (0, vue.shallowRef)("n");
}
//#endregion
exports.default = useConfig;
exports.defaultClsPrefix = defaultClsPrefix;
exports.useMergedClsPrefix = useMergedClsPrefix;
