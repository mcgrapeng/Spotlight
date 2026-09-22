Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_cssr_index = require("../_utils/cssr/index.js");
const require__utils_naive_warn = require("../_utils/naive/warn.js");
const require_config_provider_src_context = require("../config-provider/src/context.js");
let vue = require("vue");
let css_render = require("css-render");
let _css_render_vue3_ssr = require("@css-render/vue3-ssr");
//#region src/_mixins/use-css-vars-class.ts
function useThemeClass(componentName, hashRef, cssVarsRef, props) {
	if (!cssVarsRef) require__utils_naive_warn.throwError("useThemeClass", "cssVarsRef is not passed");
	const NConfigProvider = (0, vue.inject)(require_config_provider_src_context.configProviderInjectionKey, null);
	const mergedThemeHashRef = NConfigProvider?.mergedThemeHashRef;
	const styleMountTarget = NConfigProvider?.styleMountTarget;
	const themeClassRef = (0, vue.ref)("");
	const ssrAdapter = (0, _css_render_vue3_ssr.useSsrAdapter)();
	let renderCallback;
	const hashClassPrefix = `__${componentName}`;
	const mountStyle = () => {
		let finalThemeHash = hashClassPrefix;
		const hashValue = hashRef ? hashRef.value : void 0;
		const themeHash = mergedThemeHashRef?.value;
		if (themeHash) finalThemeHash += `-${themeHash}`;
		if (hashValue) finalThemeHash += `-${hashValue}`;
		const { themeOverrides, builtinThemeOverrides } = props;
		if (themeOverrides) finalThemeHash += `-${(0, css_render.hash)(JSON.stringify(themeOverrides))}`;
		if (builtinThemeOverrides) finalThemeHash += `-${(0, css_render.hash)(JSON.stringify(builtinThemeOverrides))}`;
		themeClassRef.value = finalThemeHash;
		renderCallback = () => {
			const cssVars = cssVarsRef.value;
			let style = "";
			for (const key in cssVars) style += `${key}: ${cssVars[key]};`;
			require__utils_cssr_index.c(`.${finalThemeHash}`, style).mount({
				id: finalThemeHash,
				ssr: ssrAdapter,
				parent: styleMountTarget
			});
			renderCallback = void 0;
		};
	};
	(0, vue.watchEffect)(() => {
		mountStyle();
	});
	return {
		themeClass: themeClassRef,
		onRender: () => {
			renderCallback?.();
		}
	};
}
//#endregion
exports.useThemeClass = useThemeClass;
