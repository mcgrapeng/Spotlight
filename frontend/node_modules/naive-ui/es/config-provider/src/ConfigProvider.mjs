import { warn } from "../../_utils/naive/warn.mjs";
import { configProviderInjectionKey } from "./context.mjs";
import "../../_mixins/use-config.mjs";
import { computed, defineComponent, h, inject, markRaw, provide } from "vue";
import { useMemo } from "vooks";
import { hash } from "css-render";
import { merge } from "lodash-es";
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
      warn("config-provider", "`as` is deprecated, please use `tag` instead.");
      return true;
    },
    default: void 0
  }
};
var ConfigProvider_default = defineComponent({
  name: "ConfigProvider",
  alias: ["App"],
  props: configProviderProps,
  setup(props) {
    const NConfigProvider = inject(configProviderInjectionKey, null);
    const mergedThemeRef = computed(() => {
      const {
        theme
      } = props;
      if (theme === null) return void 0;
      const inheritedTheme = NConfigProvider?.mergedThemeRef.value;
      return theme === void 0 ? inheritedTheme : inheritedTheme === void 0 ? theme : Object.assign({}, inheritedTheme, theme);
    });
    const mergedThemeOverridesRef = computed(() => {
      const {
        themeOverrides
      } = props;
      if (themeOverrides === null) return void 0;
      if (themeOverrides === void 0) return NConfigProvider?.mergedThemeOverridesRef.value;else {
        const inheritedThemeOverrides = NConfigProvider?.mergedThemeOverridesRef.value;
        if (inheritedThemeOverrides === void 0) return themeOverrides;else return merge({}, inheritedThemeOverrides, themeOverrides);
      }
    });
    const mergedNamespaceRef = useMemo(() => {
      const {
        namespace
      } = props;
      return namespace === void 0 ? NConfigProvider?.mergedNamespaceRef.value : namespace;
    });
    const mergedBorderedRef = useMemo(() => {
      const {
        bordered
      } = props;
      return bordered === void 0 ? NConfigProvider?.mergedBorderedRef.value : bordered;
    });
    const mergedIconsRef = computed(() => {
      const {
        icons
      } = props;
      return icons === void 0 ? NConfigProvider?.mergedIconsRef.value : icons;
    });
    const mergedComponentPropsRef = computed(() => {
      const {
        componentOptions
      } = props;
      if (componentOptions !== void 0) return componentOptions;
      return NConfigProvider?.mergedComponentPropsRef.value;
    });
    const mergedClsPrefixRef = computed(() => {
      const {
        clsPrefix
      } = props;
      if (clsPrefix !== void 0) return clsPrefix;
      if (NConfigProvider) return NConfigProvider.mergedClsPrefixRef.value;
      return "n";
    });
    const mergedRtlRef = computed(() => {
      const {
        rtl
      } = props;
      if (rtl === void 0) return NConfigProvider?.mergedRtlRef.value;
      const rtlEnabledState = {};
      for (const rtlInfo of rtl) {
        rtlEnabledState[rtlInfo.name] = markRaw(rtlInfo);
        rtlInfo.peers?.forEach(peerRtlInfo => {
          if (!(peerRtlInfo.name in rtlEnabledState)) rtlEnabledState[peerRtlInfo.name] = markRaw(peerRtlInfo);
        });
      }
      return rtlEnabledState;
    });
    const mergedBreakpointsRef = computed(() => {
      return props.breakpoints || NConfigProvider?.mergedBreakpointsRef.value;
    });
    const inlineThemeDisabled = props.inlineThemeDisabled || NConfigProvider?.inlineThemeDisabled;
    const preflightStyleDisabled = props.preflightStyleDisabled || NConfigProvider?.preflightStyleDisabled;
    const styleMountTarget = props.styleMountTarget || NConfigProvider?.styleMountTarget;
    const mergedThemeHashRef = computed(() => {
      const {
        value: theme
      } = mergedThemeRef;
      const {
        value: mergedThemeOverrides
      } = mergedThemeOverridesRef;
      const hasThemeOverrides = mergedThemeOverrides && Object.keys(mergedThemeOverrides).length !== 0;
      const themeName = theme?.name;
      if (themeName) {
        if (hasThemeOverrides) return `${themeName}-${hash(JSON.stringify(mergedThemeOverridesRef.value))}`;
        return themeName;
      } else {
        if (hasThemeOverrides) return hash(JSON.stringify(mergedThemeOverridesRef.value));
        return "";
      }
    });
    provide(configProviderInjectionKey, {
      mergedThemeHashRef,
      mergedBreakpointsRef,
      mergedRtlRef,
      mergedIconsRef,
      mergedComponentPropsRef,
      mergedBorderedRef,
      mergedNamespaceRef,
      mergedClsPrefixRef,
      mergedLocaleRef: computed(() => {
        const {
          locale
        } = props;
        if (locale === null) return void 0;
        return locale === void 0 ? NConfigProvider?.mergedLocaleRef.value : locale;
      }),
      mergedDateLocaleRef: computed(() => {
        const {
          dateLocale
        } = props;
        if (dateLocale === null) return void 0;
        return dateLocale === void 0 ? NConfigProvider?.mergedDateLocaleRef.value : dateLocale;
      }),
      mergedHljsRef: computed(() => {
        const {
          hljs
        } = props;
        return hljs === void 0 ? NConfigProvider?.mergedHljsRef.value : hljs;
      }),
      mergedKatexRef: computed(() => {
        const {
          katex
        } = props;
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
    return !this.abstract ? h(this.as || this.tag, {
      class: `${this.mergedClsPrefix || "n"}-config-provider`
    }, this.$slots.default?.()) : this.$slots.default?.();
  }
});
//#endregion
export { configProviderProps, ConfigProvider_default as default };