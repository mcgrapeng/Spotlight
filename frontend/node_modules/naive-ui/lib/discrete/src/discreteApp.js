Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_env_is_browser = require("../../_utils/env/is-browser.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require_config_provider_src_ConfigProvider = require("../../config-provider/src/ConfigProvider.js");
const require_dialog_src_composables = require("../../dialog/src/composables.js");
const require_modal_src_composables = require("../../modal/src/composables.js");
const require_loading_bar_src_use_loading_bar = require("../../loading-bar/src/use-loading-bar.js");
const require_message_src_use_message = require("../../message/src/use-message.js");
const require_notification_src_use_notification = require("../../notification/src/use-notification.js");
const require_discrete_src_InjectionExtractor = require("./InjectionExtractor.js");
let vue = require("vue");
//#region src/discrete/src/discreteApp.ts
const injectionFactoryMap = {
	message: require_message_src_use_message.useMessage,
	notification: require_notification_src_use_notification.useNotification,
	loadingBar: require_loading_bar_src_use_loading_bar.useLoadingBar,
	dialog: require_dialog_src_composables.useDialog,
	modal: require_modal_src_composables.useModal
};
function createDiscreteApp({ providersAndProps, configProviderProps }) {
	let app = (0, vue.createApp)(App);
	const extractedApi = { app };
	function App() {
		return (0, vue.h)(require_config_provider_src_ConfigProvider.default, (0, vue.unref)(configProviderProps), { default: () => providersAndProps.map(({ type, Provider, props }) => {
			return (0, vue.h)(Provider, (0, vue.unref)(props), { default: () => (0, vue.h)(require_discrete_src_InjectionExtractor.NInjectionExtractor, { onSetup: () => extractedApi[type] = injectionFactoryMap[type]() }) });
		}) });
	}
	let hostEl;
	if (require__utils_env_is_browser.isBrowser) {
		hostEl = document.createElement("div");
		document.body.appendChild(hostEl);
		app.mount(hostEl);
	}
	const unmount = () => {
		if (app === null || hostEl === null) {
			require__utils_naive_warn.warn("discrete", "unmount call no need because discrete app has been unmounted");
			return;
		}
		app.unmount();
		hostEl.parentNode?.removeChild(hostEl);
		hostEl = null;
		app = null;
	};
	return {
		unmount,
		...extractedApi
	};
}
//#endregion
exports.createDiscreteApp = createDiscreteApp;
