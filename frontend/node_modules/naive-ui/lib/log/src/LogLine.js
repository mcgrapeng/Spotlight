const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_log_src_context = require("./context.js");
let vue = require("vue");
//#region src/log/src/LogLine.tsx
const _hoisted_1 = { ref: "selfRef" };
var LogLine_default = (0, vue.defineComponent)({
	props: { line: {
		type: String,
		default: ""
	} },
	setup(props) {
		const { trimRef, highlightRef, languageRef, mergedHljsRef } = (0, vue.inject)(require_log_src_context.logInjectionKey);
		const selfRef = (0, vue.ref)(null);
		const maybeTrimmedLinesRef = (0, vue.computed)(() => {
			return trimRef.value ? props.line.trim() : props.line;
		});
		function setInnerHTML() {
			if (selfRef.value) selfRef.value.innerHTML = generateCodeHTML(languageRef.value, maybeTrimmedLinesRef.value);
		}
		function generateCodeHTML(language, code) {
			const { value: hljs } = mergedHljsRef;
			if (hljs) {
				if (language && hljs.getLanguage(language)) return hljs.highlight(code, { language }).value;
			}
			return code;
		}
		(0, vue.onMounted)(() => {
			if (highlightRef.value) setInnerHTML();
		});
		(0, vue.watch)((0, vue.toRef)(props, "line"), () => {
			if (highlightRef.value) setInnerHTML();
		});
		return {
			highlight: highlightRef,
			selfRef,
			maybeTrimmedLines: maybeTrimmedLinesRef
		};
	},
	render() {
		const { highlight, maybeTrimmedLines } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("pre", _hoisted_1, [highlight ? require_vdom.normalizeVNode(() => null) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => maybeTrimmedLines)], 64))], 512);
	}
});
//#endregion
module.exports = LogLine_default;
