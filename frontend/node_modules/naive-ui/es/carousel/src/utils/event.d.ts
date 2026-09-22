//#region src/carousel/src/utils/event.d.ts
declare function isTouchEvent(e: MouseEvent | TouchEvent): e is TouchEvent;
//#endregion
export { isTouchEvent };