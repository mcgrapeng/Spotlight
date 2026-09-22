Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require_config_provider_src_context = require("../../config-provider/src/context.js");
let vue = require("vue");
let css_render = require("css-render");
let _css_render_vue3_ssr = require("@css-render/vue3-ssr");
//#region src/heatmap/src/animationStyle.ts
function useLoadingStyleClass(props, themeRef) {
	const loadingClassRef = (0, vue.ref)("");
	const adapter = (0, _css_render_vue3_ssr.useSsrAdapter)();
	const styleMountTarget = (0, vue.inject)(require_config_provider_src_context.configProviderInjectionKey, null)?.styleMountTarget;
	(0, vue.onMounted)(() => {
		(0, vue.watchEffect)(() => {
			if (!props.loading) return;
			const { self: { loadingColorStart, loadingColorEnd } } = themeRef.value;
			const loadingColorHash = (0, css_render.hash)(loadingColorStart) + (0, css_render.hash)(loadingColorEnd);
			const className = `heatmap-loading-${loadingColorHash}`;
			const animationName = `heatmap-loading-animation-${loadingColorHash}`;
			loadingClassRef.value = className;
			require__utils_cssr_index.c([require__utils_cssr_index.c(`.${className}`, `
          animation: 2s ${animationName} infinite cubic-bezier(0.36, 0, 0.64, 1);
        `), require__utils_cssr_index.c(`@keyframes ${animationName}`, `
          0% {
            background: ${loadingColorStart};
          }
          40% {
            background: ${loadingColorEnd};
          }
          80% {
            background: ${loadingColorStart};
          }
          100% {
            background: ${loadingColorStart};
          }
        `)]).mount({
				id: loadingColorHash,
				ssr: adapter,
				parent: styleMountTarget
			});
		});
	});
	return loadingClassRef;
}
//#endregion
exports.useLoadingStyleClass = useLoadingStyleClass;
