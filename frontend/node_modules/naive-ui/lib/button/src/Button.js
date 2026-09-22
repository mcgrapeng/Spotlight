Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_css_color_to_class = require("../../_utils/css/color-to-class.js");
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_switch_transition_src_IconSwitchTransition = require("../../_internal/icon-switch-transition/src/IconSwitchTransition.js");
const require__internal_fade_in_expand_transition_src_FadeInExpandTransition = require("../../_internal/fade-in-expand-transition/src/FadeInExpandTransition.js");
const require__internal_loading_src_Loading = require("../../_internal/loading/src/Loading.js");
const require__internal_wave_src_Wave = require("../../_internal/wave/src/Wave.js");
const require__utils_env_browser = require("../../_utils/env/browser.js");
const require__utils_color_index = require("../../_utils/color/index.js");
const require_button_group_src_context = require("../../button-group/src/context.js");
const require_button_styles_light = require("../styles/light.js");
const require_button_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
//#region src/button/src/Button.tsx
const buttonProps = {
	...require__mixins_use_theme.default.props,
	color: String,
	textColor: String,
	text: Boolean,
	block: Boolean,
	loading: Boolean,
	disabled: Boolean,
	circle: Boolean,
	size: String,
	ghost: Boolean,
	round: Boolean,
	secondary: Boolean,
	tertiary: Boolean,
	quaternary: Boolean,
	strong: Boolean,
	focusable: {
		type: Boolean,
		default: true
	},
	keyboard: {
		type: Boolean,
		default: true
	},
	tag: {
		type: String,
		default: "button"
	},
	type: {
		type: String,
		default: "default"
	},
	dashed: Boolean,
	renderIcon: Function,
	iconPlacement: {
		type: String,
		default: "left"
	},
	attrType: {
		type: String,
		default: "button"
	},
	bordered: {
		type: Boolean,
		default: true
	},
	onClick: [Function, Array],
	nativeFocusBehavior: {
		type: Boolean,
		default: !require__utils_env_browser.isSafari
	},
	spinProps: Object
};
const Button = (0, vue.defineComponent)({
	name: "Button",
	props: buttonProps,
	slots: Object,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			const { dashed, ghost, text, secondary, tertiary, quaternary } = props;
			if ((dashed || ghost || text) && (secondary || tertiary || quaternary)) require__utils_naive_warn.warnOnce("button", "`dashed`, `ghost` and `text` props can't be used along with `secondary`, `tertiary` and `quaternary` props.");
		});
		const selfElRef = (0, vue.ref)(null);
		const waveElRef = (0, vue.ref)(null);
		const enterPressedRef = (0, vue.ref)(false);
		const showBorderRef = (0, vooks.useMemo)(() => {
			return !props.quaternary && !props.tertiary && !props.secondary && !props.text && (!props.color || props.ghost || props.dashed) && props.bordered;
		});
		const NButtonGroup = (0, vue.inject)(require_button_group_src_context.buttonGroupInjectionKey, {});
		const { inlineThemeDisabled, mergedClsPrefixRef, mergedRtlRef, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const { mergedSizeRef } = require__mixins_use_form_item.default({}, {
			defaultSize: "medium",
			mergedSize: (NFormItem) => {
				const { size } = props;
				if (size) return size;
				const { size: buttonGroupSize } = NButtonGroup;
				if (buttonGroupSize) return buttonGroupSize;
				const { mergedSize: formItemSize } = NFormItem || {};
				if (formItemSize) return formItemSize.value;
				const configSize = mergedComponentPropsRef?.value?.Button?.size;
				if (configSize) return configSize;
				return "medium";
			}
		});
		const mergedFocusableRef = (0, vue.computed)(() => {
			return props.focusable && !props.disabled;
		});
		const handleMousedown = (e) => {
			if (!mergedFocusableRef.value) e.preventDefault();
			if (props.nativeFocusBehavior) return;
			e.preventDefault();
			if (props.disabled) return;
			if (mergedFocusableRef.value) selfElRef.value?.focus({ preventScroll: true });
		};
		const handleClick = (e) => {
			if (!props.disabled && !props.loading) {
				const { onClick } = props;
				if (onClick) require__utils_vue_call.call(onClick, e);
				if (!props.text) waveElRef.value?.play();
			}
		};
		const handleKeyup = (e) => {
			switch (e.key) {
				case "Enter":
					if (!props.keyboard) return;
					enterPressedRef.value = false;
			}
		};
		const handleKeydown = (e) => {
			switch (e.key) {
				case "Enter":
					if (!props.keyboard || props.loading) {
						e.preventDefault();
						return;
					}
					enterPressedRef.value = true;
			}
		};
		const handleBlur = () => {
			enterPressedRef.value = false;
		};
		const themeRef = require__mixins_use_theme.default("Button", "-button", require_button_src_styles_index_cssr, require_button_styles_light.default, props, mergedClsPrefixRef);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Button", mergedRtlRef, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut, cubicBezierEaseOut }, self } = themeRef.value;
			const { rippleDuration, opacityDisabled, fontWeight, fontWeightStrong } = self;
			const size = mergedSizeRef.value;
			const { dashed, type, ghost, text, color, round, circle, textColor, secondary, tertiary, quaternary, strong } = props;
			const fontProps = { "--n-font-weight": strong ? fontWeightStrong : fontWeight };
			let colorProps = {
				"--n-color": "initial",
				"--n-color-hover": "initial",
				"--n-color-pressed": "initial",
				"--n-color-focus": "initial",
				"--n-color-disabled": "initial",
				"--n-ripple-color": "initial",
				"--n-text-color": "initial",
				"--n-text-color-hover": "initial",
				"--n-text-color-pressed": "initial",
				"--n-text-color-focus": "initial",
				"--n-text-color-disabled": "initial"
			};
			const typeIsTertiary = type === "tertiary";
			const typeIsDefault = type === "default";
			const mergedType = typeIsTertiary ? "default" : type;
			if (text) {
				const propTextColor = textColor || color;
				colorProps = {
					"--n-color": "#0000",
					"--n-color-hover": "#0000",
					"--n-color-pressed": "#0000",
					"--n-color-focus": "#0000",
					"--n-color-disabled": "#0000",
					"--n-ripple-color": "#0000",
					"--n-text-color": propTextColor || self[require__utils_cssr_index.createKey("textColorText", mergedType)],
					"--n-text-color-hover": propTextColor ? require__utils_color_index.createHoverColor(propTextColor) : self[require__utils_cssr_index.createKey("textColorTextHover", mergedType)],
					"--n-text-color-pressed": propTextColor ? require__utils_color_index.createPressedColor(propTextColor) : self[require__utils_cssr_index.createKey("textColorTextPressed", mergedType)],
					"--n-text-color-focus": propTextColor ? require__utils_color_index.createHoverColor(propTextColor) : self[require__utils_cssr_index.createKey("textColorTextHover", mergedType)],
					"--n-text-color-disabled": propTextColor || self[require__utils_cssr_index.createKey("textColorTextDisabled", mergedType)]
				};
			} else if (ghost || dashed) {
				const mergedTextColor = textColor || color;
				colorProps = {
					"--n-color": "#0000",
					"--n-color-hover": "#0000",
					"--n-color-pressed": "#0000",
					"--n-color-focus": "#0000",
					"--n-color-disabled": "#0000",
					"--n-ripple-color": color || self[require__utils_cssr_index.createKey("rippleColor", mergedType)],
					"--n-text-color": mergedTextColor || self[require__utils_cssr_index.createKey("textColorGhost", mergedType)],
					"--n-text-color-hover": mergedTextColor ? require__utils_color_index.createHoverColor(mergedTextColor) : self[require__utils_cssr_index.createKey("textColorGhostHover", mergedType)],
					"--n-text-color-pressed": mergedTextColor ? require__utils_color_index.createPressedColor(mergedTextColor) : self[require__utils_cssr_index.createKey("textColorGhostPressed", mergedType)],
					"--n-text-color-focus": mergedTextColor ? require__utils_color_index.createHoverColor(mergedTextColor) : self[require__utils_cssr_index.createKey("textColorGhostHover", mergedType)],
					"--n-text-color-disabled": mergedTextColor || self[require__utils_cssr_index.createKey("textColorGhostDisabled", mergedType)]
				};
			} else if (secondary) {
				const typeTextColor = typeIsDefault ? self.textColor : typeIsTertiary ? self.textColorTertiary : self[require__utils_cssr_index.createKey("color", mergedType)];
				const mergedTextColor = color || typeTextColor;
				const isColoredType = type !== "default" && type !== "tertiary";
				colorProps = {
					"--n-color": isColoredType ? (0, seemly.changeColor)(mergedTextColor, { alpha: Number(self.colorOpacitySecondary) }) : self.colorSecondary,
					"--n-color-hover": isColoredType ? (0, seemly.changeColor)(mergedTextColor, { alpha: Number(self.colorOpacitySecondaryHover) }) : self.colorSecondaryHover,
					"--n-color-pressed": isColoredType ? (0, seemly.changeColor)(mergedTextColor, { alpha: Number(self.colorOpacitySecondaryPressed) }) : self.colorSecondaryPressed,
					"--n-color-focus": isColoredType ? (0, seemly.changeColor)(mergedTextColor, { alpha: Number(self.colorOpacitySecondaryHover) }) : self.colorSecondaryHover,
					"--n-color-disabled": self.colorSecondary,
					"--n-ripple-color": "#0000",
					"--n-text-color": mergedTextColor,
					"--n-text-color-hover": mergedTextColor,
					"--n-text-color-pressed": mergedTextColor,
					"--n-text-color-focus": mergedTextColor,
					"--n-text-color-disabled": mergedTextColor
				};
			} else if (tertiary || quaternary) {
				const typeColor = typeIsDefault ? self.textColor : typeIsTertiary ? self.textColorTertiary : self[require__utils_cssr_index.createKey("color", mergedType)];
				const mergedColor = color || typeColor;
				if (tertiary) {
					colorProps["--n-color"] = self.colorTertiary;
					colorProps["--n-color-hover"] = self.colorTertiaryHover;
					colorProps["--n-color-pressed"] = self.colorTertiaryPressed;
					colorProps["--n-color-focus"] = self.colorSecondaryHover;
					colorProps["--n-color-disabled"] = self.colorTertiary;
				} else {
					colorProps["--n-color"] = self.colorQuaternary;
					colorProps["--n-color-hover"] = self.colorQuaternaryHover;
					colorProps["--n-color-pressed"] = self.colorQuaternaryPressed;
					colorProps["--n-color-focus"] = self.colorQuaternaryHover;
					colorProps["--n-color-disabled"] = self.colorQuaternary;
				}
				colorProps["--n-ripple-color"] = "#0000";
				colorProps["--n-text-color"] = mergedColor;
				colorProps["--n-text-color-hover"] = mergedColor;
				colorProps["--n-text-color-pressed"] = mergedColor;
				colorProps["--n-text-color-focus"] = mergedColor;
				colorProps["--n-text-color-disabled"] = mergedColor;
			} else colorProps = {
				"--n-color": color || self[require__utils_cssr_index.createKey("color", mergedType)],
				"--n-color-hover": color ? require__utils_color_index.createHoverColor(color) : self[require__utils_cssr_index.createKey("colorHover", mergedType)],
				"--n-color-pressed": color ? require__utils_color_index.createPressedColor(color) : self[require__utils_cssr_index.createKey("colorPressed", mergedType)],
				"--n-color-focus": color ? require__utils_color_index.createHoverColor(color) : self[require__utils_cssr_index.createKey("colorFocus", mergedType)],
				"--n-color-disabled": color || self[require__utils_cssr_index.createKey("colorDisabled", mergedType)],
				"--n-ripple-color": color || self[require__utils_cssr_index.createKey("rippleColor", mergedType)],
				"--n-text-color": textColor || (color ? self.textColorPrimary : typeIsTertiary ? self.textColorTertiary : self[require__utils_cssr_index.createKey("textColor", mergedType)]),
				"--n-text-color-hover": textColor || (color ? self.textColorHoverPrimary : self[require__utils_cssr_index.createKey("textColorHover", mergedType)]),
				"--n-text-color-pressed": textColor || (color ? self.textColorPressedPrimary : self[require__utils_cssr_index.createKey("textColorPressed", mergedType)]),
				"--n-text-color-focus": textColor || (color ? self.textColorFocusPrimary : self[require__utils_cssr_index.createKey("textColorFocus", mergedType)]),
				"--n-text-color-disabled": textColor || (color ? self.textColorDisabledPrimary : self[require__utils_cssr_index.createKey("textColorDisabled", mergedType)])
			};
			let borderProps = {
				"--n-border": "initial",
				"--n-border-hover": "initial",
				"--n-border-pressed": "initial",
				"--n-border-focus": "initial",
				"--n-border-disabled": "initial"
			};
			if (text) borderProps = {
				"--n-border": "none",
				"--n-border-hover": "none",
				"--n-border-pressed": "none",
				"--n-border-focus": "none",
				"--n-border-disabled": "none"
			};
			else borderProps = {
				"--n-border": self[require__utils_cssr_index.createKey("border", mergedType)],
				"--n-border-hover": self[require__utils_cssr_index.createKey("borderHover", mergedType)],
				"--n-border-pressed": self[require__utils_cssr_index.createKey("borderPressed", mergedType)],
				"--n-border-focus": self[require__utils_cssr_index.createKey("borderFocus", mergedType)],
				"--n-border-disabled": self[require__utils_cssr_index.createKey("borderDisabled", mergedType)]
			};
			const { [require__utils_cssr_index.createKey("height", size)]: height, [require__utils_cssr_index.createKey("fontSize", size)]: fontSize, [require__utils_cssr_index.createKey("padding", size)]: padding, [require__utils_cssr_index.createKey("paddingRound", size)]: paddingRound, [require__utils_cssr_index.createKey("iconSize", size)]: iconSize, [require__utils_cssr_index.createKey("borderRadius", size)]: borderRadius, [require__utils_cssr_index.createKey("iconMargin", size)]: iconMargin, waveOpacity } = self;
			const sizeProps = {
				"--n-width": circle && !text ? height : "initial",
				"--n-height": text ? "initial" : height,
				"--n-font-size": fontSize,
				"--n-padding": circle ? "initial" : text ? "initial" : round ? paddingRound : padding,
				"--n-icon-size": iconSize,
				"--n-icon-margin": iconMargin,
				"--n-border-radius": text ? "initial" : circle || round ? height : borderRadius
			};
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-bezier-ease-out": cubicBezierEaseOut,
				"--n-ripple-duration": rippleDuration,
				"--n-opacity-disabled": opacityDisabled,
				"--n-wave-opacity": waveOpacity,
				...fontProps,
				...colorProps,
				...borderProps,
				...sizeProps
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("button", (0, vue.computed)(() => {
			let hash = "";
			const { dashed, type, ghost, text, color, round, circle, textColor, secondary, tertiary, quaternary, strong } = props;
			if (dashed) hash += "a";
			if (ghost) hash += "b";
			if (text) hash += "c";
			if (round) hash += "d";
			if (circle) hash += "e";
			if (secondary) hash += "f";
			if (tertiary) hash += "g";
			if (quaternary) hash += "h";
			if (strong) hash += "i";
			if (color) hash += `j${require__utils_css_color_to_class.color2Class(color)}`;
			if (textColor) hash += `k${require__utils_css_color_to_class.color2Class(textColor)}`;
			const { value: size } = mergedSizeRef;
			hash += `l${size[0]}`;
			hash += `m${type[0]}`;
			return hash;
		}), cssVarsRef, props) : void 0;
		return {
			selfElRef,
			waveElRef,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedFocusable: mergedFocusableRef,
			mergedSize: mergedSizeRef,
			showBorder: showBorderRef,
			enterPressed: enterPressedRef,
			rtlEnabled: rtlEnabledRef,
			handleMousedown,
			handleKeydown,
			handleBlur,
			handleKeyup,
			handleClick,
			customColorCssVars: (0, vue.computed)(() => {
				const { color } = props;
				if (!color) return null;
				const hoverColor = require__utils_color_index.createHoverColor(color);
				return {
					"--n-border-color": color,
					"--n-border-color-hover": hoverColor,
					"--n-border-color-pressed": require__utils_color_index.createPressedColor(color),
					"--n-border-color-focus": hoverColor,
					"--n-border-color-disabled": color
				};
			}),
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedClsPrefix, tag: Component, onRender } = this;
		onRender?.();
		const children = require__utils_vue_resolve_slot.resolveWrappedSlot(this.$slots.default, (children) => children && ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-button__content`) }, [require_vdom.normalizeVNode(() => children)], 2)));
		return (0, vue.openBlock)(), (0, vue.createBlock)(Component, {
			ref: "selfElRef",
			class: require_vdom.normalizeClass([
				this.themeClass,
				`${mergedClsPrefix}-button`,
				`${mergedClsPrefix}-button--${this.type}-type`,
				`${mergedClsPrefix}-button--${this.mergedSize}-type`,
				this.rtlEnabled && `${mergedClsPrefix}-button--rtl`,
				this.disabled && `${mergedClsPrefix}-button--disabled`,
				this.block && `${mergedClsPrefix}-button--block`,
				this.enterPressed && `${mergedClsPrefix}-button--pressed`,
				!this.text && this.dashed && `${mergedClsPrefix}-button--dashed`,
				this.color && `${mergedClsPrefix}-button--color`,
				this.secondary && `${mergedClsPrefix}-button--secondary`,
				this.loading && `${mergedClsPrefix}-button--loading`,
				this.ghost && `${mergedClsPrefix}-button--ghost`
			]),
			tabindex: this.mergedFocusable ? 0 : -1,
			type: this.attrType,
			style: (0, vue.normalizeStyle)(this.cssVars),
			disabled: this.disabled,
			onClick: this.handleClick,
			onBlur: this.handleBlur,
			onMousedown: this.handleMousedown,
			onKeyup: this.handleKeyup,
			onKeydown: this.handleKeydown
		}, {
			default: (0, vue.withCtx)(() => [
				require_vdom.normalizeVNode(() => this.iconPlacement === "right" && children),
				(0, vue.createVNode)(require__internal_fade_in_expand_transition_src_FadeInExpandTransition, { width: true }, { default: () => require__utils_vue_resolve_slot.resolveWrappedSlot(this.$slots.icon, (children) => (this.loading || this.renderIcon || children) && ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-button__icon`),
					style: (0, vue.normalizeStyle)({ margin: require__utils_vue_resolve_slot.isSlotEmpty(this.$slots.default) ? "0" : "" })
				}, [(0, vue.createVNode)(require__internal_icon_switch_transition_src_IconSwitchTransition, null, { default: () => this.loading ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_loading_src_Loading.default, (0, vue.mergeProps)({
					clsPrefix: mergedClsPrefix,
					key: "loading",
					class: `${mergedClsPrefix}-icon-slot`,
					strokeWidth: 20
				}, this.spinProps), null, 16, ["clsPrefix", "class"])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: "icon",
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-icon-slot`),
					role: "none"
				}, [this.renderIcon ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => this.renderIcon())], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => children)], 64))], 2)) }, 1024)], 6))) }, 1024),
				require_vdom.normalizeVNode(() => this.iconPlacement === "left" && children),
				!this.text ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_wave_src_Wave, {
					key: 0,
					ref: "waveElRef",
					clsPrefix: mergedClsPrefix
				}, null, 8, ["clsPrefix"])) : require_vdom.normalizeVNode(() => null),
				this.showBorder ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 2,
					"aria-hidden": true,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-button__border`),
					style: (0, vue.normalizeStyle)(this.customColorCssVars)
				}, null, 6)) : require_vdom.normalizeVNode(() => null),
				this.showBorder ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 4,
					"aria-hidden": true,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-button__state-border`),
					style: (0, vue.normalizeStyle)(this.customColorCssVars)
				}, null, 6)) : require_vdom.normalizeVNode(() => null)
			]),
			_: 2
		}, 1032, [
			"class",
			"tabindex",
			"type",
			"style",
			"disabled",
			"onClick",
			"onBlur",
			"onMousedown",
			"onKeyup",
			"onKeydown"
		]);
	}
});
const XButton = Button;
//#endregion
exports.XButton = XButton;
exports.buttonProps = buttonProps;
exports.default = Button;
