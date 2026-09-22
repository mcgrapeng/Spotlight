Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_tabs_src_interface = require("./interface.js");
let vue = require("vue");
//#region src/tabs/src/TabPane.tsx
const tabPaneProps = {
	tab: [
		String,
		Number,
		Object,
		Function
	],
	name: {
		type: [String, Number],
		required: true
	},
	disabled: Boolean,
	displayDirective: {
		type: String,
		default: "if"
	},
	closable: {
		type: Boolean,
		default: void 0
	},
	tabProps: Object,
	/** @deprecated */
	label: [
		String,
		Number,
		Object,
		Function
	]
};
var TabPane_default = (0, vue.defineComponent)({
	__TAB_PANE__: true,
	name: "TabPane",
	alias: ["TabPanel"],
	props: tabPaneProps,
	slots: Object,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.label !== void 0) require__utils_naive_warn.warnOnce("tab-pane", "`label` is deprecated, please use `tab` instead.");
		});
		const NTab = (0, vue.inject)(require_tabs_src_interface.tabsInjectionKey, null);
		if (!NTab) require__utils_naive_warn.throwError("tab-pane", "`n-tab-pane` must be placed inside `n-tabs`.");
		return {
			style: NTab.paneStyleRef,
			class: NTab.paneClassRef,
			mergedClsPrefix: NTab.mergedClsPrefixRef
		};
	},
	render() {
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([`${this.mergedClsPrefix}-tab-pane`, this.class]),
			style: (0, vue.normalizeStyle)(this.style)
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 6);
	}
});
//#endregion
exports.default = TabPane_default;
exports.tabPaneProps = tabPaneProps;
