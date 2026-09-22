Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_vue_omit = require("../../_utils/vue/omit.js");
const require_dialog_src_context = require("./context.js");
const require_dialog_src_DialogEnvironment = require("./DialogEnvironment.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
//#region src/dialog/src/DialogProvider.ts
const dialogProviderProps = {
	injectionKey: String,
	to: [String, Object]
};
const NDialogProvider = (0, vue.defineComponent)({
	name: "DialogProvider",
	props: dialogProviderProps,
	setup() {
		const dialogListRef = (0, vue.ref)([]);
		const dialogInstRefs = {};
		function create(options = {}) {
			const key = (0, seemly.createId)();
			const dialogReactive = (0, vue.reactive)({
				...options,
				key,
				destroy: () => {
					dialogInstRefs[`n-dialog-${key}`]?.hide();
				}
			});
			dialogListRef.value.push(dialogReactive);
			return dialogReactive;
		}
		const typedApi = [
			"info",
			"success",
			"warning",
			"error"
		].map((type) => (options) => {
			return create({
				...options,
				type
			});
		});
		function handleAfterLeave(key) {
			const { value: dialogList } = dialogListRef;
			dialogList.splice(dialogList.findIndex((dialog) => dialog.key === key), 1);
		}
		function destroyAll() {
			Object.values(dialogInstRefs).forEach((dialogInstRef) => {
				dialogInstRef?.hide();
			});
		}
		const api = {
			create,
			destroyAll,
			info: typedApi[0],
			success: typedApi[1],
			warning: typedApi[2],
			error: typedApi[3]
		};
		(0, vue.provide)(require_dialog_src_context.dialogApiInjectionKey, api);
		(0, vue.provide)(require_dialog_src_context.dialogProviderInjectionKey, {
			clickedRef: (0, vooks.useClicked)(64),
			clickedPositionRef: (0, vooks.useClickPosition)()
		});
		(0, vue.provide)(require_dialog_src_context.dialogReactiveListInjectionKey, dialogListRef);
		return {
			...api,
			dialogList: dialogListRef,
			dialogInstRefs,
			handleAfterLeave
		};
	},
	render() {
		return (0, vue.h)(vue.Fragment, null, [this.dialogList.map((dialog) => (0, vue.h)(require_dialog_src_DialogEnvironment.NDialogEnvironment, require__utils_vue_omit.omit(dialog, ["destroy", "style"], {
			internalStyle: dialog.style,
			to: this.to,
			ref: ((inst) => {
				if (inst === null) delete this.dialogInstRefs[`n-dialog-${dialog.key}`];
				else this.dialogInstRefs[`n-dialog-${dialog.key}`] = inst;
			}),
			internalKey: dialog.key,
			onInternalAfterLeave: this.handleAfterLeave
		}))), this.$slots.default?.()]);
	}
});
//#endregion
exports.NDialogProvider = NDialogProvider;
exports.dialogProviderProps = dialogProviderProps;
