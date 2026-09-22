Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_create_injection_key = require("../../_utils/vue/create-injection-key.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_image_src_interface = require("./interface.js");
const require_image_src_ImagePreview = require("./ImagePreview.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
//#region src/image/src/ImageGroup.tsx
const imageGroupInjectionKey = require__utils_vue_create_injection_key.createInjectionKey("n-image-group");
const imageGroupProps = {
	...require_image_src_interface.imagePreviewSharedProps,
	srcList: Array,
	current: Number,
	defaultCurrent: {
		type: Number,
		default: 0
	},
	show: {
		type: Boolean,
		default: void 0
	},
	defaultShow: Boolean,
	onUpdateShow: [Function, Array],
	"onUpdate:show": [Function, Array],
	onUpdateCurrent: [Function, Array],
	"onUpdate:current": [Function, Array]
};
var ImageGroup_default = (0, vue.defineComponent)({
	name: "ImageGroup",
	props: imageGroupProps,
	setup(props) {
		const { mergedClsPrefixRef } = require__mixins_use_config.default(props);
		const groupId = `c${(0, seemly.createId)()}`;
		const previewInstRef = (0, vue.ref)(null);
		const uncontrolledShowRef = (0, vue.ref)(props.defaultShow);
		const controlledShowRef = (0, vue.toRef)(props, "show");
		const mergedShowRef = (0, vooks.useMergedState)(controlledShowRef, uncontrolledShowRef);
		const registeredImageUrlMap = (0, vue.ref)(/* @__PURE__ */ new Map());
		const mergedImageUrlMap = (0, vue.computed)(() => {
			if (props.srcList) {
				const map = /* @__PURE__ */ new Map();
				props.srcList.forEach((url, index) => {
					map.set(`p${index}`, url);
				});
				return map;
			}
			return registeredImageUrlMap.value;
		});
		const imageIdListRef = (0, vue.computed)(() => Array.from(mergedImageUrlMap.value.keys()));
		const imageCountGetter = () => imageIdListRef.value.length;
		function registerImageUrl(id, url) {
			if (props.srcList) require__utils_naive_warn.throwError("image-group", "`n-image` can't be placed inside `n-image-group` when image group's `src-list` prop is set.");
			const sid = `r${id}`;
			if (!registeredImageUrlMap.value.has(`r${sid}`)) registeredImageUrlMap.value.set(sid, url);
			return function unregisterPreviewUrl() {
				if (!registeredImageUrlMap.value.has(sid)) registeredImageUrlMap.value.delete(sid);
			};
		}
		const uncontrolledCurrentRef = (0, vue.ref)(props.defaultCurrent);
		const controlledCurrentRef = (0, vue.toRef)(props, "current");
		const mergedCurrentRef = (0, vooks.useMergedState)(controlledCurrentRef, uncontrolledCurrentRef);
		const setCurrentIndex = (index) => {
			if (index !== mergedCurrentRef.value) {
				const { onUpdateCurrent, "onUpdate:current": _onUpdateCurrent } = props;
				if (onUpdateCurrent) require__utils_vue_call.call(onUpdateCurrent, index);
				if (_onUpdateCurrent) require__utils_vue_call.call(_onUpdateCurrent, index);
				uncontrolledCurrentRef.value = index;
			}
		};
		const currentId = (0, vue.computed)(() => imageIdListRef.value[mergedCurrentRef.value]);
		const setCurrentId = (nextId) => {
			const nextIndex = imageIdListRef.value.indexOf(nextId);
			if (nextIndex !== mergedCurrentRef.value) setCurrentIndex(nextIndex);
		};
		const currentUrl = (0, vue.computed)(() => mergedImageUrlMap.value.get(currentId.value));
		function doUpdateShow(value) {
			const { onUpdateShow, "onUpdate:show": _onUpdateShow } = props;
			if (onUpdateShow) require__utils_vue_call.call(onUpdateShow, value);
			if (_onUpdateShow) require__utils_vue_call.call(_onUpdateShow, value);
			uncontrolledShowRef.value = value;
		}
		function onClose() {
			doUpdateShow(false);
		}
		const nextIndex = (0, vue.computed)(() => {
			const findNext = (start, end) => {
				for (let i = start; i <= end; i++) {
					const id = imageIdListRef.value[i];
					if (mergedImageUrlMap.value.get(id)) return i;
				}
			};
			const next = findNext(mergedCurrentRef.value + 1, imageCountGetter() - 1);
			return next === void 0 ? findNext(0, mergedCurrentRef.value - 1) : next;
		});
		const prevIndex = (0, vue.computed)(() => {
			const findPrev = (start, end) => {
				for (let i = start; i >= end; i--) {
					const id = imageIdListRef.value[i];
					if (mergedImageUrlMap.value.get(id)) return i;
				}
			};
			const prev = findPrev(mergedCurrentRef.value - 1, 0);
			return prev === void 0 ? findPrev(imageCountGetter() - 1, mergedCurrentRef.value + 1) : prev;
		});
		function go(step) {
			if (step === 1) {
				prevIndex.value !== void 0 && setCurrentIndex(nextIndex.value);
				props.onPreviewNext?.();
			} else {
				nextIndex.value !== void 0 && setCurrentIndex(prevIndex.value);
				props.onPreviewPrev?.();
			}
		}
		(0, vue.provide)(imageGroupInjectionKey, {
			mergedClsPrefixRef,
			registerImageUrl,
			setThumbnailEl: (el) => {
				previewInstRef.value?.setThumbnailEl(el);
			},
			toggleShow: (imageId) => {
				doUpdateShow(true);
				setCurrentId(imageId);
			},
			groupId,
			renderToolbarRef: (0, vue.toRef)(props, "renderToolbar")
		});
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			previewInstRef,
			mergedShow: mergedShowRef,
			src: currentUrl,
			onClose,
			next: () => {
				go(1);
			},
			prev: () => {
				go(-1);
			}
		};
	},
	render() {
		return (0, vue.openBlock)(), (0, vue.createBlock)(require_image_src_ImagePreview.default, {
			theme: this.theme,
			themeOverrides: this.themeOverrides,
			ref: "previewInstRef",
			onPrev: this.prev,
			onNext: this.next,
			src: this.src,
			show: this.mergedShow,
			showToolbar: this.showToolbar,
			showToolbarTooltip: this.showToolbarTooltip,
			renderToolbar: this.renderToolbar,
			keepDragOffset: this.keepDragOffset,
			onClose: this.onClose
		}, require_vdom.normalizeSlots(this.$slots), 1032, [
			"theme",
			"themeOverrides",
			"onPrev",
			"onNext",
			"src",
			"show",
			"showToolbar",
			"showToolbarTooltip",
			"renderToolbar",
			"keepDragOffset",
			"onClose"
		]);
	}
});
//#endregion
exports.default = ImageGroup_default;
exports.imageGroupInjectionKey = imageGroupInjectionKey;
exports.imageGroupProps = imageGroupProps;
