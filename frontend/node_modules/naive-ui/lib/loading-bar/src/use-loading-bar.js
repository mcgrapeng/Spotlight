Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require_loading_bar_src_context = require("./context.js");
let vue = require("vue");
//#region src/loading-bar/src/use-loading-bar.ts
function useLoadingBar() {
	const loadingBar = (0, vue.inject)(require_loading_bar_src_context.loadingBarApiInjectionKey, null);
	if (loadingBar === null) require__utils_naive_warn.throwError("use-loading-bar", "No outer <n-loading-bar-provider /> founded.");
	return loadingBar;
}
//#endregion
exports.useLoadingBar = useLoadingBar;
