Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_hljs = require("../../_mixins/use-hljs.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_code_styles_light = require("../styles/light.js");
const require_code_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/code/src/Code.tsx
const codeProps = {
	...require__mixins_use_theme.default.props,
	language: String,
	code: {
		type: String,
		default: ""
	},
	trim: {
		type: Boolean,
		default: true
	},
	hljs: Object,
	uri: Boolean,
	inline: Boolean,
	wordWrap: Boolean,
	showLineNumbers: Boolean,
	internalFontSize: Number,
	internalNoHighlight: Boolean
};
var Code_default = (0, vue.defineComponent)({
	name: "Code",
	props: codeProps,
	setup(props, { slots }) {
		const { internalNoHighlight } = props;
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default();
		const codeRef = (0, vue.ref)(null);
		const hljsRef = internalNoHighlight ? { value: void 0 } : require__mixins_use_hljs(props);
		const createCodeHtml = (language, code, trim) => {
			const { value: hljs } = hljsRef;
			if (!hljs) return null;
			if (!(language && hljs.getLanguage(language))) return null;
			return hljs.highlight(trim ? code.trim() : code, { language }).value;
		};
		const mergedShowLineNumbersRef = (0, vue.computed)(() => {
			if (props.inline || props.wordWrap) return false;
			return props.showLineNumbers;
		});
		const setCode = () => {
			if (slots.default) return;
			const { value: codeEl } = codeRef;
			if (!codeEl) return;
			const { language } = props;
			const code = props.uri ? window.decodeURIComponent(props.code) : props.code;
			if (language) {
				const html = createCodeHtml(language, code, props.trim);
				if (html !== null) {
					if (props.inline) codeEl.innerHTML = html;
					else {
						const prevPreEl = codeEl.querySelector(".__code__");
						if (prevPreEl) codeEl.removeChild(prevPreEl);
						const preEl = document.createElement("pre");
						preEl.className = "__code__";
						preEl.innerHTML = html;
						codeEl.appendChild(preEl);
					}
					return;
				}
			}
			if (props.inline) {
				codeEl.textContent = code;
				return;
			}
			const maybePreEl = codeEl.querySelector(".__code__");
			if (maybePreEl) maybePreEl.textContent = code;
			else {
				const wrap = document.createElement("pre");
				wrap.className = "__code__";
				wrap.textContent = code;
				codeEl.innerHTML = "";
				codeEl.appendChild(wrap);
			}
		};
		(0, vue.onMounted)(setCode);
		(0, vue.watch)((0, vue.toRef)(props, "language"), setCode);
		(0, vue.watch)((0, vue.toRef)(props, "code"), setCode);
		if (!internalNoHighlight) (0, vue.watch)(hljsRef, setCode);
		const themeRef = require__mixins_use_theme.default("Code", "-code", require_code_src_styles_index_cssr, require_code_styles_light, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut, fontFamilyMono }, self: { textColor, fontSize, fontWeightStrong, lineNumberTextColor, "mono-3": $1, "hue-1": $2, "hue-2": $3, "hue-3": $4, "hue-4": $5, "hue-5": $6, "hue-5-2": $7, "hue-6": $8, "hue-6-2": $9 } } = themeRef.value;
			const { internalFontSize } = props;
			return {
				"--n-font-size": internalFontSize ? `${internalFontSize}px` : fontSize,
				"--n-font-family": fontFamilyMono,
				"--n-font-weight-strong": fontWeightStrong,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-text-color": textColor,
				"--n-mono-3": $1,
				"--n-hue-1": $2,
				"--n-hue-2": $3,
				"--n-hue-3": $4,
				"--n-hue-4": $5,
				"--n-hue-5": $6,
				"--n-hue-5-2": $7,
				"--n-hue-6": $8,
				"--n-hue-6-2": $9,
				"--n-line-number-text-color": lineNumberTextColor
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("code", (0, vue.computed)(() => {
			return `${props.internalFontSize || "a"}`;
		}), cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			codeRef,
			mergedShowLineNumbers: mergedShowLineNumbersRef,
			lineNumbers: (0, vue.computed)(() => {
				let number = 1;
				const numbers = [];
				let lastIsLineWrap = false;
				for (const char of props.code) if (char === "\n") {
					lastIsLineWrap = true;
					numbers.push(number++);
				} else lastIsLineWrap = false;
				if (!lastIsLineWrap) numbers.push(number++);
				return numbers.join("\n");
			}),
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedClsPrefix, wordWrap, mergedShowLineNumbers, onRender } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("code", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-code`,
				this.themeClass,
				wordWrap && `${mergedClsPrefix}-code--word-wrap`,
				mergedShowLineNumbers && `${mergedClsPrefix}-code--show-line-numbers`
			]),
			style: (0, vue.normalizeStyle)(this.cssVars),
			ref: "codeRef"
		}, [mergedShowLineNumbers ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("pre", {
			key: 0,
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-code__line-numbers`)
		}, [require_vdom.normalizeVNode(() => this.lineNumbers)], 2)) : require_vdom.normalizeVNode(() => null), require_vdom.normalizeVNode(() => this.$slots.default?.())], 6);
	}
});
//#endregion
exports.codeProps = codeProps;
exports.default = Code_default;
