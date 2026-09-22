Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_vue_keep = require("../../_utils/vue/keep.js");
const require_dialog_src_dialogProps = require("./dialogProps.js");
const require_dialog_src_Dialog = require("./Dialog.js");
const require_modal_src_Modal = require("../../modal/src/Modal.js");
let vue = require("vue");
//#region src/dialog/src/DialogEnvironment.tsx
const exposedDialogEnvProps = {
	...require_dialog_src_dialogProps.dialogProps,
	onAfterEnter: Function,
	onAfterLeave: Function,
	transformOrigin: String,
	blockScroll: {
		type: Boolean,
		default: true
	},
	closeOnEsc: {
		type: Boolean,
		default: true
	},
	onEsc: Function,
	autoFocus: {
		type: Boolean,
		default: true
	},
	internalStyle: [String, Object],
	maskClosable: {
		type: Boolean,
		default: true
	},
	zIndex: Number,
	onPositiveClick: Function,
	onNegativeClick: Function,
	onClose: Function,
	onMaskClick: Function,
	draggable: [Boolean, Object]
};
const NDialogEnvironment = (0, vue.defineComponent)({
	name: "DialogEnvironment",
	props: {
		...exposedDialogEnvProps,
		internalKey: {
			type: String,
			required: true
		},
		to: [String, Object],
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
		function handlePositiveClick(e) {
			const { onPositiveClick } = props;
			if (onPositiveClick) Promise.resolve(onPositiveClick(e)).then((result) => {
				if (result === false) return;
				hide();
			});
			else hide();
		}
		function handleNegativeClick(e) {
			const { onNegativeClick } = props;
			if (onNegativeClick) Promise.resolve(onNegativeClick(e)).then((result) => {
				if (result === false) return;
				hide();
			});
			else hide();
		}
		function handleCloseClick() {
			const { onClose } = props;
			if (onClose) Promise.resolve(onClose()).then((result) => {
				if (result === false) return;
				hide();
			});
			else hide();
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
			showRef.value = value;
		}
		return {
			show: showRef,
			hide,
			handleUpdateShow,
			handleAfterLeave,
			handleCloseClick,
			handleNegativeClick,
			handlePositiveClick,
			handleMaskClick,
			handleEsc
		};
	},
	render() {
		const { handlePositiveClick, handleUpdateShow, handleNegativeClick, handleCloseClick, handleAfterLeave, handleMaskClick, handleEsc, to, zIndex, maskClosable, show } = this;
		return (0, vue.openBlock)(), (0, vue.createBlock)(require_modal_src_Modal.default, {
			show,
			onUpdateShow: handleUpdateShow,
			onMaskClick: handleMaskClick,
			onEsc: handleEsc,
			to,
			zIndex,
			maskClosable,
			onAfterEnter: this.onAfterEnter,
			onAfterLeave: handleAfterLeave,
			closeOnEsc: this.closeOnEsc,
			blockScroll: this.blockScroll,
			autoFocus: this.autoFocus,
			transformOrigin: this.transformOrigin,
			draggable: this.draggable,
			internalAppear: true,
			internalDialog: true
		}, { default: ({ draggableClass }) => ((0, vue.openBlock)(), (0, vue.createBlock)(require_dialog_src_Dialog.NDialog, require__utils_vue_keep.keep(this.$props, require_dialog_src_dialogProps.dialogPropKeys, {
			titleClass: (0, vue.normalizeClass)([this.titleClass, draggableClass]),
			style: this.internalStyle,
			onClose: handleCloseClick,
			onNegativeClick: handleNegativeClick,
			onPositiveClick: handlePositiveClick
		}), null, 16)) }, 1032, [
			"show",
			"onUpdateShow",
			"onMaskClick",
			"onEsc",
			"to",
			"zIndex",
			"maskClosable",
			"onAfterEnter",
			"onAfterLeave",
			"closeOnEsc",
			"blockScroll",
			"autoFocus",
			"transformOrigin",
			"draggable"
		]);
	}
});
//#endregion
exports.NDialogEnvironment = NDialogEnvironment;
exports.exposedDialogEnvProps = exposedDialogEnvProps;
