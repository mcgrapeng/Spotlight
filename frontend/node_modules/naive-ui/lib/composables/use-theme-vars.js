Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_config_provider_src_context = require("../config-provider/src/context.js");
const require__styles_common_light = require("../_styles/common/light.js");
let vue = require("vue");
//#region src/composables/use-theme-vars.ts
function useThemeVars() {
	const configProviderInjection = (0, vue.inject)(require_config_provider_src_context.configProviderInjectionKey, null);
	return (0, vue.computed)(() => {
		if (configProviderInjection === null) return require__styles_common_light;
		const { mergedThemeRef: { value: mergedTheme }, mergedThemeOverridesRef: { value: mergedThemeOverrides } } = configProviderInjection;
		const currentThemeVars = mergedTheme?.common || require__styles_common_light;
		if (mergedThemeOverrides?.common) return Object.assign({}, currentThemeVars, mergedThemeOverrides.common);
		else return currentThemeVars;
	});
}
//#endregion
exports.useThemeVars = useThemeVars;
