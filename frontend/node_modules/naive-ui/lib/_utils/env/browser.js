Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_env_is_browser = require("./is-browser.js");
//#region src/_utils/env/browser.ts
const isChrome = require__utils_env_is_browser.isBrowser && "chrome" in window;
const isFirefox = require__utils_env_is_browser.isBrowser && navigator.userAgent.includes("Firefox");
const isSafari = require__utils_env_is_browser.isBrowser && navigator.userAgent.includes("Safari") && !isChrome;
//#endregion
exports.isChrome = isChrome;
exports.isFirefox = isFirefox;
exports.isSafari = isSafari;
