import { cloneVNode } from "vue";
//#region src/carousel/src/utils/duplicatedLogic.ts
function addDuplicateSlides(slides) {
  const {
    length
  } = slides;
  if (length > 1) {
    slides.push(duplicateSlide(slides[0], 0, "append"));
    slides.unshift(duplicateSlide(slides[length - 1], length - 1, "prepend"));
    return slides;
  }
  return slides;
}
function duplicateSlide(child, index, position) {
  return cloneVNode(child, {
    key: `carousel-item-duplicate-${index}-${position}`
  });
}
function getDisplayIndex(current, length, duplicatedable) {
  if (length === 1) return 0;
  return !duplicatedable ? current : current === 0 ? length - 3 : current === length - 1 ? 0 : current - 1;
}
function getRealIndex(current, duplicatedable) {
  return !duplicatedable ? current : current + 1;
}
function getPrevIndex(current, length, duplicatedable) {
  if (current < 0) return null;
  return current === 0 ? duplicatedable ? length - 1 : null : current - 1;
}
function getNextIndex(current, length, duplicatedable) {
  if (current > length - 1) return null;
  return current === length - 1 ? duplicatedable ? 0 : null : current + 1;
}
function getDisplayTotalView(total, duplicatedable) {
  return duplicatedable && total > 3 ? total - 2 : total;
}
//#endregion
export { addDuplicateSlides, getDisplayIndex, getDisplayTotalView, getNextIndex, getPrevIndex, getRealIndex };