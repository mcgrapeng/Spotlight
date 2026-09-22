Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_env_is_browser = require("../env/is-browser.js");
let vue = require("vue");
//#region src/_utils/composable/use-browser-location.ts
function useBrowserLocation(customWindow = require__utils_env_is_browser.isBrowser ? window : null) {
	const getWindowLocation = () => {
		const { hash, host, hostname, href, origin, pathname, port, protocol, search } = customWindow?.location || {};
		return {
			hash,
			host,
			hostname,
			href,
			origin,
			pathname,
			port,
			protocol,
			search
		};
	};
	const locationState = (0, vue.ref)(getWindowLocation());
	const updateLocation = () => {
		locationState.value = getWindowLocation();
	};
	(0, vue.onMounted)(() => {
		if (customWindow) {
			customWindow.addEventListener("popstate", updateLocation);
			customWindow.addEventListener("hashchange", updateLocation);
		}
	});
	(0, vue.onUnmounted)(() => {
		if (customWindow) {
			customWindow.removeEventListener("popstate", updateLocation);
			customWindow.removeEventListener("hashchange", updateLocation);
		}
	});
	return locationState;
}
//#endregion
exports.useBrowserLocation = useBrowserLocation;
