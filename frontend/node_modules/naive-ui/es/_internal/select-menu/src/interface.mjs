import { createInjectionKey } from "../../../_utils/vue/create-injection-key.mjs";
//#region src/_internal/select-menu/src/interface.ts
const internalSelectionMenuInjectionKey = createInjectionKey("n-internal-select-menu");
const internalSelectionMenuBodyInjectionKey = createInjectionKey("n-internal-select-menu-body");
//#endregion
export { internalSelectionMenuBodyInjectionKey, internalSelectionMenuInjectionKey };