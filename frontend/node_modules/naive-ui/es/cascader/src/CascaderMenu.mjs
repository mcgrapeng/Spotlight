import { useOnResize } from "../../_utils/composable/use-resize.mjs";
import { resolveSlot, resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import focus_detector_default from "../../_internal/focus-detector/index.mjs";
import MenuMask_default from "../../_internal/menu-mask/src/MenuMask.mjs";
import Empty_default from "../../empty/src/Empty.mjs";
import { cascaderInjectionKey } from "./interface.mjs";
import CascaderSubmenu_default from "./CascaderSubmenu.mjs";
import { Transition, computed, createBlock, createElementBlock, defineComponent, inject, normalizeStyle, openBlock, ref, withDirectives } from "vue";
import { clickoutside } from "vdirs";
//#region src/cascader/src/CascaderMenu.tsx
const _hoisted_1 = ["onMousedown", "onFocusin", "onFocusout", "onKeydown"];
var CascaderMenu_default = defineComponent({
  name: "NCascaderMenu",
  props: {
    value: [String, Number, Array],
    placement: {
      type: String,
      default: "bottom-start"
    },
    show: Boolean,
    menuModel: {
      type: Array,
      required: true
    },
    loading: Boolean,
    onFocus: {
      type: Function,
      required: true
    },
    onBlur: {
      type: Function,
      required: true
    },
    onKeydown: {
      type: Function,
      required: true
    },
    onMousedown: {
      type: Function,
      required: true
    },
    onTabout: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const {
      localeRef,
      isMountedRef,
      mergedClsPrefixRef,
      syncCascaderMenuPosition,
      handleCascaderMenuClickOutside,
      mergedThemeRef,
      getColumnStyleRef
    } = inject(cascaderInjectionKey);
    const {
      mergedComponentPropsRef
    } = useConfig();
    const submenuInstRefs = [];
    const maskInstRef = ref(null);
    const selfElRef = ref(null);
    function handleResize() {
      syncCascaderMenuPosition();
    }
    useOnResize(selfElRef, handleResize);
    function showErrorMessage(label) {
      const {
        value: {
          loadingRequiredMessage
        }
      } = localeRef;
      maskInstRef.value?.showOnce(loadingRequiredMessage(label));
    }
    function handleClickOutside(e) {
      handleCascaderMenuClickOutside(e);
    }
    function handleFocusin(e) {
      const {
        value: selfEl
      } = selfElRef;
      if (!selfEl) return;
      if (!selfEl.contains(e.relatedTarget)) props.onFocus(e);
    }
    function handleFocusout(e) {
      const {
        value: selfEl
      } = selfElRef;
      if (!selfEl) return;
      if (!selfEl.contains(e.relatedTarget)) props.onBlur(e);
    }
    const exposedRef = {
      scroll(depth, index, elSize) {
        const submenuInst = submenuInstRefs[depth];
        if (submenuInst) submenuInst.scroll(index, elSize);
      },
      showErrorMessage
    };
    return {
      isMounted: isMountedRef,
      mergedClsPrefix: mergedClsPrefixRef,
      selfElRef,
      submenuInstRefs,
      maskInstRef,
      mergedTheme: mergedThemeRef,
      mergedRenderEmpty: computed(() => {
        return mergedComponentPropsRef?.value?.Cascader?.renderEmpty;
      }),
      getColumnStyle: getColumnStyleRef,
      handleFocusin,
      handleFocusout,
      handleClickOutside,
      ...exposedRef
    };
  },
  render() {
    const {
      submenuInstRefs,
      mergedClsPrefix,
      mergedTheme
    } = this;
    return openBlock(), createBlock(Transition, {
      name: "fade-in-scale-up-transition",
      appear: this.isMounted
    }, {
      default: () => {
        if (!this.show) return null;
        return withDirectives((openBlock(), createElementBlock("div", {
          tabindex: "0",
          ref: "selfElRef",
          class: normalizeClass$1(`${mergedClsPrefix}-cascader-menu`),
          onMousedown: this.onMousedown,
          onFocusin: this.handleFocusin,
          onFocusout: this.handleFocusout,
          onKeydown: this.onKeydown
        }, [this.menuModel[0].length ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass$1(`${mergedClsPrefix}-cascader-submenu-wrapper`)
        }, [normalizeVNode(() => this.menuModel.map((submenuOptions, index) => (openBlock(), createBlock(CascaderSubmenu_default, {
          style: normalizeStyle(this.getColumnStyle?.({
            level: index
          })),
          ref: instance => {
            if (instance) submenuInstRefs[index] = instance;
          },
          key: index,
          tmNodes: submenuOptions,
          depth: index + 1
        }, null, 8, ["style", "tmNodes", "depth"])))), (openBlock(), createBlock(MenuMask_default, {
          clsPrefix: mergedClsPrefix,
          ref: "maskInstRef"
        }, null, 8, ["clsPrefix"]))], 2)) : (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass$1(`${mergedClsPrefix}-cascader-menu__empty`)
        }, [normalizeVNode(() => resolveSlot(this.$slots.empty, () => {
          return [this.mergedRenderEmpty?.() || (openBlock(), createBlock(Empty_default, {
            theme: mergedTheme.peers.Empty,
            themeOverrides: mergedTheme.peerOverrides.Empty
          }, null, 8, ["theme", "themeOverrides"]))];
        }))], 2)), normalizeVNode(() => resolveWrappedSlot(this.$slots.action, children => children && (openBlock(), createElementBlock("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-cascader-menu-action`),
          "data-action": true
        }, [normalizeVNode(() => children)], 2)))), (openBlock(), createBlock(focus_detector_default, {
          onFocus: this.onTabout
        }, null, 8, ["onFocus"]))], 42, _hoisted_1)), [[clickoutside, this.handleClickOutside, void 0, {
          capture: true
        }]]);
      }
    }, 1032, ["appear"]);
  }
});
//#endregion
export { CascaderMenu_default as default };