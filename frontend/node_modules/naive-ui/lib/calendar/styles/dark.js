const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_button_styles_dark = require("../../button/styles/dark.js");
const require_calendar_styles_light = require("./light.js");
//#region src/calendar/styles/dark.ts
const calendarDark = {
	name: "Calendar",
	common: require__styles_common_dark,
	peers: { Button: require_button_styles_dark },
	self: require_calendar_styles_light.self
};
//#endregion
module.exports = calendarDark;
