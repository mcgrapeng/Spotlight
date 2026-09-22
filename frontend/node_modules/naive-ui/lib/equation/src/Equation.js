Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_config_provider_src_context = require("../../config-provider/src/context.js");
let vue = require("vue");
//#region src/equation/src/Equation.tsx
const equationProps = {
	value: String,
	katex: Object,
	katexOptions: Object
};
const Equation = (0, vue.defineComponent)({
	name: "Equation",
	props: equationProps,
	setup(props) {
		const configProviderContext = (0, vue.inject)(require_config_provider_src_context.configProviderInjectionKey, null);
		const extractedHtmlInfo = (0, vue.computed)(() => {
			const outerHtml = (props.katex || configProviderContext?.mergedKatexRef.value)?.renderToString(props.value || "", {
				throwOnError: false,
				...props.katexOptions
			}) || "no katex provided";
			const matchResult = outerHtml.match(/^<([a-z]+)[^>]+class="([^"]+)"[^>]*>/);
			const wrapperTag = matchResult?.[1] || "span";
			const wrapperClass = matchResult?.[2];
			return {
				wrapperTag,
				innerHtml: outerHtml.replace(/^<[a-z]+[^>]*>/, "").replace(/<\/[a-z]+>$/, ""),
				wrapperClass
			};
		});
		return () => {
			const { innerHtml, wrapperClass, wrapperTag } = extractedHtmlInfo.value;
			return (0, vue.h)(wrapperTag, {
				class: wrapperClass,
				innerHTML: innerHtml
			});
		};
	}
});
//#endregion
exports.Equation = Equation;
exports.equationProps = equationProps;
