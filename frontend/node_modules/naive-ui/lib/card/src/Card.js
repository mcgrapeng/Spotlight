Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_keysOf = require("../../_utils/vue/keysOf.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_close_src_Close = require("../../_internal/close/src/Close.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
const require_card_styles_light = require("../styles/light.js");
const require_card_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
//#region src/card/src/Card.tsx
const cardBaseProps = {
	title: [String, Function],
	contentClass: String,
	contentStyle: [Object, String],
	contentScrollable: Boolean,
	headerClass: String,
	headerStyle: [Object, String],
	headerExtraClass: String,
	headerExtraStyle: [Object, String],
	footerClass: String,
	footerStyle: [Object, String],
	embedded: Boolean,
	segmented: {
		type: [Boolean, Object],
		default: false
	},
	size: String,
	bordered: {
		type: Boolean,
		default: true
	},
	closable: Boolean,
	hoverable: Boolean,
	role: String,
	onClose: [Function, Array],
	tag: {
		type: String,
		default: "div"
	},
	cover: Function,
	content: [String, Function],
	footer: Function,
	action: Function,
	headerExtra: Function,
	closeFocusable: Boolean
};
const cardBasePropKeys = require__utils_vue_keysOf.keysOf(cardBaseProps);
const cardProps = {
	...require__mixins_use_theme.default.props,
	...cardBaseProps
};
var Card_default = (0, vue.defineComponent)({
	name: "Card",
	props: cardProps,
	slots: Object,
	setup(props) {
		const handleCloseClick = () => {
			const { onClose } = props;
			if (onClose) require__utils_vue_call.call(onClose);
		};
		const { inlineThemeDisabled, mergedClsPrefixRef, mergedRtlRef, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Card", "-card", require_card_src_styles_index_cssr, require_card_styles_light.default, props, mergedClsPrefixRef);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Card", mergedRtlRef, mergedClsPrefixRef);
		const mergedSizeRef = (0, vue.computed)(() => {
			return props.size || mergedComponentPropsRef?.value?.Card?.size || "medium";
		});
		const cssVarsRef = (0, vue.computed)(() => {
			const mergedSize = mergedSizeRef.value;
			const { self: { color, colorModal, colorTarget, textColor, titleTextColor, titleFontWeight, borderColor, actionColor, borderRadius, lineHeight, closeIconColor, closeIconColorHover, closeIconColorPressed, closeColorHover, closeColorPressed, closeBorderRadius, closeIconSize, closeSize, boxShadow, colorPopover, colorEmbedded, colorEmbeddedModal, colorEmbeddedPopover, [require__utils_cssr_index.createKey("padding", mergedSize)]: padding, [require__utils_cssr_index.createKey("fontSize", mergedSize)]: fontSize, [require__utils_cssr_index.createKey("titleFontSize", mergedSize)]: titleFontSize }, common: { cubicBezierEaseInOut } } = themeRef.value;
			const { top: paddingTop, left: paddingLeft, bottom: paddingBottom } = (0, seemly.getPadding)(padding);
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-border-radius": borderRadius,
				"--n-color": color,
				"--n-color-modal": colorModal,
				"--n-color-popover": colorPopover,
				"--n-color-embedded": colorEmbedded,
				"--n-color-embedded-modal": colorEmbeddedModal,
				"--n-color-embedded-popover": colorEmbeddedPopover,
				"--n-color-target": colorTarget,
				"--n-text-color": textColor,
				"--n-line-height": lineHeight,
				"--n-action-color": actionColor,
				"--n-title-text-color": titleTextColor,
				"--n-title-font-weight": titleFontWeight,
				"--n-close-icon-color": closeIconColor,
				"--n-close-icon-color-hover": closeIconColorHover,
				"--n-close-icon-color-pressed": closeIconColorPressed,
				"--n-close-color-hover": closeColorHover,
				"--n-close-color-pressed": closeColorPressed,
				"--n-border-color": borderColor,
				"--n-box-shadow": boxShadow,
				"--n-padding-top": paddingTop,
				"--n-padding-bottom": paddingBottom,
				"--n-padding-left": paddingLeft,
				"--n-font-size": fontSize,
				"--n-title-font-size": titleFontSize,
				"--n-close-size": closeSize,
				"--n-close-icon-size": closeIconSize,
				"--n-close-border-radius": closeBorderRadius
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("card", (0, vue.computed)(() => {
			return mergedSizeRef.value[0];
		}), cssVarsRef, props) : void 0;
		return {
			rtlEnabled: rtlEnabledRef,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedTheme: themeRef,
			handleCloseClick,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { segmented, bordered, hoverable, mergedClsPrefix, rtlEnabled, onRender, embedded, tag: Component, $slots } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createBlock)(Component, {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-card`,
				this.themeClass,
				embedded && `${mergedClsPrefix}-card--embedded`,
				{
					[`${mergedClsPrefix}-card--rtl`]: rtlEnabled,
					[`${mergedClsPrefix}-card--content-scrollable`]: this.contentScrollable,
					[`${mergedClsPrefix}-card--content${typeof segmented !== "boolean" && segmented.content === "soft" ? "-soft" : ""}-segmented`]: segmented === true || segmented !== false && segmented.content,
					[`${mergedClsPrefix}-card--footer${typeof segmented !== "boolean" && segmented.footer === "soft" ? "-soft" : ""}-segmented`]: segmented === true || segmented !== false && segmented.footer,
					[`${mergedClsPrefix}-card--action-segmented`]: segmented === true || segmented !== false && segmented.action,
					[`${mergedClsPrefix}-card--bordered`]: bordered,
					[`${mergedClsPrefix}-card--hoverable`]: hoverable
				}
			]),
			style: (0, vue.normalizeStyle)(this.cssVars),
			role: this.role
		}, {
			default: (0, vue.withCtx)(() => [
				require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot($slots.cover, (children) => {
					const mergedChildren = this.cover ? require__utils_vue_resolve_slot.ensureValidVNode([this.cover()]) : children;
					return mergedChildren && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-card-cover`),
						role: "none"
					}, [require_vdom.normalizeVNode(() => mergedChildren)], 2));
				})),
				require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot($slots.header, (children) => {
					const { title } = this;
					const mergedChildren = title ? require__utils_vue_resolve_slot.ensureValidVNode(typeof title === "function" ? [title()] : [title]) : children;
					return mergedChildren || this.closable ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 1,
						class: require_vdom.normalizeClass([`${mergedClsPrefix}-card-header`, this.headerClass]),
						style: (0, vue.normalizeStyle)(this.headerStyle),
						role: "heading"
					}, [
						(0, vue.createElementVNode)("div", {
							class: require_vdom.normalizeClass(`${mergedClsPrefix}-card-header__main`),
							role: "heading"
						}, [require_vdom.normalizeVNode(() => mergedChildren)], 2),
						require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot($slots["header-extra"], (children) => {
							const mergedChildren = this.headerExtra ? require__utils_vue_resolve_slot.ensureValidVNode([this.headerExtra()]) : children;
							return mergedChildren && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
								class: require_vdom.normalizeClass([`${mergedClsPrefix}-card-header__extra`, this.headerExtraClass]),
								style: (0, vue.normalizeStyle)(this.headerExtraStyle)
							}, [require_vdom.normalizeVNode(() => mergedChildren)], 6));
						})),
						require_vdom.normalizeVNode(() => this.closable && ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_close_src_Close, {
							clsPrefix: mergedClsPrefix,
							class: require_vdom.normalizeClass(`${mergedClsPrefix}-card-header__close`),
							onClick: this.handleCloseClick,
							focusable: this.closeFocusable,
							absolute: true
						}, null, 8, [
							"clsPrefix",
							"class",
							"onClick",
							"focusable"
						])))
					], 6)) : null;
				})),
				require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot($slots.default, (children) => {
					const { content } = this;
					const mergedChildren = content ? require__utils_vue_resolve_slot.ensureValidVNode(typeof content === "function" ? [content()] : [content]) : children;
					return mergedChildren ? this.contentScrollable ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, {
						key: 2,
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-card__content-scrollbar`),
						contentClass: [`${mergedClsPrefix}-card-content`, this.contentClass],
						contentStyle: this.contentStyle
					}, { default: () => mergedChildren }, 1032, [
						"class",
						"contentClass",
						"contentStyle"
					])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 3,
						class: require_vdom.normalizeClass([`${mergedClsPrefix}-card-content`, this.contentClass]),
						style: (0, vue.normalizeStyle)(this.contentStyle),
						role: "none"
					}, [require_vdom.normalizeVNode(() => mergedChildren)], 6)) : null;
				})),
				require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot($slots.footer, (children) => {
					const mergedChildren = this.footer ? require__utils_vue_resolve_slot.ensureValidVNode([this.footer()]) : children;
					return mergedChildren && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						class: require_vdom.normalizeClass([`${mergedClsPrefix}-card__footer`, this.footerClass]),
						style: (0, vue.normalizeStyle)(this.footerStyle),
						role: "none"
					}, [require_vdom.normalizeVNode(() => mergedChildren)], 6));
				})),
				require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot($slots.action, (children) => {
					const mergedChildren = this.action ? require__utils_vue_resolve_slot.ensureValidVNode([this.action()]) : children;
					return mergedChildren && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-card__action`),
						role: "none"
					}, [require_vdom.normalizeVNode(() => mergedChildren)], 2));
				}))
			]),
			_: 2
		}, 1032, [
			"class",
			"style",
			"role"
		]);
	}
});
//#endregion
exports.cardBasePropKeys = cardBasePropKeys;
exports.cardBaseProps = cardBaseProps;
exports.cardProps = cardProps;
exports.default = Card_default;
