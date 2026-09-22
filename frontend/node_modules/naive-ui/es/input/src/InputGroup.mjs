import useConfig from "../../_mixins/use-config.mjs";
import useStyle from "../../_mixins/use-style.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import input_group_cssr_default from "./styles/input-group.cssr.mjs";
import { createElementBlock, defineComponent, openBlock } from "vue";
//#region src/input/src/InputGroup.tsx
const inputGroupProps = {};
var InputGroup_default = defineComponent({
  name: "InputGroup",
  props: inputGroupProps,
  setup(props) {
    const {
      mergedClsPrefixRef
    } = useConfig(props);
    useStyle("-input-group", input_group_cssr_default, mergedClsPrefixRef);
    return {
      mergedClsPrefix: mergedClsPrefixRef
    };
  },
  render() {
    const {
      mergedClsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-input-group`)
    }, [normalizeVNode(() => this.$slots.default?.())], 2);
  }
});
//#endregion
export { InputGroup_default as default, inputGroupProps };