Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_upload_src_interface = require("./interface.js");
let vue = require("vue");
//#region src/upload/src/UploadDragger.tsx
const uploadDraggerKey = "__UPLOAD_DRAGGER__";
var UploadDragger_default = (0, vue.defineComponent)({
	name: "UploadDragger",
	[uploadDraggerKey]: true,
	setup(_, { slots }) {
		const NUpload = (0, vue.inject)(require_upload_src_interface.uploadInjectionKey, null);
		if (!NUpload) require__utils_naive_warn.throwError("upload-dragger", "`n-upload-dragger` must be placed inside `n-upload`.");
		return () => {
			const { mergedClsPrefixRef: { value: mergedClsPrefix }, mergedDisabledRef: { value: mergedDisabled }, maxReachedRef: { value: maxReached } } = NUpload;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass([`${mergedClsPrefix}-upload-dragger`, (mergedDisabled || maxReached) && `${mergedClsPrefix}-upload-dragger--disabled`]) }, [require_vdom.normalizeVNode(() => slots.default?.())], 2);
		};
	}
});
//#endregion
exports.default = UploadDragger_default;
exports.uploadDraggerKey = uploadDraggerKey;
