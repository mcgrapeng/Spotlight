Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_vue_create_injection_key = require("../../_utils/vue/create-injection-key.js");
//#region src/image/src/interface.ts
const imagePreviewSharedProps = {
	...require("../../_mixins/use-theme.js").default.props,
	onPreviewPrev: Function,
	onPreviewNext: Function,
	showToolbar: {
		type: Boolean,
		default: true
	},
	showToolbarTooltip: Boolean,
	keepDragOffset: Boolean,
	renderToolbar: Function
};
const imageContextKey = require__utils_vue_create_injection_key.createInjectionKey("n-image");
//#endregion
exports.imageContextKey = imageContextKey;
exports.imagePreviewSharedProps = imagePreviewSharedProps;
