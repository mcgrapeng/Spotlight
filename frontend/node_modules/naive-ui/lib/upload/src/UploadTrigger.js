const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Add = require("../../_internal/icons/Add.js");
const require_upload_src_interface = require("./interface.js");
const require_upload_src_UploadDragger = require("./UploadDragger.js");
const require_upload_src_utils = require("./utils.js");
let vue = require("vue");
//#region src/upload/src/UploadTrigger.tsx
const _hoisted_1 = [
	"onClick",
	"onDrop",
	"onDragover",
	"onDragenter",
	"onDragleave"
];
var UploadTrigger_default = (0, vue.defineComponent)({
	name: "UploadTrigger",
	props: { abstract: Boolean },
	slots: Object,
	setup(props, { slots }) {
		const NUpload = (0, vue.inject)(require_upload_src_interface.uploadInjectionKey, null);
		if (!NUpload) require__utils_naive_warn.throwError("upload-trigger", "`n-upload-trigger` must be placed inside `n-upload`.");
		const { mergedClsPrefixRef, mergedDisabledRef, maxReachedRef, listTypeRef, dragOverRef, openOpenFileDialog, draggerInsideRef, handleFileAddition, mergedDirectoryDndRef, triggerClassRef, triggerStyleRef } = NUpload;
		const isImageCardTypeRef = (0, vue.computed)(() => listTypeRef.value === "image-card");
		function handleTriggerClick() {
			if (mergedDisabledRef.value || maxReachedRef.value) return;
			openOpenFileDialog();
		}
		function handleTriggerDragOver(e) {
			e.preventDefault();
			dragOverRef.value = true;
		}
		function handleTriggerDragEnter(e) {
			e.preventDefault();
			dragOverRef.value = true;
		}
		function handleTriggerDragLeave(e) {
			e.preventDefault();
			dragOverRef.value = false;
		}
		function handleTriggerDrop(e) {
			e.preventDefault();
			if (!draggerInsideRef.value || mergedDisabledRef.value || maxReachedRef.value) {
				dragOverRef.value = false;
				return;
			}
			const dataTransferItems = e.dataTransfer?.items;
			if (dataTransferItems?.length) require_upload_src_utils.getFilesFromEntries(Array.from(dataTransferItems).map((item) => item.webkitGetAsEntry()), mergedDirectoryDndRef.value).then((files) => {
				handleFileAddition(files);
			}).finally(() => {
				dragOverRef.value = false;
			});
			else dragOverRef.value = false;
		}
		return () => {
			const { value: mergedClsPrefix } = mergedClsPrefixRef;
			const options = {
				handleClick: handleTriggerClick,
				handleDrop: handleTriggerDrop,
				handleDragOver: handleTriggerDragOver,
				handleDragEnter: handleTriggerDragEnter,
				handleDragLeave: handleTriggerDragLeave
			};
			return props.abstract ? slots.default?.(options) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 1,
				class: require_vdom.normalizeClass([
					`${mergedClsPrefix}-upload-trigger`,
					(mergedDisabledRef.value || maxReachedRef.value) && `${mergedClsPrefix}-upload-trigger--disabled`,
					isImageCardTypeRef.value && `${mergedClsPrefix}-upload-trigger--image-card`,
					triggerClassRef.value
				]),
				style: (0, vue.normalizeStyle)(triggerStyleRef.value),
				onClick: handleTriggerClick,
				onDrop: handleTriggerDrop,
				onDragover: handleTriggerDragOver,
				onDragenter: handleTriggerDragEnter,
				onDragleave: handleTriggerDragLeave
			}, [isImageCardTypeRef.value ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_upload_src_UploadDragger.default, { key: 0 }, { default: () => require__utils_vue_resolve_slot.resolveSlotWithTypedProps(slots.default, options, () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix: mergedClsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Add)) }, 1032, ["clsPrefix"]))]) }, 1024)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => slots.default?.(options))], 64))], 46, _hoisted_1));
		};
	}
});
//#endregion
module.exports = UploadTrigger_default;
