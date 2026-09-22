Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
const require_notification_src_context = require("./context.js");
let vue = require("vue");
//#region src/notification/src/NotificationContainer.tsx
const NotificationContainer = (0, vue.defineComponent)({
	name: "NotificationContainer",
	props: {
		scrollable: {
			type: Boolean,
			required: true
		},
		placement: {
			type: String,
			required: true
		}
	},
	setup() {
		const { mergedThemeRef, mergedClsPrefixRef, wipTransitionCountRef } = (0, vue.inject)(require_notification_src_context.notificationProviderInjectionKey);
		const selfRef = (0, vue.ref)(null);
		(0, vue.watchEffect)(() => {
			if (wipTransitionCountRef.value > 0) selfRef?.value?.classList.add("transitioning");
			else selfRef?.value?.classList.remove("transitioning");
		});
		return {
			selfRef,
			mergedTheme: mergedThemeRef,
			mergedClsPrefix: mergedClsPrefixRef,
			transitioning: wipTransitionCountRef
		};
	},
	render() {
		const { $slots, scrollable, mergedClsPrefix, mergedTheme, placement } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			ref: "selfRef",
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-notification-container`,
				scrollable && `${mergedClsPrefix}-notification-container--scrollable`,
				`${mergedClsPrefix}-notification-container--${placement}`
			])
		}, [scrollable ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, {
			key: 0,
			theme: mergedTheme.peers.Scrollbar,
			themeOverrides: mergedTheme.peerOverrides.Scrollbar,
			contentStyle: { overflow: "hidden" }
		}, require_vdom.normalizeSlots($slots), 1032, ["theme", "themeOverrides"])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => $slots.default?.())], 64))], 2);
	}
});
//#endregion
exports.NotificationContainer = NotificationContainer;
