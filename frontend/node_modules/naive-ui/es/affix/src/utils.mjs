//#region src/affix/src/utils.ts
function getScrollTop(target) {
  return target instanceof HTMLElement ? target.scrollTop : window.scrollY;
}
function getRect(target) {
  return target instanceof HTMLElement ? target.getBoundingClientRect() : {
    top: 0,
    bottom: window.innerHeight
  };
}
//#endregion
export { getRect, getScrollTop };