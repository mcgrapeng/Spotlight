import { Ref } from "vue";
//#region src/_utils/composable/use-browser-location.d.ts
interface IWindowLocation {
  hash?: string;
  host?: string;
  hostname?: string;
  href?: string;
  origin?: string;
  pathname?: string;
  port?: string;
  protocol?: string;
  search?: string;
}
declare function useBrowserLocation(customWindow?: (Window & typeof globalThis) | null): Ref<IWindowLocation>;
//#endregion
export { IWindowLocation, useBrowserLocation };