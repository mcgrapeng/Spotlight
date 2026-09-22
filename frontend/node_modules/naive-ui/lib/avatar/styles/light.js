Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
let seemly = require("seemly");
//#region src/avatar/styles/light.ts
function self(vars) {
	const { borderRadius, avatarColor, cardColor, fontSize, heightTiny, heightSmall, heightMedium, heightLarge, heightHuge, modalColor, popoverColor } = vars;
	return {
		borderRadius,
		fontSize,
		border: `2px solid ${cardColor}`,
		heightTiny,
		heightSmall,
		heightMedium,
		heightLarge,
		heightHuge,
		color: (0, seemly.composite)(cardColor, avatarColor),
		colorModal: (0, seemly.composite)(modalColor, avatarColor),
		colorPopover: (0, seemly.composite)(popoverColor, avatarColor)
	};
}
const avatarLight = {
	name: "Avatar",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = avatarLight;
exports.self = self;
