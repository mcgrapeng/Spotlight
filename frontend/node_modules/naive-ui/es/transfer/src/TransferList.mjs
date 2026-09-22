import useConfig from "../../_mixins/use-config.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Scrollbar from "../../_internal/scrollbar/src/Scrollbar.mjs";
import Empty_default from "../../empty/src/Empty.mjs";
import { transferInjectionKey } from "./interface.mjs";
import TransferListItem_default from "./TransferListItem.mjs";
import { computed, createBlock, createElementBlock, defineComponent, inject, openBlock, ref } from "vue";
import { VirtualList } from "vueuc";
//#region src/transfer/src/TransferList.tsx
var TransferList_default = defineComponent({
  name: "TransferList",
  props: {
    virtualScroll: {
      type: Boolean,
      required: true
    },
    itemSize: {
      type: Number,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true
    },
    source: Boolean
  },
  setup() {
    const {
      mergedThemeRef,
      mergedClsPrefixRef
    } = inject(transferInjectionKey);
    const {
      mergedComponentPropsRef
    } = useConfig();
    const scrollerInstRef = ref(null);
    const vlInstRef = ref(null);
    const mergedRenderEmptyRef = computed(() => {
      return mergedComponentPropsRef?.value?.Transfer?.renderEmpty;
    });
    function syncVLScroller() {
      scrollerInstRef.value?.sync();
    }
    function scrollContainer() {
      const {
        value
      } = vlInstRef;
      if (!value) return null;
      const {
        listElRef
      } = value;
      return listElRef;
    }
    function scrollContent() {
      const {
        value
      } = vlInstRef;
      if (!value) return null;
      const {
        itemsElRef
      } = value;
      return itemsElRef;
    }
    return {
      mergedTheme: mergedThemeRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedRenderEmpty: mergedRenderEmptyRef,
      scrollerInstRef,
      vlInstRef,
      syncVLScroller,
      scrollContainer,
      scrollContent
    };
  },
  render() {
    const {
      mergedTheme,
      options
    } = this;
    if (options.length === 0) return this.mergedRenderEmpty?.() || (openBlock(), createBlock(Empty_default, {
      key: 1,
      theme: mergedTheme.peers.Empty,
      themeOverrides: mergedTheme.peerOverrides.Empty
    }, null, 8, ["theme", "themeOverrides"]));
    const {
      mergedClsPrefix,
      virtualScroll,
      source,
      disabled,
      syncVLScroller
    } = this;
    return openBlock(), createBlock(Scrollbar, {
      ref: "scrollerInstRef",
      theme: mergedTheme.peers.Scrollbar,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar,
      container: virtualScroll ? this.scrollContainer : void 0,
      content: virtualScroll ? this.scrollContent : void 0
    }, {
      default: () => virtualScroll ? (openBlock(), createBlock(VirtualList, {
        key: 2,
        ref: "vlInstRef",
        style: {
          height: "100%"
        },
        class: normalizeClass$1(`${mergedClsPrefix}-transfer-list-content`),
        items: this.options,
        itemSize: this.itemSize,
        showScrollbar: false,
        onResize: syncVLScroller,
        onScroll: syncVLScroller,
        keyField: "value"
      }, {
        default: ({
          item
        }) => {
          const {
            source,
            disabled
          } = this;
          return openBlock(), createBlock(TransferListItem_default, {
            source,
            key: item.value,
            value: item.value,
            disabled: item.disabled || disabled,
            label: item.label,
            option: item
          }, null, 8, ["source", "value", "disabled", "label", "option"]);
        }
      }, 1032, ["class", "items", "itemSize", "onResize", "onScroll"])) : (openBlock(), createElementBlock("div", {
        key: 3,
        class: normalizeClass$1(`${mergedClsPrefix}-transfer-list-content`)
      }, [normalizeVNode(() => options.map(option => (openBlock(), createBlock(TransferListItem_default, {
        source,
        key: option.value,
        value: option.value,
        disabled: option.disabled || disabled,
        label: option.label,
        option
      }, null, 8, ["source", "value", "disabled", "label", "option"]))))], 2))
    }, 1032, ["theme", "themeOverrides", "container", "content"]);
  }
});
//#endregion
export { TransferList_default as default };