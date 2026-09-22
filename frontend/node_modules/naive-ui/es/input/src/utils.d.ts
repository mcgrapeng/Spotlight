import { Ref } from "vue";
//#region src/input/src/utils.d.ts
declare function len(s: string): number;
declare function isEmptyInputValue(value: unknown): boolean;
interface UseCursorControl {
  recordCursor: () => void;
  restoreCursor: () => void;
}
declare function useCursor(inputElRef: Ref<HTMLInputElement | HTMLTextAreaElement | null>): UseCursorControl;
//#endregion
export { UseCursorControl, isEmptyInputValue, len, useCursor };