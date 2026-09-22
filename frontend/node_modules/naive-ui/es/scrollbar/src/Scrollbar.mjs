import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeSlots } from "../../vue-jsx-vapor/vdom.mjs";
import Scrollbar$1 from "../../_internal/scrollbar/src/Scrollbar.mjs";
import { createBlock, defineComponent, mergeProps, openBlock, ref } from "vue";
//#region src/scrollbar/src/Scrollbar.tsx
const scrollbarProps = {
  ...useTheme.props,
  trigger: String,
  xScrollable: Boolean,
  onScroll: Function,
  contentClass: String,
  contentStyle: [Object, String],
  yPlacement: {
    type: String,
    default: "right"
  },
  xPlacement: {
    type: String,
    default: "bottom"
  }
};
const Scrollbar = defineComponent({
  name: "Scrollbar",
  props: scrollbarProps,
  setup() {
    const scrollbarInstRef = ref(null);
    return {
      scrollTo: (...args) => {
        scrollbarInstRef.value?.scrollTo(args[0], args[1]);
      },
      scrollBy: (...args) => {
        scrollbarInstRef.value?.scrollBy(args[0], args[1]);
      },
      scrollbarInstRef
    };
  },
  render() {
    return openBlock(), createBlock(Scrollbar$1, mergeProps({
      ref: "scrollbarInstRef"
    }, this.$props), normalizeSlots(this.$slots), 1040);
  }
});
//#endregion
export { Scrollbar as default, scrollbarProps };