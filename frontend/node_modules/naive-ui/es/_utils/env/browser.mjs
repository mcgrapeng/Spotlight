import { isBrowser } from "./is-browser.mjs";
//#region src/_utils/env/browser.ts
const isChrome = isBrowser && "chrome" in window;
const isFirefox = isBrowser && navigator.userAgent.includes("Firefox");
const isSafari = isBrowser && navigator.userAgent.includes("Safari") && !isChrome;
//#endregion
export { isChrome, isFirefox, isSafari };