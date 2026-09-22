import { isBrowser } from "../../_utils/env/is-browser.mjs";
//#region src/mention/src/utils.ts
/**
* The original package is https://www.npmjs.com/package/textarea-caret-ts
* The original file is https://github.com/TheRealSyler/textarea-caret-position/blob/master/index.ts
*
* Here I modified it to make it works when input is scrolled.
*/
/**
* Returns the Absolute (relative to the inner window size) position of the caret in the given element.
* @param element Input (has to be type='text') or Text Area.
*/
function getAbsolutePosition(element) {
  const caretRelPost = getRelativePosition(element);
  return {
    left: window.scrollX + element.getBoundingClientRect().left + caretRelPost.left,
    top: window.scrollY + element.getBoundingClientRect().top + caretRelPost.top,
    absolute: true,
    height: caretRelPost.height
  };
}
/**
* Returns the relative position of the caret in the given element.
* @param element Input (has to be type='text') or Text Area.
*/
function getRelativePosition(element, options = {
  debug: false,
  useSelectionEnd: false,
  checkWidthOverflow: true
}) {
  const selectionStart = element.selectionStart !== null ? element.selectionStart : 0;
  const selectionEnd = element.selectionEnd !== null ? element.selectionEnd : 0;
  const position = options.useSelectionEnd ? selectionEnd : selectionStart;
  const properties = ["direction", "boxSizing", "width", "height", "overflowX", "overflowY", "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth", "borderStyle", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "fontStyle", "fontVariant", "fontWeight", "fontStretch", "fontSize", "fontSizeAdjust", "lineHeight", "fontFamily", "textAlign", "textTransform", "textIndent", "textDecoration", "letterSpacing", "wordSpacing", "tabSize", "MozTabSize"];
  const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
  if (!isBrowser) throw new Error("textarea-caret-position#getCaretPosition should only be called in a browser");
  const debug = options?.debug;
  if (debug) {
    const el = document.querySelector("#input-textarea-caret-position-mirror-div");
    if (el?.parentNode) el.parentNode.removeChild(el);
  }
  const div = document.createElement("div");
  div.id = "input-textarea-caret-position-mirror-div";
  document.body.appendChild(div);
  const style = div.style;
  const computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle;
  const isInput = element.nodeName === "INPUT";
  style.whiteSpace = isInput ? "nowrap" : "pre-wrap";
  if (!isInput) style.wordWrap = "break-word";
  style.position = "absolute";
  if (!debug) style.visibility = "hidden";
  properties.forEach(prop => {
    if (isInput && prop === "lineHeight") {
      if (computed.boxSizing === "border-box") {
        const height = Number.parseInt(computed.height);
        const outerHeight = Number.parseInt(computed.paddingTop) + Number.parseInt(computed.paddingBottom) + Number.parseInt(computed.borderTopWidth) + Number.parseInt(computed.borderBottomWidth);
        const targetHeight = outerHeight + Number.parseInt(computed.lineHeight);
        if (height > targetHeight) style.lineHeight = `${height - outerHeight}px`;else if (height === targetHeight) style.lineHeight = computed.lineHeight;else style.lineHeight = "0";
      } else style.lineHeight = computed.height;
    } else style[prop] = computed[prop];
  });
  if (isFirefox) {
    if (element.scrollHeight > Number.parseInt(computed.height)) style.overflowY = "scroll";
  } else style.overflow = "hidden";
  div.textContent = element.value.substring(0, position);
  if (isInput && div.textContent) div.textContent = div.textContent.replace(/\s/g, "\xA0");
  const span = document.createElement("span");
  span.textContent = element.value.substring(position) || ".";
  span.style.position = "relative";
  span.style.left = `${-element.scrollLeft}px`;
  span.style.top = `${-element.scrollTop}px`;
  div.appendChild(span);
  const relativePosition = {
    top: span.offsetTop + Number.parseInt(computed.borderTopWidth),
    left: span.offsetLeft + Number.parseInt(computed.borderLeftWidth),
    absolute: false,
    height: Number.parseInt(computed.fontSize) * 1.5
  };
  if (debug) span.style.backgroundColor = "#aaa";else document.body.removeChild(div);
  if (relativePosition.left >= element.clientWidth && options.checkWidthOverflow) relativePosition.left = element.clientWidth;
  return relativePosition;
}
/**
* sets the top and left css style of the element based on the absolute position of the caretElements caret,
* @param offset offsets the position.
* @param detectBoundary offsets the position if the position would be outside the window.
* @param returnOnly if true the element position wont be set.
*/
function setElementPositionBasedOnCaret(element, caretElement, offset = {
  top: 0,
  left: 0
}, margin = 2, detectBoundary = true, returnOnly = false) {
  const pos = getAbsolutePosition(caretElement);
  if (detectBoundary) {
    pos.left = pos.left + (element.clientWidth + margin) + offset.left > window.scrollX + window.innerWidth ? pos.left = window.scrollX + window.innerWidth - (element.clientWidth + margin) : pos.left += offset.left;
    pos.top = pos.top + (element.clientWidth + margin) + offset.top > window.scrollY + window.innerHeight ? pos.top -= element.clientWidth + margin : pos.top += offset.top;
  } else {
    pos.top += offset.top;
    pos.left += offset.left;
  }
  if (!returnOnly) {
    element.style.top = `${pos.top}px`;
    element.style.left = `${pos.left}px`;
  }
  return pos;
}
//#endregion
export { getAbsolutePosition, getRelativePosition, setElementPositionBasedOnCaret };