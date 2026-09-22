import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
import { useInjectionCollection, useInjectionElementCollection } from "../../_utils/composable/use-collection.mjs";
import { getTitleAttribute } from "../../_utils/naive/attribute.mjs";
import { resolveSlot } from "../../_utils/vue/resolve-slot.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { createElementBlock, createElementVNode, defineComponent, inject, openBlock, ref, toRef, watch } from "vue";
import { useMemo } from "vooks";
//#region src/anchor/src/Link.tsx
const _hoisted_1 = ["href", "title", "onClick"];
const anchorInjectionKey = createInjectionKey("n-anchor");
const anchorLinkProps = {
  title: String,
  href: String
};
var Link_default = defineComponent({
  name: "AnchorLink",
  props: anchorLinkProps,
  slots: Object,
  setup(props, {
    slots
  }) {
    const titleRef = ref(null);
    const NAnchor = inject(anchorInjectionKey);
    const hrefRef = toRef(props, "href");
    const activeRef = useMemo(() => {
      return hrefRef.value && hrefRef.value === NAnchor.activeHref.value;
    });
    useInjectionCollection(anchorInjectionKey, "collectedLinkHrefs", hrefRef);
    useInjectionElementCollection(anchorInjectionKey, "titleEls", () => titleRef.value);
    watch(activeRef, value => {
      if (value && titleRef.value) NAnchor.updateBarPosition(titleRef.value);
    });
    function handleClick() {
      if (props.href !== void 0) NAnchor.setActiveHref(props.href);
    }
    return () => {
      const {
        value: mergedClsPrefix
      } = NAnchor.mergedClsPrefix;
      return openBlock(), createElementBlock("div", {
        class: normalizeClass$1([`${mergedClsPrefix}-anchor-link`, activeRef.value && `${mergedClsPrefix}-anchor-link--active`])
      }, [createElementVNode("a", {
        ref: titleRef,
        class: normalizeClass$1([`${mergedClsPrefix}-anchor-link__title`]),
        href: props.href,
        title: getTitleAttribute(props.title),
        onClick: handleClick
      }, [normalizeVNode(() => resolveSlot(slots.title, () => [props.title]))], 10, _hoisted_1), normalizeVNode(() => slots.default?.())], 2);
    };
  }
});
//#endregion
export { anchorInjectionKey, anchorLinkProps, Link_default as default };