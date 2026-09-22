import { ref, watch } from "vue";
//#region src/input/src/utils.ts
function len(s) {
  let count = 0;
  for (const _ of s) count++;
  return count;
}
function isEmptyInputValue(value) {
  return value === "" || value == null;
}
function useCursor(inputElRef) {
  const selectionRef = ref(null);
  function recordCursor() {
    const {
      value: input
    } = inputElRef;
    if (!input?.focus) {
      reset();
      return;
    }
    const {
      selectionStart,
      selectionEnd,
      value
    } = input;
    if (selectionStart == null || selectionEnd == null) {
      reset();
      return;
    }
    selectionRef.value = {
      start: selectionStart,
      end: selectionEnd,
      beforeText: value.slice(0, selectionStart),
      afterText: value.slice(selectionEnd)
    };
  }
  function restoreCursor() {
    const {
      value: selection
    } = selectionRef;
    const {
      value: inputEl
    } = inputElRef;
    if (!selection || !inputEl) return;
    const {
      value
    } = inputEl;
    const {
      start,
      beforeText,
      afterText
    } = selection;
    let startPos = value.length;
    if (value.endsWith(afterText)) startPos = value.length - afterText.length;else if (value.startsWith(beforeText)) startPos = beforeText.length;else {
      const beforeLastChar = beforeText[start - 1];
      const newIndex = value.indexOf(beforeLastChar, start - 1);
      if (newIndex !== -1) startPos = newIndex + 1;
    }
    inputEl.setSelectionRange?.(startPos, startPos);
  }
  function reset() {
    selectionRef.value = null;
  }
  watch(inputElRef, reset);
  return {
    recordCursor,
    restoreCursor
  };
}
//#endregion
export { isEmptyInputValue, len, useCursor };