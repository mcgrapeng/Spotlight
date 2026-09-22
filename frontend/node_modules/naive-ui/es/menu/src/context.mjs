import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
//#region src/menu/src/context.ts
const menuInjectionKey = createInjectionKey("n-menu");
const submenuInjectionKey = createInjectionKey("n-submenu");
const menuItemGroupInjectionKey = createInjectionKey("n-menu-item-group");
//#endregion
export { menuInjectionKey, menuItemGroupInjectionKey, submenuInjectionKey };