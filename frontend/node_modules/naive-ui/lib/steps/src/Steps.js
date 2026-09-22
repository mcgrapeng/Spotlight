Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_create_injection_key = require("../../_utils/vue/create-injection-key.js");
const require__utils_vue_flatten = require("../../_utils/vue/flatten.js");
const require__utils_vue_get_slot = require("../../_utils/vue/get-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_steps_styles_light = require("../styles/light.js");
const require_steps_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/steps/src/Steps.tsx
function stepWithIndex(step, i) {
	if (typeof step !== "object" || step === null || Array.isArray(step)) return null;
	if (!step.props) step.props = {};
	step.props.internalIndex = i + 1;
	return step;
}
function stepsWithIndex(steps) {
	return steps.map((step, i) => stepWithIndex(step, i));
}
const stepsProps = {
	...require__mixins_use_theme.default.props,
	current: Number,
	status: {
		type: String,
		default: "process"
	},
	size: {
		type: String,
		default: "medium"
	},
	vertical: Boolean,
	contentPlacement: {
		type: String,
		default: "right"
	},
	"onUpdate:current": [Function, Array],
	onUpdateCurrent: [Function, Array]
};
const stepsInjectionKey = require__utils_vue_create_injection_key.createInjectionKey("n-steps");
var Steps_default = (0, vue.defineComponent)({
	name: "Steps",
	props: stepsProps,
	slots: Object,
	setup(props, { slots }) {
		const { mergedClsPrefixRef, mergedRtlRef } = require__mixins_use_config.default(props);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Steps", mergedRtlRef, mergedClsPrefixRef);
		const themeRef = require__mixins_use_theme.default("Steps", "-steps", require_steps_src_styles_index_cssr, require_steps_styles_light.default, props, mergedClsPrefixRef);
		(0, vue.provide)(stepsInjectionKey, {
			props,
			mergedThemeRef: themeRef,
			mergedClsPrefixRef,
			stepsSlots: slots
		});
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			rtlEnabled: rtlEnabledRef
		};
	},
	render() {
		const { mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass([
			`${mergedClsPrefix}-steps`,
			this.rtlEnabled && `${mergedClsPrefix}-steps--rtl`,
			this.vertical && `${mergedClsPrefix}-steps--vertical`,
			this.contentPlacement === "bottom" && `${mergedClsPrefix}-steps--content-bottom`
		]) }, [require_vdom.normalizeVNode(() => stepsWithIndex(require__utils_vue_flatten.flatten(require__utils_vue_get_slot.getSlot(this))))], 2);
	}
});
//#endregion
exports.default = Steps_default;
exports.stepsInjectionKey = stepsInjectionKey;
exports.stepsProps = stepsProps;
