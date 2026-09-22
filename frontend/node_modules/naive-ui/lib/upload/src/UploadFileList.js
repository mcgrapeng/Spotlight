const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_fade_in_expand_transition_src_FadeInExpandTransition = require("../../_internal/fade-in-expand-transition/src/FadeInExpandTransition.js");
const require_image_src_ImageGroup = require("../../image/src/ImageGroup.js");
const require_upload_src_interface = require("./interface.js");
const require_upload_src_UploadFile = require("./UploadFile.js");
const require_upload_src_UploadTrigger = require("./UploadTrigger.js");
let vue = require("vue");
//#region src/upload/src/UploadFileList.tsx
var UploadFileList_default = (0, vue.defineComponent)({
	name: "UploadFileList",
	setup(_, { slots }) {
		const NUpload = (0, vue.inject)(require_upload_src_interface.uploadInjectionKey, null);
		if (!NUpload) require__utils_naive_warn.throwError("upload-file-list", "`n-upload-file-list` must be placed inside `n-upload`.");
		const { abstractRef, mergedClsPrefixRef, listTypeRef, mergedFileListRef, fileListClassRef, fileListStyleRef, cssVarsRef, themeClassRef, maxReachedRef, showTriggerRef, imageGroupPropsRef } = NUpload;
		const isImageCardTypeRef = (0, vue.computed)(() => listTypeRef.value === "image-card");
		const renderFileList = () => mergedFileListRef.value.map((file, index) => ((0, vue.openBlock)(), (0, vue.createBlock)(require_upload_src_UploadFile, {
			clsPrefix: mergedClsPrefixRef.value,
			key: file.id,
			file,
			index,
			listType: listTypeRef.value
		}, null, 8, [
			"clsPrefix",
			"file",
			"index",
			"listType"
		])));
		const renderUploadFileList = () => isImageCardTypeRef.value ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_image_src_ImageGroup.default, (0, vue.mergeProps)({ key: 1 }, imageGroupPropsRef.value), { default: renderFileList }, 1040)) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_fade_in_expand_transition_src_FadeInExpandTransition, {
			key: 2,
			group: true
		}, { default: renderFileList }, 1024));
		return () => {
			const { value: mergedClsPrefix } = mergedClsPrefixRef;
			const { value: abstract } = abstractRef;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass([
					`${mergedClsPrefix}-upload-file-list`,
					isImageCardTypeRef.value && `${mergedClsPrefix}-upload-file-list--grid`,
					abstract ? themeClassRef?.value : void 0,
					fileListClassRef.value
				]),
				style: (0, vue.normalizeStyle)([abstract && cssVarsRef ? cssVarsRef.value : "", fileListStyleRef.value])
			}, [require_vdom.normalizeVNode(() => renderUploadFileList()), require_vdom.normalizeVNode(() => showTriggerRef.value && !maxReachedRef.value && isImageCardTypeRef.value && ((0, vue.openBlock)(), (0, vue.createBlock)(require_upload_src_UploadTrigger, null, require_vdom.normalizeSlots(slots), 1024)))], 6);
		};
	}
});
//#endregion
module.exports = UploadFileList_default;
