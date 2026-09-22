import { createKey } from "../../_utils/cssr/index.mjs";
import { warn } from "../../_utils/naive/warn.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import typographyLight from "../styles/light.mjs";
import text_cssr_default from "./styles/text.cssr.mjs";
import { Fragment, computed, createElementBlock, defineComponent, h, normalizeStyle, openBlock } from "vue";
import { useCompitable } from "vooks";
//#region src/typography/src/text.tsx
const textProps = {
  ...useTheme.props,
  code: Boolean,
  type: {
    type: String,
    default: "default"
  },
  delete: Boolean,
  strong: Boolean,
  italic: Boolean,
  underline: Boolean,
  depth: [String, Number],
  tag: String,
  as: {
    type: String,
    validator: () => {
      if (process.env.NODE_ENV !== "production") warn("text", "`as` is deprecated, please use `tag` instead.");
      return true;
    },
    default: void 0
  }
};
var text_default = defineComponent({
  name: "Text",
  props: textProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Typography", "-text", text_cssr_default, typographyLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        depth,
        type
      } = props;
      const textColorKey = type === "default" ? depth === void 0 ? "textColor" : `textColor${depth}Depth` : createKey("textColor", type);
      const {
        common: {
          fontWeightStrong,
          fontFamilyMono,
          cubicBezierEaseInOut
        },
        self: {
          codeTextColor,
          codeBorderRadius,
          codeColor,
          codeBorder,
          [textColorKey]: textColor
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-text-color": textColor,
        "--n-font-weight-strong": fontWeightStrong,
        "--n-font-famliy-mono": fontFamilyMono,
        "--n-code-border-radius": codeBorderRadius,
        "--n-code-text-color": codeTextColor,
        "--n-code-color": codeColor,
        "--n-code-border": codeBorder
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("text", computed(() => `${props.type[0]}${props.depth || ""}`), cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      compitableTag: useCompitable(props, ["as", "tag"]),
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedClsPrefix
    } = this;
    this.onRender?.();
    const textClass = [`${mergedClsPrefix}-text`, this.themeClass, {
      [`${mergedClsPrefix}-text--code`]: this.code,
      [`${mergedClsPrefix}-text--delete`]: this.delete,
      [`${mergedClsPrefix}-text--strong`]: this.strong,
      [`${mergedClsPrefix}-text--italic`]: this.italic,
      [`${mergedClsPrefix}-text--underline`]: this.underline
    }];
    const children = this.$slots.default?.();
    return this.code ? (openBlock(), createElementBlock("code", {
      key: 1,
      class: normalizeClass$1(textClass),
      style: normalizeStyle(this.cssVars)
    }, [this.delete ? (openBlock(), createElementBlock("del", {
      key: 0
    }, [normalizeVNode(() => children)])) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => children)], 64))], 6)) : this.delete ? (openBlock(), createElementBlock("del", {
      key: 2,
      class: normalizeClass$1(textClass),
      style: normalizeStyle(this.cssVars)
    }, [normalizeVNode(() => children)], 6)) : h(this.compitableTag || "span", {
      class: textClass,
      style: this.cssVars
    }, children);
  }
});
//#endregion
export { text_default as default, textProps };