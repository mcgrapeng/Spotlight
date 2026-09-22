Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_keysOf = require("../../_utils/vue/keysOf.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_select_menu_src_SelectMenu = require("../../_internal/select-menu/src/SelectMenu.js");
const require_select_src_utils = require("../../select/src/utils.js");
const require_popselect_styles_light = require("../styles/light.js");
const require_popselect_src_interface = require("./interface.js");
const require_popselect_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
let treemate = require("treemate");
//#region src/popselect/src/PopselectPanel.tsx
const panelProps = {
	multiple: Boolean,
	value: {
		type: [
			String,
			Number,
			Array
		],
		default: null
	},
	cancelable: Boolean,
	options: {
		type: Array,
		default: () => []
	},
	size: String,
	scrollable: Boolean,
	"onUpdate:value": [Function, Array],
	onUpdateValue: [Function, Array],
	onMouseenter: Function,
	onMouseleave: Function,
	renderLabel: Function,
	showCheckmark: {
		type: Boolean,
		default: void 0
	},
	nodeProps: Function,
	virtualScroll: Boolean,
	onChange: [Function, Array]
};
const panelPropKeys = require__utils_vue_keysOf.keysOf(panelProps);
var PopselectPanel_default = (0, vue.defineComponent)({
	name: "PopselectPanel",
	props: panelProps,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.onChange !== void 0) require__utils_naive_warn.warn("popselect", "`on-change` is deprecated, please use `on-update:value` instead.");
		});
		const NPopselect = (0, vue.inject)(require_popselect_src_interface.popselectInjectionKey);
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const mergedSizeRef = (0, vue.computed)(() => {
			return props.size || mergedComponentPropsRef?.value?.Popselect?.size || "medium";
		});
		const themeRef = require__mixins_use_theme.default("Popselect", "-pop-select", require_popselect_src_styles_index_cssr, require_popselect_styles_light.default, NPopselect.props, mergedClsPrefixRef);
		const treeMateRef = (0, vue.computed)(() => {
			return (0, treemate.createTreeMate)(props.options, require_select_src_utils.createTmOptions("value", "children"));
		});
		function doUpdateValue(value, option) {
			const { onUpdateValue, "onUpdate:value": _onUpdateValue, onChange } = props;
			if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, value, option);
			if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, value, option);
			if (onChange) require__utils_vue_call.call(onChange, value, option);
		}
		function handleToggle(tmNode) {
			toggle(tmNode.key);
		}
		function handleMenuMousedown(e) {
			if (!(0, seemly.happensIn)(e, "action") && !(0, seemly.happensIn)(e, "empty") && !(0, seemly.happensIn)(e, "header")) e.preventDefault();
		}
		function toggle(value) {
			const { value: { getNode } } = treeMateRef;
			if (props.multiple) {
				if (Array.isArray(props.value)) {
					const newValue = [];
					const newOptions = [];
					let shouldAddValue = true;
					props.value.forEach((v) => {
						if (v === value) {
							shouldAddValue = false;
							return;
						}
						const tmNode = getNode(v);
						if (tmNode) {
							newValue.push(tmNode.key);
							newOptions.push(tmNode.rawNode);
						}
					});
					if (shouldAddValue) {
						newValue.push(value);
						newOptions.push(getNode(value).rawNode);
					}
					doUpdateValue(newValue, newOptions);
				} else {
					const tmNode = getNode(value);
					if (tmNode) doUpdateValue([value], [tmNode.rawNode]);
				}
			} else if (props.value === value && props.cancelable) doUpdateValue(null, null);
			else {
				const tmNode = getNode(value);
				if (tmNode) doUpdateValue(value, tmNode.rawNode);
				const { "onUpdate:show": _onUpdateShow, onUpdateShow } = NPopselect.props;
				if (_onUpdateShow) require__utils_vue_call.call(_onUpdateShow, false);
				if (onUpdateShow) require__utils_vue_call.call(onUpdateShow, false);
				NPopselect.setShow(false);
			}
			(0, vue.nextTick)(() => {
				NPopselect.syncPosition();
			});
		}
		(0, vue.watch)((0, vue.toRef)(props, "options"), () => {
			(0, vue.nextTick)(() => {
				NPopselect.syncPosition();
			});
		});
		const cssVarsRef = (0, vue.computed)(() => {
			const { self: { menuBoxShadow } } = themeRef.value;
			return { "--n-menu-box-shadow": menuBoxShadow };
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("select", void 0, cssVarsRef, NPopselect.props) : void 0;
		return {
			mergedTheme: NPopselect.mergedThemeRef,
			mergedClsPrefix: mergedClsPrefixRef,
			treeMate: treeMateRef,
			handleToggle,
			handleMenuMousedown,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender,
			mergedSize: mergedSizeRef,
			scrollbarProps: NPopselect.props.scrollbarProps
		};
	},
	render() {
		this.onRender?.();
		return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_select_menu_src_SelectMenu, {
			clsPrefix: this.mergedClsPrefix,
			focusable: true,
			nodeProps: this.nodeProps,
			class: require_vdom.normalizeClass([`${this.mergedClsPrefix}-popselect-menu`, this.themeClass]),
			style: (0, vue.normalizeStyle)(this.cssVars),
			theme: this.mergedTheme.peers.InternalSelectMenu,
			themeOverrides: this.mergedTheme.peerOverrides.InternalSelectMenu,
			multiple: this.multiple,
			treeMate: this.treeMate,
			size: this.mergedSize,
			value: this.value,
			virtualScroll: this.virtualScroll,
			scrollable: this.scrollable,
			scrollbarProps: this.scrollbarProps,
			renderLabel: this.renderLabel,
			onToggle: this.handleToggle,
			onMouseenter: this.onMouseenter,
			onMouseleave: this.onMouseenter,
			onMousedown: this.handleMenuMousedown,
			showCheckmark: this.showCheckmark
		}, {
			_: 1,
			header: require_vdom.normalizeSlot(() => this.$slots.header?.() || []),
			action: require_vdom.normalizeSlot(() => this.$slots.action?.() || []),
			empty: require_vdom.normalizeSlot(() => this.$slots.empty?.() || [])
		}, 8, [
			"clsPrefix",
			"nodeProps",
			"class",
			"style",
			"theme",
			"themeOverrides",
			"multiple",
			"treeMate",
			"size",
			"value",
			"virtualScroll",
			"scrollable",
			"scrollbarProps",
			"renderLabel",
			"onToggle",
			"onMouseenter",
			"onMouseleave",
			"onMousedown",
			"showCheckmark"
		]);
	}
});
//#endregion
exports.default = PopselectPanel_default;
exports.panelPropKeys = panelPropKeys;
exports.panelProps = panelProps;
