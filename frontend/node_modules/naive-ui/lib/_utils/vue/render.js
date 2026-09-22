Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let vue = require("vue");
//#region src/_utils/vue/render.ts
function render(r, ...args) {
	if (typeof r === "function") return r(...args);
	else if (typeof r === "string") return (0, vue.createTextVNode)(r);
	else if (typeof r === "number") return (0, vue.createTextVNode)(String(r));
	else return null;
}
//#endregion
exports.render = render;
