import { normalizeClass as normalizeClass$1, normalizeSlots, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Scrollbar from "../../_internal/scrollbar/src/Scrollbar.mjs";
import { notificationProviderInjectionKey } from "./context.mjs";
import { Fragment, createBlock, createElementBlock, defineComponent, inject, openBlock, ref, watchEffect } from "vue";
//#region src/notification/src/NotificationContainer.tsx
const NotificationContainer = defineComponent({
  name: "NotificationContainer",
  props: {
    scrollable: {
      type: Boolean,
      required: true
    },
    placement: {
      type: String,
      required: true
    }
  },
  setup() {
    const {
      mergedThemeRef,
      mergedClsPrefixRef,
      wipTransitionCountRef
    } = inject(notificationProviderInjectionKey);
    const selfRef = ref(null);
    watchEffect(() => {
      if (wipTransitionCountRef.value > 0) selfRef?.value?.classList.add("transitioning");else selfRef?.value?.classList.remove("transitioning");
    });
    return {
      selfRef,
      mergedTheme: mergedThemeRef,
      mergedClsPrefix: mergedClsPrefixRef,
      transitioning: wipTransitionCountRef
    };
  },
  render() {
    const {
      $slots,
      scrollable,
      mergedClsPrefix,
      mergedTheme,
      placement
    } = this;
    return openBlock(), createElementBlock("div", {
      ref: "selfRef",
      class: normalizeClass$1([`${mergedClsPrefix}-notification-container`, scrollable && `${mergedClsPrefix}-notification-container--scrollable`, `${mergedClsPrefix}-notification-container--${placement}`])
    }, [scrollable ? (openBlock(), createBlock(Scrollbar, {
      key: 0,
      theme: mergedTheme.peers.Scrollbar,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar,
      contentStyle: {
        overflow: "hidden"
      }
    }, normalizeSlots($slots), 1032, ["theme", "themeOverrides"])) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => $slots.default?.())], 64))], 2);
  }
});
//#endregion
export { NotificationContainer };