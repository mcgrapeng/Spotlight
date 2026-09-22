import { throwError } from "../../_utils/naive/warn.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { listInjectionKey } from "./List.mjs";
import { createElementBlock, defineComponent, inject, openBlock } from "vue";
//#region src/list/src/ListItem.tsx
var ListItem_default = defineComponent({
  name: "ListItem",
  slots: Object,
  setup() {
    const listInjection = inject(listInjectionKey, null);
    if (!listInjection) throwError("list-item", "`n-list-item` must be placed in `n-list`.");
    return {
      showDivider: listInjection.showDividerRef,
      mergedClsPrefix: listInjection.mergedClsPrefixRef
    };
  },
  render() {
    const {
      $slots,
      mergedClsPrefix
    } = this;
    return openBlock(), createElementBlock("li", {
      class: normalizeClass$1(`${mergedClsPrefix}-list-item`)
    }, [$slots.prefix ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-list-item__prefix`)
    }, [normalizeVNode(() => $slots.prefix())], 2)) : normalizeVNode(() => null), $slots.default ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1(`${mergedClsPrefix}-list-item__main`)
    }, [normalizeVNode(() => $slots.default())], 2)) : normalizeVNode(() => null), $slots.suffix ? (openBlock(), createElementBlock("div", {
      key: 4,
      class: normalizeClass$1(`${mergedClsPrefix}-list-item__suffix`)
    }, [normalizeVNode(() => $slots.suffix())], 2)) : normalizeVNode(() => null), normalizeVNode(() => this.showDivider && (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-list-item__divider`)
    }, null, 2)))], 2);
  }
});
//#endregion
export { ListItem_default as default };