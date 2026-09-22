let vue = require("vue");
//#region src/dropdown/src/DropdownRenderOption.tsx
var DropdownRenderOption_default = (0, vue.defineComponent)({
	name: "DropdownRenderOption",
	props: { tmNode: {
		type: Object,
		required: true
	} },
	render() {
		const { rawNode: { render, props } } = this.tmNode;
		return (0, vue.h)("div", props, [render?.()]);
	}
});
//#endregion
module.exports = DropdownRenderOption_default;
