Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/image/styles/dark.ts
const imageDark = {
	name: "Image",
	common: require("../../_styles/common/dark.js"),
	peers: { Tooltip: require("../../tooltip/styles/dark.js") },
	self: (vars) => {
		const { textColor2 } = vars;
		return {
			toolbarIconColor: textColor2,
			toolbarColor: "rgba(0, 0, 0, .35)",
			toolbarBoxShadow: "none",
			toolbarBorderRadius: "24px"
		};
	}
};
//#endregion
exports.imageDark = imageDark;
