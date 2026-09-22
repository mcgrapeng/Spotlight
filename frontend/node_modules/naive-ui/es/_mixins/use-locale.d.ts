import { NLocale } from "../locales/common/enUS.js";
import { NDateLocale } from "../locales/date/enUS.js";
import { Ref } from "vue";
//#region src/_mixins/use-locale.d.ts
declare function useLocale<T extends keyof NLocale>(ns: T): {
  localeRef: Ref<NLocale[T]>;
  dateLocaleRef: Ref<NDateLocale>;
};
//#endregion
export { useLocale as default };