Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__utils_env_is_native_lazy_load = require("../../_utils/env/is-native-lazy-load.js");
const require_image_src_utils = require("./utils.js");
const require_image_src_interface = require("./interface.js");
const require_image_src_ImagePreview = require("./ImagePreview.js");
const require_image_src_ImageGroup = require("./ImageGroup.js");
let vue = require("vue");
//#region src/image/src/Image.tsx
const imageProps = {
	alt: String,
	height: [String, Number],
	imgProps: Object,
	previewedImgProps: Object,
	lazy: Boolean,
	intersectionObserverOptions: Object,
	objectFit: {
		type: String,
		default: "fill"
	},
	previewSrc: String,
	fallbackSrc: String,
	width: [String, Number],
	src: String,
	previewDisabled: Boolean,
	loadDescription: String,
	onError: Function,
	onLoad: Function,
	...require_image_src_interface.imagePreviewSharedProps
};
let uuid = 0;
var Image_default = (0, vue.defineComponent)({
	name: "Image",
	props: imageProps,
	slots: Object,
	inheritAttrs: false,
	setup(props) {
		const imageRef = (0, vue.ref)(null);
		const showErrorRef = (0, vue.ref)(false);
		const previewInstRef = (0, vue.ref)(null);
		const imageGroupHandle = (0, vue.inject)(require_image_src_ImageGroup.imageGroupInjectionKey, null);
		const { mergedClsPrefixRef } = imageGroupHandle || require__mixins_use_config.default(props);
		const mergedPreviewSrcRef = (0, vue.computed)(() => {
			return props.previewSrc || props.src;
		});
		const previewShowRef = (0, vue.ref)(false);
		const imageId = uuid++;
		const showPreview = () => {
			if (props.previewDisabled || showErrorRef.value) return;
			if (imageGroupHandle) {
				imageGroupHandle.setThumbnailEl(imageRef.value);
				imageGroupHandle.toggleShow(`r${imageId}`);
				return;
			}
			const { value: previewInst } = previewInstRef;
			if (!previewInst) return;
			previewInst.setThumbnailEl(imageRef.value);
			previewShowRef.value = true;
		};
		const exposedMethods = {
			click: () => {
				showPreview();
			},
			showPreview
		};
		const shouldStartLoadingRef = (0, vue.ref)(!props.lazy);
		(0, vue.onMounted)(() => {
			imageRef.value?.setAttribute("data-group-id", imageGroupHandle?.groupId || "");
		});
		(0, vue.onMounted)(() => {
			if (props.lazy && props.intersectionObserverOptions) {
				let unobserve;
				const stopWatchHandle = (0, vue.watchEffect)(() => {
					unobserve?.();
					unobserve = void 0;
					unobserve = require_image_src_utils.observeIntersection(imageRef.value, props.intersectionObserverOptions, shouldStartLoadingRef);
				});
				(0, vue.onBeforeUnmount)(() => {
					stopWatchHandle();
					unobserve?.();
				});
			}
		});
		(0, vue.watchEffect)(() => {
			props.src || props.imgProps?.src;
			showErrorRef.value = false;
		});
		(0, vue.watchEffect)((onInvalidate) => {
			const unregister = imageGroupHandle?.registerImageUrl?.(imageId, mergedPreviewSrcRef.value || "");
			onInvalidate(() => {
				unregister?.();
			});
		});
		function onImgClick(e) {
			exposedMethods.showPreview();
			props.imgProps?.onClick?.(e);
		}
		function onPreviewClose() {
			previewShowRef.value = false;
		}
		const loadedRef = (0, vue.ref)(false);
		(0, vue.provide)(require_image_src_interface.imageContextKey, { previewedImgPropsRef: (0, vue.toRef)(props, "previewedImgProps") });
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			groupId: imageGroupHandle?.groupId,
			previewInstRef,
			imageRef,
			mergedPreviewSrc: mergedPreviewSrcRef,
			showError: showErrorRef,
			shouldStartLoading: shouldStartLoadingRef,
			loaded: loadedRef,
			mergedOnClick: (e) => {
				onImgClick(e);
			},
			onPreviewClose,
			mergedOnError: (e) => {
				if (props.intersectionObserverOptions && !shouldStartLoadingRef.value) return;
				showErrorRef.value = true;
				loadedRef.value = true;
				const { onError, imgProps: { onError: imgPropsOnError } = {} } = props;
				onError?.(e);
				imgPropsOnError?.(e);
			},
			mergedOnLoad: (e) => {
				const { onLoad, imgProps: { onLoad: imgPropsOnLoad } = {} } = props;
				onLoad?.(e);
				imgPropsOnLoad?.(e);
				loadedRef.value = true;
			},
			previewShow: previewShowRef,
			...exposedMethods
		};
	},
	render() {
		const { mergedClsPrefix, imgProps = {}, loaded, $attrs, lazy } = this;
		const errorNode = require__utils_vue_resolve_slot.resolveSlot(this.$slots.error, () => []);
		const placeholderNode = this.$slots.placeholder?.();
		const loadSrc = this.src || imgProps.src;
		const imgNode = this.showError && errorNode.length ? errorNode : (0, vue.h)("img", {
			...imgProps,
			ref: "imageRef",
			width: this.width || imgProps.width,
			height: this.height || imgProps.height,
			src: this.showError ? this.fallbackSrc : lazy && this.intersectionObserverOptions ? this.shouldStartLoading ? loadSrc : void 0 : loadSrc,
			alt: this.alt || imgProps.alt,
			"aria-label": this.alt || imgProps.alt,
			onClick: this.mergedOnClick,
			onError: this.mergedOnError,
			onLoad: this.mergedOnLoad,
			loading: require__utils_env_is_native_lazy_load.isImageSupportNativeLazy && lazy && !this.intersectionObserverOptions ? "lazy" : "eager",
			style: [
				imgProps.style || "",
				placeholderNode && !loaded ? {
					height: "0",
					width: "0",
					visibility: "hidden"
				} : "",
				{ objectFit: this.objectFit }
			],
			"data-error": this.showError,
			"data-preview-src": this.previewSrc || this.src
		});
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", (0, vue.mergeProps)($attrs, {
			role: "none",
			class: [
				$attrs.class,
				`${mergedClsPrefix}-image`,
				(this.previewDisabled || this.showError) && `${mergedClsPrefix}-image--preview-disabled`
			]
		}), [this.groupId ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => imgNode)], 64)) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_image_src_ImagePreview.default, {
			key: 1,
			theme: this.theme,
			themeOverrides: this.themeOverrides,
			ref: "previewInstRef",
			showToolbar: this.showToolbar,
			showToolbarTooltip: this.showToolbarTooltip,
			renderToolbar: this.renderToolbar,
			keepDragOffset: this.keepDragOffset,
			src: this.mergedPreviewSrc,
			show: !this.previewDisabled && this.previewShow,
			onClose: this.onPreviewClose
		}, { default: () => imgNode }, 1032, [
			"theme",
			"themeOverrides",
			"showToolbar",
			"showToolbarTooltip",
			"renderToolbar",
			"keepDragOffset",
			"src",
			"show",
			"onClose"
		])), require_vdom.normalizeVNode(() => !loaded && placeholderNode)], 16);
	}
});
//#endregion
exports.default = Image_default;
exports.imageProps = imageProps;
