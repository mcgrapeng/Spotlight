import { normalizeClass as normalizeClass$1, normalizeSlot } from "../../vue-jsx-vapor/vdom.mjs";
import Scrollbar from "../../_internal/scrollbar/src/Scrollbar.mjs";
import { cascaderInjectionKey } from "./interface.mjs";
import CascaderOption_default from "./CascaderOption.mjs";
import { depx } from "seemly";
import { computed, createBlock, createElementBlock, defineComponent, inject, openBlock, ref } from "vue";
import { VirtualList } from "vueuc";
//#region src/cascader/src/CascaderSubmenu.tsx
var CascaderSubmenu_default = defineComponent({
  name: "CascaderSubmenu",
  props: {
    depth: {
      type: Number,
      required: true
    },
    tmNodes: {
      type: Array,
      required: true
    }
  },
  setup() {
    const {
      virtualScrollRef,
      mergedClsPrefixRef,
      mergedThemeRef,
      optionHeightRef
    } = inject(cascaderInjectionKey);
    const scrollbarInstRef = ref(null);
    const vlInstRef = ref(null);
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      mergedTheme: mergedThemeRef,
      scrollbarInstRef,
      vlInstRef,
      virtualScroll: virtualScrollRef,
      itemSize: computed(() => depx(optionHeightRef.value)),
      handleVlScroll: () => {
        scrollbarInstRef.value?.sync();
      },
      getVlContainer: () => {
        return vlInstRef.value?.listElRef;
      },
      getVlContent: () => {
        return vlInstRef.value?.itemsElRef;
      },
      scroll(index, elSize) {
        if (virtualScrollRef.value) vlInstRef.value?.scrollTo({
          index
        });else scrollbarInstRef.value?.scrollTo({
          index,
          elSize
        });
      }
    };
  },
  render() {
    const {
      mergedClsPrefix,
      mergedTheme,
      virtualScroll
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([virtualScroll && `${mergedClsPrefix}-cascader-submenu--virtual`, `${mergedClsPrefix}-cascader-submenu`])
    }, [(openBlock(), createBlock(Scrollbar, {
      ref: "scrollbarInstRef",
      theme: mergedTheme.peers.Scrollbar,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar,
      container: virtualScroll ? this.getVlContainer : void 0,
      content: virtualScroll ? this.getVlContent : void 0
    }, {
      default: () => virtualScroll ? (openBlock(), createBlock(VirtualList, {
        key: 1,
        items: this.tmNodes,
        itemSize: this.itemSize,
        onScroll: this.handleVlScroll,
        showScrollbar: false,
        ref: "vlInstRef"
      }, {
        _: 1,
        default: normalizeSlot(({
          item: tmNode
        }) => (openBlock(), createBlock(CascaderOption_default, {
          key: tmNode.key,
          tmNode
        }, null, 8, ["tmNode"])))
      }, 8, ["items", "itemSize", "onScroll"])) : this.tmNodes.map(tmNode => (openBlock(), createBlock(CascaderOption_default, {
        key: tmNode.key,
        tmNode
      }, null, 8, ["tmNode"])))
    }, 1032, ["theme", "themeOverrides", "container", "content"]))], 2);
  }
});
//#endregion
export { CascaderSubmenu_default as default };