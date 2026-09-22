Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let lodash_es = require("lodash");
//#region src/locales/utils/index.ts
function createLocale(locale, fallbackLocale) {
	return (0, lodash_es.merge)({}, fallbackLocale, locale);
}
//#endregion
exports.createLocale = createLocale;
