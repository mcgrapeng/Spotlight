Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_keysOf = require("../../_utils/vue/keysOf.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_grid_src_config = require("./config.js");
let seemly = require("seemly");
let vue = require("vue");
//#region src/grid/src/GridItem.tsx
const defaultSpan = 1;
const gridItemProps = {
	span: {
		type: [Number, String],
		default: 1
	},
	offset: {
		type: [Number, String],
		default: 0
	},
	suffix: Boolean,
	privateOffset: Number,
	privateSpan: Number,
	privateColStart: Number,
	privateShow: {
		type: Boolean,
		default: true
	}
};
const gridItemPropKeys = require__utils_vue_keysOf.keysOf(gridItemProps);
var GridItem_default = (0, vue.defineComponent)({
	__GRID_ITEM__: true,
	name: "GridItem",
	alias: ["Gi"],
	props: gridItemProps,
	setup() {
		const { isSsrRef, xGapRef, itemStyleRef, overflowRef, layoutShiftDisabledRef } = (0, vue.inject)(require_grid_src_config.gridInjectionKey);
		const self = (0, vue.getCurrentInstance)();
		return {
			overflow: overflowRef,
			itemStyle: itemStyleRef,
			layoutShiftDisabled: layoutShiftDisabledRef,
			mergedXGap: (0, vue.computed)(() => {
				return (0, seemly.pxfy)(xGapRef.value || 0);
			}),
			deriveStyle: () => {
				isSsrRef.value;
				const { privateSpan = 1, privateShow = true, privateColStart = void 0, privateOffset = 0 } = self.vnode.props;
				const { value: xGap } = xGapRef;
				const mergedXGap = (0, seemly.pxfy)(xGap || 0);
				return {
					display: !privateShow ? "none" : "",
					gridColumn: `${privateColStart ?? `span ${privateSpan}`} / span ${privateSpan}`,
					marginLeft: privateOffset ? `calc((100% - (${privateSpan} - 1) * ${mergedXGap}) / ${privateSpan} * ${privateOffset} + ${mergedXGap} * ${privateOffset})` : ""
				};
			}
		};
	},
	render() {
		if (this.layoutShiftDisabled) {
			const { span, offset, mergedXGap } = this;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 1,
				style: (0, vue.normalizeStyle)({
					gridColumn: `span ${span} / span ${span}`,
					marginLeft: offset ? `calc((100% - (${span} - 1) * ${mergedXGap}) / ${span} * ${offset} + ${mergedXGap} * ${offset})` : ""
				})
			}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 4);
		}
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { style: (0, vue.normalizeStyle)([this.itemStyle, this.deriveStyle()]) }, [require_vdom.normalizeVNode(() => this.$slots.default?.({ overflow: this.overflow }))], 4);
	}
});
//#endregion
exports.default = GridItem_default;
exports.defaultSpan = defaultSpan;
exports.gridItemPropKeys = gridItemPropKeys;
exports.gridItemProps = gridItemProps;
