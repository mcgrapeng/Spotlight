const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_fade_in_expand_transition_src_FadeInExpandTransition = require("../../_internal/fade-in-expand-transition/src/FadeInExpandTransition.js");
const require_message_src_message_props = require("./message-props.js");
const require_message_src_Message = require("./Message.js");
let vue = require("vue");
//#region src/message/src/MessageEnvironment.tsx
var MessageEnvironment_default = (0, vue.defineComponent)({
	name: "MessageEnvironment",
	props: {
		...require_message_src_message_props.messageProps,
		duration: {
			type: Number,
			default: 3e3
		},
		onAfterLeave: Function,
		onLeave: Function,
		internalKey: {
			type: String,
			required: true
		},
		onInternalAfterLeave: Function,
		onHide: Function,
		onAfterHide: Function
	},
	setup(props) {
		let timerId = null;
		const showRef = (0, vue.ref)(true);
		(0, vue.onMounted)(() => {
			setHideTimeout();
		});
		function setHideTimeout() {
			const { duration } = props;
			if (duration) timerId = window.setTimeout(hide, duration);
		}
		function handleMouseenter(e) {
			if (e.currentTarget !== e.target) return;
			if (timerId !== null) {
				window.clearTimeout(timerId);
				timerId = null;
			}
		}
		function handleMouseleave(e) {
			if (e.currentTarget !== e.target) return;
			setHideTimeout();
		}
		function hide() {
			const { onHide } = props;
			showRef.value = false;
			if (timerId) {
				window.clearTimeout(timerId);
				timerId = null;
			}
			if (onHide) onHide();
		}
		function handleClose() {
			const { onClose } = props;
			if (onClose) onClose();
			hide();
		}
		function handleAfterLeave() {
			const { onAfterLeave, onInternalAfterLeave, onAfterHide, internalKey } = props;
			if (onAfterLeave) onAfterLeave();
			if (onInternalAfterLeave) onInternalAfterLeave(internalKey);
			if (onAfterHide) onAfterHide();
		}
		function deactivate() {
			hide();
		}
		return {
			show: showRef,
			hide,
			handleClose,
			handleAfterLeave,
			handleMouseleave,
			handleMouseenter,
			deactivate
		};
	},
	render() {
		return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_fade_in_expand_transition_src_FadeInExpandTransition, {
			appear: true,
			onAfterLeave: this.handleAfterLeave,
			onLeave: this.onLeave
		}, {
			_: 1,
			default: require_vdom.normalizeSlot(() => [this.show ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_message_src_Message, {
				key: 1,
				content: this.content,
				type: this.type,
				icon: this.icon,
				showIcon: this.showIcon,
				closable: this.closable,
				spinProps: this.spinProps,
				onClose: this.handleClose,
				onMouseenter: this.keepAliveOnHover ? this.handleMouseenter : void 0,
				onMouseleave: this.keepAliveOnHover ? this.handleMouseleave : void 0
			}, null, 8, [
				"content",
				"type",
				"icon",
				"showIcon",
				"closable",
				"spinProps",
				"onClose",
				"onMouseenter",
				"onMouseleave"
			])) : null])
		}, 8, ["onAfterLeave", "onLeave"]);
	}
});
//#endregion
module.exports = MessageEnvironment_default;
