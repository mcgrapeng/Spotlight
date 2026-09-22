import { MenuInjection, MenuOptionGroupInjection, SubmenuInjection } from "./use-menu-child.js";
//#region src/menu/src/context.d.ts
declare const menuInjectionKey: import("vue").InjectionKey<MenuInjection>;
declare const submenuInjectionKey: import("vue").InjectionKey<SubmenuInjection | null>;
declare const menuItemGroupInjectionKey: import("vue").InjectionKey<MenuOptionGroupInjection | null>;
//#endregion
export { menuInjectionKey, menuItemGroupInjectionKey, submenuInjectionKey };