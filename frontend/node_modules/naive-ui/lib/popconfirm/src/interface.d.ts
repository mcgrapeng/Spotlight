import { PopoverInst } from "../../popover/src/interface.js";
import "../../popover/index.js";
import { PopconfirmTheme } from "../styles/light.js";
import "../styles/index.js";
import { PopconfirmSetupProps } from "./Popconfirm.js";
import { MergedTheme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { Ref } from "vue";
//#region src/popconfirm/src/interface.d.ts
type PopconfirmInst = PopoverInst;
interface PopconfirmInjection {
  mergedThemeRef: Ref<MergedTheme<PopconfirmTheme>>;
  mergedClsPrefixRef: Ref<string>;
  props: PopconfirmSetupProps;
}
declare const popconfirmInjectionKey: import("vue").InjectionKey<PopconfirmInjection>;
//#endregion
export { PopconfirmInjection, PopconfirmInst, popconfirmInjectionKey };