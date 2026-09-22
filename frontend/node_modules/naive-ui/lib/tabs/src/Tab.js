Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_omit = require("../../_utils/vue/omit.js");
const require__utils_vue_render = require("../../_utils/vue/render.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Add = require("../../_internal/icons/Add.js");
const require__internal_close_src_Close = require("../../_internal/close/src/Close.js");
const require_tabs_src_interface = require("./interface.js");
const require_tabs_src_TabPane = require("./TabPane.js");
let vue = require("vue");
//#region src/tabs/src/Tab.tsx
const _hoisted_1 = ["data-name", "data-disabled"];
const tabProps = {
	internalLeftPadded: Boolean,
	internalAddable: Boolean,
	internalCreatedByPane: Boolean,
	...require__utils_vue_omit.omit(require_tabs_src_TabPane.tabPaneProps, ["displayDirective"])
};
var Tab_default = (0, vue.defineComponent)({
	__TAB__: true,
	inheritAttrs: false,
	name: "Tab",
	props: tabProps,
	setup(props) {
		const { mergedClsPrefixRef, valueRef, typeRef, closableRef, tabStyleRef, addTabStyleRef, tabClassRef, addTabClassRef, tabChangeIdRef, onBeforeLeaveRef, triggerRef, handleAdd, activateTab, handleClose } = (0, vue.inject)(require_tabs_src_interface.tabsInjectionKey);
		return {
			trigger: triggerRef,
			mergedClosable: (0, vue.computed)(() => {
				if (props.internalAddable) return false;
				const { closable } = props;
				if (closable === void 0) return closableRef.value;
				return closable;
			}),
			style: tabStyleRef,
			addStyle: addTabStyleRef,
			tabClass: tabClassRef,
			addTabClass: addTabClassRef,
			clsPrefix: mergedClsPrefixRef,
			value: valueRef,
			type: typeRef,
			handleClose(e) {
				e.stopPropagation();
				if (props.disabled) return;
				handleClose(props.name);
			},
			activateTab() {
				if (props.disabled) return;
				if (props.internalAddable) {
					handleAdd();
					return;
				}
				const { name: nameProp } = props;
				const id = ++tabChangeIdRef.id;
				if (nameProp !== valueRef.value) {
					const { value: onBeforeLeave } = onBeforeLeaveRef;
					if (!onBeforeLeave) activateTab(nameProp);
					else Promise.resolve(onBeforeLeave(props.name, valueRef.value)).then((allowLeave) => {
						if (allowLeave && tabChangeIdRef.id === id) activateTab(nameProp);
					});
				}
			}
		};
	},
	render() {
		const { internalAddable, clsPrefix, name, disabled, label, tab, value, mergedClosable, trigger, $slots: { default: defaultSlot } } = this;
		const mergedTab = label ?? tab;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-tabs-tab-wrapper`) }, [this.internalLeftPadded ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 0,
			class: require_vdom.normalizeClass(`${clsPrefix}-tabs-tab-pad`)
		}, null, 2)) : require_vdom.normalizeVNode(() => null), ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", (0, vue.mergeProps)({
			key: name,
			"data-name": name,
			"data-disabled": disabled ? true : void 0
		}, (0, vue.mergeProps)({
			class: [
				`${clsPrefix}-tabs-tab`,
				value === name && `${clsPrefix}-tabs-tab--active`,
				disabled && `${clsPrefix}-tabs-tab--disabled`,
				mergedClosable && `${clsPrefix}-tabs-tab--closable`,
				internalAddable && `${clsPrefix}-tabs-tab--addable`,
				internalAddable ? this.addTabClass : this.tabClass
			],
			onClick: trigger === "click" ? this.activateTab : void 0,
			onMouseenter: trigger === "hover" ? this.activateTab : void 0,
			style: internalAddable ? this.addStyle : this.style
		}, this.internalCreatedByPane ? this.tabProps || {} : this.$attrs)), [(0, vue.createElementVNode)("span", { class: require_vdom.normalizeClass(`${clsPrefix}-tabs-tab__label`) }, [internalAddable ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-tabs-tab__height-placeholder`) }, "\xA0", 2), ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Add)) }, 1032, ["clsPrefix"]))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [defaultSlot ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => defaultSlot())], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [typeof mergedTab === "object" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => mergedTab)], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => require__utils_vue_render.render(mergedTab ?? name))], 64))], 64))], 64))], 2), mergedClosable && this.type === "card" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_close_src_Close, {
			key: 0,
			clsPrefix,
			class: require_vdom.normalizeClass(`${clsPrefix}-tabs-tab__close`),
			onClick: this.handleClose,
			disabled
		}, null, 8, [
			"clsPrefix",
			"class",
			"onClick",
			"disabled"
		])) : require_vdom.normalizeVNode(() => null)], 16, _hoisted_1))], 2);
	}
});
//#endregion
exports.default = Tab_default;
exports.tabProps = tabProps;
