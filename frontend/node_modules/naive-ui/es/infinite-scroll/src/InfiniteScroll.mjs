import { resolveSlot } from "../../_utils/vue/resolve-slot.mjs";
import { normalizeSlot } from "../../vue-jsx-vapor/vdom.mjs";
import { XScrollbar } from "../../_internal/scrollbar/src/Scrollbar.mjs";
import { createBlock, defineComponent, mergeProps, openBlock, ref } from "vue";
//#region src/infinite-scroll/src/InfiniteScroll.tsx
const infiniteScrollProps = {
  distance: {
    type: Number,
    default: 0
  },
  onLoad: Function,
  scrollbarProps: Object
};
var InfiniteScroll_default = defineComponent({
  name: "InfiniteScroll",
  props: infiniteScrollProps,
  setup(props) {
    const scrollbarInstRef = ref(null);
    let loading = false;
    const handleCheckBottom = async () => {
      const {
        value: scrollbarInst
      } = scrollbarInstRef;
      if (scrollbarInst) {
        const {
          containerRef
        } = scrollbarInst;
        const scrollHeight = containerRef?.scrollHeight;
        const clientHeight = containerRef?.clientHeight;
        const scrollTop = containerRef?.scrollTop;
        if (containerRef && scrollHeight !== void 0 && clientHeight !== void 0 && scrollTop !== void 0) {
          if (scrollTop + clientHeight >= scrollHeight - props.distance) {
            loading = true;
            try {
              await props.onLoad?.();
            } catch {}
            loading = false;
          }
        }
      }
    };
    const handleScroll = () => {
      if (loading) return;
      handleCheckBottom();
    };
    const handleWheel = e => {
      if (e.deltaY <= 0) return;
      if (loading) return;
      handleCheckBottom();
    };
    return {
      scrollbarInstRef,
      handleScroll,
      handleWheel
    };
  },
  render() {
    return openBlock(), createBlock(XScrollbar, mergeProps(this.scrollbarProps, {
      ref: "scrollbarInstRef",
      onWheel: this.handleWheel,
      onScroll: this.handleScroll
    }), {
      _: 1,
      default: normalizeSlot(() => {
        return resolveSlot(this.$slots.default, () => []);
      })
    }, 16, ["onWheel", "onScroll"]);
  }
});
//#endregion
export { InfiniteScroll_default as default, infiniteScrollProps };