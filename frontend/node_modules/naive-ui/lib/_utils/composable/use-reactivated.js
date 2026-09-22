Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let vue = require("vue");
//#region src/_utils/composable/use-reactivated.ts
function useReactivated(callback) {
	const isDeactivatedRef = { isDeactivated: false };
	let activateStateInitialized = false;
	(0, vue.onActivated)(() => {
		isDeactivatedRef.isDeactivated = false;
		if (!activateStateInitialized) {
			activateStateInitialized = true;
			return;
		}
		callback();
	});
	(0, vue.onDeactivated)(() => {
		isDeactivatedRef.isDeactivated = true;
		if (!activateStateInitialized) activateStateInitialized = true;
	});
	return isDeactivatedRef;
}
//#endregion
exports.useReactivated = useReactivated;
