Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_style = require("../../_mixins/use-style.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_ellipsis_src_styles_index_cssr = require("./styles/index.cssr.js");
const require_ellipsis_src_Ellipsis = require("./Ellipsis.js");
let vue = require("vue");
//#region src/ellipsis/src/PerformantEllipsis.tsx
const NPerformantEllipsis = (0, vue.defineComponent)({
	name: "PerformantEllipsis",
	props: require_ellipsis_src_Ellipsis.ellipsisProps,
	inheritAttrs: false,
	setup(props, { attrs, slots }) {
		const mouseEnteredRef = (0, vue.ref)(false);
		const mergedClsPrefixRef = require__mixins_use_config.useMergedClsPrefix();
		require__mixins_use_style("-ellipsis", require_ellipsis_src_styles_index_cssr, mergedClsPrefixRef);
		const renderTrigger = () => {
			const { lineClamp } = props;
			const mergedClsPrefix = mergedClsPrefixRef.value;
			return (() => {
				const _cache = require_vdom.createVNodeCache("dba02f32d69b23e6");
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("span", (0, vue.mergeProps)((0, vue.mergeProps)(attrs, {
					class: [
						`${mergedClsPrefix}-ellipsis`,
						lineClamp !== void 0 ? require_ellipsis_src_Ellipsis.createLineClampClass(mergedClsPrefix) : void 0,
						props.expandTrigger === "click" ? require_ellipsis_src_Ellipsis.createCursorClass(mergedClsPrefix, "pointer") : void 0
					],
					style: lineClamp === void 0 ? { textOverflow: "ellipsis" } : { "-webkit-line-clamp": lineClamp }
				}), { onMouseenter: _cache[0] || (_cache[0] = () => {
					mouseEnteredRef.value = true;
				}) }), [lineClamp ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => slots.default?.())], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", { key: 1 }, [require_vdom.normalizeVNode(() => slots.default?.())]))], 16);
			})();
		};
		return {
			mouseEntered: mouseEnteredRef,
			renderTrigger
		};
	},
	render() {
		if (this.mouseEntered) return (0, vue.h)(require_ellipsis_src_Ellipsis.default, (0, vue.mergeProps)({}, this.$attrs, this.$props), this.$slots);
		else return this.renderTrigger();
	}
});
//#endregion
exports.NPerformantEllipsis = NPerformantEllipsis;
