Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_composable_use_houdini = require("../../_utils/composable/use-houdini.js");
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_skeleton_styles_light = require("../styles/light.js");
const require_skeleton_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
//#region src/skeleton/src/Skeleton.tsx
const skeletonProps = {
	...require__mixins_use_theme.default.props,
	text: Boolean,
	round: Boolean,
	circle: Boolean,
	height: [String, Number],
	width: [String, Number],
	size: String,
	repeat: {
		type: Number,
		default: 1
	},
	animated: {
		type: Boolean,
		default: true
	},
	sharp: {
		type: Boolean,
		default: true
	}
};
var Skeleton_default = (0, vue.defineComponent)({
	name: "Skeleton",
	inheritAttrs: false,
	props: skeletonProps,
	setup(props) {
		require__utils_composable_use_houdini.useHoudini();
		const { mergedClsPrefixRef, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const mergedSizeRef = (0, vue.computed)(() => {
			return props.size || mergedComponentPropsRef?.value?.Skeleton?.size;
		});
		const themeRef = require__mixins_use_theme.default("Skeleton", "-skeleton", require_skeleton_src_styles_index_cssr, require_skeleton_styles_light.skeletonLight, props, mergedClsPrefixRef);
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			style: (0, vue.computed)(() => {
				const theme = themeRef.value;
				const { common: { cubicBezierEaseInOut } } = theme;
				const selfThemeVars = theme.self;
				const { color, colorEnd, borderRadius } = selfThemeVars;
				let sizeHeight;
				const { circle, sharp, round, width, height, text, animated } = props;
				const mergedSize = mergedSizeRef.value;
				if (mergedSize !== void 0) sizeHeight = selfThemeVars[require__utils_cssr_index.createKey("height", mergedSize)];
				const mergedWidth = circle ? width ?? height ?? sizeHeight : width;
				const mergedHeight = (circle ? width ?? height : height) ?? sizeHeight;
				return {
					display: text ? "inline-block" : "",
					verticalAlign: text ? "-0.125em" : "",
					borderRadius: circle ? "50%" : round ? "4096px" : sharp ? "" : borderRadius,
					width: typeof mergedWidth === "number" ? (0, seemly.pxfy)(mergedWidth) : mergedWidth,
					height: typeof mergedHeight === "number" ? (0, seemly.pxfy)(mergedHeight) : mergedHeight,
					animation: !animated ? "none" : "",
					"--n-bezier": cubicBezierEaseInOut,
					"--n-color-start": color,
					"--n-color-end": colorEnd
				};
			})
		};
	},
	render() {
		const { repeat: repeatProp, style, mergedClsPrefix, $attrs } = this;
		const child = (0, vue.h)("div", (0, vue.mergeProps)({
			class: `${mergedClsPrefix}-skeleton`,
			style
		}, $attrs));
		if (repeatProp > 1) return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => (0, seemly.repeat)(repeatProp, null).map((_) => [child, "\n"]))], 64);
		return child;
	}
});
//#endregion
exports.default = Skeleton_default;
exports.skeletonProps = skeletonProps;
