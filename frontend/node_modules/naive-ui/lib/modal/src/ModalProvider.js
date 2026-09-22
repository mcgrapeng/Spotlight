Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_vue_omit = require("../../_utils/vue/omit.js");
const require_modal_src_context = require("./context.js");
const require_modal_src_ModalEnvironment = require("./ModalEnvironment.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
//#region src/modal/src/ModalProvider.ts
const modalProviderProps = { to: [String, Object] };
const NModalProvider = (0, vue.defineComponent)({
	name: "ModalProvider",
	props: modalProviderProps,
	setup() {
		const modalListRef = (0, vue.ref)([]);
		const modalInstRefs = {};
		function create(options = {}) {
			const key = (0, seemly.createId)();
			const modalReactive = (0, vue.reactive)({
				...options,
				key,
				destroy: () => {
					modalInstRefs[`n-modal-${key}`]?.hide();
				}
			});
			modalListRef.value.push(modalReactive);
			return modalReactive;
		}
		function handleAfterLeave(key) {
			const { value: modalList } = modalListRef;
			modalList.splice(modalList.findIndex((modal) => modal.key === key), 1);
		}
		function destroyAll() {
			Object.values(modalInstRefs).forEach((modalInstRef) => {
				modalInstRef?.hide();
			});
		}
		const api = {
			create,
			destroyAll
		};
		(0, vue.provide)(require_modal_src_context.modalApiInjectionKey, api);
		(0, vue.provide)(require_modal_src_context.modalProviderInjectionKey, {
			clickedRef: (0, vooks.useClicked)(64),
			clickedPositionRef: (0, vooks.useClickPosition)()
		});
		(0, vue.provide)(require_modal_src_context.modalReactiveListInjectionKey, modalListRef);
		return {
			...api,
			modalList: modalListRef,
			modalInstRefs,
			handleAfterLeave
		};
	},
	render() {
		return (0, vue.h)(vue.Fragment, null, [this.modalList.map((modal) => (0, vue.h)(require_modal_src_ModalEnvironment.NModalEnvironment, require__utils_vue_omit.omit(modal, ["destroy", "render"], {
			to: modal.to ?? this.to,
			ref: ((inst) => {
				if (inst === null) delete this.modalInstRefs[`n-modal-${modal.key}`];
				else this.modalInstRefs[`n-modal-${modal.key}`] = inst;
			}),
			internalKey: modal.key,
			onInternalAfterLeave: this.handleAfterLeave
		}), { default: modal.render })), this.$slots.default?.()]);
	}
});
//#endregion
exports.NModalProvider = NModalProvider;
exports.modalProviderProps = modalProviderProps;
