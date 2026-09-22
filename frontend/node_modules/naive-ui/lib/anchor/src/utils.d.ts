//#region src/anchor/src/utils.d.ts
type OffsetTarget = Window | Document | HTMLElement;
declare function getOffset(el: HTMLElement, scrollTarget: OffsetTarget): {
  top: number;
  height: number;
};
//#endregion
export { OffsetTarget, getOffset };