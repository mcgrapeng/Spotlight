Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_create_injection_key = require("../../_utils/vue/create-injection-key.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_timeline_styles_light = require("../styles/light.js");
const require_timeline_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/timeline/src/Timeline.tsx
const timelineProps = {
	...require__mixins_use_theme.default.props,
	horizontal: Boolean,
	itemPlacement: {
		type: String,
		default: "left"
	},
	size: {
		type: String,
		default: "medium"
	},
	iconSize: Number
};
const timelineInjectionKey = require__utils_vue_create_injection_key.createInjectionKey("n-timeline");
var Timeline_default = (0, vue.defineComponent)({
	name: "Timeline",
	props: timelineProps,
	setup(props, { slots }) {
		const { mergedClsPrefixRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Timeline", "-timeline", require_timeline_src_styles_index_cssr, require_timeline_styles_light, props, mergedClsPrefixRef);
		(0, vue.provide)(timelineInjectionKey, {
			props,
			mergedThemeRef: themeRef,
			mergedClsPrefixRef
		});
		return () => {
			const { value: mergedClsPrefix } = mergedClsPrefixRef;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-timeline`,
				props.horizontal && `${mergedClsPrefix}-timeline--horizontal`,
				`${mergedClsPrefix}-timeline--${props.size}-size`,
				!props.horizontal && `${mergedClsPrefix}-timeline--${props.itemPlacement}-placement`
			]) }, [require_vdom.normalizeVNode(() => slots.default?.())], 2);
		};
	}
});
//#endregion
exports.default = Timeline_default;
exports.timelineInjectionKey = timelineInjectionKey;
exports.timelineProps = timelineProps;
