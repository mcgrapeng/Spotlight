import useConfig from "../../_mixins/use-config.mjs";
import { normalizeClass as normalizeClass$1 } from "../../vue-jsx-vapor/vdom.mjs";
import Scrollbar from "../../_internal/scrollbar/src/Scrollbar.mjs";
import Empty_default from "../../empty/src/Empty.mjs";
import { transferInjectionKey } from "./interface.mjs";
import TransferListItem_default from "./TransferListItem.mjs";
import { Fragment, Transition, TransitionGroup, computed, createBlock, createElementBlock, defineComponent, inject, openBlock, ref } from "vue";
import { VirtualList } from "vueuc";
//#region src/legacy-transfer/src/TransferList.tsx
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
    isMounted: {
      type: Boolean,
      required: true
    },
    isInputing: {
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
      mergedClsPrefix,
      virtualScroll,
      syncVLScroller
    } = this;
    return openBlock(), createElementBlock(Fragment, null, [(openBlock(), createBlock(Scrollbar, {
      ref: "scrollerInstRef",
      theme: mergedTheme.peers.Scrollbar,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar,
      container: virtualScroll ? this.scrollContainer : void 0,
      content: virtualScroll ? this.scrollContent : void 0
    }, {
      default: () => virtualScroll ? (openBlock(), createBlock(VirtualList, {
        key: 1,
        ref: "vlInstRef",
        style: {
          height: "100%"
        },
        class: normalizeClass$1(`${mergedClsPrefix}-legacy-transfer-list-content`),
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
            label: item.label
          }, null, 8, ["source", "value", "disabled", "label"]);
        }
      }, 1032, ["class", "items", "itemSize", "onResize", "onScroll"])) : (openBlock(), createElementBlock("div", {
        key: 2,
        class: normalizeClass$1(`${mergedClsPrefix}-legacy-transfer-list-content`)
      }, [(openBlock(), createBlock(TransitionGroup, {
        name: "item",
        appear: this.isMounted,
        css: !this.isInputing
      }, {
        default: () => {
          const {
            source,
            disabled
          } = this;
          return this.options.map(option => (openBlock(), createBlock(TransferListItem_default, {
            source,
            key: option.value,
            value: option.value,
            disabled: option.disabled || disabled,
            label: option.label
          }, null, 8, ["source", "value", "disabled", "label"])));
        }
      }, 1032, ["appear", "css"]))], 2))
    }, 1032, ["theme", "themeOverrides", "container", "content"])), (openBlock(), createBlock(Transition, {
      name: "fade-in-transition",
      appear: this.isMounted,
      css: !this.isInputing
    }, {
      default: () => this.options.length ? null : this.mergedRenderEmpty?.() || (openBlock(), createBlock(Empty_default, {
        key: 3,
        theme: mergedTheme.peers.Empty,
        themeOverrides: mergedTheme.peerOverrides.Empty
      }, null, 8, ["theme", "themeOverrides"]))
    }, 1032, ["appear", "css"]))], 64);
  }
});
//#endregion
export { TransferList_default as default };