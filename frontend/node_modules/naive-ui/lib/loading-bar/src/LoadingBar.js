const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_loading_bar_src_context = require("./context.js");
const require_loading_bar_styles_light = require("../styles/light.js");
const require_loading_bar_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/loading-bar/src/LoadingBar.tsx
function createClassName(status, clsPrefix) {
	return `${clsPrefix}-loading-bar ${clsPrefix}-loading-bar--${status}`;
}
var LoadingBar_default = (0, vue.defineComponent)({
	name: "LoadingBar",
	props: {
		containerClass: String,
		containerStyle: [String, Object]
	},
	setup() {
		const { inlineThemeDisabled } = require__mixins_use_config.default();
		const { props: providerProps, mergedClsPrefixRef } = (0, vue.inject)(require_loading_bar_src_context.loadingBarProviderInjectionKey);
		const loadingBarRef = (0, vue.ref)(null);
		const enteringRef = (0, vue.ref)(false);
		const startedRef = (0, vue.ref)(false);
		const loadingRef = (0, vue.ref)(false);
		const transitionDisabledRef = (0, vue.ref)(false);
		let finishing = false;
		const erroringRef = (0, vue.ref)(false);
		const mergedLoadingBarStyle = (0, vue.computed)(() => {
			const { loadingBarStyle } = providerProps;
			if (!loadingBarStyle) return "";
			return loadingBarStyle[erroringRef.value ? "error" : "loading"];
		});
		async function init() {
			enteringRef.value = false;
			loadingRef.value = false;
			finishing = false;
			erroringRef.value = false;
			transitionDisabledRef.value = true;
			await (0, vue.nextTick)();
			transitionDisabledRef.value = false;
		}
		async function start(fromProgress = 0, toProgress = 80, status = "starting") {
			startedRef.value = true;
			await init();
			if (finishing) return;
			loadingRef.value = true;
			await (0, vue.nextTick)();
			const el = loadingBarRef.value;
			if (!el) return;
			el.style.maxWidth = `${fromProgress}%`;
			el.style.transition = "none";
			el.offsetWidth;
			el.className = createClassName(status, mergedClsPrefixRef.value);
			el.style.transition = "";
			el.style.maxWidth = `${toProgress}%`;
		}
		async function finish() {
			if (finishing || erroringRef.value) return;
			if (startedRef.value) await (0, vue.nextTick)();
			finishing = true;
			const el = loadingBarRef.value;
			if (!el) return;
			el.className = createClassName("finishing", mergedClsPrefixRef.value);
			el.style.maxWidth = "100%";
			el.offsetWidth;
			loadingRef.value = false;
		}
		function error() {
			if (finishing || erroringRef.value) return;
			if (!loadingRef.value) start(100, 100, "error").then(() => {
				erroringRef.value = true;
				const el = loadingBarRef.value;
				if (!el) return;
				el.className = createClassName("error", mergedClsPrefixRef.value);
				el.offsetWidth;
				loadingRef.value = false;
			});
			else {
				erroringRef.value = true;
				const el = loadingBarRef.value;
				if (!el) return;
				el.className = createClassName("error", mergedClsPrefixRef.value);
				el.style.maxWidth = "100%";
				el.offsetWidth;
				loadingRef.value = false;
			}
		}
		function handleEnter() {
			enteringRef.value = true;
		}
		function handleAfterEnter() {
			enteringRef.value = false;
		}
		async function handleAfterLeave() {
			await init();
		}
		const themeRef = require__mixins_use_theme.default("LoadingBar", "-loading-bar", require_loading_bar_src_styles_index_cssr, require_loading_bar_styles_light, providerProps, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { self: { height, colorError, colorLoading } } = themeRef.value;
			return {
				"--n-height": height,
				"--n-color-loading": colorLoading,
				"--n-color-error": colorError
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("loading-bar", void 0, cssVarsRef, providerProps) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			loadingBarRef,
			started: startedRef,
			loading: loadingRef,
			entering: enteringRef,
			transitionDisabled: transitionDisabledRef,
			start,
			error,
			finish,
			handleEnter,
			handleAfterEnter,
			handleAfterLeave,
			mergedLoadingBarStyle,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		if (!this.started) return null;
		const { mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
			name: "fade-in-transition",
			appear: true,
			onEnter: this.handleEnter,
			onAfterEnter: this.handleAfterEnter,
			onAfterLeave: this.handleAfterLeave,
			css: !this.transitionDisabled
		}, { default: () => {
			this.onRender?.();
			return (0, vue.withDirectives)(((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass([
					`${mergedClsPrefix}-loading-bar-container`,
					this.themeClass,
					this.containerClass
				]),
				style: (0, vue.normalizeStyle)(this.containerStyle)
			}, [(0, vue.createElementVNode)("div", {
				ref: "loadingBarRef",
				class: require_vdom.normalizeClass([`${mergedClsPrefix}-loading-bar`]),
				style: (0, vue.normalizeStyle)([this.cssVars, this.mergedLoadingBarStyle])
			}, null, 6)], 6)), [[vue.vShow, this.loading || !this.loading && this.entering]]);
		} }, 1032, [
			"onEnter",
			"onAfterEnter",
			"onAfterLeave",
			"css"
		]);
	}
});
//#endregion
module.exports = LoadingBar_default;
