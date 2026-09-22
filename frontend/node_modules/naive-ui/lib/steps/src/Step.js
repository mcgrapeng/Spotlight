Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icon_switch_transition_src_IconSwitchTransition = require("../../_internal/icon-switch-transition/src/IconSwitchTransition.js");
const require__internal_icons_Checkmark = require("../../_internal/icons/Checkmark.js");
const require__internal_icons_Close = require("../../_internal/icons/Close.js");
const require_steps_src_Steps = require("./Steps.js");
let vue = require("vue");
//#region src/steps/src/Step.tsx
const _hoisted_1 = ["onClick"];
const stepProps = {
	status: String,
	title: String,
	description: String,
	disabled: Boolean,
	internalIndex: {
		type: Number,
		default: 0
	}
};
var Step_default = (0, vue.defineComponent)({
	name: "Step",
	props: stepProps,
	slots: Object,
	setup(props) {
		const NSteps = (0, vue.inject)(require_steps_src_Steps.stepsInjectionKey, null);
		if (!NSteps) require__utils_naive_warn.throwError("step", "`n-step` must be placed inside `n-steps`.");
		const { inlineThemeDisabled } = require__mixins_use_config.default();
		const { props: stepsProps, mergedThemeRef, mergedClsPrefixRef, stepsSlots } = NSteps;
		const verticalRef = (0, vue.toRef)(stepsProps, "vertical");
		const contentPlacementRef = (0, vue.toRef)(stepsProps, "contentPlacement");
		const mergedStatusRef = (0, vue.computed)(() => {
			const { status } = props;
			if (status) return status;
			else {
				const { internalIndex } = props;
				const { current } = stepsProps;
				if (current === void 0) return "process";
				if (internalIndex < current) return "finish";
				else if (internalIndex === current) return stepsProps.status || "process";
				else if (internalIndex > current) return "wait";
			}
			return "process";
		});
		const cssVarsRef = (0, vue.computed)(() => {
			const { value: status } = mergedStatusRef;
			const { size } = stepsProps;
			const { common: { cubicBezierEaseInOut }, self: { stepHeaderFontWeight, [require__utils_cssr_index.createKey("stepHeaderFontSize", size)]: stepHeaderFontSize, [require__utils_cssr_index.createKey("indicatorIndexFontSize", size)]: indicatorIndexFontSize, [require__utils_cssr_index.createKey("indicatorSize", size)]: indicatorSize, [require__utils_cssr_index.createKey("indicatorIconSize", size)]: indicatorIconSize, [require__utils_cssr_index.createKey("indicatorTextColor", status)]: indicatorTextColor, [require__utils_cssr_index.createKey("indicatorBorderColor", status)]: indicatorBorderColor, [require__utils_cssr_index.createKey("headerTextColor", status)]: headerTextColor, [require__utils_cssr_index.createKey("splitorColor", status)]: splitorColor, [require__utils_cssr_index.createKey("indicatorColor", status)]: indicatorColor, [require__utils_cssr_index.createKey("descriptionTextColor", status)]: descriptionTextColor } } = mergedThemeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-description-text-color": descriptionTextColor,
				"--n-header-text-color": headerTextColor,
				"--n-indicator-border-color": indicatorBorderColor,
				"--n-indicator-color": indicatorColor,
				"--n-indicator-icon-size": indicatorIconSize,
				"--n-indicator-index-font-size": indicatorIndexFontSize,
				"--n-indicator-size": indicatorSize,
				"--n-indicator-text-color": indicatorTextColor,
				"--n-splitor-color": splitorColor,
				"--n-step-header-font-size": stepHeaderFontSize,
				"--n-step-header-font-weight": stepHeaderFontWeight
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("step", (0, vue.computed)(() => {
			const { value: status } = mergedStatusRef;
			const { size } = stepsProps;
			return `${status[0]}${size[0]}`;
		}), cssVarsRef, stepsProps) : void 0;
		return {
			stepsSlots,
			mergedClsPrefix: mergedClsPrefixRef,
			vertical: verticalRef,
			mergedStatus: mergedStatusRef,
			handleStepClick: (0, vue.computed)(() => {
				if (props.disabled) return void 0;
				const { onUpdateCurrent, "onUpdate:current": _onUpdateCurrent } = stepsProps;
				return onUpdateCurrent || _onUpdateCurrent ? () => {
					if (onUpdateCurrent) require__utils_vue_call.call(onUpdateCurrent, props.internalIndex);
					if (_onUpdateCurrent) require__utils_vue_call.call(_onUpdateCurrent, props.internalIndex);
				} : void 0;
			}),
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender,
			contentPlacement: contentPlacementRef
		};
	},
	render() {
		const { mergedClsPrefix, onRender, handleStepClick, disabled, contentPlacement, vertical } = this;
		const descriptionNode = require__utils_vue_resolve_slot.resolveWrappedSlot(this.$slots.default, (children) => {
			const mergedDescription = children || this.description;
			if (mergedDescription) return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 1,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-step-content__description`)
			}, [require_vdom.normalizeVNode(() => mergedDescription)], 2);
			return null;
		});
		const splitorNode = ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-step-splitor`) }, null, 2));
		const indicatorNode = ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-step-indicator`),
			key: contentPlacement
		}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-step-indicator-slot`) }, [(0, vue.createVNode)(require__internal_icon_switch_transition_src_IconSwitchTransition, null, { default: () => {
			return require__utils_vue_resolve_slot.resolveWrappedSlot(this.$slots.icon, (icon) => {
				const { mergedStatus, stepsSlots } = this;
				return !(mergedStatus === "finish" || mergedStatus === "error") ? icon || ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: this.internalIndex,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-step-indicator-slot__index`)
				}, [require_vdom.normalizeVNode(() => this.internalIndex)], 2)) : mergedStatus === "finish" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
					clsPrefix: mergedClsPrefix,
					key: "finish"
				}, { default: () => require__utils_vue_resolve_slot.resolveSlot(stepsSlots["finish-icon"], () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Checkmark))]) }, 1032, ["clsPrefix"])) : mergedStatus === "error" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
					clsPrefix: mergedClsPrefix,
					key: "error"
				}, { default: () => require__utils_vue_resolve_slot.resolveSlot(stepsSlots["error-icon"], () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Close))]) }, 1032, ["clsPrefix"])) : null;
			});
		} }, 1024)], 2), vertical ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => splitorNode)], 64)) : require_vdom.normalizeVNode(() => null)], 2));
		const contentNode = ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-step-content`) }, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-step-content-header`) }, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-step-content-header__title`) }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(this.$slots.title, () => [this.title]))], 2), !vertical && contentPlacement === "right" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => splitorNode)], 64)) : require_vdom.normalizeVNode(() => null)], 2), require_vdom.normalizeVNode(() => descriptionNode)], 2));
		let stepNode;
		if (!vertical && contentPlacement === "bottom") stepNode = ((stepNode) => {
			return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 5 }, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-step-line`) }, [require_vdom.normalizeVNode(() => indicatorNode), require_vdom.normalizeVNode(() => splitorNode)], 2), require_vdom.normalizeVNode(() => contentNode)], 64);
		})(stepNode);
		else stepNode = ((stepNode) => {
			return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 6 }, [require_vdom.normalizeVNode(() => indicatorNode), require_vdom.normalizeVNode(() => contentNode)], 64);
		})(stepNode);
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-step`,
				disabled && `${mergedClsPrefix}-step--disabled`,
				!disabled && handleStepClick && `${mergedClsPrefix}-step--clickable`,
				this.themeClass,
				descriptionNode && `${mergedClsPrefix}-step--show-description`,
				`${mergedClsPrefix}-step--${this.mergedStatus}-status`
			]),
			style: (0, vue.normalizeStyle)(this.cssVars),
			onClick: handleStepClick
		}, [require_vdom.normalizeVNode(() => stepNode)], 14, _hoisted_1);
	}
});
//#endregion
exports.default = Step_default;
exports.stepProps = stepProps;
