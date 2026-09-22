import { merge } from "lodash-es";
//#region src/locales/utils/index.ts
function createLocale(locale, fallbackLocale) {
  return merge({}, fallbackLocale, locale);
}
//#endregion
export { createLocale };