Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_config_provider_src_context = require("../config-provider/src/context.js");
const require__mixins_common = require("./common.js");
let vue = require("vue");
let css_render = require("css-render");
let _css_render_vue3_ssr = require("@css-render/vue3-ssr");
//#region src/_mixins/use-rtl.ts
function useRtl(mountId, rtlStateRef, clsPrefixRef) {
	if (!rtlStateRef) return void 0;
	const ssrAdapter = (0, _css_render_vue3_ssr.useSsrAdapter)();
	const componentRtlStateRef = (0, vue.computed)(() => {
		const { value: rtlState } = rtlStateRef;
		if (!rtlState) return;
		const componentRtlState = rtlState[mountId];
		if (!componentRtlState) return;
		return componentRtlState;
	});
	const NConfigProvider = (0, vue.inject)(require_config_provider_src_context.configProviderInjectionKey, null);
	const mountStyle = () => {
		(0, vue.watchEffect)(() => {
			const { value: clsPrefix } = clsPrefixRef;
			const id = `${clsPrefix}${mountId}Rtl`;
			if ((0, css_render.exists)(id, ssrAdapter)) return;
			const { value: componentRtlState } = componentRtlStateRef;
			if (!componentRtlState) return;
			componentRtlState.style.mount({
				id,
				head: true,
				anchorMetaName: require__mixins_common.cssrAnchorMetaName,
				props: { bPrefix: clsPrefix ? `.${clsPrefix}-` : void 0 },
				ssr: ssrAdapter,
				parent: NConfigProvider?.styleMountTarget
			});
		});
	};
	if (ssrAdapter) mountStyle();
	else (0, vue.onBeforeMount)(mountStyle);
	return componentRtlStateRef;
}
//#endregion
exports.useRtl = useRtl;
