Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_ChevronLeft = require("../../_internal/icons/ChevronLeft.js");
const require__internal_icons_ChevronRight = require("../../_internal/icons/ChevronRight.js");
const require_collapse_src_Collapse = require("./Collapse.js");
const require_collapse_src_CollapseItemContent = require("./CollapseItemContent.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
//#region src/collapse/src/CollapseItem.tsx
const _hoisted_1 = ["onClick"];
const _hoisted_2 = ["onClick"];
const collapseItemProps = {
	title: String,
	name: [String, Number],
	disabled: Boolean,
	displayDirective: String
};
var CollapseItem_default = (0, vue.defineComponent)({
	name: "CollapseItem",
	props: collapseItemProps,
	setup(props) {
		const { mergedRtlRef } = require__mixins_use_config.default(props);
		const randomName = (0, seemly.createId)();
		const mergedNameRef = (0, vooks.useMemo)(() => {
			return props.name ?? randomName;
		});
		const NCollapse = (0, vue.inject)(require_collapse_src_Collapse.collapseInjectionKey);
		if (!NCollapse) require__utils_naive_warn.throwError("collapse-item", "`n-collapse-item` must be placed inside `n-collapse`.");
		const { expandedNamesRef, props: collapseProps, mergedClsPrefixRef, slots: collapseSlots } = NCollapse;
		const collapsedRef = (0, vue.computed)(() => {
			const { value: expandedNames } = expandedNamesRef;
			if (Array.isArray(expandedNames)) {
				const { value: name } = mergedNameRef;
				return !~expandedNames.findIndex((expandedName) => expandedName === name);
			} else if (expandedNames) {
				const { value: name } = mergedNameRef;
				return name !== expandedNames;
			}
			return true;
		});
		return {
			rtlEnabled: require__mixins_use_rtl.useRtl("Collapse", mergedRtlRef, mergedClsPrefixRef),
			collapseSlots,
			randomName,
			mergedClsPrefix: mergedClsPrefixRef,
			collapsed: collapsedRef,
			triggerAreas: (0, vue.toRef)(collapseProps, "triggerAreas"),
			mergedDisplayDirective: (0, vue.computed)(() => {
				const { displayDirective } = props;
				if (displayDirective) return displayDirective;
				else return collapseProps.displayDirective;
			}),
			arrowPlacement: (0, vue.computed)(() => {
				return collapseProps.arrowPlacement;
			}),
			handleClick(e) {
				let happensInArea = "main";
				if ((0, seemly.happensIn)(e, "arrow")) happensInArea = "arrow";
				if ((0, seemly.happensIn)(e, "extra")) happensInArea = "extra";
				if (!collapseProps.triggerAreas.includes(happensInArea)) return;
				if (NCollapse && !props.disabled) NCollapse.toggleItem(collapsedRef.value, mergedNameRef.value, e);
			}
		};
	},
	render() {
		const { collapseSlots, $slots, arrowPlacement, collapsed, mergedDisplayDirective, mergedClsPrefix, disabled, triggerAreas } = this;
		const headerNode = require__utils_vue_resolve_slot.resolveSlotWithTypedProps($slots.header, { collapsed }, () => [this.title]);
		const headerExtraSlot = $slots["header-extra"] || collapseSlots["header-extra"];
		const arrowSlot = $slots.arrow || collapseSlots.arrow;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass([
			`${mergedClsPrefix}-collapse-item`,
			`${mergedClsPrefix}-collapse-item--${arrowPlacement}-arrow-placement`,
			disabled && `${mergedClsPrefix}-collapse-item--disabled`,
			!collapsed && `${mergedClsPrefix}-collapse-item--active`,
			triggerAreas.map((area) => {
				return `${mergedClsPrefix}-collapse-item--trigger-area-${area}`;
			})
		]) }, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass([`${mergedClsPrefix}-collapse-item__header`, !collapsed && `${mergedClsPrefix}-collapse-item__header--active`]) }, [(0, vue.createElementVNode)("div", {
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-collapse-item__header-main`),
			onClick: this.handleClick
		}, [
			require_vdom.normalizeVNode(() => arrowPlacement === "right" && headerNode),
			((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-collapse-item-arrow`),
				key: this.rtlEnabled ? 0 : 1,
				"data-arrow": true
			}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlotWithTypedProps(arrowSlot, { collapsed }, () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix: mergedClsPrefix }, { default: () => this.rtlEnabled ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ChevronLeft, { key: 1 })) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ChevronRight, { key: 2 })) }, 1032, ["clsPrefix"]))]))], 2)),
			require_vdom.normalizeVNode(() => arrowPlacement === "left" && headerNode)
		], 10, _hoisted_2), require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlotWithProps(headerExtraSlot, { collapsed }, (children) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-collapse-item__header-extra`),
			onClick: this.handleClick,
			"data-extra": true
		}, [require_vdom.normalizeVNode(() => children)], 10, _hoisted_1))))], 2), ((0, vue.openBlock)(), (0, vue.createBlock)(require_collapse_src_CollapseItemContent, {
			clsPrefix: mergedClsPrefix,
			displayDirective: mergedDisplayDirective,
			show: !collapsed
		}, require_vdom.normalizeSlots($slots), 1032, [
			"clsPrefix",
			"displayDirective",
			"show"
		]))], 2);
	}
});
//#endregion
exports.collapseItemProps = collapseItemProps;
exports.default = CollapseItem_default;
