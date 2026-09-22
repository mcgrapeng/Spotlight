Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_env_is_browser = require("../../_utils/env/is-browser.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_watermark_styles_light = require("../styles/light.js");
const require_watermark_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/watermark/src/Watermark.tsx
function getRatio(context) {
	if (!context) return 1;
	const backingStore = context.backingStorePixelRatio || context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
	return (window.devicePixelRatio || 1) / backingStore;
}
const watermarkProps = {
	...require__mixins_use_theme.default.props,
	debug: Boolean,
	cross: Boolean,
	fullscreen: Boolean,
	width: {
		type: Number,
		default: 32
	},
	height: {
		type: Number,
		default: 32
	},
	zIndex: {
		type: Number,
		default: 10
	},
	xGap: {
		type: Number,
		default: 0
	},
	yGap: {
		type: Number,
		default: 0
	},
	yOffset: {
		type: Number,
		default: 0
	},
	xOffset: {
		type: Number,
		default: 0
	},
	rotate: {
		type: Number,
		default: 0
	},
	textAlign: {
		type: String,
		default: "left"
	},
	image: String,
	imageOpacity: {
		type: Number,
		default: 1
	},
	imageHeight: Number,
	imageWidth: Number,
	content: String,
	selectable: {
		type: Boolean,
		default: true
	},
	fontSize: {
		type: Number,
		default: 14
	},
	fontFamily: String,
	fontStyle: {
		type: String,
		default: "normal"
	},
	fontVariant: {
		type: String,
		default: ""
	},
	fontWeight: {
		type: Number,
		default: 400
	},
	fontColor: {
		type: String,
		default: "rgba(128, 128, 128, .3)"
	},
	fontStretch: {
		type: String,
		default: ""
	},
	lineHeight: {
		type: Number,
		default: 14
	},
	globalRotate: {
		type: Number,
		default: 0
	}
};
var Watermark_default = (0, vue.defineComponent)({
	name: "Watermark",
	props: watermarkProps,
	setup(props, { slots }) {
		const { mergedClsPrefixRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Watermark", "-watermark", require_watermark_src_styles_index_cssr, require_watermark_styles_light, props, mergedClsPrefixRef);
		const base64UrlRef = (0, vue.ref)("");
		const canvas = require__utils_env_is_browser.isBrowser ? document.createElement("canvas") : null;
		const ctx = canvas ? canvas.getContext("2d") : null;
		const fontsReadyRef = (0, vue.ref)(false);
		(0, vooks.onFontsReady)(() => fontsReadyRef.value = true);
		(0, vue.watchEffect)(() => {
			if (!canvas) return;
			fontsReadyRef.value;
			const ratio = getRatio(ctx);
			const { xGap, yGap, width, height, yOffset, xOffset, rotate, image, content, fontColor, fontStyle, fontVariant, fontStretch, fontWeight, fontFamily, fontSize, lineHeight, debug } = props;
			const canvasWidth = (xGap + width) * ratio;
			const canvasHeight = (yGap + height) * ratio;
			const canvasOffsetLeft = xOffset * ratio;
			const canvasOffsetTop = yOffset * ratio;
			canvas.width = canvasWidth;
			canvas.height = canvasHeight;
			if (ctx) {
				ctx.translate(0, 0);
				const markWidth = width * ratio;
				const markHeight = height * ratio;
				if (debug) {
					ctx.strokeStyle = "grey";
					ctx.strokeRect(0, 0, markWidth, markHeight);
				}
				ctx.rotate(rotate * (Math.PI / 180));
				if (image) {
					const img = new Image();
					img.crossOrigin = "anonymous";
					img.referrerPolicy = "no-referrer";
					img.src = image;
					img.onload = () => {
						ctx.globalAlpha = props.imageOpacity;
						const { imageWidth, imageHeight } = props;
						ctx.drawImage(img, canvasOffsetLeft, canvasOffsetTop, (props.imageWidth || (imageHeight ? img.width * imageHeight / img.height : img.width)) * ratio, (props.imageHeight || (imageWidth ? img.height * imageWidth / img.width : img.height)) * ratio);
						base64UrlRef.value = canvas.toDataURL();
					};
				} else if (content) {
					if (debug) {
						ctx.strokeStyle = "green";
						ctx.strokeRect(0, 0, markWidth, markHeight);
					}
					ctx.font = `${fontStyle} ${fontVariant} ${fontWeight} ${fontStretch} ${fontSize * ratio}px/${lineHeight * ratio}px ${fontFamily || themeRef.value.self.fontFamily}`;
					ctx.fillStyle = fontColor;
					let maxWidth = 0;
					const { textAlign } = props;
					content.split("\n").map((line) => {
						const width = ctx.measureText(line).width;
						maxWidth = Math.max(maxWidth, width);
						return {
							width,
							line
						};
					}).forEach(({ line, width }, index) => {
						const alignOffset = textAlign === "left" ? 0 : textAlign === "center" ? (maxWidth - width) / 2 : maxWidth - width;
						ctx.fillText(line, canvasOffsetLeft + alignOffset, canvasOffsetTop + lineHeight * ratio * (index + 1));
					});
					base64UrlRef.value = canvas.toDataURL();
				} else if (!content) {
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					base64UrlRef.value = canvas.toDataURL();
				}
			} else require__utils_naive_warn.warnOnce("watermark", "Canvas is not supported in the browser.");
		});
		return () => {
			const { globalRotate, fullscreen, zIndex } = props;
			const mergedClsPrefix = mergedClsPrefixRef.value;
			const isFullScreenGlobalRotate = globalRotate !== 0 && fullscreen;
			const rotatedImageOffset = "max(142vh, 142vw)";
			const watermarkNode = ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass([
					`${mergedClsPrefix}-watermark`,
					globalRotate !== 0 && `${mergedClsPrefix}-watermark--global-rotate`,
					fullscreen && `${mergedClsPrefix}-watermark--fullscreen`
				]),
				style: (0, vue.normalizeStyle)({
					transform: globalRotate ? `translateX(-50%) translateY(-50%) rotate(${globalRotate}deg)` : void 0,
					zIndex: isFullScreenGlobalRotate ? void 0 : zIndex,
					backgroundSize: `${props.xGap + props.width}px`,
					backgroundPosition: globalRotate === 0 ? props.cross ? `${props.width / 2}px ${props.height / 2}px, 0 0` : "" : props.cross ? `calc(${rotatedImageOffset} + ${props.width / 2}px) calc(${rotatedImageOffset} + ${props.height / 2}px), ${rotatedImageOffset} ${rotatedImageOffset}` : rotatedImageOffset,
					backgroundImage: props.cross ? `url(${base64UrlRef.value}), url(${base64UrlRef.value})` : `url(${base64UrlRef.value})`
				})
			}, null, 6));
			if (props.fullscreen && !globalRotate) return watermarkNode;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass([
					`${mergedClsPrefix}-watermark-container`,
					globalRotate !== 0 && `${mergedClsPrefix}-watermark-container--global-rotate`,
					fullscreen && `${mergedClsPrefix}-watermark-container--fullscreen`,
					props.selectable && `${mergedClsPrefix}-watermark-container--selectable`
				]),
				style: (0, vue.normalizeStyle)({ zIndex: isFullScreenGlobalRotate ? zIndex : void 0 })
			}, [require_vdom.normalizeVNode(() => slots.default?.()), require_vdom.normalizeVNode(() => watermarkNode)], 6);
		};
	}
});
//#endregion
exports.default = Watermark_default;
exports.watermarkProps = watermarkProps;
