import { formatLength } from "../../_utils/css/format-length.mjs";
import { warn } from "../../_utils/naive/warn.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import iconLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { computed, defineComponent, h, mergeProps } from "vue";
//#region src/icon/src/Icon.ts
const iconProps = {
  ...useTheme.props,
  depth: [String, Number],
  size: [Number, String],
  color: String,
  component: [Object, Function]
};
const NIcon = defineComponent({
  _n_icon__: true,
  name: "Icon",
  inheritAttrs: false,
  props: iconProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Icon", "-icon", index_cssr_default, iconLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        depth
      } = props;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self
      } = themeRef.value;
      if (depth !== void 0) {
        const {
          color,
          [`opacity${depth}Depth`]: opacity
        } = self;
        return {
          "--n-bezier": cubicBezierEaseInOut,
          "--n-color": color,
          "--n-opacity": opacity
        };
      }
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-color": "",
        "--n-opacity": ""
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("icon", computed(() => `${props.depth || "d"}`), cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      mergedStyle: computed(() => {
        const {
          size,
          color
        } = props;
        return {
          fontSize: formatLength(size),
          color
        };
      }),
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      $parent,
      depth,
      mergedClsPrefix,
      component,
      onRender,
      themeClass
    } = this;
    if ($parent?.$options?._n_icon__) warn("icon", "don't wrap `n-icon` inside `n-icon`");
    onRender?.();
    return h("i", mergeProps(this.$attrs, {
      role: "img",
      class: [`${mergedClsPrefix}-icon`, themeClass, {
        [`${mergedClsPrefix}-icon--depth`]: depth,
        [`${mergedClsPrefix}-icon--color-transition`]: depth !== void 0
      }],
      style: [this.cssVars, this.mergedStyle]
    }), component ? h(component) : this.$slots.default?.());
  }
});
//#endregion
export { NIcon, iconProps };