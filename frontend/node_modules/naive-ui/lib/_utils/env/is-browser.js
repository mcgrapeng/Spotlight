Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/_utils/env/is-browser.ts
const isBrowser = typeof document !== "undefined" && typeof window !== "undefined";
//#endregion
exports.isBrowser = isBrowser;
