import { PopoverInst } from "../../popover/src/interface.js";
import { PopselectTheme } from "../styles/light.js";
import "../styles/index.js";
import { PopselectSetupProps } from "./Popselect.js";
import { MergedTheme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { Ref } from "vue";
//#region src/popselect/src/interface.d.ts
interface PopselectInjection {
  props: PopselectSetupProps;
  mergedThemeRef: Ref<MergedTheme<PopselectTheme>>;
  setShow: (value: boolean) => void;
  syncPosition: () => void;
}
type PopselectInst = PopoverInst;
declare const popselectInjectionKey: import("vue").InjectionKey<PopselectInjection>;
//#endregion
export { PopselectInjection, PopselectInst, popselectInjectionKey };