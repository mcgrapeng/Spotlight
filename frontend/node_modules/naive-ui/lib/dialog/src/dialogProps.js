Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_vue_keysOf = require("../../_utils/vue/keysOf.js");
//#region src/dialog/src/dialogProps.ts
const dialogProps = {
	icon: Function,
	type: {
		type: String,
		default: "default"
	},
	title: [String, Function],
	closable: {
		type: Boolean,
		default: true
	},
	negativeText: String,
	positiveText: String,
	positiveButtonProps: Object,
	negativeButtonProps: Object,
	content: [String, Function],
	action: Function,
	showIcon: {
		type: Boolean,
		default: true
	},
	loading: Boolean,
	bordered: Boolean,
	iconPlacement: String,
	titleClass: [String, Array],
	titleStyle: [String, Object],
	contentClass: [String, Array],
	contentStyle: [String, Object],
	actionClass: [String, Array],
	actionStyle: [String, Object],
	onPositiveClick: Function,
	onNegativeClick: Function,
	onClose: Function,
	closeFocusable: Boolean
};
const dialogPropKeys = require__utils_vue_keysOf.keysOf(dialogProps);
//#endregion
exports.dialogPropKeys = dialogPropKeys;
exports.dialogProps = dialogProps;
