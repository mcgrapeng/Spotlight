const require__utils_vue_render = require("../../_utils/vue/render.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_ChevronDownFilled = require("../../_internal/icons/ChevronDownFilled.js");
const require_menu_src_context = require("./context.js");
let vue = require("vue");
//#region src/menu/src/MenuOptionContent.tsx
const _hoisted_1 = ["onClick"];
var MenuOptionContent_default = (0, vue.defineComponent)({
	name: "MenuOptionContent",
	props: {
		collapsed: Boolean,
		disabled: Boolean,
		title: [String, Function],
		icon: Function,
		extra: [String, Function],
		showArrow: Boolean,
		childActive: Boolean,
		hover: Boolean,
		paddingLeft: Number,
		selected: Boolean,
		maxIconSize: {
			type: Number,
			required: true
		},
		activeIconSize: {
			type: Number,
			required: true
		},
		iconMarginRight: {
			type: Number,
			required: true
		},
		clsPrefix: {
			type: String,
			required: true
		},
		onClick: Function,
		tmNode: {
			type: Object,
			required: true
		},
		isEllipsisPlaceholder: Boolean
	},
	setup(props) {
		const { props: menuProps } = (0, vue.inject)(require_menu_src_context.menuInjectionKey);
		return {
			menuProps,
			style: (0, vue.computed)(() => {
				const { paddingLeft } = props;
				return { paddingLeft: paddingLeft && `${paddingLeft}px` };
			}),
			iconStyle: (0, vue.computed)(() => {
				const { maxIconSize, activeIconSize, iconMarginRight } = props;
				return {
					width: `${maxIconSize}px`,
					height: `${maxIconSize}px`,
					fontSize: `${activeIconSize}px`,
					marginRight: `${iconMarginRight}px`
				};
			})
		};
	},
	render() {
		const { clsPrefix, tmNode, menuProps: { renderIcon, renderLabel, renderExtra, expandIcon } } = this;
		const icon = renderIcon ? renderIcon(tmNode.rawNode) : require__utils_vue_render.render(this.icon);
		return (() => {
			const _cache = require_vdom.createVNodeCache("7bb10afc6caf8fa4");
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				onClick: (e) => {
					this.onClick?.(e);
				},
				role: "none",
				class: require_vdom.normalizeClass([`${clsPrefix}-menu-item-content`, {
					[`${clsPrefix}-menu-item-content--selected`]: this.selected,
					[`${clsPrefix}-menu-item-content--collapsed`]: this.collapsed,
					[`${clsPrefix}-menu-item-content--child-active`]: this.childActive,
					[`${clsPrefix}-menu-item-content--disabled`]: this.disabled,
					[`${clsPrefix}-menu-item-content--hover`]: this.hover
				}]),
				style: (0, vue.normalizeStyle)(this.style)
			}, [
				require_vdom.normalizeVNode(() => icon && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					class: require_vdom.normalizeClass(`${clsPrefix}-menu-item-content__icon`),
					style: (0, vue.normalizeStyle)(this.iconStyle),
					role: "none"
				}, [require_vdom.normalizeVNode(() => [icon])], 6))),
				(0, vue.createElementVNode)("div", {
					class: require_vdom.normalizeClass(`${clsPrefix}-menu-item-content-header`),
					role: "none"
				}, [this.isEllipsisPlaceholder ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => this.title)], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [renderLabel ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderLabel(tmNode.rawNode))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => require__utils_vue_render.render(this.title))], 64))], 64)), this.extra || renderExtra ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
					key: 2,
					class: require_vdom.normalizeClass(`${clsPrefix}-menu-item-content-header__extra`)
				}, [_cache[0] || (_cache[0] = require_vdom.normalizeVNode(" ", -1)), renderExtra ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderExtra(tmNode.rawNode))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => require__utils_vue_render.render(this.extra))], 64))], 2)) : require_vdom.normalizeVNode(() => null)], 2),
				this.showArrow ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
					key: 0,
					ariaHidden: true,
					class: require_vdom.normalizeClass(`${clsPrefix}-menu-item-content__arrow`),
					clsPrefix
				}, { default: () => expandIcon ? expandIcon(tmNode.rawNode) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ChevronDownFilled, { key: 1 })) }, 1032, ["class", "clsPrefix"])) : require_vdom.normalizeVNode(() => null)
			], 14, _hoisted_1);
		})();
	}
});
//#endregion
module.exports = MenuOptionContent_default;
