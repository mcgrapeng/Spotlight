Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let vue = require("vue");
//#region src/tree/src/dnd.tsx
function renderDropMark({ position, offsetLevel, indent, el }) {
	const style = {
		position: "absolute",
		boxSizing: "border-box",
		right: 0
	};
	if (position === "inside") {
		style.left = 0;
		style.top = 0;
		style.bottom = 0;
		style.borderRadius = "inherit";
		style.boxShadow = "inset 0 0 0 2px var(--n-drop-mark-color)";
	} else {
		const cssPosition = position === "before" ? "top" : "bottom";
		style[cssPosition] = 0;
		style.left = `${el.offsetLeft + 6 - offsetLevel * indent}px`;
		style.height = "2px";
		style.backgroundColor = "var(--n-drop-mark-color)";
		style.transformOrigin = cssPosition;
		style.borderRadius = "1px";
		style.transform = position === "before" ? "translateY(-4px)" : "translateY(4px)";
	}
	return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { style: (0, vue.normalizeStyle)(style) }, null, 4);
}
function defaultAllowDrop({ dropPosition, node }) {
	if (node.isLeaf === false) return true;
	if (node.children) return true;
	return dropPosition !== "inside";
}
//#endregion
exports.defaultAllowDrop = defaultAllowDrop;
exports.renderDropMark = renderDropMark;
