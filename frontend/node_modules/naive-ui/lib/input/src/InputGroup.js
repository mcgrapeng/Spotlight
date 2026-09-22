Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_style = require("../../_mixins/use-style.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_input_src_styles_input_group_cssr = require("./styles/input-group.cssr.js");
let vue = require("vue");
//#region src/input/src/InputGroup.tsx
const inputGroupProps = {};
var InputGroup_default = (0, vue.defineComponent)({
	name: "InputGroup",
	props: inputGroupProps,
	setup(props) {
		const { mergedClsPrefixRef } = require__mixins_use_config.default(props);
		require__mixins_use_style("-input-group", require_input_src_styles_input_group_cssr, mergedClsPrefixRef);
		return { mergedClsPrefix: mergedClsPrefixRef };
	},
	render() {
		const { mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-input-group`) }, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 2);
	}
});
//#endregion
exports.default = InputGroup_default;
exports.inputGroupProps = inputGroupProps;
