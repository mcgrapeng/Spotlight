import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import elementLight from "../styles/light.mjs";
import { computed, defineComponent, h } from "vue";
import { kebabCase } from "lodash-es";
//#region src/element/src/Element.ts
const elementProps = {
  ...useTheme.props,
  tag: {
    type: String,
    default: "div"
  }
};
var Element_default = defineComponent({
  name: "Element",
  alias: ["El"],
  props: elementProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Element", "-element", void 0, elementLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        common
      } = themeRef.value;
      return Object.keys(common).reduce((prevValue, key) => {
        prevValue[`--${kebabCase(key)}`] = common[key];
        return prevValue;
      }, {});
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("element", void 0, cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      tag,
      mergedClsPrefix,
      cssVars,
      themeClass,
      onRender,
      $slots
    } = this;
    onRender?.();
    return h(tag, {
      role: "none",
      class: [`${mergedClsPrefix}-element`, themeClass],
      style: cssVars
    }, $slots.default?.());
  }
});
//#endregion
export { Element_default as default, elementProps };