Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_omit = require("../../_utils/vue/omit.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_message_src_context = require("./context.js");
const require_message_src_MessageEnvironment = require("./MessageEnvironment.js");
let seemly = require("seemly");
let vue = require("vue");
//#region src/message/src/MessageProvider.tsx
const messageProviderProps = {
	...require__mixins_use_theme.default.props,
	to: [String, Object],
	duration: {
		type: Number,
		default: 3e3
	},
	keepAliveOnHover: Boolean,
	max: Number,
	placement: {
		type: String,
		default: "top"
	},
	closable: Boolean,
	containerClass: String,
	containerStyle: [String, Object]
};
var MessageProvider_default = (0, vue.defineComponent)({
	name: "MessageProvider",
	props: messageProviderProps,
	setup(props) {
		const { mergedClsPrefixRef } = require__mixins_use_config.default(props);
		const messageListRef = (0, vue.ref)([]);
		const messageRefs = (0, vue.ref)({});
		const api = {
			create(content, options) {
				return create(content, {
					type: "default",
					...options
				});
			},
			info(content, options) {
				return create(content, {
					...options,
					type: "info"
				});
			},
			success(content, options) {
				return create(content, {
					...options,
					type: "success"
				});
			},
			warning(content, options) {
				return create(content, {
					...options,
					type: "warning"
				});
			},
			error(content, options) {
				return create(content, {
					...options,
					type: "error"
				});
			},
			loading(content, options) {
				return create(content, {
					...options,
					type: "loading"
				});
			},
			destroyAll
		};
		(0, vue.provide)(require_message_src_context.messageProviderInjectionKey, {
			props,
			mergedClsPrefixRef
		});
		(0, vue.provide)(require_message_src_context.messageApiInjectionKey, api);
		function create(content, options) {
			const key = (0, seemly.createId)();
			const messageReactive = (0, vue.reactive)({
				...options,
				content,
				key,
				destroy: () => {
					messageRefs.value[key]?.hide();
				}
			});
			const { max } = props;
			if (max && messageListRef.value.length >= max) messageListRef.value.shift();
			messageListRef.value.push(messageReactive);
			return messageReactive;
		}
		function handleAfterLeave(key) {
			messageListRef.value.splice(messageListRef.value.findIndex((message) => message.key === key), 1);
			delete messageRefs.value[key];
		}
		function destroyAll() {
			Object.values(messageRefs.value).forEach((messageInstRef) => {
				messageInstRef.hide();
			});
		}
		return Object.assign({
			mergedClsPrefix: mergedClsPrefixRef,
			messageRefs,
			messageList: messageListRef,
			handleAfterLeave
		}, api);
	},
	render() {
		return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [require_vdom.normalizeVNode(() => this.$slots.default?.()), this.messageList.length ? ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Teleport, {
			key: 0,
			to: this.to ?? "body"
		}, [(0, vue.createElementVNode)("div", {
			class: require_vdom.normalizeClass([
				`${this.mergedClsPrefix}-message-container`,
				`${this.mergedClsPrefix}-message-container--${this.placement}`,
				this.containerClass
			]),
			key: "message-container",
			style: (0, vue.normalizeStyle)(this.containerStyle)
		}, [require_vdom.normalizeVNode(() => this.messageList.map((message) => {
			return (0, vue.openBlock)(), (0, vue.createBlock)(require_message_src_MessageEnvironment, (0, vue.mergeProps)({
				ref: ((inst) => {
					if (inst) this.messageRefs[message.key] = inst;
				}),
				internalKey: message.key,
				onInternalAfterLeave: this.handleAfterLeave
			}, require__utils_vue_omit.omit(message, ["destroy"], void 0), {
				duration: message.duration === void 0 ? this.duration : message.duration,
				keepAliveOnHover: message.keepAliveOnHover === void 0 ? this.keepAliveOnHover : message.keepAliveOnHover,
				closable: message.closable === void 0 ? this.closable : message.closable
			}), null, 16, [
				"internalKey",
				"onInternalAfterLeave",
				"duration",
				"keepAliveOnHover",
				"closable"
			]);
		}))], 6)], 8, ["to"])) : require_vdom.normalizeVNode(() => null)], 64);
	}
});
//#endregion
exports.default = MessageProvider_default;
exports.messageProviderProps = messageProviderProps;
