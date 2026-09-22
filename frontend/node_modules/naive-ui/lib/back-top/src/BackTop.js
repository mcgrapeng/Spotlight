Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_composable_use_lock_html_scroll = require("../../_utils/composable/use-lock-html-scroll.js");
const require__utils_css_format_length = require("../../_utils/css/format-length.js");
const require__utils_dom_is_document = require("../../_utils/dom/is-document.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require_back_top_styles_light = require("../styles/light.js");
const require_back_top_src_BackTopIcon = require("./BackTopIcon.js");
const require_back_top_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
let vueuc = require("vueuc");
//#region src/back-top/src/BackTop.tsx
const backTopProps = {
	...require__mixins_use_theme.default.props,
	show: {
		type: Boolean,
		default: void 0
	},
	right: {
		type: [Number, String],
		default: 40
	},
	bottom: {
		type: [Number, String],
		default: 40
	},
	to: {
		type: [String, Object],
		default: "body"
	},
	visibilityHeight: {
		type: Number,
		default: 180
	},
	listenTo: [
		String,
		Object,
		Function
	],
	"onUpdate:show": {
		type: Function,
		default: () => {}
	},
	target: Function,
	onShow: Function,
	onHide: Function
};
var BackTop_default = (0, vue.defineComponent)({
	name: "BackTop",
	inheritAttrs: false,
	props: backTopProps,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.target !== void 0) require__utils_naive_warn.warnOnce("back-top", "`target` is deprecated, please use `listen-to` instead.");
			if (props.onShow !== void 0) require__utils_naive_warn.warnOnce("back-top", "`on-show` is deprecated, please use `on-update:show` instead.");
			if (props.onHide !== void 0) require__utils_naive_warn.warnOnce("back-top", "`on-hide` is deprecated, please use `on-update:show` instead.");
		});
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const scrollTopRef = (0, vue.ref)(null);
		const uncontrolledShowRef = (0, vue.ref)(false);
		(0, vue.watchEffect)(() => {
			const { value: scrollTop } = scrollTopRef;
			if (scrollTop === null) {
				uncontrolledShowRef.value = false;
				return;
			}
			uncontrolledShowRef.value = scrollTop >= props.visibilityHeight;
		});
		const DomInfoReadyRef = (0, vue.ref)(false);
		(0, vue.watch)(uncontrolledShowRef, (value) => {
			if (DomInfoReadyRef.value) props["onUpdate:show"]?.(value);
		});
		const controlledShowRef = (0, vue.toRef)(props, "show");
		const mergedShowRef = (0, vooks.useMergedState)(controlledShowRef, uncontrolledShowRef);
		const transitionDisabledRef = (0, vue.ref)(true);
		const placeholderRef = (0, vue.ref)(null);
		const styleRef = (0, vue.computed)(() => {
			return {
				right: `calc(${require__utils_css_format_length.formatLength(props.right)} + ${require__utils_composable_use_lock_html_scroll.lockHtmlScrollRightCompensationRef.value})`,
				bottom: require__utils_css_format_length.formatLength(props.bottom)
			};
		});
		let scrollElement;
		let scrollListenerRegistered;
		(0, vue.watch)(mergedShowRef, (value) => {
			if (DomInfoReadyRef.value) {
				if (value) props.onShow?.();
				props.onHide?.();
			}
		});
		const themeRef = require__mixins_use_theme.default("BackTop", "-back-top", require_back_top_src_styles_index_cssr, require_back_top_styles_light, props, mergedClsPrefixRef);
		function init() {
			if (scrollListenerRegistered) return;
			scrollListenerRegistered = true;
			const scrollEl = props.target?.() || (0, seemly.unwrapElement)(props.listenTo) || (0, seemly.getScrollParent)(placeholderRef.value);
			if (!scrollEl) {
				if (process.env.NODE_ENV !== "production") require__utils_naive_warn.warn("back-top", "Container of back-top element is not found. This could be a bug of naive-ui.");
				return;
			}
			scrollElement = scrollEl === document.documentElement ? document : scrollEl;
			const { to } = props;
			const target = typeof to === "string" ? document.querySelector(to) : to;
			if (process.env.NODE_ENV !== "production" && !target) require__utils_naive_warn.warn("back-top", "Target is not found.");
			scrollElement.addEventListener("scroll", handleScroll);
			handleScroll();
		}
		function handleClick() {
			(require__utils_dom_is_document.isDocument(scrollElement) ? document.documentElement : scrollElement).scrollTo({
				top: 0,
				behavior: "smooth"
			});
		}
		function handleScroll() {
			scrollTopRef.value = (require__utils_dom_is_document.isDocument(scrollElement) ? document.documentElement : scrollElement).scrollTop;
			if (!DomInfoReadyRef.value) (0, vue.nextTick)(() => {
				DomInfoReadyRef.value = true;
			});
		}
		function handleAfterEnter() {
			transitionDisabledRef.value = false;
		}
		(0, vue.onMounted)(() => {
			init();
			transitionDisabledRef.value = mergedShowRef.value;
		});
		(0, vue.onBeforeUnmount)(() => {
			if (scrollElement) scrollElement.removeEventListener("scroll", handleScroll);
		});
		const cssVarsRef = (0, vue.computed)(() => {
			const { self: { color, boxShadow, boxShadowHover, boxShadowPressed, iconColor, iconColorHover, iconColorPressed, width, height, iconSize, borderRadius, textColor }, common: { cubicBezierEaseInOut } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-border-radius": borderRadius,
				"--n-height": height,
				"--n-width": width,
				"--n-box-shadow": boxShadow,
				"--n-box-shadow-hover": boxShadowHover,
				"--n-box-shadow-pressed": boxShadowPressed,
				"--n-color": color,
				"--n-icon-size": iconSize,
				"--n-icon-color": iconColor,
				"--n-icon-color-hover": iconColorHover,
				"--n-icon-color-pressed": iconColorPressed,
				"--n-text-color": textColor
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("back-top", void 0, cssVarsRef, props) : void 0;
		return {
			placeholderRef,
			style: styleRef,
			mergedShow: mergedShowRef,
			isMounted: (0, vooks.useIsMounted)(),
			scrollElement: (0, vue.ref)(null),
			scrollTop: scrollTopRef,
			DomInfoReady: DomInfoReadyRef,
			transitionDisabled: transitionDisabledRef,
			mergedClsPrefix: mergedClsPrefixRef,
			handleAfterEnter,
			handleScroll,
			handleClick,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			ref: "placeholderRef",
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-back-top-placeholder`),
			style: "display: none",
			"aria-hidden": true
		}, [((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VLazyTeleport, {
			to: this.to,
			show: this.mergedShow
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
			name: "fade-in-scale-up-transition",
			appear: this.isMounted,
			onAfterEnter: this.handleAfterEnter
		}, { default: () => {
			this.onRender?.();
			return this.mergedShow ? (0, vue.h)("div", (0, vue.mergeProps)(this.$attrs, {
				class: [
					`${mergedClsPrefix}-back-top`,
					this.themeClass,
					this.transitionDisabled && `${mergedClsPrefix}-back-top--transition-disabled`
				],
				style: [this.style, this.cssVars],
				onClick: this.handleClick
			}), require__utils_vue_resolve_slot.resolveSlot(this.$slots.default, () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix: mergedClsPrefix }, { default: require_back_top_src_BackTopIcon }, 1032, ["clsPrefix"]))])) : null;
		} }, 1032, ["appear", "onAfterEnter"])) }, 1032, ["to", "show"]))], 2);
	}
});
//#endregion
exports.backTopProps = backTopProps;
exports.default = BackTop_default;
