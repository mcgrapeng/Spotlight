const require_config_provider_src_context = require("../config-provider/src/context.js");
const require_locales_common_enUS = require("../locales/common/enUS.js");
const require_locales_date_enUS = require("../locales/date/enUS.js");
let vue = require("vue");
//#region src/_mixins/use-locale.ts
function useLocale(ns) {
	const { mergedLocaleRef, mergedDateLocaleRef } = (0, vue.inject)(require_config_provider_src_context.configProviderInjectionKey, null) || {};
	const localeRef = (0, vue.computed)(() => {
		return mergedLocaleRef?.value?.[ns] ?? require_locales_common_enUS[ns];
	});
	return {
		dateLocaleRef: (0, vue.computed)(() => {
			return mergedDateLocaleRef?.value ?? require_locales_date_enUS;
		}),
		localeRef
	};
}
//#endregion
module.exports = useLocale;
