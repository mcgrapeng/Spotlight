import useConfig from "../../_mixins/use-config.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useStyle from "../../_mixins/use-style.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { buttonGroupInjectionKey } from "./context.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { createElementBlock, defineComponent, openBlock, provide } from "vue";
//#region src/button-group/src/ButtonGroup.tsx
const buttonGroupProps = {
  size: String,
  vertical: Boolean
};
var ButtonGroup_default = defineComponent({
  name: "ButtonGroup",
  props: buttonGroupProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      mergedRtlRef
    } = useConfig(props);
    useStyle("-button-group", index_cssr_default, mergedClsPrefixRef);
    provide(buttonGroupInjectionKey, props);
    return {
      rtlEnabled: useRtl("ButtonGroup", mergedRtlRef, mergedClsPrefixRef),
      mergedClsPrefix: mergedClsPrefixRef
    };
  },
  render() {
    const {
      mergedClsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-button-group`, this.rtlEnabled && `${mergedClsPrefix}-button-group--rtl`, this.vertical && `${mergedClsPrefix}-button-group--vertical`]),
      role: "group"
    }, [normalizeVNode(() => this.$slots.default?.())], 2);
  }
});
//#endregion
export { buttonGroupProps, ButtonGroup_default as default };