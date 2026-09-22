const require__utils_naive_warn = require("../_utils/naive/warn.js");
const require_config_provider_src_context = require("../config-provider/src/context.js");
const require__mixins_common = require("./common.js");
const require__styles_global_index_cssr = require("../_styles/global/index.cssr.js");
let vue = require("vue");
let _css_render_vue3_ssr = require("@css-render/vue3-ssr");
//#region src/_mixins/use-style.ts
function useStyle(mountId, style, clsPrefixRef) {
	if (!style) {
		if (process.env.NODE_ENV !== "production") require__utils_naive_warn.throwError("use-style", "No style is specified.");
		return;
	}
	const ssrAdapter = (0, _css_render_vue3_ssr.useSsrAdapter)();
	const NConfigProvider = (0, vue.inject)(require_config_provider_src_context.configProviderInjectionKey, null);
	const mountStyle = () => {
		const clsPrefix = clsPrefixRef.value;
		style.mount({
			id: clsPrefix === void 0 ? mountId : clsPrefix + mountId,
			head: true,
			anchorMetaName: require__mixins_common.cssrAnchorMetaName,
			props: { bPrefix: clsPrefix ? `.${clsPrefix}-` : void 0 },
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
//#endregion
module.exports = useStyle;
