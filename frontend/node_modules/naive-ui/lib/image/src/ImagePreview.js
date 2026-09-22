Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_dom_download = require("../../_utils/dom/download.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Download = require("../../_internal/icons/Download.js");
const require__internal_icons_ResizeSmall = require("../../_internal/icons/ResizeSmall.js");
const require__internal_icons_RotateClockwise = require("../../_internal/icons/RotateClockwise.js");
const require__internal_icons_RotateCounterclockwise = require("../../_internal/icons/RotateCounterclockwise.js");
const require__internal_icons_ZoomIn = require("../../_internal/icons/ZoomIn.js");
const require__internal_icons_ZoomOut = require("../../_internal/icons/ZoomOut.js");
const require_tooltip_src_Tooltip = require("../../tooltip/src/Tooltip.js");
const require_image_styles_light = require("../styles/light.js");
const require_image_src_icons = require("./icons.js");
const require_image_src_interface = require("./interface.js");
const require_image_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
let evtd = require("evtd");
let vooks = require("vooks");
let vueuc = require("vueuc");
let lodash_es = require("lodash");
let vdirs = require("vdirs");
//#region src/image/src/ImagePreview.tsx
const _hoisted_1 = ["onClick"];
const _hoisted_2 = [
	"onMousedown",
	"onDblclick",
	"src",
	"onDragstart"
];
const _hoisted_3 = ["onWheel"];
const BLEEDING = 32;
const imagePreviewProps = {
	...require_image_src_interface.imagePreviewSharedProps,
	src: String,
	show: {
		type: Boolean,
		default: void 0
	},
	defaultShow: Boolean,
	"onUpdate:show": [Function, Array],
	onUpdateShow: [Function, Array],
	onNext: Function,
	onPrev: Function,
	onClose: [Function, Array]
};
var ImagePreview_default = (0, vue.defineComponent)({
	name: "ImagePreview",
	props: imagePreviewProps,
	setup(props) {
		const { src } = (0, vue.toRefs)(props);
		const { mergedClsPrefixRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Image", "-image", require_image_src_styles_index_cssr, require_image_styles_light.imageLight, props, mergedClsPrefixRef);
		let thumbnailEl = null;
		const previewRef = (0, vue.ref)(null);
		const previewWrapperRef = (0, vue.ref)(null);
		const displayedRef = (0, vue.ref)(false);
		const { localeRef } = require__mixins_use_locale("Image");
		const uncontrolledShowRef = (0, vue.ref)(props.defaultShow);
		const controlledShowRef = (0, vue.toRef)(props, "show");
		const mergedShowRef = (0, vooks.useMergedState)(controlledShowRef, uncontrolledShowRef);
		function syncTransformOrigin() {
			const { value: previewWrapper } = previewWrapperRef;
			if (!thumbnailEl || !previewWrapper) return;
			const { style } = previewWrapper;
			const tbox = thumbnailEl.getBoundingClientRect();
			style.transformOrigin = `${tbox.left + tbox.width / 2}px ${tbox.top + tbox.height / 2}px`;
		}
		function handleKeydown(e) {
			switch (e.key) {
				case " ":
					e.preventDefault();
					break;
				case "ArrowLeft":
					props.onPrev?.();
					break;
				case "ArrowRight":
					props.onNext?.();
					break;
				case "ArrowUp":
					e.preventDefault();
					zoomIn();
					break;
				case "ArrowDown":
					e.preventDefault();
					zoomOut();
					break;
				case "Escape": close();
			}
		}
		function doUpdateShow(value) {
			const { onUpdateShow, "onUpdate:show": _onUpdateShow } = props;
			if (onUpdateShow) require__utils_vue_call.call(onUpdateShow, value);
			if (_onUpdateShow) require__utils_vue_call.call(_onUpdateShow, value);
			uncontrolledShowRef.value = value;
			displayedRef.value = true;
		}
		(0, vue.watch)(mergedShowRef, (value) => {
			if (value) (0, evtd.on)("keydown", document, handleKeydown);
			else (0, evtd.off)("keydown", document, handleKeydown);
		});
		(0, vue.onBeforeUnmount)(() => {
			(0, evtd.off)("keydown", document, handleKeydown);
		});
		let startX = 0;
		let startY = 0;
		let offsetX = 0;
		let offsetY = 0;
		let startOffsetX = 0;
		let startOffsetY = 0;
		let mouseDownClientX = 0;
		let mouseDownClientY = 0;
		let dragging = false;
		function handleMouseMove(e) {
			const { clientX, clientY } = e;
			offsetX = clientX - startX;
			offsetY = clientY - startY;
			(0, seemly.beforeNextFrameOnce)(derivePreviewStyle);
		}
		function getMoveStrategy(opts) {
			const { mouseUpClientX, mouseUpClientY, mouseDownClientX, mouseDownClientY } = opts;
			const deltaHorizontal = mouseDownClientX - mouseUpClientX;
			const deltaVertical = mouseDownClientY - mouseUpClientY;
			return {
				moveVerticalDirection: `vertical${deltaVertical > 0 ? "Top" : "Bottom"}`,
				moveHorizontalDirection: `horizontal${deltaHorizontal > 0 ? "Left" : "Right"}`,
				deltaHorizontal,
				deltaVertical
			};
		}
		function getDerivedOffset(moveStrategy) {
			const { value: preview } = previewRef;
			if (!preview) return {
				offsetX: 0,
				offsetY: 0
			};
			const pbox = preview.getBoundingClientRect();
			const { moveVerticalDirection, moveHorizontalDirection, deltaHorizontal, deltaVertical } = moveStrategy || {};
			let nextOffsetX = 0;
			let nextOffsetY = 0;
			if (pbox.width <= window.innerWidth) nextOffsetX = 0;
			else if (pbox.left > 0) nextOffsetX = (pbox.width - window.innerWidth) / 2;
			else if (pbox.right < window.innerWidth) nextOffsetX = -(pbox.width - window.innerWidth) / 2;
			else if (moveHorizontalDirection === "horizontalRight") nextOffsetX = Math.min((pbox.width - window.innerWidth) / 2, startOffsetX - (deltaHorizontal ?? 0));
			else nextOffsetX = Math.max(-((pbox.width - window.innerWidth) / 2), startOffsetX - (deltaHorizontal ?? 0));
			if (pbox.height <= window.innerHeight) nextOffsetY = 0;
			else if (pbox.top > 0) nextOffsetY = (pbox.height - window.innerHeight) / 2;
			else if (pbox.bottom < window.innerHeight) nextOffsetY = -(pbox.height - window.innerHeight) / 2;
			else if (moveVerticalDirection === "verticalBottom") nextOffsetY = Math.min((pbox.height - window.innerHeight) / 2, startOffsetY - (deltaVertical ?? 0));
			else nextOffsetY = Math.max(-((pbox.height - window.innerHeight) / 2), startOffsetY - (deltaVertical ?? 0));
			return {
				offsetX: nextOffsetX,
				offsetY: nextOffsetY
			};
		}
		function handleMouseUp(e) {
			(0, evtd.off)("mousemove", document, handleMouseMove);
			(0, evtd.off)("mouseup", document, handleMouseUp);
			dragging = false;
			if (!props.keepDragOffset) {
				const { clientX: mouseUpClientX, clientY: mouseUpClientY } = e;
				const offset = getDerivedOffset(getMoveStrategy({
					mouseUpClientX,
					mouseUpClientY,
					mouseDownClientX,
					mouseDownClientY
				}));
				offsetX = offset.offsetX;
				offsetY = offset.offsetY;
			}
			derivePreviewStyle();
		}
		const imageContext = (0, vue.inject)(require_image_src_interface.imageContextKey, null);
		function handlePreviewMousedown(e) {
			imageContext?.previewedImgPropsRef.value?.onMousedown?.(e);
			if (e.button !== 0) return;
			const { clientX, clientY } = e;
			dragging = true;
			startX = clientX - offsetX;
			startY = clientY - offsetY;
			startOffsetX = offsetX;
			startOffsetY = offsetY;
			mouseDownClientX = clientX;
			mouseDownClientY = clientY;
			derivePreviewStyle();
			(0, evtd.on)("mousemove", document, handleMouseMove);
			(0, evtd.on)("mouseup", document, handleMouseUp);
		}
		const scaleRadix = 1.5;
		let scaleExp = 0;
		let scale = 1;
		let rotate = 0;
		function handlePreviewDblclick(e) {
			imageContext?.previewedImgPropsRef.value?.onDblclick?.(e);
			const originalImageSizeScale = getOrignalImageSizeScale();
			scale = scale === originalImageSizeScale ? 1 : originalImageSizeScale;
			derivePreviewStyle();
		}
		function resetScale() {
			scale = 1;
			scaleExp = 0;
		}
		function resetOffset() {
			offsetX = 0;
			offsetY = 0;
		}
		function handleSwitchPrev() {
			resetScale();
			resetOffset();
			rotate = 0;
			props.onPrev?.();
		}
		function handleSwitchNext() {
			resetScale();
			resetOffset();
			rotate = 0;
			props.onNext?.();
		}
		function rotateCounterclockwise() {
			rotate -= 90;
			derivePreviewStyle();
		}
		function rotateClockwise() {
			rotate += 90;
			derivePreviewStyle();
		}
		function getMaxScale() {
			const { value: preview } = previewRef;
			if (!preview) return 1;
			const { innerWidth, innerHeight } = window;
			const heightMaxScale = Math.max(1, preview.naturalHeight / (innerHeight - BLEEDING));
			const widthMaxScale = Math.max(1, preview.naturalWidth / (innerWidth - BLEEDING));
			return Math.max(3, heightMaxScale * 2, widthMaxScale * 2);
		}
		function getOrignalImageSizeScale() {
			const { value: preview } = previewRef;
			if (!preview) return 1;
			const { innerWidth, innerHeight } = window;
			const heightScale = preview.naturalHeight / (innerHeight - BLEEDING);
			const widthScale = preview.naturalWidth / (innerWidth - BLEEDING);
			if (heightScale < 1 && widthScale < 1) return 1;
			return Math.max(heightScale, widthScale);
		}
		function zoomIn() {
			const maxScale = getMaxScale();
			if (scale < maxScale) {
				scaleExp += 1;
				scale = Math.min(maxScale, scaleRadix ** scaleExp);
				derivePreviewStyle();
			}
		}
		function zoomOut() {
			if (scale > .5) {
				const originalScale = scale;
				scaleExp -= 1;
				scale = Math.max(.5, scaleRadix ** scaleExp);
				const diff = originalScale - scale;
				derivePreviewStyle(false);
				const offset = getDerivedOffset();
				scale += diff;
				derivePreviewStyle(false);
				scale -= diff;
				offsetX = offset.offsetX;
				offsetY = offset.offsetY;
				derivePreviewStyle();
			}
		}
		function handleDownloadClick() {
			const imgSrc = src.value;
			if (imgSrc) require__utils_dom_download.download(imgSrc, void 0);
		}
		function derivePreviewStyle(transition = true) {
			const { value: preview } = previewRef;
			if (!preview) return;
			const { style } = preview;
			const controlledStyle = (0, vue.normalizeStyle)(imageContext?.previewedImgPropsRef.value?.style);
			let controlledStyleString = "";
			if (typeof controlledStyle === "string") controlledStyleString = `${controlledStyle};`;
			else for (const key in controlledStyle) controlledStyleString += `${(0, lodash_es.kebabCase)(key)}: ${controlledStyle[key]};`;
			const transformStyle = `transform-origin: center; transform: translateX(${offsetX}px) translateY(${offsetY}px) rotate(${rotate}deg) scale(${scale});`;
			if (dragging) style.cssText = `${controlledStyleString}cursor: grabbing; transition: none;${transformStyle}`;
			else style.cssText = `${controlledStyleString}cursor: grab;${transformStyle}${transition ? "" : "transition: none;"}`;
			if (!transition) preview.offsetHeight;
		}
		function close() {
			if (mergedShowRef.value) {
				const { onClose } = props;
				if (onClose) require__utils_vue_call.call(onClose);
				doUpdateShow(false);
				uncontrolledShowRef.value = false;
			}
		}
		function resizeToOrignalImageSize() {
			scale = getOrignalImageSizeScale();
			scaleExp = Math.ceil(Math.log(scale) / Math.log(scaleRadix));
			offsetX = 0;
			offsetY = 0;
			derivePreviewStyle();
		}
		const exposedMethods = { setThumbnailEl: (el) => {
			thumbnailEl = el;
		} };
		function withTooltip(node, tooltipKey) {
			if (props.showToolbarTooltip) {
				const { value: theme } = themeRef;
				return (0, vue.openBlock)(), (0, vue.createBlock)(require_tooltip_src_Tooltip.default, {
					key: 1,
					to: false,
					theme: theme.peers.Tooltip,
					themeOverrides: theme.peerOverrides.Tooltip,
					keepAliveOnHover: false
				}, {
					default: () => {
						return localeRef.value[tooltipKey];
					},
					trigger: () => node
				}, 1032, ["theme", "themeOverrides"]);
			} else return node;
		}
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self: { toolbarIconColor, toolbarBorderRadius, toolbarBoxShadow, toolbarColor } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-toolbar-icon-color": toolbarIconColor,
				"--n-toolbar-color": toolbarColor,
				"--n-toolbar-border-radius": toolbarBorderRadius,
				"--n-toolbar-box-shadow": toolbarBoxShadow
			};
		});
		const { inlineThemeDisabled } = require__mixins_use_config.default();
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("image-preview", void 0, cssVarsRef, props) : void 0;
		function handleWheel(event) {
			event.preventDefault();
		}
		return {
			clsPrefix: mergedClsPrefixRef,
			previewRef,
			previewWrapperRef,
			previewSrc: src,
			mergedShow: mergedShowRef,
			appear: (0, vooks.useIsMounted)(),
			displayed: displayedRef,
			previewedImgProps: imageContext?.previewedImgPropsRef,
			handleWheel,
			handlePreviewMousedown,
			handlePreviewDblclick,
			syncTransformOrigin,
			handleAfterLeave: () => {
				resetScale();
				resetOffset();
				rotate = 0;
				displayedRef.value = false;
			},
			handleDragStart: (e) => {
				imageContext?.previewedImgPropsRef.value?.onDragstart?.(e);
				e.preventDefault();
			},
			zoomIn,
			zoomOut,
			handleDownloadClick,
			rotateCounterclockwise,
			rotateClockwise,
			handleSwitchPrev,
			handleSwitchNext,
			withTooltip,
			resizeToOrignalImageSize,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender,
			doUpdateShow,
			close,
			...exposedMethods
		};
	},
	render() {
		const { clsPrefix, renderToolbar, withTooltip } = this;
		const prevNode = withTooltip(((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			clsPrefix,
			onClick: this.handleSwitchPrev
		}, { default: require_image_src_icons.renderPrevIcon }, 1032, ["clsPrefix", "onClick"])), "tipPrevious");
		const nextNode = withTooltip(((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			clsPrefix,
			onClick: this.handleSwitchNext
		}, { default: require_image_src_icons.renderNextIcon }, 1032, ["clsPrefix", "onClick"])), "tipNext");
		const rotateCounterclockwiseNode = withTooltip(((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			clsPrefix,
			onClick: this.rotateCounterclockwise
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_RotateCounterclockwise)) }, 1032, ["clsPrefix", "onClick"])), "tipCounterclockwise");
		const rotateClockwiseNode = withTooltip(((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			clsPrefix,
			onClick: this.rotateClockwise
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_RotateClockwise)) }, 1032, ["clsPrefix", "onClick"])), "tipClockwise");
		const originalSizeNode = withTooltip(((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			clsPrefix,
			onClick: this.resizeToOrignalImageSize
		}, { default: () => {
			return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ResizeSmall);
		} }, 1032, ["clsPrefix", "onClick"])), "tipOriginalSize");
		const zoomOutNode = withTooltip(((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			clsPrefix,
			onClick: this.zoomOut
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ZoomOut)) }, 1032, ["clsPrefix", "onClick"])), "tipZoomOut");
		const downloadNode = withTooltip(((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			clsPrefix,
			onClick: this.handleDownloadClick
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Download)) }, 1032, ["clsPrefix", "onClick"])), "tipDownload");
		const closeNode = withTooltip(((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			clsPrefix,
			onClick: () => this.close()
		}, { default: require_image_src_icons.renderCloseIcon }, 1032, ["clsPrefix", "onClick"])), "tipClose");
		const zoomInNode = withTooltip(((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			clsPrefix,
			onClick: this.zoomIn
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ZoomIn)) }, 1032, ["clsPrefix", "onClick"])), "tipZoomIn");
		return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [require_vdom.normalizeVNode(() => this.$slots.default?.()), ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.LazyTeleport, { show: this.mergedShow }, { default: () => {
			if (!(this.mergedShow || this.displayed)) return null;
			this.onRender?.();
			return (0, vue.withDirectives)(((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				ref: "containerRef",
				class: require_vdom.normalizeClass([`${clsPrefix}-image-preview-container`, this.themeClass]),
				style: (0, vue.normalizeStyle)(this.cssVars),
				onWheel: this.handleWheel
			}, [
				((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
					name: "fade-in-transition",
					appear: this.appear
				}, { default: () => this.mergedShow ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 2,
					class: require_vdom.normalizeClass(`${clsPrefix}-image-preview-overlay`),
					onClick: () => this.close()
				}, null, 10, _hoisted_1)) : null }, 1032, ["appear"])),
				this.showToolbar ? ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
					key: 0,
					name: "fade-in-transition",
					appear: this.appear
				}, { default: () => {
					if (!this.mergedShow) return null;
					return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-image-preview-toolbar`) }, [renderToolbar ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderToolbar({ nodes: {
						prev: prevNode,
						next: nextNode,
						rotateCounterclockwise: rotateCounterclockwiseNode,
						rotateClockwise: rotateClockwiseNode,
						resizeToOriginalSize: originalSizeNode,
						zoomOut: zoomOutNode,
						zoomIn: zoomInNode,
						download: downloadNode,
						close: closeNode
					} }))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [
						this.onPrev ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => prevNode), require_vdom.normalizeVNode(() => nextNode)], 64)) : require_vdom.normalizeVNode(() => null),
						require_vdom.normalizeVNode(() => rotateCounterclockwiseNode),
						require_vdom.normalizeVNode(() => rotateClockwiseNode),
						require_vdom.normalizeVNode(() => originalSizeNode),
						require_vdom.normalizeVNode(() => zoomOutNode),
						require_vdom.normalizeVNode(() => zoomInNode),
						require_vdom.normalizeVNode(() => downloadNode),
						require_vdom.normalizeVNode(() => closeNode)
					], 64))], 2);
				} }, 1032, ["appear"])) : require_vdom.normalizeVNode(() => null),
				((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
					name: "fade-in-scale-up-transition",
					onAfterLeave: this.handleAfterLeave,
					appear: this.appear,
					onEnter: this.syncTransformOrigin,
					onBeforeLeave: this.syncTransformOrigin
				}, { default: () => {
					const { previewedImgProps = {} } = this;
					return (0, vue.withDirectives)(((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						class: require_vdom.normalizeClass(`${clsPrefix}-image-preview-wrapper`),
						ref: "previewWrapperRef"
					}, [((0, vue.openBlock)(), (0, vue.createElementBlock)("img", (0, vue.mergeProps)(previewedImgProps, {
						draggable: false,
						onMousedown: this.handlePreviewMousedown,
						onDblclick: this.handlePreviewDblclick,
						class: [`${clsPrefix}-image-preview`, previewedImgProps.class],
						key: this.previewSrc,
						src: this.previewSrc,
						ref: "previewRef",
						onDragstart: this.handleDragStart
					}), null, 16, _hoisted_2))], 2)), [[vue.vShow, this.mergedShow]]);
				} }, 1032, [
					"onAfterLeave",
					"appear",
					"onEnter",
					"onBeforeLeave"
				]))
			], 46, _hoisted_3)), [[vdirs.zindexable, { enabled: this.mergedShow }]]);
		} }, 1032, ["show"]))], 64);
	}
});
//#endregion
exports.default = ImagePreview_default;
exports.imagePreviewProps = imagePreviewProps;
