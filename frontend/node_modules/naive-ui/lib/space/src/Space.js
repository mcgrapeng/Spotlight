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
const require_space_styles_light = require("../styles/light.js");
const require_space_src_utils = require("./utils.js");
let seemly = require("seemly");
let vue = require("vue");
//#region src/space/src/Space.tsx
const spaceProps = {
	...require__mixins_use_theme.default.props,
	align: String,
	justify: {
		type: String,
		default: "start"
	},
	inline: Boolean,
	vertical: Boolean,
	reverse: Boolean,
	size: [
		String,
		Number,
		Array
	],
	wrapItem: {
		type: Boolean,
		default: true
	},
	itemClass: String,
	itemStyle: [String, Object],
	wrap: {
		type: Boolean,
		default: true
	},
	internalUseGap: {
		type: Boolean,
		default: void 0
	}
};
var Space_default = (0, vue.defineComponent)({
	name: "Space",
	props: spaceProps,
	setup(props) {
		const { mergedClsPrefixRef, mergedRtlRef, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const mergedSizeRef = (0, vue.computed)(() => {
			return props.size ?? mergedComponentPropsRef?.value?.Space?.size ?? "medium";
		});
		const themeRef = require__mixins_use_theme.default("Space", "-space", void 0, require_space_styles_light, props, mergedClsPrefixRef);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Space", mergedRtlRef, mergedClsPrefixRef);
		return {
			useGap: require_space_src_utils.ensureSupportFlexGap(),
			rtlEnabled: rtlEnabledRef,
			mergedClsPrefix: mergedClsPrefixRef,
			margin: (0, vue.computed)(() => {
				const size = mergedSizeRef.value;
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
		const { vertical, reverse, align, inline, justify, itemClass, itemStyle, margin, wrap, mergedClsPrefix, rtlEnabled, useGap, wrapItem, internalUseGap } = this;
		const children = require__utils_vue_flatten.flatten(require__utils_vue_get_slot.getSlot(this), false);
		if (!children.length) return null;
		const horizontalMargin = `${margin.horizontal}px`;
		const semiHorizontalMargin = `${margin.horizontal / 2}px`;
		const verticalMargin = `${margin.vertical}px`;
		const semiVerticalMargin = `${margin.vertical / 2}px`;
		const lastIndex = children.length - 1;
		const isJustifySpace = justify.startsWith("space-");
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			role: "none",
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-space`, rtlEnabled && `${mergedClsPrefix}-space--rtl`]),
			style: (0, vue.normalizeStyle)({
				display: inline ? "inline-flex" : "flex",
				flexDirection: (() => {
					if (vertical && !reverse) return "column";
					if (vertical && reverse) return "column-reverse";
					if (!vertical && reverse) return "row-reverse";
					else return "row";
				})(),
				justifyContent: ["start", "end"].includes(justify) ? `flex-${justify}` : justify,
				flexWrap: !wrap || vertical ? "nowrap" : "wrap",
				marginTop: useGap || vertical ? "" : `-${semiVerticalMargin}`,
				marginBottom: useGap || vertical ? "" : `-${semiVerticalMargin}`,
				alignItems: align,
				gap: useGap ? `${margin.vertical}px ${margin.horizontal}px` : ""
			})
		}, [!wrapItem && (useGap || internalUseGap) ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => children)], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => children.map((child, index) => child.type === vue.Comment ? child : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 1,
			role: "none",
			class: require_vdom.normalizeClass(itemClass),
			style: (0, vue.normalizeStyle)([
				itemStyle,
				{ maxWidth: "100%" },
				useGap ? "" : vertical ? { marginBottom: index !== lastIndex ? verticalMargin : "" } : rtlEnabled ? {
					marginLeft: isJustifySpace ? justify === "space-between" && index === lastIndex ? "" : semiHorizontalMargin : index !== lastIndex ? horizontalMargin : "",
					marginRight: isJustifySpace ? justify === "space-between" && index === 0 ? "" : semiHorizontalMargin : "",
					paddingTop: semiVerticalMargin,
					paddingBottom: semiVerticalMargin
				} : {
					marginRight: isJustifySpace ? justify === "space-between" && index === lastIndex ? "" : semiHorizontalMargin : index !== lastIndex ? horizontalMargin : "",
					marginLeft: isJustifySpace ? justify === "space-between" && index === 0 ? "" : semiHorizontalMargin : "",
					paddingTop: semiVerticalMargin,
					paddingBottom: semiVerticalMargin
				}
			])
		}, [require_vdom.normalizeVNode(() => child)], 6))))], 64))], 6);
	}
});
//#endregion
exports.default = Space_default;
exports.spaceProps = spaceProps;
