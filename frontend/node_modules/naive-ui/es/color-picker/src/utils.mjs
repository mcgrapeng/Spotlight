import { warn } from "../../_utils/naive/warn.mjs";
import { hsl2hsv, hsl2rgb, hsla, hsv2hsl, hsv2rgb, hsva, rgb2hsl, rgb2hsv, rgba, toHexaString, toHslaString, toHsvaString, toRgbaString } from "seemly";
//#region src/color-picker/src/utils.ts
function deriveDefaultValue(modes, showAlpha) {
  switch (modes[0]) {
    case "hex":
      return showAlpha ? "#000000FF" : "#000000";
    case "rgb":
      return showAlpha ? "rgba(0, 0, 0, 1)" : "rgb(0, 0, 0)";
    case "hsl":
      return showAlpha ? "hsla(0, 0%, 0%, 1)" : "hsl(0, 0%, 0%)";
    case "hsv":
      return showAlpha ? "hsva(0, 0%, 0%, 1)" : "hsv(0, 0%, 0%)";
  }
  if (process.env.NODE_ENV !== "production") warn("color-picker", "props.modes is invalid.");
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
function getWCAGContrast(hsla, contrastColor = [255, 255, 255], level = "AA") {
  const [r, g, b, a] = rgba(toHslaString(hsla));
  if (a === 1) {
    const luminance1 = rgb2luminance([r, g, b]);
    const luminance2 = rgb2luminance(contrastColor);
    return (Math.max(luminance1, luminance2) + .05) / (Math.min(luminance1, luminance2) + .05) >= (level === "AA" ? 4.5 : 7);
  }
  const luminanceBlended = rgb2luminance([Math.round(r * a + contrastColor[0] * (1 - a)), Math.round(g * a + contrastColor[1] * (1 - a)), Math.round(b * a + contrastColor[2] * (1 - a))]);
  const luminanceWhite = rgb2luminance(contrastColor);
  return (Math.max(luminanceBlended, luminanceWhite) + .05) / (Math.min(luminanceBlended, luminanceWhite) + .05) >= (level === "AA" ? 4.5 : 7);
}
function rgb2luminance(rgb) {
  const [cr, cg, cb] = rgb.map(c => {
    c /= 255;
    return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
  });
  return .2126 * cr + .7152 * cg + .0722 * cb;
}
function floor(color) {
  return color.map(channel => Math.floor(channel));
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
      return toHexaString(rgba(value));
    },
    hsl(value) {
      const [r, g, b, a] = rgba(value);
      return toHslaString([...rgb2hsl(r, g, b), a]);
    },
    hsv(value) {
      const [r, g, b, a] = rgba(value);
      return toHsvaString([...rgb2hsv(r, g, b), a]);
    }
  },
  hex: {
    rgb(value) {
      return toRgbaString(rgba(value));
    },
    hsl(value) {
      const [r, g, b, a] = rgba(value);
      return toHslaString([...rgb2hsl(r, g, b), a]);
    },
    hsv(value) {
      const [r, g, b, a] = rgba(value);
      return toHsvaString([...rgb2hsv(r, g, b), a]);
    }
  },
  hsl: {
    hex(value) {
      const [h, s, l, a] = hsla(value);
      return toHexaString([...hsl2rgb(h, s, l), a]);
    },
    rgb(value) {
      const [h, s, l, a] = hsla(value);
      return toRgbaString([...hsl2rgb(h, s, l), a]);
    },
    hsv(value) {
      const [h, s, l, a] = hsla(value);
      return toHsvaString([...hsl2hsv(h, s, l), a]);
    }
  },
  hsv: {
    hex(value) {
      const [h, s, v, a] = hsva(value);
      return toHexaString([...hsv2rgb(h, s, v), a]);
    },
    rgb(value) {
      const [h, s, v, a] = hsva(value);
      return toRgbaString([...hsv2rgb(h, s, v), a]);
    },
    hsl(value) {
      const [h, s, v, a] = hsva(value);
      return toHslaString([...hsv2hsl(h, s, v), a]);
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
export { convertColor, deriveDefaultValue, floor, getModeFromValue, getWCAGContrast, normalizeAlpha, normalizeHue };