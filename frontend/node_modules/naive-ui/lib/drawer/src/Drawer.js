Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require_drawer_src_interface = require("./interface.js");
const require__utils_composable_use_is_composing = require("../../_utils/composable/use-is-composing.js");
const require__utils_css_format_length = require("../../_utils/css/format-length.js");
const require__utils_event_index = require("../../_utils/event/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_drawer_styles_light = require("../styles/light.js");
const require_drawer_src_DrawerBodyWrapper = require("./DrawerBodyWrapper.js");
const require_drawer_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
let vooks = require("vooks");
let vueuc = require("vueuc");
let vdirs = require("vdirs");
//#region src/drawer/src/Drawer.tsx
const _hoisted_1 = ["onClick"];
const drawerProps = {
	...require__mixins_use_theme.default.props,
	show: Boolean,
	width: [Number, String],
	height: [Number, String],
	placement: {
		type: String,
		default: "right"
	},
	maskClosable: {
		type: Boolean,
		default: true
	},
	showMask: {
		type: [Boolean, String],
		default: true
	},
	to: [String, Object],
	displayDirective: {
		type: String,
		default: "if"
	},
	nativeScrollbar: {
		type: Boolean,
		default: true
	},
	zIndex: Number,
	onMaskClick: Function,
	scrollbarProps: Object,
	contentClass: String,
	contentStyle: [Object, String],
	trapFocus: {
		type: Boolean,
		default: true
	},
	onEsc: Function,
	autoFocus: {
		type: Boolean,
		default: true
	},
	closeOnEsc: {
		type: Boolean,
		default: true
	},
	blockScroll: {
		type: Boolean,
		default: true
	},
	maxWidth: Number,
	maxHeight: Number,
	minWidth: Number,
	minHeight: Number,
	resizable: Boolean,
	defaultWidth: {
		type: [Number, String],
		default: 251
	},
	defaultHeight: {
		type: [Number, String],
		default: 251
	},
	onUpdateWidth: [Function, Array],
	onUpdateHeight: [Function, Array],
	"onUpdate:width": [Function, Array],
	"onUpdate:height": [Function, Array],
	"onUpdate:show": [Function, Array],
	onUpdateShow: [Function, Array],
	onAfterEnter: Function,
	onAfterLeave: Function,
	/** @deprecated */
	drawerStyle: [String, Object],
	drawerClass: String,
	target: null,
	onShow: Function,
	onHide: Function
};
var Drawer_default = (0, vue.defineComponent)({
	name: "Drawer",
	inheritAttrs: false,
	props: drawerProps,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.drawerStyle !== void 0) require__utils_naive_warn.warnOnce("drawer", "`drawer-style` is deprecated, please use `style` instead.");
			if (props.drawerClass !== void 0) require__utils_naive_warn.warnOnce("drawer", "`drawer-class` is deprecated, please use `class` instead.");
			if (props.target !== void 0) require__utils_naive_warn.warnOnce("drawer", "`target` is deprecated, please use `to` instead.");
			if (props.onShow !== void 0) require__utils_naive_warn.warnOnce("drawer", "`on-show` is deprecated, please use `on-update:show` instead.");
			if (props.onHide !== void 0) require__utils_naive_warn.warnOnce("drawer", "`on-hide` is deprecated, please use `on-update:show` instead.");
		});
		const { mergedClsPrefixRef, namespaceRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const isMountedRef = (0, vooks.useIsMounted)();
		const themeRef = require__mixins_use_theme.default("Drawer", "-drawer", require_drawer_src_styles_index_cssr, require_drawer_styles_light.default, props, mergedClsPrefixRef);
		const uncontrolledWidthRef = (0, vue.ref)(props.defaultWidth);
		const uncontrolledHeightRef = (0, vue.ref)(props.defaultHeight);
		const mergedWidthRef = (0, vooks.useMergedState)((0, vue.toRef)(props, "width"), uncontrolledWidthRef);
		const mergedHeightRef = (0, vooks.useMergedState)((0, vue.toRef)(props, "height"), uncontrolledHeightRef);
		const styleWidthRef = (0, vue.computed)(() => {
			const { placement } = props;
			if (placement === "top" || placement === "bottom") return "";
			return require__utils_css_format_length.formatLength(mergedWidthRef.value);
		});
		const styleHeightRef = (0, vue.computed)(() => {
			const { placement } = props;
			if (placement === "left" || placement === "right") return "";
			return require__utils_css_format_length.formatLength(mergedHeightRef.value);
		});
		const doUpdateWidth = (value) => {
			const { onUpdateWidth, "onUpdate:width": _onUpdateWidth } = props;
			if (onUpdateWidth) require__utils_vue_call.call(onUpdateWidth, value);
			if (_onUpdateWidth) require__utils_vue_call.call(_onUpdateWidth, value);
			uncontrolledWidthRef.value = value;
		};
		const doUpdateHeight = (value) => {
			const { onUpdateHeight, "onUpdate:width": _onUpdateHeight } = props;
			if (onUpdateHeight) require__utils_vue_call.call(onUpdateHeight, value);
			if (_onUpdateHeight) require__utils_vue_call.call(_onUpdateHeight, value);
			uncontrolledHeightRef.value = value;
		};
		const mergedBodyStyleRef = (0, vue.computed)(() => {
			return [{
				width: styleWidthRef.value,
				height: styleHeightRef.value
			}, props.drawerStyle || ""];
		});
		function handleMaskClick(e) {
			const { onMaskClick, maskClosable } = props;
			if (maskClosable) doUpdateShow(false);
			if (onMaskClick) onMaskClick(e);
		}
		function handleOutsideClick(e) {
			handleMaskClick(e);
		}
		const isComposingRef = require__utils_composable_use_is_composing.useIsComposing();
		function handleEsc(e) {
			props.onEsc?.();
			if (props.show && props.closeOnEsc && require__utils_event_index.eventEffectNotPerformed(e)) {
				if (!isComposingRef.value) doUpdateShow(false);
			}
		}
		function doUpdateShow(show) {
			const { onHide, onUpdateShow, "onUpdate:show": _onUpdateShow } = props;
			if (onUpdateShow) require__utils_vue_call.call(onUpdateShow, show);
			if (_onUpdateShow) require__utils_vue_call.call(_onUpdateShow, show);
			if (onHide && !show) require__utils_vue_call.call(onHide, show);
		}
		(0, vue.provide)(require_drawer_src_interface.drawerInjectionKey, {
			isMountedRef,
			mergedThemeRef: themeRef,
			mergedClsPrefixRef,
			doUpdateShow,
			doUpdateHeight,
			doUpdateWidth
		});
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut, cubicBezierEaseIn, cubicBezierEaseOut }, self: { color, textColor, boxShadow, lineHeight, headerPadding, footerPadding, borderRadius, bodyPadding, titleFontSize, titleTextColor, titleFontWeight, headerBorderBottom, footerBorderTop, closeIconColor, closeIconColorHover, closeIconColorPressed, closeColorHover, closeColorPressed, closeIconSize, closeSize, closeBorderRadius, resizableTriggerColorHover } } = themeRef.value;
			return {
				"--n-line-height": lineHeight,
				"--n-color": color,
				"--n-border-radius": borderRadius,
				"--n-text-color": textColor,
				"--n-box-shadow": boxShadow,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-bezier-out": cubicBezierEaseOut,
				"--n-bezier-in": cubicBezierEaseIn,
				"--n-header-padding": headerPadding,
				"--n-body-padding": bodyPadding,
				"--n-footer-padding": footerPadding,
				"--n-title-text-color": titleTextColor,
				"--n-title-font-size": titleFontSize,
				"--n-title-font-weight": titleFontWeight,
				"--n-header-border-bottom": headerBorderBottom,
				"--n-footer-border-top": footerBorderTop,
				"--n-close-icon-color": closeIconColor,
				"--n-close-icon-color-hover": closeIconColorHover,
				"--n-close-icon-color-pressed": closeIconColorPressed,
				"--n-close-size": closeSize,
				"--n-close-color-hover": closeColorHover,
				"--n-close-color-pressed": closeColorPressed,
				"--n-close-icon-size": closeIconSize,
				"--n-close-border-radius": closeBorderRadius,
				"--n-resize-trigger-color-hover": resizableTriggerColorHover
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("drawer", void 0, cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			namespace: namespaceRef,
			mergedBodyStyle: mergedBodyStyleRef,
			handleOutsideClick,
			handleMaskClick,
			handleEsc,
			mergedTheme: themeRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender,
			isMounted: isMountedRef
		};
	},
	render() {
		const { mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VLazyTeleport, {
			to: this.to,
			show: this.show
		}, { default: () => {
			this.onRender?.();
			return (0, vue.withDirectives)(((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass([
					`${mergedClsPrefix}-drawer-container`,
					this.namespace,
					this.themeClass
				]),
				style: (0, vue.normalizeStyle)(this.cssVars),
				role: "none"
			}, [this.showMask ? ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
				key: 0,
				name: "fade-in-transition",
				appear: this.isMounted
			}, { default: () => this.show ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 1,
				"aria-hidden": true,
				class: require_vdom.normalizeClass([`${mergedClsPrefix}-drawer-mask`, this.showMask === "transparent" && `${mergedClsPrefix}-drawer-mask--invisible`]),
				onClick: this.handleMaskClick
			}, null, 10, _hoisted_1)) : null }, 1032, ["appear"])) : require_vdom.normalizeVNode(() => null), ((0, vue.openBlock)(), (0, vue.createBlock)(require_drawer_src_DrawerBodyWrapper, (0, vue.mergeProps)(this.$attrs, {
				class: [this.drawerClass, this.$attrs.class],
				style: [this.mergedBodyStyle, this.$attrs.style],
				blockScroll: this.blockScroll,
				contentStyle: this.contentStyle,
				contentClass: this.contentClass,
				placement: this.placement,
				scrollbarProps: this.scrollbarProps,
				show: this.show,
				displayDirective: this.displayDirective,
				nativeScrollbar: this.nativeScrollbar,
				onAfterEnter: this.onAfterEnter,
				onAfterLeave: this.onAfterLeave,
				trapFocus: this.trapFocus,
				autoFocus: this.autoFocus,
				resizable: this.resizable,
				maxHeight: this.maxHeight,
				minHeight: this.minHeight,
				maxWidth: this.maxWidth,
				minWidth: this.minWidth,
				showMask: this.showMask,
				onEsc: this.handleEsc,
				onClickoutside: this.handleOutsideClick
			}), require_vdom.normalizeSlots(this.$slots), 1040, [
				"class",
				"style",
				"blockScroll",
				"contentStyle",
				"contentClass",
				"placement",
				"scrollbarProps",
				"show",
				"displayDirective",
				"nativeScrollbar",
				"onAfterEnter",
				"onAfterLeave",
				"trapFocus",
				"autoFocus",
				"resizable",
				"maxHeight",
				"minHeight",
				"maxWidth",
				"minWidth",
				"showMask",
				"onEsc",
				"onClickoutside"
			]))], 6)), [[vdirs.zindexable, {
				zIndex: this.zIndex,
				enabled: this.show
			}]]);
		} }, 1032, ["to", "show"]);
	}
});
//#endregion
exports.default = Drawer_default;
exports.drawerProps = drawerProps;
