Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_keysOf = require("../../_utils/vue/keysOf.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_style = require("../../_mixins/use-style.js");
const require_affix_src_styles_index_cssr = require("./styles/index.cssr.js");
const require_affix_src_utils = require("./utils.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let seemly = require("seemly");
let vue = require("vue");
//#region src/affix/src/Affix.tsx
const affixProps = {
	listenTo: [
		String,
		Object,
		Function
	],
	top: Number,
	bottom: Number,
	triggerTop: Number,
	triggerBottom: Number,
	position: {
		type: String,
		default: "fixed"
	},
	offsetTop: {
		type: Number,
		validator: () => {
			if (process.env.NODE_ENV !== "production") require__utils_naive_warn.warn("affix", "`offset-top` is deprecated, please use `trigger-top` instead.");
			return true;
		},
		default: void 0
	},
	offsetBottom: {
		type: Number,
		validator: () => {
			if (process.env.NODE_ENV !== "production") require__utils_naive_warn.warn("affix", "`offset-bottom` is deprecated, please use `trigger-bottom` instead.");
			return true;
		},
		default: void 0
	},
	target: {
		type: Function,
		validator: () => {
			if (process.env.NODE_ENV !== "production") require__utils_naive_warn.warn("affix", "`target` is deprecated, please use `listen-to` instead.");
			return true;
		},
		default: void 0
	}
};
const affixPropKeys = require__utils_vue_keysOf.keysOf(affixProps);
var Affix_default = (0, vue.defineComponent)({
	name: "Affix",
	props: affixProps,
	setup(props) {
		const { mergedClsPrefixRef } = require__mixins_use_config.default(props);
		require__mixins_use_style("-affix", require_affix_src_styles_index_cssr, mergedClsPrefixRef);
		let scrollTarget = null;
		const stickToTopRef = (0, vue.ref)(false);
		const stickToBottomRef = (0, vue.ref)(false);
		const bottomAffixedTriggerScrollTopRef = (0, vue.ref)(null);
		const topAffixedTriggerScrollTopRef = (0, vue.ref)(null);
		const affixedRef = (0, vue.computed)(() => {
			return stickToBottomRef.value || stickToTopRef.value;
		});
		const mergedOffsetTopRef = (0, vue.computed)(() => {
			return props.triggerTop ?? props.offsetTop ?? props.top;
		});
		const mergedTopRef = (0, vue.computed)(() => {
			return props.top ?? props.triggerTop ?? props.offsetTop;
		});
		const mergedBottomRef = (0, vue.computed)(() => {
			return props.bottom ?? props.triggerBottom ?? props.offsetBottom;
		});
		const mergedOffsetBottomRef = (0, vue.computed)(() => {
			return props.triggerBottom ?? props.offsetBottom ?? props.bottom;
		});
		const selfRef = (0, vue.ref)(null);
		const init = () => {
			const { target: getScrollTarget, listenTo } = props;
			if (getScrollTarget) scrollTarget = getScrollTarget();
			else if (listenTo) scrollTarget = (0, seemly.unwrapElement)(listenTo);
			else scrollTarget = document;
			if (scrollTarget) {
				scrollTarget.addEventListener("scroll", handleScroll);
				handleScroll();
			} else if (process.env.NODE_ENV !== "production") require__utils_naive_warn.warn("affix", "Target to be listened to is not valid.");
		};
		function handleScroll() {
			(0, seemly.beforeNextFrameOnce)(_handleScroll);
		}
		function _handleScroll() {
			const { value: selfEl } = selfRef;
			if (!scrollTarget || !selfEl) return;
			const scrollTop = require_affix_src_utils.getScrollTop(scrollTarget);
			if (affixedRef.value) {
				if (topAffixedTriggerScrollTopRef.value !== null && scrollTop < topAffixedTriggerScrollTopRef.value) {
					stickToTopRef.value = false;
					topAffixedTriggerScrollTopRef.value = null;
				}
				if (bottomAffixedTriggerScrollTopRef.value !== null && scrollTop > bottomAffixedTriggerScrollTopRef.value) {
					stickToBottomRef.value = false;
					bottomAffixedTriggerScrollTopRef.value = null;
				}
				return;
			}
			const containerRect = require_affix_src_utils.getRect(scrollTarget);
			const affixRect = selfEl.getBoundingClientRect();
			const pxToTop = affixRect.top - containerRect.top;
			const pxToBottom = containerRect.bottom - affixRect.bottom;
			const mergedOffsetTop = mergedOffsetTopRef.value;
			const mergedOffsetBottom = mergedOffsetBottomRef.value;
			if (mergedOffsetTop !== void 0 && pxToTop <= mergedOffsetTop) {
				stickToTopRef.value = true;
				topAffixedTriggerScrollTopRef.value = scrollTop - (mergedOffsetTop - pxToTop);
			} else {
				stickToTopRef.value = false;
				topAffixedTriggerScrollTopRef.value = null;
			}
			if (mergedOffsetBottom !== void 0 && pxToBottom <= mergedOffsetBottom) {
				stickToBottomRef.value = true;
				bottomAffixedTriggerScrollTopRef.value = scrollTop + mergedOffsetBottom - pxToBottom;
			} else {
				stickToBottomRef.value = false;
				bottomAffixedTriggerScrollTopRef.value = null;
			}
		}
		(0, vue.onMounted)(() => {
			init();
		});
		(0, vue.onBeforeUnmount)(() => {
			if (!scrollTarget) return;
			scrollTarget.removeEventListener("scroll", handleScroll);
		});
		return {
			selfRef,
			affixed: affixedRef,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedstyle: (0, vue.computed)(() => {
				const style = {};
				if (stickToTopRef.value && mergedOffsetTopRef.value !== void 0 && mergedTopRef.value !== void 0) style.top = `${mergedTopRef.value}px`;
				if (stickToBottomRef.value && mergedOffsetBottomRef.value !== void 0 && mergedBottomRef.value !== void 0) style.bottom = `${mergedBottomRef.value}px`;
				return style;
			})
		};
	},
	render() {
		const { mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			ref: "selfRef",
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-affix`, {
				[`${mergedClsPrefix}-affix--affixed`]: this.affixed,
				[`${mergedClsPrefix}-affix--absolute-positioned`]: this.position === "absolute"
			}]),
			style: (0, vue.normalizeStyle)(this.mergedstyle)
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 6);
	}
});
//#endregion
exports.affixPropKeys = affixPropKeys;
exports.affixProps = affixProps;
exports.default = Affix_default;
