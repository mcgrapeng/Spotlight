import { Locale } from "date-fns";
//#region src/locales/date/enUS.d.ts
interface NDateLocale {
  name: string;
  locale: Locale;
}
declare const dateEnUs: NDateLocale;
//#endregion
export { type NDateLocale, dateEnUs as default };