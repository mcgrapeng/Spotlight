import { warn } from "../../_utils/naive/warn.mjs";
import { resolveSlot } from "../../_utils/vue/resolve-slot.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { breadcrumbInjectionKey } from "./Breadcrumb.mjs";
import { useBrowserLocation } from "../../_utils/composable/use-browser-location.mjs";
import { computed, createElementBlock, defineComponent, h, inject, openBlock } from "vue";
//#region src/breadcrumb/src/BreadcrumbItem.tsx
const breadcrumbItemProps = {
  separator: String,
  href: String,
  clickable: {
    type: Boolean,
    default: true
  },
  showSeparator: {
    type: Boolean,
    default: true
  },
  onClick: Function
};
var BreadcrumbItem_default = defineComponent({
  name: "BreadcrumbItem",
  props: breadcrumbItemProps,
  slots: Object,
  setup(props, {
    slots
  }) {
    const NBreadcrumb = inject(breadcrumbInjectionKey, null);
    if (!NBreadcrumb) {
      if (process.env.NODE_ENV !== "production") warn("breadcrumb", "`n-breadcrumb-item` must be placed inside `n-breadcrumb`.");
      return () => null;
    }
    const {
      separatorRef,
      mergedClsPrefixRef
    } = NBreadcrumb;
    const browserLocationRef = useBrowserLocation();
    const htmlTagRef = computed(() => props.href ? "a" : "span");
    const ariaCurrentRef = computed(() => browserLocationRef.value.href === props.href ? "location" : null);
    return () => {
      const {
        value: mergedClsPrefix
      } = mergedClsPrefixRef;
      return openBlock(), createElementBlock("li", {
        class: normalizeClass$1([`${mergedClsPrefix}-breadcrumb-item`, props.clickable && `${mergedClsPrefix}-breadcrumb-item--clickable`])
      }, [normalizeVNode(() => h(htmlTagRef.value, {
        class: `${mergedClsPrefix}-breadcrumb-item__link`,
        "aria-current": ariaCurrentRef.value,
        href: props.href,
        onClick: props.onClick
      }, slots)), normalizeVNode(() => props.showSeparator && (openBlock(), createElementBlock("span", {
        class: normalizeClass$1(`${mergedClsPrefix}-breadcrumb-item__separator`),
        "aria-hidden": "true"
      }, [normalizeVNode(() => resolveSlot(slots.separator, () => [props.separator ?? separatorRef.value]))], 2)))], 2);
    };
  }
});
//#endregion
export { breadcrumbItemProps, BreadcrumbItem_default as default };