Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_vue_keep = require("../../_utils/vue/keep.js");
const require__utils_vue_merge_handlers = require("../../_utils/vue/merge-handlers.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_notification_src_context = require("./context.js");
const require_notification_src_Notification = require("./Notification.js");
let vue = require("vue");
//#region src/notification/src/NotificationEnvironment.tsx
const notificationEnvOptions = {
	...require_notification_src_Notification.notificationProps,
	duration: Number,
	onClose: Function,
	onLeave: Function,
	onAfterEnter: Function,
	onAfterLeave: Function,
	/** @deprecated */
	onHide: Function,
	/** @deprecated */
	onAfterShow: Function,
	/** @deprecated */
	onAfterHide: Function
};
const NotificationEnvironment = (0, vue.defineComponent)({
	name: "NotificationEnvironment",
	props: {
		...notificationEnvOptions,
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
		const { wipTransitionCountRef } = (0, vue.inject)(require_notification_src_context.notificationProviderInjectionKey);
		const showRef = (0, vue.ref)(true);
		let timerId = null;
		function hide() {
			showRef.value = false;
			if (timerId) window.clearTimeout(timerId);
		}
		function handleBeforeEnter(el) {
			wipTransitionCountRef.value++;
			(0, vue.nextTick)(() => {
				el.style.height = `${el.offsetHeight}px`;
				el.style.maxHeight = "0";
				el.style.transition = "none";
				el.offsetHeight;
				el.style.transition = "";
				el.style.maxHeight = el.style.height;
			});
		}
		function handleAfterEnter(el) {
			wipTransitionCountRef.value--;
			el.style.height = "";
			el.style.maxHeight = "";
			const { onAfterEnter, onAfterShow } = props;
			if (onAfterEnter) onAfterEnter();
			if (onAfterShow) onAfterShow();
		}
		function handleBeforeLeave(el) {
			wipTransitionCountRef.value++;
			el.style.maxHeight = `${el.offsetHeight}px`;
			el.style.height = `${el.offsetHeight}px`;
			el.offsetHeight;
		}
		function handleLeave(el) {
			const { onHide } = props;
			if (onHide) onHide();
			el.style.maxHeight = "0";
			el.offsetHeight;
		}
		function handleAfterLeave() {
			wipTransitionCountRef.value--;
			const { onAfterLeave, onInternalAfterLeave, onAfterHide, internalKey } = props;
			if (onAfterLeave) onAfterLeave();
			onInternalAfterLeave(internalKey);
			if (onAfterHide) onAfterHide();
		}
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
		function handleClose() {
			const { onClose } = props;
			if (onClose) Promise.resolve(onClose()).then((feedback) => {
				if (feedback === false) return;
				hide();
			});
			else hide();
		}
		(0, vue.onMounted)(() => {
			if (props.duration) timerId = window.setTimeout(hide, props.duration);
		});
		return {
			show: showRef,
			hide,
			handleClose,
			handleAfterLeave,
			handleLeave,
			handleBeforeLeave,
			handleAfterEnter,
			handleBeforeEnter,
			handleMouseenter,
			handleMouseleave
		};
	},
	render() {
		return (0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
			name: "notification-transition",
			appear: true,
			onBeforeEnter: this.handleBeforeEnter,
			onAfterEnter: this.handleAfterEnter,
			onBeforeLeave: this.handleBeforeLeave,
			onLeave: this.handleLeave,
			onAfterLeave: this.handleAfterLeave
		}, {
			_: 1,
			default: require_vdom.normalizeSlot(() => {
				return this.show ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_notification_src_Notification.Notification, (0, vue.mergeProps)({ key: 1 }, require__utils_vue_keep.keep(this.$props, require_notification_src_Notification.notificationPropKeys, {
					onClose: this.handleClose,
					onMouseenter: this.duration && this.keepAliveOnHover ? require__utils_vue_merge_handlers.mergeEventHandlers([this.handleMouseenter, this.onMouseenter]) : this.onMouseenter,
					onMouseleave: this.duration && this.keepAliveOnHover ? require__utils_vue_merge_handlers.mergeEventHandlers([this.handleMouseleave, this.onMouseleave]) : this.onMouseleave
				})), null, 16)) : null;
			})
		}, 8, [
			"onBeforeEnter",
			"onAfterEnter",
			"onBeforeLeave",
			"onLeave",
			"onAfterLeave"
		]);
	}
});
//#endregion
exports.NotificationEnvironment = NotificationEnvironment;
exports.notificationEnvOptions = notificationEnvOptions;
