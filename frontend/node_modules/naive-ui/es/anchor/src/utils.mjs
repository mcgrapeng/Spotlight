//#region src/anchor/src/utils.ts
function getOffset(el, scrollTarget) {
  const {
    top: elTop,
    height
  } = el.getBoundingClientRect();
  return {
    top: elTop - (scrollTarget instanceof HTMLElement ? scrollTarget.getBoundingClientRect().top : 0),
    height
  };
}
//#endregion
export { getOffset };