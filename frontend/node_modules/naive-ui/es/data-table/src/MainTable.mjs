import { formatLength } from "../../_utils/css/format-length.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { dataTableInjectionKey } from "./interface.mjs";
import Header_default from "./TableParts/Header.mjs";
import Body_default from "./TableParts/Body.mjs";
import { computed, createBlock, createElementBlock, defineComponent, inject, openBlock, ref, watchEffect } from "vue";
//#region src/data-table/src/MainTable.tsx
var MainTable_default = defineComponent({
  name: "MainTable",
  setup() {
    const {
      mergedClsPrefixRef,
      rightFixedColumnsRef,
      leftFixedColumnsRef,
      bodyWidthRef,
      maxHeightRef,
      minHeightRef,
      flexHeightRef,
      virtualScrollHeaderRef,
      syncScrollState,
      scrollXRef
    } = inject(dataTableInjectionKey);
    const headerInstRef = ref(null);
    const bodyInstRef = ref(null);
    const selfElRef = ref(null);
    const fixedStateInitializedRef = ref(!(leftFixedColumnsRef.value.length || rightFixedColumnsRef.value.length));
    const bodyStyleRef = computed(() => {
      return {
        maxHeight: formatLength(maxHeightRef.value),
        minHeight: formatLength(minHeightRef.value)
      };
    });
    function handleBodyResize(entry) {
      bodyWidthRef.value = entry.contentRect.width;
      syncScrollState("layout");
      if (!fixedStateInitializedRef.value) fixedStateInitializedRef.value = true;
    }
    function getHeaderElement() {
      const {
        value
      } = headerInstRef;
      if (value) {
        if (virtualScrollHeaderRef.value) return value.virtualListRef?.listElRef || null;else return value.$el;
      }
      return null;
    }
    function getBodyElement() {
      const {
        value
      } = bodyInstRef;
      if (value) return value.getScrollContainer();
      return null;
    }
    const exposedMethods = {
      getBodyElement,
      getHeaderElement,
      scrollTo(arg0, arg1) {
        bodyInstRef.value?.scrollTo(arg0, arg1);
      }
    };
    watchEffect(() => {
      const {
        value: selfEl
      } = selfElRef;
      if (!selfEl) return;
      const transitionDisabledClass = `${mergedClsPrefixRef.value}-data-table-base-table--transition-disabled`;
      if (fixedStateInitializedRef.value) setTimeout(() => {
        selfEl.classList.remove(transitionDisabledClass);
      }, 0);else selfEl.classList.add(transitionDisabledClass);
    });
    return {
      maxHeight: maxHeightRef,
      mergedClsPrefix: mergedClsPrefixRef,
      selfElRef,
      headerInstRef,
      bodyInstRef,
      bodyStyle: bodyStyleRef,
      flexHeight: flexHeightRef,
      handleBodyResize,
      scrollX: scrollXRef,
      ...exposedMethods
    };
  },
  render() {
    const {
      mergedClsPrefix,
      maxHeight,
      flexHeight
    } = this;
    const headerInBody = maxHeight === void 0 && !flexHeight;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-data-table-base-table`),
      ref: "selfElRef"
    }, [headerInBody ? normalizeVNode(() => null) : (openBlock(), createBlock(Header_default, {
      key: 1,
      ref: "headerInstRef"
    }, null, 512)), (openBlock(), createBlock(Body_default, {
      ref: "bodyInstRef",
      bodyStyle: this.bodyStyle,
      showHeader: headerInBody,
      flexHeight,
      onResize: this.handleBodyResize
    }, null, 8, ["bodyStyle", "showHeader", "flexHeight", "onResize"]))], 2);
  }
});
//#endregion
export { MainTable_default as default };