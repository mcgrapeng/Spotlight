Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require_dialog_src_context = require("./context.js");
let vue = require("vue");
//#region src/dialog/src/composables.ts
function useDialog() {
	const dialog = (0, vue.inject)(require_dialog_src_context.dialogApiInjectionKey, null);
	if (dialog === null) require__utils_naive_warn.throwError("use-dialog", "No outer <n-dialog-provider /> founded.");
	return dialog;
}
function useDialogReactiveList() {
	const dialogReactiveList = (0, vue.inject)(require_dialog_src_context.dialogReactiveListInjectionKey, null);
	if (dialogReactiveList === null) require__utils_naive_warn.throwError("use-dialog-reactive-list", "No outer <n-dialog-provider /> founded.");
	return dialogReactiveList;
}
//#endregion
exports.useDialog = useDialog;
exports.useDialogReactiveList = useDialogReactiveList;
