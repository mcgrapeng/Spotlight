Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require_highlight_src_utils = require("./utils.js");
let vue = require("vue");
//#region src/highlight/src/Highlight.tsx
const highlightProps = {
	highlightTag: {
		type: String,
		default: "mark"
	},
	caseSensitive: Boolean,
	autoEscape: {
		type: Boolean,
		default: true
	},
	text: String,
	patterns: {
		type: Array,
		default: () => []
	},
	highlightClass: String,
	highlightStyle: [Object, String]
};
var Highlight_default = (0, vue.defineComponent)({
	name: "Highlight",
	props: highlightProps,
	setup(props) {
		const { mergedClsPrefixRef } = require__mixins_use_config.default();
		const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		return {
			highlightedNode: (0, vue.computed)(() => {
				const mergedClsPrefix = mergedClsPrefixRef.value;
				let children = [];
				const { patterns, text } = props;
				if (patterns.length === 0 || !text) children = [text];
				else {
					const { highlightTag, caseSensitive, autoEscape, highlightClass, highlightStyle } = props;
					const pattern = patterns.map((word) => autoEscape ? escapeRegExp(word) : word).join("|");
					const regex = new RegExp(`(${pattern})`, caseSensitive ? "g" : "gi");
					children = require_highlight_src_utils.splitAndMarkByRegex(text, regex).map(({ text, isMatch }) => {
						if (isMatch) return (0, vue.h)(highlightTag, {
							class: [`${mergedClsPrefix}-highlight__mark`, highlightClass],
							style: highlightStyle
						}, text);
						return text;
					});
				}
				return (0, vue.h)("span", { class: `${mergedClsPrefix}-highlight` }, children);
			}),
			mergedClsPrefix: mergedClsPrefixRef
		};
	},
	render() {
		return this.highlightedNode;
	}
});
//#endregion
exports.default = Highlight_default;
exports.highlightProps = highlightProps;
