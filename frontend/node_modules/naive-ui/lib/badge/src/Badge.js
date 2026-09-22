Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_css_color_to_class = require("../../_utils/css/color-to-class.js");
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_naive_attribute = require("../../_utils/naive/attribute.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_slot_machine_src_SlotMachine = require("../../_internal/slot-machine/src/SlotMachine.js");
const require__internal_wave_src_Wave = require("../../_internal/wave/src/Wave.js");
const require_badge_styles_light = require("../styles/light.js");
const require_badge_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/badge/src/Badge.tsx
const _hoisted_1 = ["title"];
const badgeProps = {
	...require__mixins_use_theme.default.props,
	value: [String, Number],
	max: Number,
	dot: Boolean,
	type: {
		type: String,
		default: "default"
	},
	show: {
		type: Boolean,
		default: true
	},
	showZero: Boolean,
	processing: Boolean,
	color: String,
	offset: Array
};
var Badge_default = (0, vue.defineComponent)({
	name: "Badge",
	props: badgeProps,
	setup(props, { slots }) {
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Badge", "-badge", require_badge_src_styles_index_cssr, require_badge_styles_light, props, mergedClsPrefixRef);
		const appearedRef = (0, vue.ref)(false);
		const handleAfterEnter = () => {
			appearedRef.value = true;
		};
		const handleAfterLeave = () => {
			appearedRef.value = false;
		};
		const showBadgeRef = (0, vue.computed)(() => {
			return props.show && (props.dot || props.value !== void 0 && !(!props.showZero && Number(props.value) <= 0) || !require__utils_vue_resolve_slot.isSlotEmpty(slots.value));
		});
		(0, vue.onMounted)(() => {
			if (showBadgeRef.value) appearedRef.value = true;
		});
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Badge", mergedRtlRef, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { type, color: propColor } = props;
			const { common: { cubicBezierEaseInOut, cubicBezierEaseOut }, self: { [require__utils_cssr_index.createKey("color", type)]: color, fontFamily, fontSize } } = themeRef.value;
			return {
				"--n-font-size": fontSize,
				"--n-font-family": fontFamily,
				"--n-color": propColor || color,
				"--n-ripple-color": propColor || color,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-ripple-bezier": cubicBezierEaseOut
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("badge", (0, vue.computed)(() => {
			let hash = "";
			const { type, color } = props;
			if (type) hash += type[0];
			if (color) hash += require__utils_css_color_to_class.color2Class(color);
			return hash;
		}), cssVarsRef, props) : void 0;
		const offsetStyleRef = (0, vue.computed)(() => {
			const { offset } = props;
			if (!offset) return void 0;
			const [x, y] = offset;
			const reslovedOffsetX = typeof x === "number" ? `${x}px` : x;
			const reslovedOffsetY = typeof y === "number" ? `${y}px` : y;
			return { transform: `translate(calc(${rtlEnabledRef?.value ? "50%" : "-50%"} + ${reslovedOffsetX}), ${reslovedOffsetY})` };
		});
		return {
			rtlEnabled: rtlEnabledRef,
			mergedClsPrefix: mergedClsPrefixRef,
			appeared: appearedRef,
			showBadge: showBadgeRef,
			handleAfterEnter,
			handleAfterLeave,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender,
			offsetStyle: offsetStyleRef
		};
	},
	render() {
		const { mergedClsPrefix, onRender, themeClass, $slots } = this;
		onRender?.();
		const children = $slots.default?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-badge`,
				this.rtlEnabled && `${mergedClsPrefix}-badge--rtl`,
				themeClass,
				{
					[`${mergedClsPrefix}-badge--dot`]: this.dot,
					[`${mergedClsPrefix}-badge--as-is`]: !children
				}
			]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [require_vdom.normalizeVNode(() => children), ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
			name: "fade-in-scale-up-transition",
			onAfterEnter: this.handleAfterEnter,
			onAfterLeave: this.handleAfterLeave
		}, { default: () => this.showBadge ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("sup", {
			key: 1,
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-badge-sup`),
			title: require__utils_naive_attribute.getTitleAttribute(this.value),
			style: (0, vue.normalizeStyle)(this.offsetStyle)
		}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot($slots.value, () => [!this.dot ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_slot_machine_src_SlotMachine, {
			key: 2,
			clsPrefix: mergedClsPrefix,
			appeared: this.appeared,
			max: this.max,
			value: this.value
		}, null, 8, [
			"clsPrefix",
			"appeared",
			"max",
			"value"
		])) : null])), this.processing ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_wave_src_Wave, {
			key: 0,
			clsPrefix: mergedClsPrefix
		}, null, 8, ["clsPrefix"])) : require_vdom.normalizeVNode(() => null)], 14, _hoisted_1)) : null }, 1032, ["onAfterEnter", "onAfterLeave"]))], 6);
	}
});
//#endregion
exports.badgeProps = badgeProps;
exports.default = Badge_default;
