Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_flatten = require("../../_utils/vue/flatten.js");
const require__utils_vue_get_slot = require("../../_utils/vue/get-slot.js");
const require__utils_vue_get_v_node_children = require("../../_utils/vue/get-v-node-children.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_descriptions_styles_light = require("../styles/light.js");
const require_descriptions_src_styles_index_cssr = require("./styles/index.cssr.js");
const require_descriptions_src_utils = require("./utils.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
//#region src/descriptions/src/Descriptions.tsx
const _hoisted_1 = ["colspan"];
const _hoisted_2 = ["colspan"];
const _hoisted_3 = ["colspan"];
const _hoisted_4 = ["colspan"];
const descriptionsProps = {
	...require__mixins_use_theme.default.props,
	title: String,
	column: {
		type: Number,
		default: 3
	},
	columns: Number,
	labelPlacement: {
		type: String,
		default: "top"
	},
	labelAlign: {
		type: String,
		default: "left"
	},
	separator: {
		type: String,
		default: ":"
	},
	size: String,
	bordered: Boolean,
	labelClass: String,
	labelStyle: [Object, String],
	contentClass: String,
	contentStyle: [Object, String]
};
var Descriptions_default = (0, vue.defineComponent)({
	name: "Descriptions",
	props: descriptionsProps,
	slots: Object,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const mergedSizeRef = (0, vue.computed)(() => {
			return props.size || mergedComponentPropsRef?.value?.Descriptions?.size || "medium";
		});
		const themeRef = require__mixins_use_theme.default("Descriptions", "-descriptions", require_descriptions_src_styles_index_cssr, require_descriptions_styles_light.default, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { bordered } = props;
			const mergedSize = mergedSizeRef.value;
			const { common: { cubicBezierEaseInOut }, self: { titleTextColor, thColor, thColorModal, thColorPopover, thTextColor, thFontWeight, tdTextColor, tdColor, tdColorModal, tdColorPopover, borderColor, borderColorModal, borderColorPopover, borderRadius, lineHeight, [require__utils_cssr_index.createKey("fontSize", mergedSize)]: fontSize, [require__utils_cssr_index.createKey(bordered ? "thPaddingBordered" : "thPadding", mergedSize)]: thPadding, [require__utils_cssr_index.createKey(bordered ? "tdPaddingBordered" : "tdPadding", mergedSize)]: tdPadding } } = themeRef.value;
			return {
				"--n-title-text-color": titleTextColor,
				"--n-th-padding": thPadding,
				"--n-td-padding": tdPadding,
				"--n-font-size": fontSize,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-th-font-weight": thFontWeight,
				"--n-line-height": lineHeight,
				"--n-th-text-color": thTextColor,
				"--n-td-text-color": tdTextColor,
				"--n-th-color": thColor,
				"--n-th-color-modal": thColorModal,
				"--n-th-color-popover": thColorPopover,
				"--n-td-color": tdColor,
				"--n-td-color-modal": tdColorModal,
				"--n-td-color-popover": tdColorPopover,
				"--n-border-radius": borderRadius,
				"--n-border-color": borderColor,
				"--n-border-color-modal": borderColorModal,
				"--n-border-color-popover": borderColorPopover
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("descriptions", (0, vue.computed)(() => {
			let hash = "";
			const { bordered } = props;
			if (bordered) hash += "a";
			hash += mergedSizeRef.value[0];
			return hash;
		}), cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender,
			compitableColumn: (0, vooks.useCompitable)(props, ["columns", "column"]),
			inlineThemeDisabled,
			mergedSize: mergedSizeRef
		};
	},
	render() {
		const defaultSlots = this.$slots.default;
		const children = defaultSlots ? require__utils_vue_flatten.flatten(defaultSlots()) : [];
		const memorizedLength = children.length;
		const { contentClass, labelClass, compitableColumn, labelPlacement, labelAlign, mergedSize, bordered, title, cssVars, mergedClsPrefix, separator, onRender } = this;
		onRender?.();
		const filteredChildren = children.filter((child) => require_descriptions_src_utils.isDescriptionsItem(child));
		if (process.env.NODE_ENV !== "production" && memorizedLength !== filteredChildren.length) require__utils_naive_warn.warn("descriptions", "`n-descriptions` only takes `n-descriptions-item` as children.");
		const rows = filteredChildren.reduce((state, vNode, index) => {
			const props = vNode.props || {};
			const isLastIteration = filteredChildren.length - 1 === index;
			const itemLabel = ["label" in props ? props.label : require__utils_vue_get_v_node_children.getVNodeChildren(vNode, "label")];
			const itemChildren = [require__utils_vue_get_v_node_children.getVNodeChildren(vNode)];
			const itemSpan = props.span || 1;
			const memorizedSpan = state.span;
			state.span += itemSpan;
			const labelStyle = props.labelStyle || props["label-style"] || this.labelStyle;
			const contentStyle = props.contentStyle || props["content-style"] || this.contentStyle;
			if (labelPlacement === "left") {
				if (bordered) state.row.push(((0, vue.openBlock)(), (0, vue.createElementBlock)("th", {
					key: 1,
					class: require_vdom.normalizeClass([`${mergedClsPrefix}-descriptions-table-header`, labelClass]),
					colspan: 1,
					style: (0, vue.normalizeStyle)(labelStyle)
				}, [require_vdom.normalizeVNode(() => itemLabel)], 6)), ((0, vue.openBlock)(), (0, vue.createElementBlock)("td", {
					key: 2,
					class: require_vdom.normalizeClass([`${mergedClsPrefix}-descriptions-table-content`, contentClass]),
					colspan: isLastIteration ? (compitableColumn - memorizedSpan) * 2 + 1 : itemSpan * 2 - 1,
					style: (0, vue.normalizeStyle)(contentStyle)
				}, [require_vdom.normalizeVNode(() => itemChildren)], 14, _hoisted_1)));
				else state.row.push(((0, vue.openBlock)(), (0, vue.createElementBlock)("td", {
					key: 3,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-descriptions-table-content`),
					colspan: isLastIteration ? (compitableColumn - memorizedSpan) * 2 : itemSpan * 2
				}, [(0, vue.createElementVNode)("span", {
					class: require_vdom.normalizeClass([`${mergedClsPrefix}-descriptions-table-content__label`, labelClass]),
					style: (0, vue.normalizeStyle)(labelStyle)
				}, [require_vdom.normalizeVNode(() => [...itemLabel, separator && ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
					key: 4,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-descriptions-separator`)
				}, [require_vdom.normalizeVNode(() => separator)], 2))])], 6), (0, vue.createElementVNode)("span", {
					class: require_vdom.normalizeClass([`${mergedClsPrefix}-descriptions-table-content__content`, contentClass]),
					style: (0, vue.normalizeStyle)(contentStyle)
				}, [require_vdom.normalizeVNode(() => itemChildren)], 6)], 10, _hoisted_2)));
			} else {
				const colspan = isLastIteration ? (compitableColumn - memorizedSpan) * 2 : itemSpan * 2;
				state.row.push(((0, vue.openBlock)(), (0, vue.createElementBlock)("th", {
					key: 5,
					class: require_vdom.normalizeClass([`${mergedClsPrefix}-descriptions-table-header`, labelClass]),
					colspan,
					style: (0, vue.normalizeStyle)(labelStyle)
				}, [require_vdom.normalizeVNode(() => itemLabel)], 14, _hoisted_3)));
				state.secondRow.push(((0, vue.openBlock)(), (0, vue.createElementBlock)("td", {
					key: 6,
					class: require_vdom.normalizeClass([`${mergedClsPrefix}-descriptions-table-content`, contentClass]),
					colspan,
					style: (0, vue.normalizeStyle)(contentStyle)
				}, [require_vdom.normalizeVNode(() => itemChildren)], 14, _hoisted_4)));
			}
			if (state.span >= compitableColumn || isLastIteration) {
				state.span = 0;
				if (state.row.length) {
					state.rows.push(state.row);
					state.row = [];
				}
				if (labelPlacement !== "left") {
					if (state.secondRow.length) {
						state.rows.push(state.secondRow);
						state.secondRow = [];
					}
				}
			}
			return state;
		}, {
			span: 0,
			row: [],
			secondRow: [],
			rows: []
		}).rows.map((row) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("tr", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-descriptions-table-row`) }, [require_vdom.normalizeVNode(() => row)], 2)));
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			style: (0, vue.normalizeStyle)(cssVars),
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-descriptions`,
				this.themeClass,
				`${mergedClsPrefix}-descriptions--${labelPlacement}-label-placement`,
				`${mergedClsPrefix}-descriptions--${labelAlign}-label-align`,
				`${mergedClsPrefix}-descriptions--${mergedSize}-size`,
				bordered && `${mergedClsPrefix}-descriptions--bordered`
			])
		}, [title || this.$slots.header ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 0,
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-descriptions-header`)
		}, [require_vdom.normalizeVNode(() => title || require__utils_vue_get_slot.getSlot(this, "header"))], 2)) : require_vdom.normalizeVNode(() => null), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-descriptions-table-wrapper`) }, [(0, vue.createElementVNode)("table", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-descriptions-table`) }, [(0, vue.createElementVNode)("tbody", null, [require_vdom.normalizeVNode(() => labelPlacement === "top" && ((0, vue.openBlock)(), (0, vue.createElementBlock)("tr", {
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-descriptions-table-row`),
			style: { visibility: "collapse" }
		}, [require_vdom.normalizeVNode(() => (0, seemly.repeat)(compitableColumn * 2, ((0, vue.openBlock)(), (0, vue.createElementBlock)("td"))))], 2))), require_vdom.normalizeVNode(() => rows)])], 2)], 2)], 6);
	}
});
//#endregion
exports.default = Descriptions_default;
exports.descriptionsProps = descriptionsProps;
