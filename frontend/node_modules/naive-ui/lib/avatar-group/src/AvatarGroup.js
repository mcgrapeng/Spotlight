Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_avatar_src_context = require("../../avatar/src/context.js");
const require_avatar_src_Avatar = require("../../avatar/src/Avatar.js");
const require_avatar_group_styles_light = require("../styles/light.js");
const require_avatar_group_src_styles_avatar_group_cssr = require("./styles/avatar-group.cssr.js");
let vue = require("vue");
//#region src/avatar-group/src/AvatarGroup.tsx
const avatarGroupProps = {
	...require__mixins_use_theme.default.props,
	max: Number,
	maxStyle: [Object, String],
	options: {
		type: Array,
		default: () => []
	},
	vertical: Boolean,
	expandOnHover: Boolean,
	size: [String, Number]
};
var AvatarGroup_default = (0, vue.defineComponent)({
	name: "AvatarGroup",
	props: avatarGroupProps,
	slots: Object,
	setup(props) {
		const { mergedClsPrefixRef, mergedRtlRef } = require__mixins_use_config.default(props);
		const mergedThemeRef = require__mixins_use_theme.default("AvatarGroup", "-avatar-group", require_avatar_group_src_styles_avatar_group_cssr, require_avatar_group_styles_light.default, props, mergedClsPrefixRef);
		(0, vue.provide)(require_avatar_src_context.avatarGroupInjectionKey, props);
		return {
			mergedTheme: mergedThemeRef,
			rtlEnabled: require__mixins_use_rtl.useRtl("AvatarGroup", mergedRtlRef, mergedClsPrefixRef),
			mergedClsPrefix: mergedClsPrefixRef,
			restOptions: (0, vue.computed)(() => {
				const { max } = props;
				if (max === void 0) return void 0;
				const { options } = props;
				if (options.length > max) return options.slice(max - 1, options.length);
				return [];
			}),
			displayedOptions: (0, vue.computed)(() => {
				const { options, max } = props;
				if (max === void 0) return options;
				if (options.length > max) return options.slice(0, max - 1);
				if (options.length === max) return options.slice(0, max);
				return options;
			}),
			cssVars: (0, vue.computed)(() => {
				return { "--n-gap": mergedThemeRef.value.self.gap };
			})
		};
	},
	render() {
		const { mergedClsPrefix, displayedOptions, restOptions, mergedTheme, $slots } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-avatar-group`,
				this.rtlEnabled && `${mergedClsPrefix}-avatar-group--rtl`,
				this.vertical && `${mergedClsPrefix}-avatar-group--vertical`,
				this.expandOnHover && `${mergedClsPrefix}-avatar-group--expand-on-hover`
			]),
			style: (0, vue.normalizeStyle)(this.cssVars),
			role: "group"
		}, [require_vdom.normalizeVNode(() => displayedOptions.map((option) => {
			return $slots.avatar ? $slots.avatar({ option }) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_avatar_src_Avatar.default, {
				key: 1,
				src: option.src,
				theme: mergedTheme.peers.Avatar,
				themeOverrides: mergedTheme.peerOverrides.Avatar
			}, null, 8, [
				"src",
				"theme",
				"themeOverrides"
			]));
		})), require_vdom.normalizeVNode(() => restOptions !== void 0 && restOptions.length > 0 && ($slots.rest ? $slots.rest({
			options: restOptions,
			rest: restOptions.length
		}) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_avatar_src_Avatar.default, {
			key: 2,
			style: (0, vue.normalizeStyle)(this.maxStyle),
			theme: mergedTheme.peers.Avatar,
			themeOverrides: mergedTheme.peerOverrides.Avatar
		}, { default: () => `+${restOptions.length}` }, 1032, [
			"style",
			"theme",
			"themeOverrides"
		]))))], 6);
	}
});
//#endregion
exports.avatarGroupProps = avatarGroupProps;
exports.default = AvatarGroup_default;
