const require__mixins_use_style = require("../../../_mixins/use-style.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../icon/src/Icon.js");
const require__internal_icons_Close = require("../../icons/Close.js");
const require__internal_close_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/_internal/close/src/Close.tsx
var Close_default = (0, vue.defineComponent)({
	name: "BaseClose",
	props: {
		isButtonTag: {
			type: Boolean,
			default: true
		},
		clsPrefix: {
			type: String,
			required: true
		},
		disabled: {
			type: Boolean,
			default: void 0
		},
		focusable: {
			type: Boolean,
			default: true
		},
		round: Boolean,
		onClick: Function,
		absolute: Boolean
	},
	setup(props) {
		require__mixins_use_style("-base-close", require__internal_close_src_styles_index_cssr, (0, vue.toRef)(props, "clsPrefix"));
		return () => {
			const { clsPrefix, disabled, absolute, round, isButtonTag } = props;
			const Tag = isButtonTag ? "button" : "div";
			return (() => {
				const _cache = require_vdom.createVNodeCache("b5bdc9fe09f5ae00");
				return (0, vue.openBlock)(), (0, vue.createBlock)(Tag, {
					type: isButtonTag ? "button" : void 0,
					tabindex: disabled || !props.focusable ? -1 : 0,
					"aria-disabled": disabled,
					"aria-label": "close",
					role: isButtonTag ? void 0 : "button",
					disabled,
					class: require_vdom.normalizeClass([
						`${clsPrefix}-base-close`,
						absolute && `${clsPrefix}-base-close--absolute`,
						disabled && `${clsPrefix}-base-close--disabled`,
						round && `${clsPrefix}-base-close--round`
					]),
					onMousedown: _cache[0] || (_cache[0] = (e) => {
						if (!props.focusable) e.preventDefault();
					}),
					onClick: props.onClick
				}, {
					default: (0, vue.withCtx)(() => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Close)) }, 1032, ["clsPrefix"]))]),
					_: 2
				}, 1032, [
					"type",
					"tabindex",
					"aria-disabled",
					"role",
					"disabled",
					"class",
					"onClick"
				]);
			})();
		};
	}
});
//#endregion
module.exports = Close_default;
