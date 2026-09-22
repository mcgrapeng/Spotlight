Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_vue_flatten = require("../../_utils/vue/flatten.js");
const require__utils_vue_get_slot = require("../../_utils/vue/get-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_flex_styles_light = require("../styles/light.js");
let seemly = require("seemly");
let vue = require("vue");
//#region src/flex/src/Flex.tsx
const flexProps = {
	...require__mixins_use_theme.default.props,
	align: String,
	justify: {
		type: String,
		default: "start"
	},
	inline: Boolean,
	vertical: Boolean,
	reverse: Boolean,
	size: {
		type: [
			String,
			Number,
			Array
		],
		default: "medium"
	},
	wrap: {
		type: Boolean,
		default: true
	}
};
var Flex_default = (0, vue.defineComponent)({
	name: "Flex",
	props: flexProps,
	setup(props) {
		const { mergedClsPrefixRef, mergedRtlRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Flex", "-flex", void 0, require_flex_styles_light, props, mergedClsPrefixRef);
		return {
			rtlEnabled: require__mixins_use_rtl.useRtl("Flex", mergedRtlRef, mergedClsPrefixRef),
			mergedClsPrefix: mergedClsPrefixRef,
			margin: (0, vue.computed)(() => {
				const { size } = props;
				if (Array.isArray(size)) return {
					horizontal: size[0],
					vertical: size[1]
				};
				if (typeof size === "number") return {
					horizontal: size,
					vertical: size
				};
				const { self: { [require__utils_cssr_index.createKey("gap", size)]: gap } } = themeRef.value;
				const { row, col } = (0, seemly.getGap)(gap);
				return {
					horizontal: (0, seemly.depx)(col),
					vertical: (0, seemly.depx)(row)
				};
			})
		};
	},
	render() {
		const { vertical, reverse, align, inline, justify, margin, wrap, mergedClsPrefix, rtlEnabled } = this;
		const children = require__utils_vue_flatten.flatten(require__utils_vue_get_slot.getSlot(this), false);
		if (!children.length) return null;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			role: "none",
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-flex`, rtlEnabled && `${mergedClsPrefix}-flex--rtl`]),
			style: (0, vue.normalizeStyle)({
				display: inline ? "inline-flex" : "flex",
				flexDirection: (() => {
					if (vertical && !reverse) return "column";
					if (vertical && reverse) return "column-reverse";
					if (!vertical && reverse) return "row-reverse";
					else return "row";
				})(),
				justifyContent: justify,
				flexWrap: !wrap || vertical ? "nowrap" : "wrap",
				alignItems: align,
				gap: `${margin.vertical}px ${margin.horizontal}px`
			})
		}, [require_vdom.normalizeVNode(() => children)], 6);
	}
});
//#endregion
exports.default = Flex_default;
exports.flexProps = flexProps;
