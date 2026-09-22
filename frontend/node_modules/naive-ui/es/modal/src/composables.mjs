import { throwError } from "../../_utils/naive/warn.mjs";
import { modalApiInjectionKey, modalReactiveListInjectionKey } from "./context.mjs";
import { computed, inject, nextTick, onUnmounted, ref } from "vue";
import { off, on } from "evtd";
//#region src/modal/src/composables.ts
function useModal() {
  const modal = inject(modalApiInjectionKey, null);
  if (modal === null) throwError("use-modal", "No outer <n-modal-provider /> founded.");
  return modal;
}
function useModalReactiveList() {
  const modalReactiveList = inject(modalReactiveListInjectionKey, null);
  if (modalReactiveList === null) throwError("use-modal-reactive-list", "No outer <n-modal-provider /> founded.");
  return modalReactiveList;
}
const DRAGGABLE_CLASS = "n-draggable";
function useDragModal(draggablePropsRef, options) {
  let cleanup;
  const dragXRef = ref(null);
  const dragYRef = ref(null);
  const draggableRef = computed(() => {
    return draggablePropsRef.value !== false;
  });
  const draggableClassRef = computed(() => {
    return draggableRef.value ? DRAGGABLE_CLASS : "";
  });
  const boundsToWindowRef = computed(() => {
    const draggableProps = draggablePropsRef.value;
    if (draggableProps === true || draggableProps === false) return true;else if (draggableProps) return draggableProps.bounds !== "none";else return true;
  });
  function startDrag(modal) {
    const header = modal.querySelector(`.${DRAGGABLE_CLASS}`);
    if (!header || !draggableClassRef.value) return;
    let maxMoveX = 0;
    let minMoveX = 0;
    let maxMoveY = 0;
    let minMoveY = 0;
    let prevMoveY = 0;
    let prevMoveX = 0;
    let mousedownEvent;
    let rafId = null;
    let pendingPosition = null;
    function handleMouseDown(event) {
      event.preventDefault();
      mousedownEvent = event;
      const {
        x,
        y,
        right,
        bottom
      } = modal.getBoundingClientRect();
      minMoveX = x;
      minMoveY = y;
      maxMoveX = window.innerWidth - right;
      maxMoveY = window.innerHeight - bottom;
      if (dragXRef.value !== null && dragYRef.value !== null) {
        prevMoveX = dragXRef.value;
        prevMoveY = dragYRef.value;
      } else {
        const {
          left,
          top
        } = modal.style;
        prevMoveY = +top.slice(0, -2);
        prevMoveX = +left.slice(0, -2);
      }
    }
    function updatePosition() {
      if (pendingPosition) {
        dragXRef.value = pendingPosition.x;
        dragYRef.value = pendingPosition.y;
        pendingPosition = null;
      }
      rafId = null;
    }
    function handleMouseMove(event) {
      if (!mousedownEvent) return;
      const {
        clientX: downX,
        clientY: downY
      } = mousedownEvent;
      let moveX = event.clientX - downX;
      let moveY = event.clientY - downY;
      if (boundsToWindowRef.value) {
        if (moveX > maxMoveX) moveX = maxMoveX;else if (-moveX > minMoveX) moveX = -minMoveX;
        if (moveY > maxMoveY) moveY = maxMoveY;else if (-moveY > minMoveY) moveY = -minMoveY;
      }
      pendingPosition = {
        x: moveX + prevMoveX,
        y: moveY + prevMoveY
      };
      if (!rafId) rafId = requestAnimationFrame(updatePosition);
    }
    function handleMouseUp() {
      mousedownEvent = void 0;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (pendingPosition) {
        dragXRef.value = pendingPosition.x;
        dragYRef.value = pendingPosition.y;
        pendingPosition = null;
      }
      nextTick(() => {
        options.onEnd(modal);
      });
    }
    on("mousedown", header, handleMouseDown);
    on("mousemove", window, handleMouseMove);
    on("mouseup", window, handleMouseUp);
    cleanup = () => {
      if (rafId) cancelAnimationFrame(rafId);
      off("mousedown", header, handleMouseDown);
      off("mousemove", window, handleMouseMove);
      off("mouseup", window, handleMouseUp);
    };
  }
  function stopDrag() {
    if (cleanup) {
      cleanup();
      cleanup = void 0;
    }
    dragXRef.value = null;
    dragYRef.value = null;
  }
  onUnmounted(stopDrag);
  return {
    stopDrag,
    startDrag,
    draggableRef,
    draggableClassRef,
    dragX: dragXRef,
    dragY: dragYRef
  };
}
//#endregion
export { DRAGGABLE_CLASS, useDragModal, useModal, useModalReactiveList };