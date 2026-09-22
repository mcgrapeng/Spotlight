//#region src/float-button-group/styles/dark.ts
const floatButtonGroupDark = {
	name: "FloatButtonGroup",
	common: require("../../_styles/common/dark.js"),
	self(vars) {
		const { popoverColor, dividerColor, borderRadius } = vars;
		return {
			color: popoverColor,
			buttonBorderColor: dividerColor,
			borderRadiusSquare: borderRadius,
			boxShadow: "0 2px 8px 0px rgba(0, 0, 0, .12)"
		};
	}
};
//#endregion
module.exports = floatButtonGroupDark;
