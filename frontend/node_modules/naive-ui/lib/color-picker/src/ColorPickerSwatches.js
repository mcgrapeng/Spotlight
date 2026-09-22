const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_color_picker_src_utils = require("./utils.js");
let seemly = require("seemly");
let vue = require("vue");
//#region src/color-picker/src/ColorPickerSwatches.tsx
const _hoisted_1 = ["onClick", "onKeydown"];
function normalizeColor(color, mode) {
	if (mode === "hsv") {
		const [h, s, v, a] = (0, seemly.hsva)(color);
		return (0, seemly.toRgbaString)([...(0, seemly.hsv2rgb)(h, s, v), a]);
	}
	return color;
}
function getHexFromName(color) {
	const ctx = document.createElement("canvas").getContext("2d");
	if (!ctx) return "#000000";
	ctx.fillStyle = color;
	return ctx.fillStyle;
}
var ColorPickerSwatches_default = (0, vue.defineComponent)({
	name: "ColorPickerSwatches",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		mode: {
			type: String,
			required: true
		},
		swatches: {
			type: Array,
			required: true
		},
		onUpdateColor: {
			type: Function,
			required: true
		}
	},
	setup(props) {
		const parsedSwatchesRef = (0, vue.computed)(() => props.swatches.map((value) => {
			const mode = require_color_picker_src_utils.getModeFromValue(value);
			return {
				value,
				mode,
				legalValue: normalizeColor(value, mode)
			};
		}));
		function normalizeOutput(parsed) {
			const { mode: modeProp } = props;
			let { value, mode: swatchColorMode } = parsed;
			if (!swatchColorMode) {
				swatchColorMode = "hex";
				if (/^[a-zA-Z]+$/.test(value)) value = getHexFromName(value);
				else {
					require__utils_naive_warn.warn("color-picker", `color ${value} in swatches is invalid.`);
					value = "#000000";
				}
			}
			if (swatchColorMode === modeProp) return value;
			return require_color_picker_src_utils.convertColor(value, modeProp, swatchColorMode);
		}
		function handleSwatchSelect(parsed) {
			props.onUpdateColor(normalizeOutput(parsed));
		}
		function handleSwatchKeyDown(e, parsed) {
			if (e.key === "Enter") handleSwatchSelect(parsed);
		}
		return {
			parsedSwatchesRef,
			handleSwatchSelect,
			handleSwatchKeyDown
		};
	},
	render() {
		const { clsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-swatches`) }, [require_vdom.normalizeVNode(() => this.parsedSwatchesRef.map((swatch) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-swatch`),
			tabindex: 0,
			onClick: () => {
				this.handleSwatchSelect(swatch);
			},
			onKeydown: (e) => {
				this.handleSwatchKeyDown(e, swatch);
			}
		}, [(0, vue.createElementVNode)("div", {
			class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-swatch__fill`),
			style: (0, vue.normalizeStyle)({ background: swatch.legalValue })
		}, null, 6)], 42, _hoisted_1))))], 2);
	}
});
//#endregion
module.exports = ColorPickerSwatches_default;
