const require__styles_common_dark = require("../../_styles/common/dark.js");
const require__internal_scrollbar_styles_dark = require("../../_internal/scrollbar/styles/dark.js");
const require_notification_styles_light = require("./light.js");
//#region src/notification/styles/dark.ts
const notificationDark = {
	name: "Notification",
	common: require__styles_common_dark,
	peers: { Scrollbar: require__internal_scrollbar_styles_dark },
	self: require_notification_styles_light.self
};
//#endregion
module.exports = notificationDark;
