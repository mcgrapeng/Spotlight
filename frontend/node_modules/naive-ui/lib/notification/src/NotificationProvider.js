Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_create_injection_key = require("../../_utils/vue/create-injection-key.js");
const require__utils_vue_omit = require("../../_utils/vue/omit.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_notification_styles_light = require("../styles/light.js");
const require_notification_src_context = require("./context.js");
const require_notification_src_NotificationContainer = require("./NotificationContainer.js");
const require_notification_src_NotificationEnvironment = require("./NotificationEnvironment.js");
const require_notification_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
//#region src/notification/src/NotificationProvider.tsx
const notificationApiInjectionKey = require__utils_vue_create_injection_key.createInjectionKey("n-notification-api");
const notificationProviderProps = {
	...require__mixins_use_theme.default.props,
	containerClass: String,
	containerStyle: [String, Object],
	to: [String, Object],
	scrollable: {
		type: Boolean,
		default: true
	},
	max: Number,
	placement: {
		type: String,
		default: "top-right"
	},
	keepAliveOnHover: Boolean
};
var NotificationProvider_default = (0, vue.defineComponent)({
	name: "NotificationProvider",
	props: notificationProviderProps,
	setup(props) {
		const { mergedClsPrefixRef } = require__mixins_use_config.default(props);
		const notificationListRef = (0, vue.ref)([]);
		const notificationRefs = {};
		const leavingKeySet = /* @__PURE__ */ new Set();
		function create(options) {
			const key = (0, seemly.createId)();
			const destroy = () => {
				leavingKeySet.add(key);
				if (notificationRefs[key]) notificationRefs[key].hide();
			};
			const notificationReactive = (0, vue.reactive)({
				...options,
				key,
				destroy,
				hide: destroy,
				deactivate: destroy
			});
			const { max } = props;
			if (max && notificationListRef.value.length - leavingKeySet.size >= max) {
				let someoneMountedRemoved = false;
				let index = 0;
				for (const notification of notificationListRef.value) {
					if (!leavingKeySet.has(notification.key)) {
						if (notificationRefs[notification.key]) {
							notification.destroy();
							someoneMountedRemoved = true;
						}
						break;
					}
					index++;
				}
				if (!someoneMountedRemoved) notificationListRef.value.splice(index, 1);
			}
			notificationListRef.value.push(notificationReactive);
			return notificationReactive;
		}
		const apis = [
			"info",
			"success",
			"warning",
			"error"
		].map((type) => {
			return (options) => create({
				...options,
				type
			});
		});
		function handleAfterLeave(key) {
			leavingKeySet.delete(key);
			notificationListRef.value.splice(notificationListRef.value.findIndex((notification) => notification.key === key), 1);
		}
		const themeRef = require__mixins_use_theme.default("Notification", "-notification", require_notification_src_styles_index_cssr, require_notification_styles_light.default, props, mergedClsPrefixRef);
		const api = {
			create,
			info: apis[0],
			success: apis[1],
			warning: apis[2],
			error: apis[3],
			open,
			destroyAll
		};
		const wipTransitionCountRef = (0, vue.ref)(0);
		(0, vue.provide)(notificationApiInjectionKey, api);
		(0, vue.provide)(require_notification_src_context.notificationProviderInjectionKey, {
			props,
			mergedClsPrefixRef,
			mergedThemeRef: themeRef,
			wipTransitionCountRef
		});
		function open(options) {
			return create(options);
		}
		function destroyAll() {
			Object.values(notificationListRef.value).forEach((notification) => {
				notification.hide();
			});
		}
		return Object.assign({
			mergedClsPrefix: mergedClsPrefixRef,
			notificationList: notificationListRef,
			notificationRefs,
			handleAfterLeave
		}, api);
	},
	render() {
		const { placement } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [require_vdom.normalizeVNode(() => this.$slots.default?.()), this.notificationList.length ? ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Teleport, {
			key: 0,
			to: this.to ?? "body"
		}, [((0, vue.openBlock)(), (0, vue.createBlock)(require_notification_src_NotificationContainer.NotificationContainer, {
			class: require_vdom.normalizeClass(this.containerClass),
			style: (0, vue.normalizeStyle)(this.containerStyle),
			scrollable: this.scrollable && placement !== "top" && placement !== "bottom",
			placement
		}, { default: () => {
			return this.notificationList.map((notification) => {
				return (0, vue.openBlock)(), (0, vue.createBlock)(require_notification_src_NotificationEnvironment.NotificationEnvironment, (0, vue.mergeProps)({ ref: ((inst) => {
					const refKey = notification.key;
					if (inst === null) delete this.notificationRefs[refKey];
					else this.notificationRefs[refKey] = inst;
				}) }, require__utils_vue_omit.omit(notification, [
					"destroy",
					"hide",
					"deactivate"
				]), {
					internalKey: notification.key,
					onInternalAfterLeave: this.handleAfterLeave,
					keepAliveOnHover: notification.keepAliveOnHover === void 0 ? this.keepAliveOnHover : notification.keepAliveOnHover
				}), null, 16, [
					"internalKey",
					"onInternalAfterLeave",
					"keepAliveOnHover"
				]);
			});
		} }, 1032, [
			"class",
			"style",
			"scrollable",
			"placement"
		]))], 8, ["to"])) : require_vdom.normalizeVNode(() => null)], 64);
	}
});
//#endregion
exports.default = NotificationProvider_default;
exports.notificationApiInjectionKey = notificationApiInjectionKey;
exports.notificationProviderProps = notificationProviderProps;
