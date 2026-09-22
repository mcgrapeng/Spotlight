Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_popover_src_Popover = require("../../popover/src/Popover.js");
const require_tooltip_styles_light = require("../styles/light.js");
let vue = require("vue");
//#region src/tooltip/src/Tooltip.ts
const tooltipProps = {
	...require_popover_src_Popover.popoverBaseProps,
	...require__mixins_use_theme.default.props
};
var Tooltip_default = (0, vue.defineComponent)({
	name: "Tooltip",
	props: tooltipProps,
	slots: Object,
	__popover__: true,
	setup(props) {
		const { mergedClsPrefixRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Tooltip", "-tooltip", void 0, require_tooltip_styles_light, props, mergedClsPrefixRef);
		const popoverRef = (0, vue.ref)(null);
		return {
			syncPosition() {
				popoverRef.value.syncPosition();
			},
			setShow(show) {
				popoverRef.value.setShow(show);
			},
			popoverRef,
			mergedTheme: themeRef,
			popoverThemeOverrides: (0, vue.computed)(() => {
				return themeRef.value.self;
			})
		};
	},
	render() {
		const { mergedTheme, internalExtraClass } = this;
		return (0, vue.h)(require_popover_src_Popover.default, {
			...this.$props,
			theme: mergedTheme.peers.Popover,
			themeOverrides: mergedTheme.peerOverrides.Popover,
			builtinThemeOverrides: this.popoverThemeOverrides,
			internalExtraClass: internalExtraClass.concat("tooltip"),
			ref: "popoverRef"
		}, this.$slots);
	}
});
//#endregion
exports.default = Tooltip_default;
exports.tooltipProps = tooltipProps;
