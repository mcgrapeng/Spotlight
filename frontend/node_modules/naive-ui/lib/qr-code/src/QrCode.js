Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_qr_code_styles_light = require("../styles/light.js");
const require_qr_code_src_qrcodegen = require("./qrcodegen.js");
const require_qr_code_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/qr-code/src/QrCode.tsx
const ERROR_CORRECTION_LEVEL = {
	L: require_qr_code_src_qrcodegen.QrCode.Ecc.LOW,
	M: require_qr_code_src_qrcodegen.QrCode.Ecc.MEDIUM,
	Q: require_qr_code_src_qrcodegen.QrCode.Ecc.QUARTILE,
	H: require_qr_code_src_qrcodegen.QrCode.Ecc.HIGH
};
const qrCodeProps = {
	...require__mixins_use_theme.default.props,
	value: String,
	color: {
		type: String,
		default: "#000"
	},
	backgroundColor: {
		type: String,
		default: "#FFF"
	},
	iconSrc: String,
	iconSize: {
		type: Number,
		default: 40
	},
	iconBackgroundColor: {
		type: String,
		default: "#FFF"
	},
	iconBorderRadius: {
		type: Number,
		default: 4
	},
	size: {
		type: Number,
		default: 100
	},
	padding: {
		type: [Number, String],
		default: 12
	},
	errorCorrectionLevel: {
		type: String,
		default: "M"
	},
	type: {
		type: String,
		default: "canvas"
	}
};
const UPSCALE_RATIO = 2;
var QrCode_default = (0, vue.defineComponent)({
	name: "QrCode",
	props: qrCodeProps,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("QrCode", "-qr-code", require_qr_code_src_styles_index_cssr, require_qr_code_styles_light, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			return { "--n-border-radius": themeRef.value.self.borderRadius };
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("qr-code", void 0, cssVarsRef, props) : void 0;
		const canvasRef = (0, vue.ref)();
		const qr = (0, vue.computed)(() => {
			const errorCorrectionLevel = ERROR_CORRECTION_LEVEL[props.errorCorrectionLevel];
			return require_qr_code_src_qrcodegen.QrCode.encodeText(props.value ?? "-", errorCorrectionLevel);
		});
		(0, vue.onMounted)(() => {
			const imageLoadedTrigger = (0, vue.ref)(0);
			let loadedIcon = null;
			(0, vue.watchEffect)(() => {
				if (props.type === "svg") return;
				imageLoadedTrigger.value;
				drawCanvas(qr.value, props.size, props.color, props.backgroundColor, loadedIcon ? {
					icon: loadedIcon,
					iconBorderRadius: props.iconBorderRadius,
					iconSize: props.iconSize,
					iconBackgroundColor: props.iconBackgroundColor
				} : null);
			});
			(0, vue.watchEffect)(() => {
				if (props.type === "svg") return;
				const { iconSrc } = props;
				if (iconSrc) {
					let aborted = false;
					const img = new Image();
					img.src = iconSrc;
					img.onload = () => {
						if (aborted) return;
						loadedIcon = img;
						imageLoadedTrigger.value++;
					};
					return () => {
						aborted = true;
					};
				}
			});
		});
		function drawCanvas(qr, size, foregroundColor, backgroundColor, iconConfig) {
			const canvas = canvasRef.value;
			if (!canvas) return;
			const canvasWidth = size * UPSCALE_RATIO;
			const scale = canvasWidth / qr.size;
			canvas.width = canvasWidth;
			canvas.height = canvasWidth;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			for (let y = 0; y < qr.size; y++) for (let x = 0; x < qr.size; x++) {
				ctx.fillStyle = qr.getModule(x, y) ? foregroundColor : backgroundColor;
				const startX = Math.floor(x * scale);
				const endX = Math.ceil((x + 1) * scale);
				const startY = Math.floor(y * scale);
				const endY = Math.ceil((y + 1) * scale);
				ctx.fillRect(startX, startY, endX - startX, endY - startY);
			}
			if (iconConfig) {
				const { icon, iconBackgroundColor, iconBorderRadius, iconSize } = iconConfig;
				const finalIconSize = iconSize * UPSCALE_RATIO;
				const centerX = (canvas.width - finalIconSize) / 2;
				const centerY = (canvas.height - finalIconSize) / 2;
				ctx.fillStyle = iconBackgroundColor;
				ctx.beginPath();
				ctx.roundRect(centerX, centerY, finalIconSize, finalIconSize, iconBorderRadius * UPSCALE_RATIO);
				ctx.fill();
				const aspectRatio = icon.width / icon.height;
				const scaledWidth = aspectRatio >= 1 ? finalIconSize : finalIconSize * aspectRatio;
				const scaledHeight = aspectRatio <= 1 ? finalIconSize : finalIconSize / aspectRatio;
				const left = centerX + (finalIconSize - scaledWidth) / 2;
				const top = centerY + (finalIconSize - scaledHeight) / 2;
				ctx.drawImage(icon, left, top, scaledWidth, scaledHeight);
			}
		}
		function generatePath(modules, margin = 0) {
			const ops = [];
			modules.forEach((row, y) => {
				let start = null;
				row.forEach((cell, x) => {
					if (!cell && start !== null) {
						ops.push(`M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`);
						start = null;
						return;
					}
					if (x === row.length - 1) {
						if (!cell) return;
						if (start === null) ops.push(`M${x + margin},${y + margin} h1v1H${x + margin}z`);
						else ops.push(`M${start + margin},${y + margin} h${x + 1 - start}v1H${start + margin}z`);
						return;
					}
					if (cell && start === null) start = x;
				});
			});
			return ops.join("");
		}
		function svgInfo(qr, size, iconConfig) {
			const cells = qr.getModules();
			const numCells = cells.length;
			const cellsToDraw = cells;
			let svgInnerHtml = "";
			const path1Html = `<path fill="transparent" d="M0,0 h${numCells}v${numCells}H0z" shape-rendering="crispEdges"></path>`;
			const path2Html = `<path fill="${props.color}" d="${generatePath(cellsToDraw, 0)}" shape-rendering="crispEdges"></path>`;
			let iconHtml = "";
			if (iconConfig) {
				const { iconSrc, iconSize } = iconConfig;
				const defaultSize = Math.floor(size * .1);
				const scale = numCells / size;
				const h = (iconSize || defaultSize) * scale;
				const w = (iconSize || defaultSize) * scale;
				const x = cells.length / 2 - w / 2;
				const y = cells.length / 2 - h / 2;
				iconHtml += `<image href="${iconSrc}" width="${w}" height="${h}" x="${x}" y="${y}" preserveAspectRatio="none"></image>`;
			}
			svgInnerHtml += path1Html;
			svgInnerHtml += path2Html;
			svgInnerHtml += iconHtml;
			return {
				innerHtml: svgInnerHtml,
				numCells
			};
		}
		const svgInfoRef = (0, vue.computed)(() => svgInfo(qr.value, props.size, props.iconSrc ? {
			iconSrc: props.iconSrc,
			iconBorderRadius: props.iconBorderRadius,
			iconSize: props.iconSize,
			iconBackgroundColor: props.iconBackgroundColor
		} : null));
		return {
			canvasRef,
			mergedClsPrefix: mergedClsPrefixRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			svgInfo: svgInfoRef
		};
	},
	render() {
		const { mergedClsPrefix, backgroundColor, padding, cssVars, themeClass, size, type } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-qr-code`, themeClass]),
			style: (0, vue.normalizeStyle)({
				padding: typeof padding === "number" ? `${padding}px` : padding,
				backgroundColor,
				width: `${size}px`,
				height: `${size}px`,
				...cssVars
			})
		}, [type === "canvas" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("canvas", {
			key: 0,
			ref: "canvasRef",
			style: (0, vue.normalizeStyle)({
				width: `${size}px`,
				height: `${size}px`
			})
		}, null, 4)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("svg", {
			key: 1,
			height: size,
			width: size,
			viewBox: `0 0 ${this.svgInfo.numCells} ${this.svgInfo.numCells}`,
			role: "img",
			innerHTML: this.svgInfo.innerHtml
		}, null, 8, [
			"height",
			"width",
			"viewBox",
			"innerHTML"
		]))], 6);
	}
});
//#endregion
exports.default = QrCode_default;
exports.qrCodeProps = qrCodeProps;
