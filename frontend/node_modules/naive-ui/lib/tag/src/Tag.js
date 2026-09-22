Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_create_injection_key = require("../../_utils/vue/create-injection-key.js");
const require__utils_css_color_to_class = require("../../_utils/css/color-to-class.js");
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_close_src_Close = require("../../_internal/close/src/Close.js");
const require_tag_styles_light = require("../styles/light.js");
const require_tag_src_common_props = require("./common-props.js");
const require_tag_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
//#region src/tag/src/Tag.tsx
const _hoisted_1 = [
	"onClick",
	"onMouseenter",
	"onMouseleave"
];
const tagProps = {
	...require__mixins_use_theme.default.props,
	...require_tag_src_common_props,
	bordered: {
		type: Boolean,
		default: void 0
	},
	checked: Boolean,
	checkable: Boolean,
	strong: Boolean,
	triggerClickOnClose: Boolean,
	onClose: [Array, Function],
	onMouseenter: Function,
	onMouseleave: Function,
	"onUpdate:checked": Function,
	onUpdateChecked: Function,
	internalCloseFocusable: {
		type: Boolean,
		default: true
	},
	internalCloseIsButtonTag: {
		type: Boolean,
		default: true
	},
	onCheckedChange: Function
};
const tagInjectionKey = require__utils_vue_create_injection_key.createInjectionKey("n-tag");
var Tag_default = (0, vue.defineComponent)({
	name: "Tag",
	props: tagProps,
	slots: Object,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.onCheckedChange !== void 0) require__utils_naive_warn.warnOnce("tag", "`on-checked-change` is deprecated, please use `on-update:checked` instead");
		});
		const contentRef = (0, vue.ref)(null);
		const { mergedBorderedRef, mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const mergedSizeRef = (0, vue.computed)(() => {
			return props.size || mergedComponentPropsRef?.value?.Tag?.size || "medium";
		});
		const themeRef = require__mixins_use_theme.default("Tag", "-tag", require_tag_src_styles_index_cssr, require_tag_styles_light, props, mergedClsPrefixRef);
		(0, vue.provide)(tagInjectionKey, { roundRef: (0, vue.toRef)(props, "round") });
		function handleClick() {
			if (!props.disabled) {
				if (props.checkable) {
					const { checked, onCheckedChange, onUpdateChecked, "onUpdate:checked": _onUpdateChecked } = props;
					if (onUpdateChecked) onUpdateChecked(!checked);
					if (_onUpdateChecked) _onUpdateChecked(!checked);
					if (onCheckedChange) onCheckedChange(!checked);
				}
			}
		}
		function handleCloseClick(e) {
			if (!props.triggerClickOnClose) e.stopPropagation();
			if (!props.disabled) {
				const { onClose } = props;
				if (onClose) require__utils_vue_call.call(onClose, e);
			}
		}
		const tagPublicMethods = { setTextContent(textContent) {
			const { value } = contentRef;
			if (value) value.textContent = textContent;
		} };
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Tag", mergedRtlRef, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { type, color: { color, textColor } = {} } = props;
			const size = mergedSizeRef.value;
			const { common: { cubicBezierEaseInOut }, self: { padding, closeMargin, borderRadius, opacityDisabled, textColorCheckable, textColorHoverCheckable, textColorPressedCheckable, textColorChecked, colorCheckable, colorHoverCheckable, colorPressedCheckable, colorChecked, colorCheckedHover, colorCheckedPressed, closeBorderRadius, fontWeightStrong, [require__utils_cssr_index.createKey("colorBordered", type)]: colorBordered, [require__utils_cssr_index.createKey("closeSize", size)]: closeSize, [require__utils_cssr_index.createKey("closeIconSize", size)]: closeIconSize, [require__utils_cssr_index.createKey("fontSize", size)]: fontSize, [require__utils_cssr_index.createKey("height", size)]: height, [require__utils_cssr_index.createKey("color", type)]: typedColor, [require__utils_cssr_index.createKey("textColor", type)]: typeTextColor, [require__utils_cssr_index.createKey("border", type)]: border, [require__utils_cssr_index.createKey("closeIconColor", type)]: closeIconColor, [require__utils_cssr_index.createKey("closeIconColorHover", type)]: closeIconColorHover, [require__utils_cssr_index.createKey("closeIconColorPressed", type)]: closeIconColorPressed, [require__utils_cssr_index.createKey("closeColorHover", type)]: closeColorHover, [require__utils_cssr_index.createKey("closeColorPressed", type)]: closeColorPressed } } = themeRef.value;
			const closeMarginDiscrete = (0, seemly.getMargin)(closeMargin);
			return {
				"--n-font-weight-strong": fontWeightStrong,
				"--n-avatar-size-override": `calc(${height} - 8px)`,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-border-radius": borderRadius,
				"--n-border": border,
				"--n-close-icon-size": closeIconSize,
				"--n-close-color-pressed": closeColorPressed,
				"--n-close-color-hover": closeColorHover,
				"--n-close-border-radius": closeBorderRadius,
				"--n-close-icon-color": closeIconColor,
				"--n-close-icon-color-hover": closeIconColorHover,
				"--n-close-icon-color-pressed": closeIconColorPressed,
				"--n-close-icon-color-disabled": closeIconColor,
				"--n-close-margin-top": closeMarginDiscrete.top,
				"--n-close-margin-right": closeMarginDiscrete.right,
				"--n-close-margin-bottom": closeMarginDiscrete.bottom,
				"--n-close-margin-left": closeMarginDiscrete.left,
				"--n-close-size": closeSize,
				"--n-color": color || (mergedBorderedRef.value ? colorBordered : typedColor),
				"--n-color-checkable": colorCheckable,
				"--n-color-checked": colorChecked,
				"--n-color-checked-hover": colorCheckedHover,
				"--n-color-checked-pressed": colorCheckedPressed,
				"--n-color-hover-checkable": colorHoverCheckable,
				"--n-color-pressed-checkable": colorPressedCheckable,
				"--n-font-size": fontSize,
				"--n-height": height,
				"--n-opacity-disabled": opacityDisabled,
				"--n-padding": padding,
				"--n-text-color": textColor || typeTextColor,
				"--n-text-color-checkable": textColorCheckable,
				"--n-text-color-checked": textColorChecked,
				"--n-text-color-hover-checkable": textColorHoverCheckable,
				"--n-text-color-pressed-checkable": textColorPressedCheckable
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("tag", (0, vue.computed)(() => {
			let hash = "";
			const { type, color: { color, textColor } = {} } = props;
			hash += type[0];
			hash += mergedSizeRef.value[0];
			if (color) hash += `a${require__utils_css_color_to_class.color2Class(color)}`;
			if (textColor) hash += `b${require__utils_css_color_to_class.color2Class(textColor)}`;
			if (mergedBorderedRef.value) hash += "c";
			return hash;
		}), cssVarsRef, props) : void 0;
		return {
			...tagPublicMethods,
			rtlEnabled: rtlEnabledRef,
			mergedClsPrefix: mergedClsPrefixRef,
			contentRef,
			mergedBordered: mergedBorderedRef,
			handleClick,
			handleCloseClick,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedClsPrefix, rtlEnabled, closable, color: { borderColor } = {}, round, onRender, $slots } = this;
		onRender?.();
		const avatarNode = require__utils_vue_resolve_slot.resolveWrappedSlot($slots.avatar, (children) => children && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-tag__avatar`) }, [require_vdom.normalizeVNode(() => children)], 2)));
		const iconNode = require__utils_vue_resolve_slot.resolveWrappedSlot($slots.icon, (children) => children && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-tag__icon`) }, [require_vdom.normalizeVNode(() => children)], 2)));
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-tag`,
				this.themeClass,
				{
					[`${mergedClsPrefix}-tag--rtl`]: rtlEnabled,
					[`${mergedClsPrefix}-tag--strong`]: this.strong,
					[`${mergedClsPrefix}-tag--disabled`]: this.disabled,
					[`${mergedClsPrefix}-tag--checkable`]: this.checkable,
					[`${mergedClsPrefix}-tag--checked`]: this.checkable && this.checked,
					[`${mergedClsPrefix}-tag--round`]: round,
					[`${mergedClsPrefix}-tag--avatar`]: avatarNode,
					[`${mergedClsPrefix}-tag--icon`]: iconNode,
					[`${mergedClsPrefix}-tag--closable`]: closable
				}
			]),
			style: (0, vue.normalizeStyle)(this.cssVars),
			onClick: this.handleClick,
			onMouseenter: this.onMouseenter,
			onMouseleave: this.onMouseleave
		}, [
			require_vdom.normalizeVNode(() => iconNode || avatarNode),
			(0, vue.createElementVNode)("span", {
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-tag__content`),
				ref: "contentRef"
			}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 2),
			!this.checkable && closable ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_close_src_Close, {
				key: 0,
				clsPrefix: mergedClsPrefix,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-tag__close`),
				disabled: this.disabled,
				onClick: this.handleCloseClick,
				focusable: this.internalCloseFocusable,
				round,
				isButtonTag: this.internalCloseIsButtonTag,
				absolute: true
			}, null, 8, [
				"clsPrefix",
				"class",
				"disabled",
				"onClick",
				"focusable",
				"round",
				"isButtonTag"
			])) : require_vdom.normalizeVNode(() => null),
			!this.checkable && this.mergedBordered ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 2,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-tag__border`),
				style: (0, vue.normalizeStyle)({ borderColor })
			}, null, 6)) : require_vdom.normalizeVNode(() => null)
		], 46, _hoisted_1);
	}
});
//#endregion
exports.default = Tag_default;
exports.tagInjectionKey = tagInjectionKey;
exports.tagProps = tagProps;
