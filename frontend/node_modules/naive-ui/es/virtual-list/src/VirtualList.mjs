import { normalizeSlot } from "../../vue-jsx-vapor/vdom.mjs";
import { XScrollbar } from "../../_internal/scrollbar/src/Scrollbar.mjs";
import { createBlock, defineComponent, mergeProps, openBlock, ref } from "vue";
import { VVirtualList } from "vueuc";
//#region src/virtual-list/src/VirtualList.tsx
const virtualListProps = {
  scrollbarProps: Object,
  items: {
    type: Array,
    default: () => []
  },
  itemSize: {
    type: Number,
    required: true
  },
  itemResizable: Boolean,
  itemsStyle: [String, Object],
  visibleItemsTag: {
    type: [String, Object],
    default: "div"
  },
  visibleItemsProps: Object,
  ignoreItemResize: Boolean,
  onScroll: Function,
  onWheel: Function,
  onResize: Function,
  defaultScrollKey: [Number, String],
  defaultScrollIndex: Number,
  keyField: {
    type: String,
    default: "key"
  },
  paddingTop: {
    type: [Number, String],
    default: 0
  },
  paddingBottom: {
    type: [Number, String],
    default: 0
  }
};
var VirtualList_default = defineComponent({
  name: "VirtualList",
  props: virtualListProps,
  setup(props) {
    const scrollbarInstRef = ref(null);
    const virtualListInstRef = ref(null);
    function syncScrollbar() {
      const {
        value: scrollbarInst
      } = scrollbarInstRef;
      if (scrollbarInst) scrollbarInst.sync();
    }
    function handleScroll(e) {
      syncScrollbar();
      props.onScroll?.(e);
    }
    function handleResize(e) {
      syncScrollbar();
      props.onResize?.(e);
    }
    function handleWheel(e) {
      props.onWheel?.(e);
    }
    function scrollTo(options, y) {
      if (typeof options === "number") virtualListInstRef.value?.scrollTo(options, y ?? 0);else virtualListInstRef.value?.scrollTo(options);
    }
    function getScrollContainer() {
      return virtualListInstRef.value?.listElRef;
    }
    function getScrollContent() {
      return virtualListInstRef.value?.itemsElRef;
    }
    return {
      scrollTo,
      scrollbarInstRef,
      virtualListInstRef,
      getScrollContainer,
      getScrollContent,
      handleScroll,
      handleResize,
      handleWheel
    };
  },
  render() {
    return openBlock(), createBlock(XScrollbar, mergeProps(this.scrollbarProps, {
      ref: "scrollbarInstRef",
      container: this.getScrollContainer,
      content: this.getScrollContent
    }), {
      _: 1,
      default: normalizeSlot(() => {
        return openBlock(), createBlock(VVirtualList, {
          ref: "virtualListInstRef",
          showScrollbar: false,
          items: this.items,
          itemSize: this.itemSize,
          itemResizable: this.itemResizable,
          itemsStyle: this.itemsStyle,
          visibleItemsTag: this.visibleItemsTag,
          visibleItemsProps: this.visibleItemsProps,
          ignoreItemResize: this.ignoreItemResize,
          keyField: this.keyField,
          defaultScrollKey: this.defaultScrollKey,
          defaultScrollIndex: this.defaultScrollIndex,
          paddingTop: this.paddingTop,
          paddingBottom: this.paddingBottom,
          onScroll: this.handleScroll,
          onResize: this.handleResize,
          onWheel: this.handleWheel
        }, {
          _: 1,
          default: normalizeSlot(({
            item,
            index
          }) => this.$slots.default?.({
            item,
            index
          }))
        }, 8, ["items", "itemSize", "itemResizable", "itemsStyle", "visibleItemsTag", "visibleItemsProps", "ignoreItemResize", "keyField", "defaultScrollKey", "defaultScrollIndex", "paddingTop", "paddingBottom", "onScroll", "onResize", "onWheel"]);
      })
    }, 16, ["container", "content"]);
  }
});
//#endregion
export { VirtualList_default as default, virtualListProps };