Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_loading_bar_src_context = require("./context.js");
const require_loading_bar_src_LoadingBar = require("./LoadingBar.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/loading-bar/src/LoadingBarProvider.tsx
const loadingBarProviderProps = {
	...require__mixins_use_theme.default.props,
	to: {
		type: [
			String,
			Object,
			Boolean
		],
		default: void 0
	},
	containerClass: String,
	containerStyle: [String, Object],
	loadingBarStyle: { type: Object }
};
var LoadingBarProvider_default = (0, vue.defineComponent)({
	name: "LoadingBarProvider",
	props: loadingBarProviderProps,
	setup(props) {
		const isMountedRef = (0, vooks.useIsMounted)();
		const loadingBarRef = (0, vue.ref)(null);
		const methods = {
			start() {
				if (isMountedRef.value) loadingBarRef.value?.start();
				else (0, vue.nextTick)(() => {
					loadingBarRef.value?.start();
				});
			},
			error() {
				if (isMountedRef.value) loadingBarRef.value?.error();
				else (0, vue.nextTick)(() => {
					loadingBarRef.value?.error();
				});
			},
			finish() {
				if (isMountedRef.value) loadingBarRef.value?.finish();
				else (0, vue.nextTick)(() => {
					loadingBarRef.value?.finish();
				});
			}
		};
		const { mergedClsPrefixRef } = require__mixins_use_config.default(props);
		(0, vue.provide)(require_loading_bar_src_context.loadingBarApiInjectionKey, methods);
		(0, vue.provide)(require_loading_bar_src_context.loadingBarProviderInjectionKey, {
			props,
			mergedClsPrefixRef
		});
		return Object.assign(methods, { loadingBarRef });
	},
	render() {
		return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [((0, vue.openBlock)(), (0, vue.createBlock)(vue.Teleport, {
			disabled: this.to === false,
			to: this.to || "body"
		}, [((0, vue.openBlock)(), (0, vue.createBlock)(require_loading_bar_src_LoadingBar, {
			ref: "loadingBarRef",
			containerStyle: this.containerStyle,
			containerClass: this.containerClass
		}, null, 8, ["containerStyle", "containerClass"]))], 8, ["disabled", "to"])), require_vdom.normalizeVNode(() => this.$slots.default?.())], 64);
	}
});
//#endregion
exports.default = LoadingBarProvider_default;
exports.loadingBarProviderProps = loadingBarProviderProps;
