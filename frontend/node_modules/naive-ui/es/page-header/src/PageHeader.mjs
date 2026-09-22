import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import ArrowBack_default from "../../_internal/icons/ArrowBack.mjs";
import { pageHeaderLight } from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { Fragment, computed, createBlock, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/page-header/src/PageHeader.tsx
const pageHeaderProps = {
  ...useTheme.props,
  title: String,
  subtitle: String,
  extra: String,
  onBack: Function
};
var PageHeader_default = defineComponent({
  name: "PageHeader",
  props: pageHeaderProps,
  slots: Object,
  setup(props) {
    const {
      mergedClsPrefixRef,
      mergedRtlRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("PageHeader", "-page-header", index_cssr_default, pageHeaderLight, props, mergedClsPrefixRef);
    const rtlEnabledRef = useRtl("PageHeader", mergedRtlRef, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        self: {
          titleTextColor,
          subtitleTextColor,
          backColor,
          fontSize,
          titleFontSize,
          backSize,
          titleFontWeight,
          backColorHover,
          backColorPressed
        },
        common: {
          cubicBezierEaseInOut
        }
      } = themeRef.value;
      return {
        "--n-title-text-color": titleTextColor,
        "--n-title-font-size": titleFontSize,
        "--n-title-font-weight": titleFontWeight,
        "--n-font-size": fontSize,
        "--n-back-size": backSize,
        "--n-subtitle-text-color": subtitleTextColor,
        "--n-back-color": backColor,
        "--n-back-color-hover": backColorHover,
        "--n-back-color-pressed": backColorPressed,
        "--n-bezier": cubicBezierEaseInOut
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("page-header", void 0, cssVarsRef, props) : void 0;
    return {
      rtlEnabled: rtlEnabledRef,
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      onBack,
      title,
      subtitle,
      extra,
      mergedClsPrefix,
      cssVars,
      $slots
    } = this;
    this.onRender?.();
    const {
      title: titleSlot,
      subtitle: subtitleSlot,
      extra: extraSlot,
      default: defaultSlot,
      header: headerSlot,
      avatar: avatarSlot,
      footer: footerSlot,
      back: backSlot
    } = $slots;
    const showBack = onBack;
    const showTitle = title || titleSlot;
    const showSubtitle = subtitle || subtitleSlot;
    const showExtra = extra || extraSlot;
    return openBlock(), createElementBlock("div", {
      style: normalizeStyle(cssVars),
      class: normalizeClass$1([`${mergedClsPrefix}-page-header-wrapper`, this.themeClass, this.rtlEnabled && `${mergedClsPrefix}-page-header-wrapper--rtl`])
    }, [headerSlot ? (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-page-header-header`),
      key: "breadcrumb"
    }, [normalizeVNode(() => headerSlot())], 2)) : normalizeVNode(() => null), normalizeVNode(() => (showBack || avatarSlot || showTitle || showSubtitle || showExtra) && (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-page-header`),
      key: "header"
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-page-header__main`),
      key: "back"
    }, [showBack ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-page-header__back`),
      onClick: onBack
    }, [backSlot ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => backSlot())], 64)) : (openBlock(), createBlock(Icon_default, {
      key: 1,
      clsPrefix: mergedClsPrefix
    }, {
      default: () => (openBlock(), createBlock(ArrowBack_default))
    }, 1032, ["clsPrefix"]))], 10, ["onClick"])) : normalizeVNode(() => null), avatarSlot ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1(`${mergedClsPrefix}-page-header__avatar`)
    }, [normalizeVNode(() => avatarSlot())], 2)) : normalizeVNode(() => null), showTitle ? (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-page-header__title`),
      key: "title"
    }, [normalizeVNode(() => title || titleSlot())], 2)) : normalizeVNode(() => null), showSubtitle ? (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-page-header__subtitle`),
      key: "subtitle"
    }, [normalizeVNode(() => subtitle || subtitleSlot())], 2)) : normalizeVNode(() => null)], 2), showExtra ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-page-header__extra`)
    }, [normalizeVNode(() => extra || extraSlot())], 2)) : normalizeVNode(() => null)], 2))), defaultSlot ? (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-page-header-content`),
      key: "content"
    }, [normalizeVNode(() => defaultSlot())], 2)) : normalizeVNode(() => null), footerSlot ? (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-page-header-footer`),
      key: "footer"
    }, [normalizeVNode(() => footerSlot())], 2)) : normalizeVNode(() => null)], 6);
  }
});
//#endregion
export { PageHeader_default as default, pageHeaderProps };