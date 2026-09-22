import useLocale from "../../_mixins/use-locale.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Loading_default from "../../_internal/loading/src/Loading.mjs";
import { createBlock, createElementBlock, createElementVNode, defineComponent, mergeProps, openBlock } from "vue";
//#region src/log/src/LogLoader.tsx
var LogLoader_default = defineComponent({
  name: "LogLoader",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    spinProps: Object
  },
  setup() {
    return {
      locale: useLocale("Log").localeRef
    };
  },
  render() {
    const {
      clsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${clsPrefix}-log-loader`)
    }, [(openBlock(), createBlock(Loading_default, mergeProps({
      clsPrefix,
      strokeWidth: 24,
      scale: .85
    }, this.spinProps), null, 16, ["clsPrefix"])), createElementVNode("span", {
      class: normalizeClass$1(`${clsPrefix}-log-loader__content`)
    }, [normalizeVNode(() => this.locale.loading)], 2)], 2);
  }
});
//#endregion
export { LogLoader_default as default };