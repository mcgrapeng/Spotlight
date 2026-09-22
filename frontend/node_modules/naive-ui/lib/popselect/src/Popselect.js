Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_create_ref_setter = require("../../_utils/vue/create-ref-setter.js");
const require__utils_vue_keep = require("../../_utils/vue/keep.js");
const require__utils_vue_merge_handlers = require("../../_utils/vue/merge-handlers.js");
const require__utils_vue_omit = require("../../_utils/vue/omit.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_popover_src_Popover = require("../../popover/src/Popover.js");
const require_popselect_styles_light = require("../styles/light.js");
const require_popselect_src_interface = require("./interface.js");
const require_popselect_src_PopselectPanel = require("./PopselectPanel.js");
let vue = require("vue");
//#region src/popselect/src/Popselect.tsx
const popselectProps = {
	...require__mixins_use_theme.default.props,
	...require__utils_vue_omit.omit(require_popover_src_Popover.popoverBaseProps, ["showArrow", "arrow"]),
	placement: {
		...require_popover_src_Popover.popoverBaseProps.placement,
		default: "bottom"
	},
	trigger: {
		type: String,
		default: "hover"
	},
	...require_popselect_src_PopselectPanel.panelProps,
	scrollbarProps: Object
};
var Popselect_default = (0, vue.defineComponent)({
	name: "Popselect",
	props: popselectProps,
	slots: Object,
	inheritAttrs: false,
	__popover__: true,
	setup(props) {
		const { mergedClsPrefixRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Popselect", "-popselect", void 0, require_popselect_styles_light.default, props, mergedClsPrefixRef);
		const popoverInstRef = (0, vue.ref)(null);
		function syncPosition() {
			popoverInstRef.value?.syncPosition();
		}
		function setShow(value) {
			popoverInstRef.value?.setShow(value);
		}
		(0, vue.provide)(require_popselect_src_interface.popselectInjectionKey, {
			props,
			mergedThemeRef: themeRef,
			syncPosition,
			setShow
		});
		return {
			syncPosition,
			setShow,
			popoverInstRef,
			mergedTheme: themeRef
		};
	},
	render() {
		const { mergedTheme } = this;
		const popoverProps = {
			theme: mergedTheme.peers.Popover,
			themeOverrides: mergedTheme.peerOverrides.Popover,
			builtinThemeOverrides: { padding: "0" },
			ref: "popoverInstRef",
			internalRenderBody: (className, ref, style, onMouseenter, onMouseleave) => {
				const { $attrs } = this;
				return (0, vue.openBlock)(), (0, vue.createBlock)(require_popselect_src_PopselectPanel.default, (0, vue.mergeProps)($attrs, {
					class: [$attrs.class, className],
					style: [$attrs.style, ...style]
				}, require__utils_vue_keep.keep(this.$props, require_popselect_src_PopselectPanel.panelPropKeys), {
					ref: require__utils_vue_create_ref_setter.createRefSetter(ref),
					onMouseenter: require__utils_vue_merge_handlers.mergeEventHandlers([onMouseenter, $attrs.onMouseenter]),
					onMouseleave: require__utils_vue_merge_handlers.mergeEventHandlers([onMouseleave, $attrs.onMouseleave])
				}), {
					header: () => this.$slots.header?.(),
					action: () => this.$slots.action?.(),
					empty: () => this.$slots.empty?.()
				}, 1040, [
					"class",
					"style",
					"onMouseenter",
					"onMouseleave"
				]);
			}
		};
		return (0, vue.openBlock)(), (0, vue.createBlock)(require_popover_src_Popover.default, (0, vue.mergeProps)(require__utils_vue_omit.omit(this.$props, require_popselect_src_PopselectPanel.panelPropKeys), popoverProps, { internalDeactivateImmediately: true }), {
			_: 1,
			trigger: require_vdom.normalizeSlot(() => this.$slots.default?.())
		}, 16);
	}
});
//#endregion
exports.default = Popselect_default;
exports.popselectProps = popselectProps;
