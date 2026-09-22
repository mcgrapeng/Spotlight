Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
let seemly = require("seemly");
//#region src/color-picker/src/utils.ts
function deriveDefaultValue(modes, showAlpha) {
	switch (modes[0]) {
		case "hex": return showAlpha ? "#000000FF" : "#000000";
		case "rgb": return showAlpha ? "rgba(0, 0, 0, 1)" : "rgb(0, 0, 0)";
		case "hsl": return showAlpha ? "hsla(0, 0%, 0%, 1)" : "hsl(0, 0%, 0%)";
		case "hsv": return showAlpha ? "hsva(0, 0%, 0%, 1)" : "hsv(0, 0%, 0%)";
	}
	if (process.env.NODE_ENV !== "production") require__utils_naive_warn.warn("color-picker", "props.modes is invalid.");
	return "#000000";
}
function getModeFromValue(color) {
	if (color === null) return null;
	if (/^ *#/.test(color)) return "hex";
	if (color.includes("rgb")) return "rgb";
	if (color.includes("hsl")) return "hsl";
	if (color.includes("hsv")) return "hsv";
	return null;
}
function getWCAGContrast(hsla, contrastColor = [
	255,
	255,
	255
], level = "AA") {
	const [r, g, b, a] = (0, seemly.rgba)((0, seemly.toHslaString)(hsla));
	if (a === 1) {
		const luminance1 = rgb2luminance([
			r,
			g,
			b
		]);
		const luminance2 = rgb2luminance(contrastColor);
		return (Math.max(luminance1, luminance2) + .05) / (Math.min(luminance1, luminance2) + .05) >= (level === "AA" ? 4.5 : 7);
	}
	const luminanceBlended = rgb2luminance([
		Math.round(r * a + contrastColor[0] * (1 - a)),
		Math.round(g * a + contrastColor[1] * (1 - a)),
		Math.round(b * a + contrastColor[2] * (1 - a))
	]);
	const luminanceWhite = rgb2luminance(contrastColor);
	return (Math.max(luminanceBlended, luminanceWhite) + .05) / (Math.min(luminanceBlended, luminanceWhite) + .05) >= (level === "AA" ? 4.5 : 7);
}
function rgb2luminance(rgb) {
	const [cr, cg, cb] = rgb.map((c) => {
		c /= 255;
		return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
	});
	return .2126 * cr + .7152 * cg + .0722 * cb;
}
function floor(color) {
	return color.map((channel) => Math.floor(channel));
}
function normalizeHue(hue) {
	hue = Math.round(hue);
	return hue >= 360 ? 359 : hue < 0 ? 0 : hue;
}
function normalizeAlpha(alpha) {
	alpha = Math.round(alpha * 100) / 100;
	return alpha > 1 ? 1 : alpha < 0 ? 0 : alpha;
}
const convert = {
	rgb: {
		hex(value) {
			return (0, seemly.toHexaString)((0, seemly.rgba)(value));
		},
		hsl(value) {
			const [r, g, b, a] = (0, seemly.rgba)(value);
			return (0, seemly.toHslaString)([...(0, seemly.rgb2hsl)(r, g, b), a]);
		},
		hsv(value) {
			const [r, g, b, a] = (0, seemly.rgba)(value);
			return (0, seemly.toHsvaString)([...(0, seemly.rgb2hsv)(r, g, b), a]);
		}
	},
	hex: {
		rgb(value) {
			return (0, seemly.toRgbaString)((0, seemly.rgba)(value));
		},
		hsl(value) {
			const [r, g, b, a] = (0, seemly.rgba)(value);
			return (0, seemly.toHslaString)([...(0, seemly.rgb2hsl)(r, g, b), a]);
		},
		hsv(value) {
			const [r, g, b, a] = (0, seemly.rgba)(value);
			return (0, seemly.toHsvaString)([...(0, seemly.rgb2hsv)(r, g, b), a]);
		}
	},
	hsl: {
		hex(value) {
			const [h, s, l, a] = (0, seemly.hsla)(value);
			return (0, seemly.toHexaString)([...(0, seemly.hsl2rgb)(h, s, l), a]);
		},
		rgb(value) {
			const [h, s, l, a] = (0, seemly.hsla)(value);
			return (0, seemly.toRgbaString)([...(0, seemly.hsl2rgb)(h, s, l), a]);
		},
		hsv(value) {
			const [h, s, l, a] = (0, seemly.hsla)(value);
			return (0, seemly.toHsvaString)([...(0, seemly.hsl2hsv)(h, s, l), a]);
		}
	},
	hsv: {
		hex(value) {
			const [h, s, v, a] = (0, seemly.hsva)(value);
			return (0, seemly.toHexaString)([...(0, seemly.hsv2rgb)(h, s, v), a]);
		},
		rgb(value) {
			const [h, s, v, a] = (0, seemly.hsva)(value);
			return (0, seemly.toRgbaString)([...(0, seemly.hsv2rgb)(h, s, v), a]);
		},
		hsl(value) {
			const [h, s, v, a] = (0, seemly.hsva)(value);
			return (0, seemly.toHslaString)([...(0, seemly.hsv2hsl)(h, s, v), a]);
		}
	}
};
function convertColor(value, mode, originalMode) {
	originalMode = originalMode || getModeFromValue(value);
	if (!originalMode) return null;
	if (originalMode === mode) return value;
	return convert[originalMode][mode](value);
}
//#endregion
exports.convertColor = convertColor;
exports.deriveDefaultValue = deriveDefaultValue;
exports.floor = floor;
exports.getModeFromValue = getModeFromValue;
exports.getWCAGContrast = getWCAGContrast;
exports.normalizeAlpha = normalizeAlpha;
exports.normalizeHue = normalizeHue;
