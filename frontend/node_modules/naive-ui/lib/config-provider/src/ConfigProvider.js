Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require_config_provider_src_context = require("./context.js");
require("../../_mixins/use-config.js");
let vue = require("vue");
let vooks = require("vooks");
let css_render = require("css-render");
let lodash_es = require("lodash");
//#region src/config-provider/src/ConfigProvider.ts
const configProviderProps = {
	abstract: Boolean,
	bordered: {
		type: Boolean,
		default: void 0
	},
	clsPrefix: String,
	locale: Object,
	dateLocale: Object,
	namespace: String,
	rtl: Array,
	tag: {
		type: String,
		default: "div"
	},
	hljs: Object,
	katex: Object,
	theme: Object,
	themeOverrides: Object,
	componentOptions: Object,
	icons: Object,
	breakpoints: Object,
	preflightStyleDisabled: Boolean,
	styleMountTarget: Object,
	inlineThemeDisabled: {
		type: Boolean,
		default: void 0
	},
	as: {
		type: String,
		validator: () => {
			require__utils_naive_warn.warn("config-provider", "`as` is deprecated, please use `tag` instead.");
			return true;
		},
		default: void 0
	}
};
var ConfigProvider_default = (0, vue.defineComponent)({
	name: "ConfigProvider",
	alias: ["App"],
	props: configProviderProps,
	setup(props) {
		const NConfigProvider = (0, vue.inject)(require_config_provider_src_context.configProviderInjectionKey, null);
		const mergedThemeRef = (0, vue.computed)(() => {
			const { theme } = props;
			if (theme === null) return void 0;
			const inheritedTheme = NConfigProvider?.mergedThemeRef.value;
			return theme === void 0 ? inheritedTheme : inheritedTheme === void 0 ? theme : Object.assign({}, inheritedTheme, theme);
		});
		const mergedThemeOverridesRef = (0, vue.computed)(() => {
			const { themeOverrides } = props;
			if (themeOverrides === null) return void 0;
			if (themeOverrides === void 0) return NConfigProvider?.mergedThemeOverridesRef.value;
			else {
				const inheritedThemeOverrides = NConfigProvider?.mergedThemeOverridesRef.value;
				if (inheritedThemeOverrides === void 0) return themeOverrides;
				else return (0, lodash_es.merge)({}, inheritedThemeOverrides, themeOverrides);
			}
		});
		const mergedNamespaceRef = (0, vooks.useMemo)(() => {
			const { namespace } = props;
			return namespace === void 0 ? NConfigProvider?.mergedNamespaceRef.value : namespace;
		});
		const mergedBorderedRef = (0, vooks.useMemo)(() => {
			const { bordered } = props;
			return bordered === void 0 ? NConfigProvider?.mergedBorderedRef.value : bordered;
		});
		const mergedIconsRef = (0, vue.computed)(() => {
			const { icons } = props;
			return icons === void 0 ? NConfigProvider?.mergedIconsRef.value : icons;
		});
		const mergedComponentPropsRef = (0, vue.computed)(() => {
			const { componentOptions } = props;
			if (componentOptions !== void 0) return componentOptions;
			return NConfigProvider?.mergedComponentPropsRef.value;
		});
		const mergedClsPrefixRef = (0, vue.computed)(() => {
			const { clsPrefix } = props;
			if (clsPrefix !== void 0) return clsPrefix;
			if (NConfigProvider) return NConfigProvider.mergedClsPrefixRef.value;
			return "n";
		});
		const mergedRtlRef = (0, vue.computed)(() => {
			const { rtl } = props;
			if (rtl === void 0) return NConfigProvider?.mergedRtlRef.value;
			const rtlEnabledState = {};
			for (const rtlInfo of rtl) {
				rtlEnabledState[rtlInfo.name] = (0, vue.markRaw)(rtlInfo);
				rtlInfo.peers?.forEach((peerRtlInfo) => {
					if (!(peerRtlInfo.name in rtlEnabledState)) rtlEnabledState[peerRtlInfo.name] = (0, vue.markRaw)(peerRtlInfo);
				});
			}
			return rtlEnabledState;
		});
		const mergedBreakpointsRef = (0, vue.computed)(() => {
			return props.breakpoints || NConfigProvider?.mergedBreakpointsRef.value;
		});
		const inlineThemeDisabled = props.inlineThemeDisabled || NConfigProvider?.inlineThemeDisabled;
		const preflightStyleDisabled = props.preflightStyleDisabled || NConfigProvider?.preflightStyleDisabled;
		const styleMountTarget = props.styleMountTarget || NConfigProvider?.styleMountTarget;
		const mergedThemeHashRef = (0, vue.computed)(() => {
			const { value: theme } = mergedThemeRef;
			const { value: mergedThemeOverrides } = mergedThemeOverridesRef;
			const hasThemeOverrides = mergedThemeOverrides && Object.keys(mergedThemeOverrides).length !== 0;
			const themeName = theme?.name;
			if (themeName) {
				if (hasThemeOverrides) return `${themeName}-${(0, css_render.hash)(JSON.stringify(mergedThemeOverridesRef.value))}`;
				return themeName;
			} else {
				if (hasThemeOverrides) return (0, css_render.hash)(JSON.stringify(mergedThemeOverridesRef.value));
				return "";
			}
		});
		(0, vue.provide)(require_config_provider_src_context.configProviderInjectionKey, {
			mergedThemeHashRef,
			mergedBreakpointsRef,
			mergedRtlRef,
			mergedIconsRef,
			mergedComponentPropsRef,
			mergedBorderedRef,
			mergedNamespaceRef,
			mergedClsPrefixRef,
			mergedLocaleRef: (0, vue.computed)(() => {
				const { locale } = props;
				if (locale === null) return void 0;
				return locale === void 0 ? NConfigProvider?.mergedLocaleRef.value : locale;
			}),
			mergedDateLocaleRef: (0, vue.computed)(() => {
				const { dateLocale } = props;
				if (dateLocale === null) return void 0;
				return dateLocale === void 0 ? NConfigProvider?.mergedDateLocaleRef.value : dateLocale;
			}),
			mergedHljsRef: (0, vue.computed)(() => {
				const { hljs } = props;
				return hljs === void 0 ? NConfigProvider?.mergedHljsRef.value : hljs;
			}),
			mergedKatexRef: (0, vue.computed)(() => {
				const { katex } = props;
				return katex === void 0 ? NConfigProvider?.mergedKatexRef.value : katex;
			}),
			mergedThemeRef,
			mergedThemeOverridesRef,
			inlineThemeDisabled: inlineThemeDisabled || false,
			preflightStyleDisabled: preflightStyleDisabled || false,
			styleMountTarget
		});
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			mergedBordered: mergedBorderedRef,
			mergedNamespace: mergedNamespaceRef,
			mergedTheme: mergedThemeRef,
			mergedThemeOverrides: mergedThemeOverridesRef
		};
	},
	render() {
		return !this.abstract ? (0, vue.h)(this.as || this.tag, { class: `${this.mergedClsPrefix || "n"}-config-provider` }, this.$slots.default?.()) : this.$slots.default?.();
	}
});
//#endregion
exports.configProviderProps = configProviderProps;
exports.default = ConfigProvider_default;
