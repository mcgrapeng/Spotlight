Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/marquee/src/props.ts
const marqueeProps = {
	...require("../../_mixins/use-theme.js").default.props,
	autoFill: Boolean,
	speed: {
		type: Number,
		default: 48
	}
};
//#endregion
exports.marqueeProps = marqueeProps;
