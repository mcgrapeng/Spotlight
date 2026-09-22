const require__internal_select_menu_src_interface = require("./interface.js");
const require__utils_vue_merge_handlers = require("../../../_utils/vue/merge-handlers.js");
const require__utils_vue_render = require("../../../_utils/vue/render.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../icon/src/Icon.js");
const require__internal_icons_Checkmark = require("../../icons/Checkmark.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/_internal/select-menu/src/SelectOption.tsx
const _hoisted_1 = [
	"onClick",
	"onMouseenter",
	"onMousemove"
];
function renderCheckMark(show, clsPrefix) {
	return (0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, { name: "fade-in-scale-up-transition" }, { default: () => show ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
		key: 1,
		clsPrefix,
		class: require_vdom.normalizeClass(`${clsPrefix}-base-select-option__check`)
	}, { default: () => (0, vue.h)(require__internal_icons_Checkmark) }, 1032, ["clsPrefix", "class"])) : null }, 1024);
}
var SelectOption_default = (0, vue.defineComponent)({
	name: "NBaseSelectOption",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		tmNode: {
			type: Object,
			required: true
		}
	},
	setup(props) {
		const { valueRef, pendingTmNodeRef, multipleRef, valueSetRef, renderLabelRef, renderOptionRef, labelFieldRef, valueFieldRef, showCheckmarkRef, nodePropsRef, handleOptionClick, handleOptionMouseEnter } = (0, vue.inject)(require__internal_select_menu_src_interface.internalSelectionMenuInjectionKey);
		const isPendingRef = (0, vooks.useMemo)(() => {
			const { value: pendingTmNode } = pendingTmNodeRef;
			if (!pendingTmNode) return false;
			return props.tmNode.key === pendingTmNode.key;
		});
		function handleClick(e) {
			const { tmNode } = props;
			if (tmNode.disabled) return;
			handleOptionClick(e, tmNode);
		}
		function handleMouseEnter(e) {
			const { tmNode } = props;
			if (tmNode.disabled) return;
			handleOptionMouseEnter(e, tmNode);
		}
		function handleMouseMove(e) {
			const { tmNode } = props;
			const { value: isPending } = isPendingRef;
			if (tmNode.disabled || isPending) return;
			handleOptionMouseEnter(e, tmNode);
		}
		return {
			multiple: multipleRef,
			isGrouped: (0, vooks.useMemo)(() => {
				const { tmNode } = props;
				const { parent } = tmNode;
				return parent && parent.rawNode.type === "group";
			}),
			showCheckmark: showCheckmarkRef,
			nodeProps: nodePropsRef,
			isPending: isPendingRef,
			isSelected: (0, vooks.useMemo)(() => {
				const { value } = valueRef;
				const { value: multiple } = multipleRef;
				if (value === null) return false;
				const optionValue = props.tmNode.rawNode[valueFieldRef.value];
				if (multiple) {
					const { value: valueSet } = valueSetRef;
					return valueSet.has(optionValue);
				} else return value === optionValue;
			}),
			labelField: labelFieldRef,
			renderLabel: renderLabelRef,
			renderOption: renderOptionRef,
			handleMouseMove,
			handleMouseEnter,
			handleClick
		};
	},
	render() {
		const { clsPrefix, tmNode: { rawNode }, isSelected, isPending, isGrouped, showCheckmark, nodeProps, renderOption, renderLabel, handleClick, handleMouseEnter, handleMouseMove } = this;
		const checkmark = renderCheckMark(isSelected, clsPrefix);
		const children = renderLabel ? [renderLabel(rawNode, isSelected), showCheckmark && checkmark] : [require__utils_vue_render.render(rawNode[this.labelField], rawNode, isSelected), showCheckmark && checkmark];
		const attrs = nodeProps?.(rawNode);
		const node = ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", (0, vue.mergeProps)(attrs, {
			class: [
				`${clsPrefix}-base-select-option`,
				rawNode.class,
				attrs?.class,
				{
					[`${clsPrefix}-base-select-option--disabled`]: rawNode.disabled,
					[`${clsPrefix}-base-select-option--selected`]: isSelected,
					[`${clsPrefix}-base-select-option--grouped`]: isGrouped,
					[`${clsPrefix}-base-select-option--pending`]: isPending,
					[`${clsPrefix}-base-select-option--show-checkmark`]: showCheckmark
				}
			],
			style: [attrs?.style || "", rawNode.style || ""],
			onClick: require__utils_vue_merge_handlers.mergeEventHandlers([handleClick, attrs?.onClick]),
			onMouseenter: require__utils_vue_merge_handlers.mergeEventHandlers([handleMouseEnter, attrs?.onMouseenter]),
			onMousemove: require__utils_vue_merge_handlers.mergeEventHandlers([handleMouseMove, attrs?.onMousemove])
		}), [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-base-select-option__content`) }, [require_vdom.normalizeVNode(() => children)], 2)], 16, _hoisted_1));
		return rawNode.render ? rawNode.render({
			node,
			option: rawNode,
			selected: isSelected
		}) : renderOption ? renderOption({
			node,
			option: rawNode,
			selected: isSelected
		}) : node;
	}
});
//#endregion
module.exports = SelectOption_default;
