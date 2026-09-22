const require__utils_naive_warn = require("../_utils/naive/warn.js");
const require_config_provider_src_context = require("../config-provider/src/context.js");
let vue = require("vue");
//#region src/_mixins/use-hljs.ts
function useHljs(props, shouldHighlightRef) {
	const NConfigProvider = (0, vue.inject)(require_config_provider_src_context.configProviderInjectionKey, null);
	if (process.env.NODE_ENV !== "production") {
		const warnHljs = () => {
			if (!props.hljs && !NConfigProvider?.mergedHljsRef.value) require__utils_naive_warn.warn("code", "hljs is not set.");
		};
		if (!shouldHighlightRef) warnHljs();
		else (0, vue.watchEffect)(() => {
			if (shouldHighlightRef.value) warnHljs();
		});
	}
	return (0, vue.computed)(() => {
		return props.hljs || NConfigProvider?.mergedHljsRef.value;
	});
}
//#endregion
module.exports = useHljs;
