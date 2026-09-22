import { createKey } from "../../_utils/cssr/index.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Error_default from "../../_internal/icons/Error.mjs";
import Info_default from "../../_internal/icons/Info.mjs";
import Success_default from "../../_internal/icons/Success.mjs";
import Warning_default from "../../_internal/icons/Warning.mjs";
import resultLight from "../styles/light.mjs";
import { render403 } from "./403.mjs";
import { render404 } from "./404.mjs";
import { render418 } from "./418.mjs";
import { render500 } from "./500.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { computed, createBlock, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/result/src/Result.tsx
const iconRenderMap = {
  403: render403,
  404: render404,
  418: render418,
  500: render500,
  info: () => (openBlock(), createBlock(Info_default)),
  success: () => (openBlock(), createBlock(Success_default)),
  warning: () => (openBlock(), createBlock(Warning_default)),
  error: () => (openBlock(), createBlock(Error_default))
};
const resultProps = {
  ...useTheme.props,
  size: String,
  status: {
    type: String,
    default: "info"
  },
  title: String,
  description: String
};
var Result_default = defineComponent({
  name: "Result",
  props: resultProps,
  slots: Object,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedComponentPropsRef
    } = useConfig(props);
    const mergedSizeRef = computed(() => {
      return props.size || mergedComponentPropsRef?.value?.Result?.size || "medium";
    });
    const themeRef = useTheme("Result", "-result", index_cssr_default, resultLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        status
      } = props;
      const size = mergedSizeRef.value;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          textColor,
          lineHeight,
          titleTextColor,
          titleFontWeight,
          [createKey("iconColor", status)]: iconColor,
          [createKey("fontSize", size)]: fontSize,
          [createKey("titleFontSize", size)]: titleFontSize,
          [createKey("iconSize", size)]: iconSize
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-font-size": fontSize,
        "--n-icon-size": iconSize,
        "--n-line-height": lineHeight,
        "--n-text-color": textColor,
        "--n-title-font-size": titleFontSize,
        "--n-title-font-weight": titleFontWeight,
        "--n-title-text-color": titleTextColor,
        "--n-icon-color": iconColor || ""
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("result", computed(() => {
      const {
        status
      } = props;
      const size = mergedSizeRef.value;
      let hash = "";
      if (size) hash += size[0];
      if (status) hash += status[0];
      return hash;
    }), cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      status,
      $slots,
      mergedClsPrefix,
      onRender
    } = this;
    onRender?.();
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-result`, this.themeClass]),
      style: normalizeStyle(this.cssVars)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-result-icon`)
    }, [normalizeVNode(() => $slots.icon?.() || (openBlock(), createBlock(Icon_default, {
      clsPrefix: mergedClsPrefix
    }, {
      default: () => iconRenderMap[status]()
    }, 1032, ["clsPrefix"])))], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-result-header`)
    }, [this.title ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-result-header__title`)
    }, [normalizeVNode(() => this.title)], 2)) : normalizeVNode(() => null), this.description ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1(`${mergedClsPrefix}-result-header__description`)
    }, [normalizeVNode(() => this.description)], 2)) : normalizeVNode(() => null)], 2), normalizeVNode(() => $slots.default && (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-result-content`)
    }, [normalizeVNode(() => $slots.default())], 2))), normalizeVNode(() => $slots.footer && (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-result-footer`)
    }, [normalizeVNode(() => $slots.footer())], 2)))], 6);
  }
});
//#endregion
export { Result_default as default, resultProps };