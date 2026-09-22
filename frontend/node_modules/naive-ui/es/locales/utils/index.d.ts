import { NLocale } from "../common/enUS.js";
//#region src/locales/utils/index.d.ts
type NPartialLocale = { [key in keyof NLocale]+?: { [childKey in keyof NLocale[key]]+?: NLocale[key][childKey]; }; };
declare function createLocale(locale: NLocale): NLocale;
declare function createLocale(locale: NPartialLocale, fallbackLocale: NLocale): NLocale;
//#endregion
export { NPartialLocale, createLocale };