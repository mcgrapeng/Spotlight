Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/layout/src/interface.ts
const layoutSiderInjectionKey = require("../../_utils/vue/create-injection-key.js").createInjectionKey("n-layout-sider");
const positionProp = {
	type: String,
	default: "static"
};
//#endregion
exports.layoutSiderInjectionKey = layoutSiderInjectionKey;
exports.positionProp = positionProp;
