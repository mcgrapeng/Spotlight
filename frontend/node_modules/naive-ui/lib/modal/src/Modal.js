Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require_modal_src_interface = require("./interface.js");
const require__utils_composable_use_is_composing = require("../../_utils/composable/use-is-composing.js");
const require__utils_event_index = require("../../_utils/event/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_keep = require("../../_utils/vue/keep.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_dialog_src_context = require("../../dialog/src/context.js");
const require_modal_styles_light = require("../styles/light.js");
const require_modal_src_presetProps = require("./presetProps.js");
const require_modal_src_BodyWrapper = require("./BodyWrapper.js");
const require_modal_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
let vueuc = require("vueuc");
let vdirs = require("vdirs");
//#region src/modal/src/Modal.tsx
const modalProps = {
	...require__mixins_use_theme.default.props,
	show: Boolean,
	showMask: {
		type: Boolean,
		default: true
	},
	maskClosable: {
		type: Boolean,
		default: true
	},
	preset: String,
	to: [String, Object],
	displayDirective: {
		type: String,
		default: "if"
	},
	transformOrigin: {
		type: String,
		default: "mouse"
	},
	zIndex: Number,
	autoFocus: {
		type: Boolean,
		default: true
	},
	trapFocus: {
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
	...require_modal_src_presetProps.presetProps,
	draggable: [Boolean, Object],
	onEsc: Function,
	"onUpdate:show": [Function, Array],
	onUpdateShow: [Function, Array],
	onAfterEnter: Function,
	onBeforeLeave: Function,
	onAfterLeave: Function,
	onClose: Function,
	onPositiveClick: Function,
	onNegativeClick: Function,
	onMaskClick: Function,
	internalDialog: Boolean,
	internalModal: Boolean,
	internalAppear: {
		type: Boolean,
		default: void 0
	},
	overlayStyle: [String, Object],
	onBeforeHide: Function,
	onAfterHide: Function,
	onHide: Function,
	unstableShowMask: {
		type: Boolean,
		default: void 0
	}
};
var Modal_default = (0, vue.defineComponent)({
	name: "Modal",
	inheritAttrs: false,
	props: modalProps,
	slots: Object,
	setup(props) {
		if (process.env.NODE_ENV !== "production") {
			if (props.onHide) require__utils_naive_warn.warnOnce("modal", "`on-hide` is deprecated.");
			if (props.onAfterHide) require__utils_naive_warn.warnOnce("modal", "`on-after-hide` is deprecated, please use `on-after-leave` instead.");
			if (props.onBeforeHide) require__utils_naive_warn.warnOnce("modal", "`on-before-hide` is deprecated, please use `on-before-leave` instead.");
			if (props.overlayStyle) require__utils_naive_warn.warnOnce("modal", "`overlay-style` is deprecated, please use `style` instead.");
			if (props.unstableShowMask) require__utils_naive_warn.warnOnce("modal", "`unstable-show-mask` has been removed, please use `show-mask` instead.");
		}
		const containerRef = (0, vue.ref)(null);
		const { mergedClsPrefixRef, namespaceRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Modal", "-modal", require_modal_src_styles_index_cssr, require_modal_styles_light.default, props, mergedClsPrefixRef);
		const clickedRef = (0, vooks.useClicked)(64);
		const clickedPositionRef = (0, vooks.useClickPosition)();
		const isMountedRef = (0, vooks.useIsMounted)();
		const NDialogProvider = props.internalDialog ? (0, vue.inject)(require_dialog_src_context.dialogProviderInjectionKey, null) : null;
		const NModalProvider = props.internalModal ? (0, vue.inject)(require_modal_src_interface.modalProviderInjectionKey, null) : null;
		const isComposingRef = require__utils_composable_use_is_composing.useIsComposing();
		function doUpdateShow(show) {
			const { onUpdateShow, "onUpdate:show": _onUpdateShow, onHide } = props;
			if (onUpdateShow) require__utils_vue_call.call(onUpdateShow, show);
			if (_onUpdateShow) require__utils_vue_call.call(_onUpdateShow, show);
			if (onHide && !show) onHide(show);
		}
		function handleCloseClick() {
			const { onClose } = props;
			if (onClose) Promise.resolve(onClose()).then((value) => {
				if (value === false) return;
				doUpdateShow(false);
			});
			else doUpdateShow(false);
		}
		function handlePositiveClick() {
			const { onPositiveClick } = props;
			if (onPositiveClick) Promise.resolve(onPositiveClick()).then((value) => {
				if (value === false) return;
				doUpdateShow(false);
			});
			else doUpdateShow(false);
		}
		function handleNegativeClick() {
			const { onNegativeClick } = props;
			if (onNegativeClick) Promise.resolve(onNegativeClick()).then((value) => {
				if (value === false) return;
				doUpdateShow(false);
			});
			else doUpdateShow(false);
		}
		function handleBeforeLeave() {
			const { onBeforeLeave, onBeforeHide } = props;
			if (onBeforeLeave) require__utils_vue_call.call(onBeforeLeave);
			if (onBeforeHide) onBeforeHide();
		}
		function handleAfterLeave() {
			const { onAfterLeave, onAfterHide } = props;
			if (onAfterLeave) require__utils_vue_call.call(onAfterLeave);
			if (onAfterHide) onAfterHide();
		}
		function handleClickoutside(e) {
			const { onMaskClick } = props;
			if (onMaskClick) onMaskClick(e);
			if (props.maskClosable) {
				if (containerRef.value?.contains((0, seemly.getPreciseEventTarget)(e))) doUpdateShow(false);
			}
		}
		function handleEsc(e) {
			props.onEsc?.();
			if (props.show && props.closeOnEsc && require__utils_event_index.eventEffectNotPerformed(e)) {
				if (!isComposingRef.value) doUpdateShow(false);
			}
		}
		(0, vue.provide)(require_modal_src_interface.modalInjectionKey, {
			getMousePosition: () => {
				const mergedProvider = NDialogProvider || NModalProvider;
				if (mergedProvider) {
					const { clickedRef, clickedPositionRef } = mergedProvider;
					if (clickedRef.value && clickedPositionRef.value) return clickedPositionRef.value;
				}
				if (clickedRef.value) return clickedPositionRef.value;
				return null;
			},
			mergedClsPrefixRef,
			mergedThemeRef: themeRef,
			isMountedRef,
			appearRef: (0, vue.toRef)(props, "internalAppear"),
			transformOriginRef: (0, vue.toRef)(props, "transformOrigin")
		});
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseOut }, self: { boxShadow, color, textColor } } = themeRef.value;
			return {
				"--n-bezier-ease-out": cubicBezierEaseOut,
				"--n-box-shadow": boxShadow,
				"--n-color": color,
				"--n-text-color": textColor
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("theme-class", void 0, cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			namespace: namespaceRef,
			isMounted: isMountedRef,
			containerRef,
			presetProps: (0, vue.computed)(() => {
				return require__utils_vue_keep.keep(props, require_modal_src_presetProps.forwardedPresetPropsKeys);
			}),
			handleEsc,
			handleAfterLeave,
			handleClickoutside,
			handleBeforeLeave,
			doUpdateShow,
			handleNegativeClick,
			handlePositiveClick,
			handleCloseClick,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VLazyTeleport, {
			to: this.to,
			show: this.show
		}, { default: () => {
			this.onRender?.();
			const { showMask } = this;
			return (0, vue.withDirectives)(((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				role: "none",
				ref: "containerRef",
				class: require_vdom.normalizeClass([
					`${mergedClsPrefix}-modal-container`,
					this.themeClass,
					this.namespace
				]),
				style: (0, vue.normalizeStyle)(this.cssVars)
			}, [showMask ? ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
				name: "fade-in-transition",
				key: "mask",
				appear: this.internalAppear ?? this.isMounted
			}, { default: () => {
				return this.show ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 1,
					"aria-hidden": true,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-modal-mask`)
				}, null, 2)) : null;
			} }, 1032, ["appear"])) : require_vdom.normalizeVNode(() => null), ((0, vue.openBlock)(), (0, vue.createBlock)(require_modal_src_BodyWrapper, (0, vue.mergeProps)({ style: this.overlayStyle }, this.$attrs, {
				ref: "bodyWrapper",
				displayDirective: this.displayDirective,
				show: this.show,
				preset: this.preset,
				autoFocus: this.autoFocus,
				trapFocus: this.trapFocus,
				draggable: this.draggable,
				blockScroll: this.blockScroll,
				maskHidden: !showMask
			}, this.presetProps, {
				onEsc: this.handleEsc,
				onClose: this.handleCloseClick,
				onNegativeClick: this.handleNegativeClick,
				onPositiveClick: this.handlePositiveClick,
				onBeforeLeave: this.handleBeforeLeave,
				onAfterEnter: this.onAfterEnter,
				onAfterLeave: this.handleAfterLeave,
				onClickoutside: this.handleClickoutside
			}), require_vdom.normalizeSlots(this.$slots), 1040, [
				"style",
				"displayDirective",
				"show",
				"preset",
				"autoFocus",
				"trapFocus",
				"draggable",
				"blockScroll",
				"maskHidden",
				"onEsc",
				"onClose",
				"onNegativeClick",
				"onPositiveClick",
				"onBeforeLeave",
				"onAfterEnter",
				"onAfterLeave",
				"onClickoutside"
			]))], 6)), [[vdirs.zindexable, {
				zIndex: this.zIndex,
				enabled: this.show
			}]]);
		} }, 1032, ["to", "show"]);
	}
});
//#endregion
exports.default = Modal_default;
exports.modalProps = modalProps;
