//#region src/affix/src/utils.d.ts
type ScrollTarget = Window | Document | HTMLElement;
declare function getScrollTop(target: ScrollTarget): number;
declare function getRect(target: ScrollTarget): {
  top: number;
  bottom: number;
};
//#endregion
export { ScrollTarget, getRect, getScrollTop };