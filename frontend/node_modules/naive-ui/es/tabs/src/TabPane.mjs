import { throwError, warnOnce } from "../../_utils/naive/warn.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { tabsInjectionKey } from "./interface.mjs";
import { createElementBlock, defineComponent, inject, normalizeStyle, openBlock, watchEffect } from "vue";
//#region src/tabs/src/TabPane.tsx
const tabPaneProps = {
  tab: [String, Number, Object, Function],
  name: {
    type: [String, Number],
    required: true
  },
  disabled: Boolean,
  displayDirective: {
    type: String,
    default: "if"
  },
  closable: {
    type: Boolean,
    default: void 0
  },
  tabProps: Object,
  /** @deprecated */
  label: [String, Number, Object, Function]
};
var TabPane_default = defineComponent({
  __TAB_PANE__: true,
  name: "TabPane",
  alias: ["TabPanel"],
  props: tabPaneProps,
  slots: Object,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.label !== void 0) warnOnce("tab-pane", "`label` is deprecated, please use `tab` instead.");
    });
    const NTab = inject(tabsInjectionKey, null);
    if (!NTab) throwError("tab-pane", "`n-tab-pane` must be placed inside `n-tabs`.");
    return {
      style: NTab.paneStyleRef,
      class: NTab.paneClassRef,
      mergedClsPrefix: NTab.mergedClsPrefixRef
    };
  },
  render() {
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${this.mergedClsPrefix}-tab-pane`, this.class]),
      style: normalizeStyle(this.style)
    }, [normalizeVNode(() => this.$slots.default?.())], 6);
  }
});
//#endregion
export { TabPane_default as default, tabPaneProps };