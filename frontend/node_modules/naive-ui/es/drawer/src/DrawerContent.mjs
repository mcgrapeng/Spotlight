import { drawerInjectionKey } from "./interface.mjs";
import { throwError } from "../../_utils/naive/warn.mjs";
import { normalizeClass as normalizeClass$1, normalizeSlots, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Close_default from "../../_internal/close/src/Close.mjs";
import Scrollbar from "../../_internal/scrollbar/src/Scrollbar.mjs";
import { Fragment, createBlock, createElementBlock, createElementVNode, defineComponent, inject, mergeProps, normalizeStyle, openBlock } from "vue";
//#region src/drawer/src/DrawerContent.tsx
const drawerContentProps = {
  title: String,
  headerClass: String,
  headerStyle: [Object, String],
  footerClass: String,
  footerStyle: [Object, String],
  bodyClass: String,
  bodyStyle: [Object, String],
  bodyContentClass: String,
  bodyContentStyle: [Object, String],
  nativeScrollbar: {
    type: Boolean,
    default: true
  },
  scrollbarProps: Object,
  closable: Boolean
};
var DrawerContent_default = defineComponent({
  name: "DrawerContent",
  props: drawerContentProps,
  slots: Object,
  setup() {
    const NDrawer = inject(drawerInjectionKey, null);
    if (!NDrawer) throwError("drawer-content", "`n-drawer-content` must be placed inside `n-drawer`.");
    const {
      doUpdateShow
    } = NDrawer;
    function handleCloseClick() {
      doUpdateShow(false);
    }
    return {
      handleCloseClick,
      mergedTheme: NDrawer.mergedThemeRef,
      mergedClsPrefix: NDrawer.mergedClsPrefixRef
    };
  },
  render() {
    const {
      title,
      mergedClsPrefix,
      nativeScrollbar,
      mergedTheme,
      bodyClass,
      bodyStyle,
      bodyContentClass,
      bodyContentStyle,
      headerClass,
      headerStyle,
      footerClass,
      footerStyle,
      scrollbarProps,
      closable,
      $slots
    } = this;
    return openBlock(), createElementBlock("div", {
      role: "none",
      class: normalizeClass$1([`${mergedClsPrefix}-drawer-content`, nativeScrollbar && `${mergedClsPrefix}-drawer-content--native-scrollbar`])
    }, [$slots.header || title || closable ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1([`${mergedClsPrefix}-drawer-header`, headerClass]),
      style: normalizeStyle(headerStyle),
      role: "none"
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-drawer-header__main`),
      role: "heading",
      "aria-level": "1"
    }, [$slots.header !== void 0 ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => $slots.header())], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => title)], 64))], 2), normalizeVNode(() => closable && (openBlock(), createBlock(Close_default, {
      onClick: this.handleCloseClick,
      clsPrefix: mergedClsPrefix,
      class: normalizeClass$1(`${mergedClsPrefix}-drawer-header__close`),
      absolute: true
    }, null, 8, ["onClick", "clsPrefix", "class"])))], 6)) : normalizeVNode(() => null), nativeScrollbar ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1([`${mergedClsPrefix}-drawer-body`, bodyClass]),
      style: normalizeStyle(bodyStyle),
      role: "none"
    }, [createElementVNode("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-drawer-body-content-wrapper`, bodyContentClass]),
      style: normalizeStyle(bodyContentStyle),
      role: "none"
    }, [normalizeVNode(() => $slots.default?.())], 6)], 6)) : (openBlock(), createBlock(Scrollbar, mergeProps({
      key: 3,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar,
      theme: mergedTheme.peers.Scrollbar
    }, scrollbarProps, {
      class: `${mergedClsPrefix}-drawer-body`,
      contentClass: [`${mergedClsPrefix}-drawer-body-content-wrapper`, bodyContentClass],
      contentStyle: bodyContentStyle
    }), normalizeSlots($slots), 1040, ["themeOverrides", "theme", "class", "contentClass", "contentStyle"])), $slots.footer ? (openBlock(), createElementBlock("div", {
      key: 4,
      class: normalizeClass$1([`${mergedClsPrefix}-drawer-footer`, footerClass]),
      style: normalizeStyle(footerStyle),
      role: "none"
    }, [normalizeVNode(() => $slots.footer())], 6)) : normalizeVNode(() => null)], 2);
  }
});
//#endregion
export { DrawerContent_default as default, drawerContentProps };