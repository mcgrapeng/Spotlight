Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_keep = require("../../_utils/vue/keep.js");
const require__utils_vue_omit = require("../../_utils/vue/omit.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_popover_src_Popover = require("../../popover/src/Popover.js");
const require_popconfirm_styles_light = require("../styles/light.js");
const require_popconfirm_src_interface = require("./interface.js");
const require_popconfirm_src_PopconfirmPanel = require("./PopconfirmPanel.js");
const require_popconfirm_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/popconfirm/src/Popconfirm.tsx
const popconfirmProps = {
	...require__mixins_use_theme.default.props,
	...require_popover_src_Popover.popoverBaseProps,
	positiveText: String,
	negativeText: String,
	showIcon: {
		type: Boolean,
		default: true
	},
	trigger: {
		type: String,
		default: "click"
	},
	positiveButtonProps: Object,
	negativeButtonProps: Object,
	onPositiveClick: Function,
	onNegativeClick: Function
};
var Popconfirm_default = (0, vue.defineComponent)({
	name: "Popconfirm",
	props: popconfirmProps,
	slots: Object,
	__popover__: true,
	setup(props) {
		const { mergedClsPrefixRef } = require__mixins_use_config.default();
		const themeRef = require__mixins_use_theme.default("Popconfirm", "-popconfirm", require_popconfirm_src_styles_index_cssr, require_popconfirm_styles_light.default, props, mergedClsPrefixRef);
		const popoverInstRef = (0, vue.ref)(null);
		function handlePositiveClick(e) {
			if (!popoverInstRef.value?.getMergedShow()) return;
			const { onPositiveClick, "onUpdate:show": onUpdateShow } = props;
			Promise.resolve(onPositiveClick ? onPositiveClick(e) : true).then((value) => {
				if (value === false) return;
				popoverInstRef.value?.setShow(false);
				if (onUpdateShow) require__utils_vue_call.call(onUpdateShow, false);
			});
		}
		function handleNegativeClick(e) {
			if (!popoverInstRef.value?.getMergedShow()) return;
			const { onNegativeClick, "onUpdate:show": onUpdateShow } = props;
			Promise.resolve(onNegativeClick ? onNegativeClick(e) : true).then((value) => {
				if (value === false) return;
				popoverInstRef.value?.setShow(false);
				if (onUpdateShow) require__utils_vue_call.call(onUpdateShow, false);
			});
		}
		(0, vue.provide)(require_popconfirm_src_interface.popconfirmInjectionKey, {
			mergedThemeRef: themeRef,
			mergedClsPrefixRef,
			props
		});
		return {
			setShow(value) {
				popoverInstRef.value?.setShow(value);
			},
			syncPosition() {
				popoverInstRef.value?.syncPosition();
			},
			mergedTheme: themeRef,
			popoverInstRef,
			handlePositiveClick,
			handleNegativeClick
		};
	},
	render() {
		const { $slots: slots, $props: props, mergedTheme } = this;
		return (0, vue.openBlock)(), (0, vue.createBlock)(require_popover_src_Popover.default, (0, vue.mergeProps)(require__utils_vue_omit.omit(props, require_popconfirm_src_PopconfirmPanel.panelPropKeys), {
			theme: mergedTheme.peers.Popover,
			themeOverrides: mergedTheme.peerOverrides.Popover,
			internalExtraClass: ["popconfirm"],
			ref: "popoverInstRef"
		}), {
			trigger: slots.trigger,
			default: () => {
				const panelProps = require__utils_vue_keep.keep(props, require_popconfirm_src_PopconfirmPanel.panelPropKeys);
				return (0, vue.openBlock)(), (0, vue.createBlock)(require_popconfirm_src_PopconfirmPanel.default, {
					...panelProps,
					onPositiveClick: this.handlePositiveClick,
					onNegativeClick: this.handleNegativeClick
				}, require_vdom.normalizeSlots(slots), 1040);
			}
		}, 1040, ["theme", "themeOverrides"]);
	}
});
//#endregion
exports.default = Popconfirm_default;
exports.popconfirmProps = popconfirmProps;
