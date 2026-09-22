import { DropdownInjection } from "./Dropdown.js";
import { NDropdownMenuInjection } from "./DropdownMenu.js";
import { NDropdownOptionInjection } from "./DropdownOption.js";
//#region src/dropdown/src/context.d.ts
declare const dropdownMenuInjectionKey: import("vue").InjectionKey<NDropdownMenuInjection>;
declare const dropdownInjectionKey: import("vue").InjectionKey<DropdownInjection>;
declare const dropdownOptionInjectionKey: import("vue").InjectionKey<NDropdownOptionInjection>;
//#endregion
export { dropdownInjectionKey, dropdownMenuInjectionKey, dropdownOptionInjectionKey };