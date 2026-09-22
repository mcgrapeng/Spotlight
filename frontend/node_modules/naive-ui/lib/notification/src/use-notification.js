Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require_notification_src_NotificationProvider = require("./NotificationProvider.js");
let vue = require("vue");
//#region src/notification/src/use-notification.ts
function useNotification() {
	const api = (0, vue.inject)(require_notification_src_NotificationProvider.notificationApiInjectionKey, null);
	if (api === null) require__utils_naive_warn.throwError("use-notification", "No outer `n-notification-provider` found.");
	return api;
}
//#endregion
exports.useNotification = useNotification;
