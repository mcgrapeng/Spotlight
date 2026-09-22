Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require_components = require("./components.js");
//#region src/preset.ts
const naive = require("./create.js")({ components: Object.keys(require_components.components_exports).map((key) => require_components.components_exports[key]) });
const install = naive.install;
//#endregion
exports.default = naive;
exports.install = install;
