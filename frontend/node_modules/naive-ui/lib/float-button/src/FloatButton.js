Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_css_format_length = require("../../_utils/css/format-length.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Close = require("../../_internal/icons/Close.js");
const require_float_button_group_src_FloatButtonGroup = require("../../float-button-group/src/FloatButtonGroup.js");
const require_float_button_styles_light = require("../styles/light.js");
const require_float_button_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
let evtd = require("evtd");
let vooks = require("vooks");
//#region src/float-button/src/FloatButton.tsx
const _hoisted_1 = [
	"onMouseenter",
	"onMouseleave",
	"onClick"
];
const floatButtonProps = {
	...require__mixins_use_theme.default.props,
	width: {
		type: [Number, String],
		default: 40
	},
	height: {
		type: [Number, String],
		default: 40
	},
	left: [Number, String],
	right: [Number, String],
	top: [Number, String],
	bottom: [Number, String],
	shape: {
		type: String,
		default: "circle"
	},
	position: {
		type: String,
		default: "fixed"
	},
	type: {
		type: String,
		default: "default"
	},
	menuTrigger: String,
	showMenu: {
		type: Boolean,
		default: void 0
	},
	onUpdateShowMenu: {
		type: [Function, Array],
		default: void 0
	},
	"onUpdate:showMenu": {
		type: [Function, Array],
		default: void 0
	}
};
var FloatButton_default = (0, vue.defineComponent)({
	name: "FloatButton",
	props: floatButtonProps,
	slots: Object,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const selfElRef = (0, vue.ref)(null);
		const themeRef = require__mixins_use_theme.default("FloatButton", "-float-button", require_float_button_src_styles_index_cssr, require_float_button_styles_light, props, mergedClsPrefixRef);
		const floatButtonGroupInjection = (0, vue.inject)(require_float_button_group_src_FloatButtonGroup.floatButtonGroupInjectionKey, null);
		const uncontrolledShowMenuRef = (0, vue.ref)(false);
		const controlledShoeMenuRef = (0, vue.toRef)(props, "showMenu");
		const mergedShowMenuRef = (0, vooks.useMergedState)(controlledShoeMenuRef, uncontrolledShowMenuRef);
		function doUpdateShowMenu(value) {
			const { onUpdateShowMenu, "onUpdate:showMenu": _onUpdateShowMenu } = props;
			uncontrolledShowMenuRef.value = value;
			if (onUpdateShowMenu) require__utils_vue_call.call(onUpdateShowMenu, value);
			if (_onUpdateShowMenu) require__utils_vue_call.call(_onUpdateShowMenu, value);
		}
		const cssVarsRef = (0, vue.computed)(() => {
			const { self: { color, textColor, boxShadow, boxShadowHover, boxShadowPressed, colorHover, colorPrimary, colorPrimaryHover, textColorPrimary, borderRadiusSquare, colorPressed, colorPrimaryPressed }, common: { cubicBezierEaseInOut } } = themeRef.value;
			const { type } = props;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-box-shadow": boxShadow,
				"--n-box-shadow-hover": boxShadowHover,
				"--n-box-shadow-pressed": boxShadowPressed,
				"--n-color": type === "primary" ? colorPrimary : color,
				"--n-text-color": type === "primary" ? textColorPrimary : textColor,
				"--n-color-hover": type === "primary" ? colorPrimaryHover : colorHover,
				"--n-color-pressed": type === "primary" ? colorPrimaryPressed : colorPressed,
				"--n-border-radius-square": borderRadiusSquare
			};
		});
		const inlineStyle = (0, vue.computed)(() => {
			const { width, height } = props;
			return {
				position: floatButtonGroupInjection ? void 0 : props.position,
				width: require__utils_css_format_length.formatLength(width),
				minHeight: require__utils_css_format_length.formatLength(height),
				...floatButtonGroupInjection ? null : {
					left: require__utils_css_format_length.formatLength(props.left),
					right: require__utils_css_format_length.formatLength(props.right),
					top: require__utils_css_format_length.formatLength(props.top),
					bottom: require__utils_css_format_length.formatLength(props.bottom)
				}
			};
		});
		const mergedShapeRef = (0, vue.computed)(() => {
			return floatButtonGroupInjection ? floatButtonGroupInjection.shapeRef.value : props.shape;
		});
		const Mouseenter = () => {
			if (props.menuTrigger === "hover") doUpdateShowMenu(true);
		};
		const handleMouseleave = () => {
			if (props.menuTrigger === "hover" && mergedShowMenuRef.value) doUpdateShowMenu(false);
		};
		const handleClick = () => {
			if (props.menuTrigger === "click") doUpdateShowMenu(!mergedShowMenuRef.value);
		};
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("float-button", (0, vue.computed)(() => props.type[0]), cssVarsRef, props) : void 0;
		(0, vue.onMounted)(() => {
			const selfEl = selfElRef.value;
			if (selfEl) (0, evtd.on)("mousemoveoutside", selfEl, handleMouseleave);
		});
		(0, vue.onBeforeUnmount)(() => {
			const selfEl = selfElRef.value;
			if (selfEl) (0, evtd.off)("mousemoveoutside", selfEl, handleMouseleave);
		});
		return {
			inlineStyle,
			selfElRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedShape: mergedShapeRef,
			mergedShowMenu: mergedShowMenuRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender,
			Mouseenter,
			handleMouseleave,
			handleClick
		};
	},
	render() {
		const { mergedClsPrefix, cssVars, mergedShape, type, menuTrigger, mergedShowMenu, themeClass, $slots, inlineStyle, onRender } = this;
		onRender?.();
		return (() => {
			const _cache = require_vdom.createVNodeCache("6bc55e1ae00d3b9b");
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				ref: "selfElRef",
				class: require_vdom.normalizeClass([
					`${mergedClsPrefix}-float-button`,
					`${mergedClsPrefix}-float-button--${mergedShape}-shape`,
					`${mergedClsPrefix}-float-button--${type}-type`,
					mergedShowMenu && `${mergedClsPrefix}-float-button--show-menu`,
					themeClass
				]),
				style: (0, vue.normalizeStyle)([cssVars, inlineStyle]),
				onMouseenter: this.Mouseenter,
				onMouseleave: this.handleMouseleave,
				onClick: this.handleClick,
				role: "button"
			}, [
				(0, vue.createElementVNode)("div", {
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-float-button__fill`),
					"aria-hidden": true
				}, null, 2),
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-float-button__body`) }, [require_vdom.normalizeVNode(() => $slots.default?.()), require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot($slots.description, (children) => {
					if (children) return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 1,
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-float-button__description`)
					}, [require_vdom.normalizeVNode(() => children)], 2);
					return null;
				}))], 2),
				menuTrigger ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 0,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-float-button__close`)
				}, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix: mergedClsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Close)) }, 1032, ["clsPrefix"]))], 2)) : require_vdom.normalizeVNode(() => null),
				menuTrigger ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 2,
					onClick: _cache[0] || (_cache[0] = (e) => {
						e.stopPropagation();
					}),
					"data-float-button-menu": true,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-float-button__menu`)
				}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot($slots.menu, () => []))], 2)) : require_vdom.normalizeVNode(() => null)
			], 46, _hoisted_1);
		})();
	}
});
//#endregion
exports.default = FloatButton_default;
exports.floatButtonProps = floatButtonProps;
