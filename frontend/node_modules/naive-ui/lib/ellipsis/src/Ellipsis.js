Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_ellipsis_styles_light = require("../styles/light.js");
const require_tooltip_src_Tooltip = require("../../tooltip/src/Tooltip.js");
const require_ellipsis_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/ellipsis/src/Ellipsis.tsx
const _hoisted_1 = ["onClick"];
function createLineClampClass(clsPrefix) {
	return `${clsPrefix}-ellipsis--line-clamp`;
}
function createCursorClass(clsPrefix, cursor) {
	return `${clsPrefix}-ellipsis--cursor-${cursor}`;
}
const ellipsisProps = {
	...require__mixins_use_theme.default.props,
	expandTrigger: String,
	lineClamp: [Number, String],
	tooltip: {
		type: [Boolean, Object],
		default: true
	}
};
var Ellipsis_default = (0, vue.defineComponent)({
	name: "Ellipsis",
	inheritAttrs: false,
	props: ellipsisProps,
	slots: Object,
	setup(props, { slots, attrs }) {
		const mergedClsPrefixRef = require__mixins_use_config.useMergedClsPrefix();
		const mergedTheme = require__mixins_use_theme.default("Ellipsis", "-ellipsis", require_ellipsis_src_styles_index_cssr, require_ellipsis_styles_light, props, mergedClsPrefixRef);
		const triggerRef = (0, vue.ref)(null);
		const triggerInnerRef = (0, vue.ref)(null);
		const tooltipRef = (0, vue.ref)(null);
		const expandedRef = (0, vue.ref)(false);
		const ellipsisStyleRef = (0, vue.computed)(() => {
			const { lineClamp } = props;
			const { value: expanded } = expandedRef;
			if (lineClamp !== void 0) return {
				textOverflow: "",
				"-webkit-line-clamp": expanded ? "" : lineClamp
			};
			else return {
				textOverflow: expanded ? "" : "ellipsis",
				"-webkit-line-clamp": ""
			};
		});
		function getTooltipDisabled() {
			let tooltipDisabled = false;
			const { value: expanded } = expandedRef;
			if (expanded) return true;
			const { value: trigger } = triggerRef;
			if (trigger) {
				const { lineClamp } = props;
				syncEllipsisStyle(trigger);
				if (lineClamp !== void 0) tooltipDisabled = trigger.scrollHeight <= trigger.offsetHeight;
				else {
					const { value: triggerInner } = triggerInnerRef;
					if (triggerInner) tooltipDisabled = triggerInner.getBoundingClientRect().width <= trigger.getBoundingClientRect().width;
				}
				syncCursorStyle(trigger, tooltipDisabled);
			}
			return tooltipDisabled;
		}
		function handleClick() {
			if (props.expandTrigger !== "click") return;
			const { value: expanded } = expandedRef;
			if (expanded) tooltipRef.value?.setShow(false);
			expandedRef.value = !expanded;
		}
		(0, vue.onDeactivated)(() => {
			if (props.tooltip) tooltipRef.value?.setShow(false);
		});
		const renderTrigger = () => (() => {
			const _cache = require_vdom.createVNodeCache("c61f52eafd841df5");
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("span", (0, vue.mergeProps)((0, vue.mergeProps)(attrs, {
				class: [
					`${mergedClsPrefixRef.value}-ellipsis`,
					props.lineClamp !== void 0 ? createLineClampClass(mergedClsPrefixRef.value) : void 0,
					props.expandTrigger === "click" ? createCursorClass(mergedClsPrefixRef.value, "pointer") : void 0
				],
				style: ellipsisStyleRef.value
			}), {
				ref: "triggerRef",
				onClick: handleClick,
				onMouseenter: _cache[0] || (_cache[0] = props.expandTrigger === "click" ? getTooltipDisabled : void 0)
			}), [props.lineClamp ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => slots.default?.())], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
				key: 1,
				ref: "triggerInnerRef"
			}, [require_vdom.normalizeVNode(() => slots.default?.())], 512))], 16, _hoisted_1);
		})();
		function syncEllipsisStyle(trigger) {
			if (!trigger) return;
			const latestStyle = ellipsisStyleRef.value;
			const lineClampClass = createLineClampClass(mergedClsPrefixRef.value);
			if (props.lineClamp !== void 0) syncTriggerClass(trigger, lineClampClass, "add");
			else syncTriggerClass(trigger, lineClampClass, "remove");
			for (const key in latestStyle) if (trigger.style[key] !== latestStyle[key]) trigger.style[key] = latestStyle[key];
		}
		function syncCursorStyle(trigger, tooltipDisabled) {
			const cursorClass = createCursorClass(mergedClsPrefixRef.value, "pointer");
			if (props.expandTrigger === "click" && !tooltipDisabled) syncTriggerClass(trigger, cursorClass, "add");
			else syncTriggerClass(trigger, cursorClass, "remove");
		}
		function syncTriggerClass(trigger, styleClass, action) {
			if (action === "add") {
				if (!trigger.classList.contains(styleClass)) trigger.classList.add(styleClass);
			} else if (trigger.classList.contains(styleClass)) trigger.classList.remove(styleClass);
		}
		return {
			mergedTheme,
			triggerRef,
			triggerInnerRef,
			tooltipRef,
			renderTrigger,
			getTooltipDisabled
		};
	},
	render() {
		const { tooltip, renderTrigger, $slots } = this;
		if (tooltip) {
			const { mergedTheme } = this;
			return (0, vue.openBlock)(), (0, vue.createBlock)(require_tooltip_src_Tooltip.default, (0, vue.mergeProps)({
				key: 1,
				ref: "tooltipRef",
				placement: "top"
			}, tooltip, {
				getDisabled: this.getTooltipDisabled,
				theme: mergedTheme.peers.Tooltip,
				themeOverrides: mergedTheme.peerOverrides.Tooltip
			}), {
				trigger: renderTrigger,
				default: $slots.tooltip ?? $slots.default
			}, 1040, [
				"getDisabled",
				"theme",
				"themeOverrides"
			]);
		} else return renderTrigger();
	}
});
//#endregion
exports.createCursorClass = createCursorClass;
exports.createLineClampClass = createLineClampClass;
exports.default = Ellipsis_default;
exports.ellipsisProps = ellipsisProps;
