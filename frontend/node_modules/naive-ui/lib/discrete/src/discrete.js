Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_dialog_src_DialogProvider = require("../../dialog/src/DialogProvider.js");
const require_loading_bar_src_LoadingBarProvider = require("../../loading-bar/src/LoadingBarProvider.js");
const require_message_src_MessageProvider = require("../../message/src/MessageProvider.js");
const require_modal_src_ModalProvider = require("../../modal/src/ModalProvider.js");
const require_notification_src_NotificationProvider = require("../../notification/src/NotificationProvider.js");
const require_discrete_src_discreteApp = require("./discreteApp.js");
//#region src/discrete/src/discrete.ts
function createDiscreteApi(includes, { configProviderProps, messageProviderProps, dialogProviderProps, notificationProviderProps, loadingBarProviderProps, modalProviderProps } = {}) {
	const providersAndProps = [];
	includes.forEach((type) => {
		switch (type) {
			case "message":
				providersAndProps.push({
					type,
					Provider: require_message_src_MessageProvider.default,
					props: messageProviderProps
				});
				break;
			case "notification":
				providersAndProps.push({
					type,
					Provider: require_notification_src_NotificationProvider.default,
					props: notificationProviderProps
				});
				break;
			case "dialog":
				providersAndProps.push({
					type,
					Provider: require_dialog_src_DialogProvider.NDialogProvider,
					props: dialogProviderProps
				});
				break;
			case "loadingBar":
				providersAndProps.push({
					type,
					Provider: require_loading_bar_src_LoadingBarProvider.default,
					props: loadingBarProviderProps
				});
				break;
			case "modal": providersAndProps.push({
				type,
				Provider: require_modal_src_ModalProvider.NModalProvider,
				props: modalProviderProps
			});
		}
	});
	return require_discrete_src_discreteApp.createDiscreteApp({
		providersAndProps,
		configProviderProps
	});
}
//#endregion
exports.createDiscreteApi = createDiscreteApi;
