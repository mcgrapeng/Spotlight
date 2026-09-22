//#region src/mention/styles/dark.ts
const listDark = {
	name: "Mention",
	common: require("../../_styles/common/dark.js"),
	peers: {
		InternalSelectMenu: require("../../_internal/select-menu/styles/dark.js"),
		Input: require("../../input/styles/dark.js")
	},
	self(vars) {
		const { boxShadow2 } = vars;
		return { menuBoxShadow: boxShadow2 };
	}
};
//#endregion
module.exports = listDark;
