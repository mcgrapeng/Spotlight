import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import thingLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { Fragment, computed, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/thing/src/Thing.tsx
const thingProps = {
  ...useTheme.props,
  title: String,
  titleExtra: String,
  description: String,
  descriptionClass: String,
  descriptionStyle: [String, Object],
  content: String,
  contentClass: String,
  contentStyle: [String, Object],
  contentIndented: Boolean
};
var Thing_default = defineComponent({
  name: "Thing",
  props: thingProps,
  slots: Object,
  setup(props, {
    slots
  }) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef
    } = useConfig(props);
    const themeRef = useTheme("Thing", "-thing", index_cssr_default, thingLight, props, mergedClsPrefixRef);
    const rtlEnabledRef = useRtl("Thing", mergedRtlRef, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        self: {
          titleTextColor,
          textColor,
          titleFontWeight,
          fontSize
        },
        common: {
          cubicBezierEaseInOut
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-font-size": fontSize,
        "--n-text-color": textColor,
        "--n-title-font-weight": titleFontWeight,
        "--n-title-text-color": titleTextColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("thing", void 0, cssVarsRef, props) : void 0;
    return () => {
      const {
        value: mergedClsPrefix
      } = mergedClsPrefixRef;
      const rtlEnabled = rtlEnabledRef ? rtlEnabledRef.value : false;
      themeClassHandle?.onRender?.();
      return openBlock(), createElementBlock("div", {
        class: normalizeClass$1([`${mergedClsPrefix}-thing`, themeClassHandle?.themeClass, rtlEnabled && `${mergedClsPrefix}-thing--rtl`]),
        style: normalizeStyle(inlineThemeDisabled ? void 0 : cssVarsRef.value)
      }, [slots.avatar && props.contentIndented ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass$1(`${mergedClsPrefix}-thing-avatar`)
      }, [normalizeVNode(() => slots.avatar())], 2)) : normalizeVNode(() => null), createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-thing-main`)
      }, [!props.contentIndented && (slots.header || props.title || slots["header-extra"] || props.titleExtra || slots.avatar) ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass$1(`${mergedClsPrefix}-thing-avatar-header-wrapper`)
      }, [slots.avatar ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass$1(`${mergedClsPrefix}-thing-avatar`)
      }, [normalizeVNode(() => slots.avatar())], 2)) : normalizeVNode(() => null), slots.header || props.title || slots["header-extra"] || props.titleExtra ? (openBlock(), createElementBlock("div", {
        key: 2,
        class: normalizeClass$1(`${mergedClsPrefix}-thing-header-wrapper`)
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-thing-header`)
      }, [slots.header || props.title ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass$1(`${mergedClsPrefix}-thing-header__title`)
      }, [slots.header ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => slots.header())], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => props.title)], 64))], 2)) : normalizeVNode(() => null), slots["header-extra"] || props.titleExtra ? (openBlock(), createElementBlock("div", {
        key: 2,
        class: normalizeClass$1(`${mergedClsPrefix}-thing-header__extra`)
      }, [slots["header-extra"] ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => slots["header-extra"]())], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => props.titleExtra)], 64))], 2)) : normalizeVNode(() => null)], 2), slots.description || props.description ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass$1([`${mergedClsPrefix}-thing-main__description`, props.descriptionClass]),
        style: normalizeStyle(props.descriptionStyle)
      }, [slots.description ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => slots.description())], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => props.description)], 64))], 6)) : normalizeVNode(() => null)], 2)) : normalizeVNode(() => null)], 2)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [slots.header || props.title || slots["header-extra"] || props.titleExtra ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass$1(`${mergedClsPrefix}-thing-header`)
      }, [slots.header || props.title ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass$1(`${mergedClsPrefix}-thing-header__title`)
      }, [slots.header ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => slots.header())], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => props.title)], 64))], 2)) : normalizeVNode(() => null), slots["header-extra"] || props.titleExtra ? (openBlock(), createElementBlock("div", {
        key: 2,
        class: normalizeClass$1(`${mergedClsPrefix}-thing-header__extra`)
      }, [slots["header-extra"] ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => slots["header-extra"]())], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => props.titleExtra)], 64))], 2)) : normalizeVNode(() => null)], 2)) : normalizeVNode(() => null), slots.description || props.description ? (openBlock(), createElementBlock("div", {
        key: 2,
        class: normalizeClass$1([`${mergedClsPrefix}-thing-main__description`, props.descriptionClass]),
        style: normalizeStyle(props.descriptionStyle)
      }, [slots.description ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => slots.description())], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => props.description)], 64))], 6)) : normalizeVNode(() => null)], 64)), slots.default || props.content ? (openBlock(), createElementBlock("div", {
        key: 2,
        class: normalizeClass$1([`${mergedClsPrefix}-thing-main__content`, props.contentClass]),
        style: normalizeStyle(props.contentStyle)
      }, [slots.default ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => slots.default())], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => props.content)], 64))], 6)) : normalizeVNode(() => null), slots.footer ? (openBlock(), createElementBlock("div", {
        key: 4,
        class: normalizeClass$1(`${mergedClsPrefix}-thing-main__footer`)
      }, [normalizeVNode(() => slots.footer())], 2)) : normalizeVNode(() => null), slots.action ? (openBlock(), createElementBlock("div", {
        key: 6,
        class: normalizeClass$1(`${mergedClsPrefix}-thing-main__action`)
      }, [normalizeVNode(() => slots.action())], 2)) : normalizeVNode(() => null)], 2)], 6);
    };
  }
});
//#endregion
export { Thing_default as default, thingProps };