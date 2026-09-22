import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
//#region src/dropdown/src/context.ts
const dropdownMenuInjectionKey = createInjectionKey("n-dropdown-menu");
const dropdownInjectionKey = createInjectionKey("n-dropdown");
const dropdownOptionInjectionKey = createInjectionKey("n-dropdown-option");
//#endregion
export { dropdownInjectionKey, dropdownMenuInjectionKey, dropdownOptionInjectionKey };