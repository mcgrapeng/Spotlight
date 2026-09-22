Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_env_is_browser = require("../../_utils/env/is-browser.js");
const require__utils_vue_flatten = require("../../_utils/vue/flatten.js");
const require__utils_vue_get_slot = require("../../_utils/vue/get-slot.js");
const require__utils_vue_is_node_v_show_false = require("../../_utils/vue/is-node-v-show-false.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require_grid_src_config = require("./config.js");
const require_config_provider_src_config = require("../../config-provider/src/config.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
let vueuc = require("vueuc");
//#region src/grid/src/Grid.tsx
const defaultCols = 24;
const SSR_ATTR_NAME = "__ssr__";
const gridProps = {
	layoutShiftDisabled: Boolean,
	responsive: {
		type: [String, Boolean],
		default: "self"
	},
	cols: {
		type: [Number, String],
		default: defaultCols
	},
	itemResponsive: Boolean,
	collapsed: Boolean,
	collapsedRows: {
		type: Number,
		default: 1
	},
	itemStyle: [Object, String],
	xGap: {
		type: [Number, String],
		default: 0
	},
	yGap: {
		type: [Number, String],
		default: 0
	}
};
var Grid_default = (0, vue.defineComponent)({
	name: "Grid",
	inheritAttrs: false,
	props: gridProps,
	setup(props) {
		const { mergedClsPrefixRef, mergedBreakpointsRef } = require__mixins_use_config.default(props);
		const numRegex = /^\d+$/;
		const widthRef = (0, vue.ref)(void 0);
		const breakpointsRef = (0, vooks.useBreakpoints)(mergedBreakpointsRef?.value || require_config_provider_src_config.defaultBreakpoints);
		const isResponsiveRef = (0, vooks.useMemo)(() => {
			if (props.itemResponsive) return true;
			if (!numRegex.test(props.cols.toString())) return true;
			if (!numRegex.test(props.xGap.toString())) return true;
			if (!numRegex.test(props.yGap.toString())) return true;
			return false;
		});
		const responsiveQueryRef = (0, vue.computed)(() => {
			if (!isResponsiveRef.value) return void 0;
			return props.responsive === "self" ? widthRef.value : breakpointsRef.value;
		});
		const responsiveColsRef = (0, vooks.useMemo)(() => {
			return Number((0, seemly.parseResponsivePropValue)(props.cols.toString(), responsiveQueryRef.value)) ?? defaultCols;
		});
		const responsiveXGapRef = (0, vooks.useMemo)(() => (0, seemly.parseResponsivePropValue)(props.xGap.toString(), responsiveQueryRef.value));
		const responsiveYGapRef = (0, vooks.useMemo)(() => (0, seemly.parseResponsivePropValue)(props.yGap.toString(), responsiveQueryRef.value));
		const handleResize = (entry) => {
			widthRef.value = entry.contentRect.width;
		};
		const handleResizeRaf = (entry) => {
			(0, seemly.beforeNextFrameOnce)(handleResize, entry);
		};
		const overflowRef = (0, vue.ref)(false);
		const handleResizeRef = (0, vue.computed)(() => {
			if (props.responsive === "self") return handleResizeRaf;
		});
		const isSsrRef = (0, vue.ref)(false);
		const contentElRef = (0, vue.ref)();
		(0, vue.onMounted)(() => {
			const { value: contentEl } = contentElRef;
			if (contentEl) {
				if (contentEl.hasAttribute(SSR_ATTR_NAME)) {
					contentEl.removeAttribute(SSR_ATTR_NAME);
					isSsrRef.value = true;
				}
			}
		});
		(0, vue.provide)(require_grid_src_config.gridInjectionKey, {
			layoutShiftDisabledRef: (0, vue.toRef)(props, "layoutShiftDisabled"),
			isSsrRef,
			itemStyleRef: (0, vue.toRef)(props, "itemStyle"),
			xGapRef: responsiveXGapRef,
			overflowRef
		});
		return {
			isSsr: !require__utils_env_is_browser.isBrowser,
			contentEl: contentElRef,
			mergedClsPrefix: mergedClsPrefixRef,
			style: (0, vue.computed)(() => {
				if (props.layoutShiftDisabled) return {
					width: "100%",
					display: "grid",
					gridTemplateColumns: `repeat(${props.cols}, minmax(0, 1fr))`,
					columnGap: (0, seemly.pxfy)(props.xGap),
					rowGap: (0, seemly.pxfy)(props.yGap)
				};
				return {
					width: "100%",
					display: "grid",
					gridTemplateColumns: `repeat(${responsiveColsRef.value}, minmax(0, 1fr))`,
					columnGap: (0, seemly.pxfy)(responsiveXGapRef.value),
					rowGap: (0, seemly.pxfy)(responsiveYGapRef.value)
				};
			}),
			isResponsive: isResponsiveRef,
			responsiveQuery: responsiveQueryRef,
			responsiveCols: responsiveColsRef,
			handleResize: handleResizeRef,
			overflow: overflowRef
		};
	},
	render() {
		if (this.layoutShiftDisabled) return (0, vue.h)("div", (0, vue.mergeProps)({
			ref: "contentEl",
			class: `${this.mergedClsPrefix}-grid`,
			style: this.style
		}, this.$attrs), this.$slots);
		const renderContent = () => {
			this.overflow = false;
			const rawChildren = require__utils_vue_flatten.flatten(require__utils_vue_get_slot.getSlot(this));
			const childrenAndRawSpan = [];
			const { collapsed, collapsedRows, responsiveCols, responsiveQuery } = this;
			rawChildren.forEach((child) => {
				if ((child?.type)?.__GRID_ITEM__ !== true) return;
				if (require__utils_vue_is_node_v_show_false.isNodeVShowFalse(child)) {
					const clonedNode = (0, vue.cloneVNode)(child);
					if (clonedNode.props) clonedNode.props.privateShow = false;
					else clonedNode.props = { privateShow: false };
					childrenAndRawSpan.push({
						child: clonedNode,
						rawChildSpan: 0
					});
					return;
				}
				child.dirs = child.dirs?.filter(({ dir }) => dir !== vue.vShow) || null;
				if (child.dirs?.length === 0) child.dirs = null;
				const clonedChild = (0, vue.cloneVNode)(child);
				const rawChildSpan = Number((0, seemly.parseResponsivePropValue)(clonedChild.props?.span, responsiveQuery) ?? 1);
				if (rawChildSpan === 0) return;
				childrenAndRawSpan.push({
					child: clonedChild,
					rawChildSpan
				});
			});
			let suffixSpan = 0;
			const maybeSuffixNode = childrenAndRawSpan[childrenAndRawSpan.length - 1]?.child;
			if (maybeSuffixNode?.props) {
				const suffixPropValue = maybeSuffixNode.props?.suffix;
				if (suffixPropValue !== void 0 && suffixPropValue !== false) {
					suffixSpan = Number((0, seemly.parseResponsivePropValue)(maybeSuffixNode.props?.span, responsiveQuery) ?? 1);
					maybeSuffixNode.props.privateSpan = suffixSpan;
					maybeSuffixNode.props.privateColStart = responsiveCols + 1 - suffixSpan;
					maybeSuffixNode.props.privateShow = maybeSuffixNode.props.privateShow ?? true;
				}
			}
			let spanCounter = 0;
			let done = false;
			for (const { child, rawChildSpan } of childrenAndRawSpan) {
				if (done) this.overflow = true;
				if (!done) {
					const childOffset = Number((0, seemly.parseResponsivePropValue)(child.props?.offset, responsiveQuery) ?? 0);
					const childSpan = Math.min(rawChildSpan + childOffset, responsiveCols);
					if (!child.props) child.props = {
						privateSpan: childSpan,
						privateOffset: childOffset
					};
					else {
						child.props.privateSpan = childSpan;
						child.props.privateOffset = childOffset;
					}
					if (collapsed) {
						const remainder = spanCounter % responsiveCols;
						if (childSpan + remainder > responsiveCols) spanCounter += responsiveCols - remainder;
						if (childSpan + spanCounter + suffixSpan > collapsedRows * responsiveCols) done = true;
						else spanCounter += childSpan;
					}
				}
				if (done) {
					if (child.props) {
						if (child.props.privateShow !== true) child.props.privateShow = false;
					} else child.props = { privateShow: false };
				}
			}
			return (0, vue.h)("div", (0, vue.mergeProps)({
				ref: "contentEl",
				class: `${this.mergedClsPrefix}-grid`,
				style: this.style,
				[SSR_ATTR_NAME]: this.isSsr || void 0
			}, this.$attrs), childrenAndRawSpan.map(({ child }) => child));
		};
		return this.isResponsive && this.responsive === "self" ? ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VResizeObserver, {
			key: 1,
			onResize: this.handleResize
		}, { default: renderContent }, 1032, ["onResize"])) : renderContent();
	}
});
//#endregion
exports.default = Grid_default;
exports.gridProps = gridProps;
