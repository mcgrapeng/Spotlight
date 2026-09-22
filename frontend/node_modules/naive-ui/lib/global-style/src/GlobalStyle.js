const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require_config_provider_src_context = require("../../config-provider/src/context.js");
const require__styles_common_light = require("../../_styles/common/light.js");
let vue = require("vue");
let lodash_es = require("lodash");
//#region src/global-style/src/GlobalStyle.ts
var GlobalStyle_default = (0, vue.defineComponent)({
	name: "GlobalStyle",
	setup() {
		if (typeof document === "undefined") return;
		const NConfigProvider = (0, vue.inject)(require_config_provider_src_context.configProviderInjectionKey, null);
		const { body } = document;
		const { style } = body;
		let styleApplied = false;
		let firstApply = true;
		(0, vue.onBeforeMount)(() => {
			(0, vue.watchEffect)(() => {
				const { textColor2, fontSize, fontFamily, bodyColor, cubicBezierEaseInOut, lineHeight } = NConfigProvider ? (0, lodash_es.merge)({}, NConfigProvider.mergedThemeRef.value?.common || require__styles_common_light, NConfigProvider.mergedThemeOverridesRef.value?.common) : require__styles_common_light;
				if (styleApplied || !body.hasAttribute("n-styled")) {
					style.setProperty("-webkit-text-size-adjust", "100%");
					style.setProperty("-webkit-tap-highlight-color", "transparent");
					style.padding = "0";
					style.margin = "0";
					style.backgroundColor = bodyColor;
					style.color = textColor2;
					style.fontSize = fontSize;
					style.fontFamily = fontFamily;
					style.lineHeight = lineHeight;
					const transition = `color .3s ${cubicBezierEaseInOut}, background-color .3s ${cubicBezierEaseInOut}`;
					if (firstApply) setTimeout(() => {
						style.transition = transition;
					}, 0);
					else style.transition = transition;
					body.setAttribute("n-styled", "");
					styleApplied = true;
					firstApply = false;
				} else if (process.env.NODE_ENV !== "production") require__utils_naive_warn.warn("global-style", "More than one n-global-style exist in the document.body. Only the first mounted one will work.");
			});
		});
		(0, vue.onUnmounted)(() => {
			if (styleApplied) body.removeAttribute("n-styled");
		});
	},
	render() {
		return null;
	}
});
//#endregion
module.exports = GlobalStyle_default;
