const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_ChevronLeft = require("../../_internal/icons/ChevronLeft.js");
const require__internal_icons_ChevronRight = require("../../_internal/icons/ChevronRight.js");
const require_button_src_Button = require("../../button/src/Button.js");
let vue = require("vue");
//#region src/tabs/src/TabsButton.tsx
var TabsButton_default = (0, vue.defineComponent)({
	name: "TabsButton",
	props: {
		type: {
			type: String,
			default: "next"
		},
		mergedClsPrefix: {
			type: String,
			required: true
		},
		vertical: Boolean,
		disabled: Boolean,
		rtl: Boolean,
		theme: Object,
		themeOverrides: Object,
		onClick: Function
	},
	setup(props) {
		const handleClick = () => {
			if (!props.disabled) props.onClick?.(props.type);
		};
		return { handleClick };
	},
	render() {
		const { mergedClsPrefix, disabled, type, vertical, rtl, theme, themeOverrides, handleClick } = this;
		const isNext = type === "next";
		const showRightIcon = vertical ? isNext : rtl ? !isNext : isNext;
		return (0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
			text: true,
			disabled,
			size: "small",
			theme,
			themeOverrides,
			onClick: handleClick,
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-tabs-scroll-button`,
				!vertical && type === "prev" && `${mergedClsPrefix}-tabs-scroll-button--start`,
				!vertical && type === "next" && `${mergedClsPrefix}-tabs-scroll-button--end`,
				vertical && type === "prev" && `${mergedClsPrefix}-tabs-scroll-button--up`,
				vertical && type === "next" && `${mergedClsPrefix}-tabs-scroll-button--down`
			])
		}, { icon: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			clsPrefix: mergedClsPrefix,
			style: (0, vue.normalizeStyle)(vertical ? { transform: "rotate(90deg)" } : void 0)
		}, { default: () => showRightIcon ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ChevronRight, { key: 1 })) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ChevronLeft, { key: 2 })) }, 1032, ["clsPrefix", "style"])) }, 1032, [
			"disabled",
			"theme",
			"themeOverrides",
			"onClick",
			"class"
		]);
	}
});
//#endregion
module.exports = TabsButton_default;
