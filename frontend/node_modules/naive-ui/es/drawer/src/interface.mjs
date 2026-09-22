import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
//#region src/drawer/src/interface.ts
const drawerBodyInjectionKey = createInjectionKey("n-drawer-body");
const drawerInjectionKey = createInjectionKey("n-drawer");
//#endregion
export { drawerBodyInjectionKey, drawerInjectionKey };