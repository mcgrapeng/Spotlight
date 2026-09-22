const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_loading_src_Loading = require("../../_internal/loading/src/Loading.js");
let vue = require("vue");
//#region src/log/src/LogLoader.tsx
var LogLoader_default = (0, vue.defineComponent)({
	name: "LogLoader",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		spinProps: Object
	},
	setup() {
		return { locale: require__mixins_use_locale("Log").localeRef };
	},
	render() {
		const { clsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-log-loader`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_loading_src_Loading.default, (0, vue.mergeProps)({
			clsPrefix,
			strokeWidth: 24,
			scale: .85
		}, this.spinProps), null, 16, ["clsPrefix"])), (0, vue.createElementVNode)("span", { class: require_vdom.normalizeClass(`${clsPrefix}-log-loader__content`) }, [require_vdom.normalizeVNode(() => this.locale.loading)], 2)], 2);
	}
});
//#endregion
module.exports = LogLoader_default;
