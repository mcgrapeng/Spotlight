Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_omit = require("../../_utils/vue/omit.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_modal_src_Modal = require("./Modal.js");
let vue = require("vue");
//#region src/modal/src/ModalEnvironment.tsx
const NModalEnvironment = (0, vue.defineComponent)({
	name: "ModalEnvironment",
	props: {
		...require_modal_src_Modal.modalProps,
		internalKey: {
			type: String,
			required: true
		},
		onInternalAfterLeave: {
			type: Function,
			required: true
		}
	},
	setup(props) {
		const showRef = (0, vue.ref)(true);
		function handleAfterLeave() {
			const { onInternalAfterLeave, internalKey, onAfterLeave } = props;
			if (onInternalAfterLeave) onInternalAfterLeave(internalKey);
			if (onAfterLeave) onAfterLeave();
		}
		function handleMaskClick(e) {
			const { onMaskClick, maskClosable } = props;
			if (onMaskClick) {
				onMaskClick(e);
				if (maskClosable) hide();
			}
		}
		function handleEsc() {
			const { onEsc } = props;
			if (onEsc) onEsc();
		}
		function hide() {
			showRef.value = false;
		}
		function handleUpdateShow(value) {
			const { onUpdateShow, "onUpdate:show": _onUpdateShow } = props;
			if (onUpdateShow) require__utils_vue_call.call(onUpdateShow, value);
			if (_onUpdateShow) require__utils_vue_call.call(_onUpdateShow, value);
			showRef.value = value;
		}
		return {
			show: showRef,
			hide,
			handleUpdateShow,
			handleAfterLeave,
			handleMaskClick,
			handleEsc
		};
	},
	render() {
		const { handleUpdateShow, handleAfterLeave, handleMaskClick, handleEsc, show } = this;
		return (0, vue.openBlock)(), (0, vue.createBlock)(require_modal_src_Modal.default, (0, vue.mergeProps)(require__utils_vue_omit.omit(this.$props, [
			"onUpdateShow",
			"onUpdate:show",
			"onMaskClick",
			"onEsc",
			"onAfterLeave"
		]), {
			show,
			onUpdateShow: handleUpdateShow,
			onMaskClick: handleMaskClick,
			onEsc: handleEsc,
			onAfterLeave: handleAfterLeave,
			internalAppear: true,
			internalModal: true
		}), require_vdom.normalizeSlots(this.$slots), 1040, [
			"show",
			"onUpdateShow",
			"onMaskClick",
			"onEsc",
			"onAfterLeave",
			"internalAppear",
			"internalModal"
		]);
	}
});
//#endregion
exports.NModalEnvironment = NModalEnvironment;
