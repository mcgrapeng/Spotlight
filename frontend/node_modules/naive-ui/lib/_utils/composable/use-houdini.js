Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_env_is_browser = require("../env/is-browser.js");
//#region src/_utils/composable/use-houdini.ts
let houdiniRegistered = false;
function useHoudini() {
	if (!require__utils_env_is_browser.isBrowser) return;
	if (!window.CSS) return;
	if (!houdiniRegistered) {
		houdiniRegistered = true;
		if ("registerProperty" in window?.CSS) try {
			CSS.registerProperty({
				name: "--n-color-start",
				syntax: "<color>",
				inherits: false,
				initialValue: "#0000"
			});
			CSS.registerProperty({
				name: "--n-color-end",
				syntax: "<color>",
				inherits: false,
				initialValue: "#0000"
			});
		} catch {}
	}
}
//#endregion
exports.useHoudini = useHoudini;
