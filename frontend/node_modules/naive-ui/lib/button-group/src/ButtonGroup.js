Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_style = require("../../_mixins/use-style.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_button_group_src_context = require("./context.js");
const require_button_group_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/button-group/src/ButtonGroup.tsx
const buttonGroupProps = {
	size: String,
	vertical: Boolean
};
var ButtonGroup_default = (0, vue.defineComponent)({
	name: "ButtonGroup",
	props: buttonGroupProps,
	setup(props) {
		const { mergedClsPrefixRef, mergedRtlRef } = require__mixins_use_config.default(props);
		require__mixins_use_style("-button-group", require_button_group_src_styles_index_cssr.default, mergedClsPrefixRef);
		(0, vue.provide)(require_button_group_src_context.buttonGroupInjectionKey, props);
		return {
			rtlEnabled: require__mixins_use_rtl.useRtl("ButtonGroup", mergedRtlRef, mergedClsPrefixRef),
			mergedClsPrefix: mergedClsPrefixRef
		};
	},
	render() {
		const { mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-button-group`,
				this.rtlEnabled && `${mergedClsPrefix}-button-group--rtl`,
				this.vertical && `${mergedClsPrefix}-button-group--vertical`
			]),
			role: "group"
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 2);
	}
});
//#endregion
exports.buttonGroupProps = buttonGroupProps;
exports.default = ButtonGroup_default;
