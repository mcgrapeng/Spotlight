import { ModalTheme } from "../styles/light.js";
import "../styles/index.js";
import { MergedTheme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ComponentPublicInstance, Ref } from "vue";
//#region src/modal/src/interface.d.ts
type ModalBodyInjection = Ref<HTMLElement | ComponentPublicInstance | null> | null;
declare const modalBodyInjectionKey: import("vue").InjectionKey<ModalBodyInjection>;
interface ModalProviderInjection {
  clickedRef: Ref<boolean>;
  clickedPositionRef: Ref<{
    x: number;
    y: number;
  } | null>;
}
declare const modalProviderInjectionKey: import("vue").InjectionKey<ModalProviderInjection>;
interface ModalInjection {
  getMousePosition: () => {
    x: number;
    y: number;
  } | null;
  mergedClsPrefixRef: Ref<string>;
  mergedThemeRef: Ref<MergedTheme<ModalTheme>>;
  isMountedRef: Ref<boolean>;
  appearRef: Ref<boolean | undefined>;
  transformOriginRef: Ref<'mouse' | 'center'>;
}
declare const modalInjectionKey: import("vue").InjectionKey<ModalInjection>;
interface ModalDraggableOptions {
  /**
   * If set to 'none', the modal's position will not be bounded to the window.
   */
  bounds?: 'none';
}
//#endregion
export { ModalBodyInjection, ModalDraggableOptions, ModalInjection, ModalProviderInjection, modalBodyInjectionKey, modalInjectionKey, modalProviderInjectionKey };