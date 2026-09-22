export function resolveTo(selector) {
    var _a;
    if (typeof selector === 'string') {
        return document.querySelector(selector);
    }
    return (_a = selector()) !== null && _a !== void 0 ? _a : null;
}
