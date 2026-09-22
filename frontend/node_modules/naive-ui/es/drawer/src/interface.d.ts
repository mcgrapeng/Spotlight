import { DrawerTheme } from "../styles/light.js";
import "../styles/index.js";
import { MergedTheme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { Ref } from "vue";
//#region src/drawer/src/interface.d.ts
type DrawerBodyInjection = Ref<HTMLElement | null> | null;
declare const drawerBodyInjectionKey: import("vue").InjectionKey<DrawerBodyInjection>;
interface DrawerInjection {
  isMountedRef: Ref<boolean>;
  mergedThemeRef: Ref<MergedTheme<DrawerTheme>>;
  mergedClsPrefixRef: Ref<string>;
  doUpdateShow: (show: boolean) => void;
  doUpdateWidth: (value: number) => void;
  doUpdateHeight: (value: number) => void;
}
declare const drawerInjectionKey: import("vue").InjectionKey<DrawerInjection>;
//#endregion
export { DrawerBodyInjection, DrawerInjection, drawerBodyInjectionKey, drawerInjectionKey };