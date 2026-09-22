Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_env_is_browser = require("../../_utils/env/is-browser.js");
//#region src/space/src/utils.ts
let supportFlexGap;
function ensureSupportFlexGap() {
	if (!require__utils_env_is_browser.isBrowser) return true;
	if (supportFlexGap === void 0) {
		const flex = document.createElement("div");
		flex.style.display = "flex";
		flex.style.flexDirection = "column";
		flex.style.rowGap = "1px";
		flex.appendChild(document.createElement("div"));
		flex.appendChild(document.createElement("div"));
		document.body.appendChild(flex);
		const isSupported = flex.scrollHeight === 1;
		document.body.removeChild(flex);
		return supportFlexGap = isSupported;
	}
	return supportFlexGap;
}
//#endregion
exports.ensureSupportFlexGap = ensureSupportFlexGap;
