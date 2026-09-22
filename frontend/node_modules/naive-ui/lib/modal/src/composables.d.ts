import { ModalDraggableOptions } from "./interface.js";
import { ModalApiInjection, ModalReactive } from "./ModalProvider.js";
import { Ref } from "vue";
//#region src/modal/src/composables.d.ts
declare function useModal(): ModalApiInjection;
declare function useModalReactiveList(): Ref<readonly ModalReactive[]>;
declare const DRAGGABLE_CLASS = "n-draggable";
interface UseDragModalOptions {
  onEnd: (el: HTMLElement) => void;
}
declare function useDragModal(draggablePropsRef: Ref<boolean | ModalDraggableOptions>, options: UseDragModalOptions): {
  stopDrag: () => void;
  startDrag: (modal: HTMLElement) => void;
  draggableRef: import("vue").ComputedRef<boolean>;
  draggableClassRef: import("vue").ComputedRef<"" | "n-draggable">;
  dragX: Ref<number | null, number | null>;
  dragY: Ref<number | null, number | null>;
};
//#endregion
export { DRAGGABLE_CLASS, useDragModal, useModal, useModalReactiveList };