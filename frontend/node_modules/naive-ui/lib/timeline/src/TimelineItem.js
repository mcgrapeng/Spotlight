Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_composable_use_houdini = require("../../_utils/composable/use-houdini.js");
const require__utils_css_format_length = require("../../_utils/css/format-length.js");
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_timeline_src_Timeline = require("./Timeline.js");
let vue = require("vue");
//#region src/timeline/src/TimelineItem.tsx
const timelineItemProps = {
	time: [String, Number],
	title: String,
	content: String,
	color: String,
	lineType: {
		type: String,
		default: "default"
	},
	type: {
		type: String,
		default: "default"
	}
};
var TimelineItem_default = (0, vue.defineComponent)({
	name: "TimelineItem",
	props: timelineItemProps,
	slots: Object,
	setup(props) {
		const NTimeline = (0, vue.inject)(require_timeline_src_Timeline.timelineInjectionKey);
		if (!NTimeline) require__utils_naive_warn.throwError("timeline-item", "`n-timeline-item` must be placed inside `n-timeline`.");
		require__utils_composable_use_houdini.useHoudini();
		const { inlineThemeDisabled } = require__mixins_use_config.default();
		const cssVarsRef = (0, vue.computed)(() => {
			const { props: { size, iconSize: iconSizeProp }, mergedThemeRef } = NTimeline;
			const { type } = props;
			const { self: { titleTextColor, contentTextColor, metaTextColor, lineColor, titleFontWeight, contentFontSize, [require__utils_cssr_index.createKey("iconSize", size)]: iconSize, [require__utils_cssr_index.createKey("titleMargin", size)]: titleMargin, [require__utils_cssr_index.createKey("titleFontSize", size)]: titleFontSize, [require__utils_cssr_index.createKey("circleBorder", type)]: circleBorder, [require__utils_cssr_index.createKey("iconColor", type)]: iconColor }, common: { cubicBezierEaseInOut } } = mergedThemeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-circle-border": circleBorder,
				"--n-icon-color": iconColor,
				"--n-content-font-size": contentFontSize,
				"--n-content-text-color": contentTextColor,
				"--n-line-color": lineColor,
				"--n-meta-text-color": metaTextColor,
				"--n-title-font-size": titleFontSize,
				"--n-title-font-weight": titleFontWeight,
				"--n-title-margin": titleMargin,
				"--n-title-text-color": titleTextColor,
				"--n-icon-size": require__utils_css_format_length.formatLength(iconSizeProp) || iconSize
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("timeline-item", (0, vue.computed)(() => {
			const { props: { size, iconSize: iconSizeProp } } = NTimeline;
			const { type } = props;
			return `${size[0]}${iconSizeProp || "a"}${type[0]}`;
		}), cssVarsRef, NTimeline.props) : void 0;
		return {
			mergedClsPrefix: NTimeline.mergedClsPrefixRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedClsPrefix, color, onRender, $slots } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-timeline-item`,
				this.themeClass,
				`${mergedClsPrefix}-timeline-item--${this.type}-type`,
				`${mergedClsPrefix}-timeline-item--${this.lineType}-line-type`
			]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-timeline-item-timeline`) }, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-timeline-item-timeline__line`) }, null, 2), require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot($slots.icon, (children) => {
			return children ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 1,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-timeline-item-timeline__icon`),
				style: (0, vue.normalizeStyle)({ color })
			}, [require_vdom.normalizeVNode(() => children)], 6)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 2,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-timeline-item-timeline__circle`),
				style: (0, vue.normalizeStyle)({ borderColor: color })
			}, null, 6));
		}))], 2), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-timeline-item-content`) }, [
			require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot($slots.header, (children) => {
				if (children || this.title) return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 3,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-timeline-item-content__title`)
				}, [require_vdom.normalizeVNode(() => children || this.title)], 2);
				return null;
			})),
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-timeline-item-content__content`) }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot($slots.default, () => [this.content]))], 2),
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-timeline-item-content__meta`) }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot($slots.footer, () => [this.time]))], 2)
		], 2)], 6);
	}
});
//#endregion
exports.default = TimelineItem_default;
exports.timelineItemProps = timelineItemProps;
