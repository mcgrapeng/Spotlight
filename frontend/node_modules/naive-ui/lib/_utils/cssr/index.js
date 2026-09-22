Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let _css_render_plugin_bem = require("@css-render/plugin-bem");
let css_render = require("css-render");
//#region src/_utils/cssr/index.ts
const namespace = "n";
const prefix = `.n-`;
const elementPrefix = "__";
const modifierPrefix = "--";
const cssr = (0, css_render.CssRender)();
const plugin = (0, _css_render_plugin_bem.plugin)({
	blockPrefix: prefix,
	elementPrefix,
	modifierPrefix
});
cssr.use(plugin);
const { c, find } = cssr;
const { cB, cE, cM, cNotM } = plugin;
function insideModal(style) {
	return c(({ props: { bPrefix } }) => `${bPrefix || prefix}modal, ${bPrefix || prefix}drawer`, [style]);
}
function insidePopover(style) {
	return c(({ props: { bPrefix } }) => `${bPrefix || prefix}popover`, [style]);
}
function asModal(style) {
	return c(({ props: { bPrefix } }) => `&${bPrefix || prefix}modal`, style);
}
const cCB = ((...args) => {
	return c(">", [cB(...args)]);
});
function createKey(prefix, suffix) {
	return prefix + (suffix === "default" ? "" : suffix.replace(/^[a-z]/, (startChar) => startChar.toUpperCase()));
}
//#endregion
exports.asModal = asModal;
exports.c = c;
exports.cB = cB;
exports.cCB = cCB;
exports.cE = cE;
exports.cM = cM;
exports.cNotM = cNotM;
exports.createKey = createKey;
exports.find = find;
exports.insideModal = insideModal;
exports.insidePopover = insidePopover;
exports.namespace = namespace;
exports.prefix = prefix;
