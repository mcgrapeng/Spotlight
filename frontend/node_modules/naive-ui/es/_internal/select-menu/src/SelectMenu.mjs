import { internalSelectionMenuBodyInjectionKey, internalSelectionMenuInjectionKey } from "./interface.mjs";
import { useOnResize } from "../../../_utils/composable/use-resize.mjs";
import { createKey } from "../../../_utils/cssr/index.mjs";
import { resolveSlot, resolveWrappedSlot } from "../../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../../_mixins/use-config.mjs";
import { useThemeClass } from "../../../_mixins/use-css-vars-class.mjs";
import { useRtl } from "../../../_mixins/use-rtl.mjs";
import useTheme from "../../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import focus_detector_default from "../../focus-detector/index.mjs";
import Loading_default from "../../loading/src/Loading.mjs";
import Scrollbar from "../../scrollbar/src/Scrollbar.mjs";
import Empty_default from "../../../empty/src/Empty.mjs";
import internalSelectMenuLight from "../styles/light.mjs";
import SelectGroupHeader_default from "./SelectGroupHeader.mjs";
import SelectOption_default from "./SelectOption.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { depx, getPadding, happensIn } from "seemly";
import { Fragment, computed, createBlock, createElementBlock, defineComponent, mergeProps, nextTick, normalizeStyle, onBeforeUnmount, onMounted, openBlock, provide, ref, toRef, watch } from "vue";
import { VirtualList } from "vueuc";
import { createIndexGetter } from "treemate";
//#region src/_internal/select-menu/src/SelectMenu.tsx
const _hoisted_1 = ["tabindex", "onFocusin", "onFocusout", "onKeyup", "onKeydown", "onMousedown", "onMouseenter", "onMouseleave"];
var SelectMenu_default = defineComponent({
  name: "InternalSelectMenu",
  props: {
    ...useTheme.props,
    clsPrefix: {
      type: String,
      required: true
    },
    scrollable: {
      type: Boolean,
      default: true
    },
    treeMate: {
      type: Object,
      required: true
    },
    multiple: Boolean,
    size: {
      type: String,
      default: "medium"
    },
    value: {
      type: [String, Number, Array],
      default: null
    },
    autoPending: Boolean,
    virtualScroll: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: true
    },
    labelField: {
      type: String,
      default: "label"
    },
    valueField: {
      type: String,
      default: "value"
    },
    loading: Boolean,
    focusable: Boolean,
    renderLabel: Function,
    renderOption: Function,
    nodeProps: Function,
    showCheckmark: {
      type: Boolean,
      default: true
    },
    onMousedown: Function,
    onScroll: Function,
    onFocus: Function,
    onBlur: Function,
    onKeyup: Function,
    onKeydown: Function,
    onTabOut: Function,
    onMouseenter: Function,
    onMouseleave: Function,
    onResize: Function,
    resetMenuOnOptionsChange: {
      type: Boolean,
      default: true
    },
    inlineThemeDisabled: Boolean,
    scrollbarProps: Object,
    onToggle: Function
  },
  setup(props) {
    const {
      mergedClsPrefixRef,
      mergedRtlRef,
      mergedComponentPropsRef
    } = useConfig(props);
    const rtlEnabledRef = useRtl("InternalSelectMenu", mergedRtlRef, mergedClsPrefixRef);
    const themeRef = useTheme("InternalSelectMenu", "-internal-select-menu", index_cssr_default, internalSelectMenuLight, props, toRef(props, "clsPrefix"));
    const selfRef = ref(null);
    const virtualListRef = ref(null);
    const scrollbarRef = ref(null);
    const flattenedNodesRef = computed(() => props.treeMate.getFlattenedNodes());
    const fIndexGetterRef = computed(() => createIndexGetter(flattenedNodesRef.value));
    const pendingNodeRef = ref(null);
    function initPendingNode() {
      const {
        treeMate
      } = props;
      let defaultPendingNode = null;
      const {
        value
      } = props;
      if (value === null) defaultPendingNode = treeMate.getFirstAvailableNode();else {
        if (props.multiple) defaultPendingNode = treeMate.getNode((value || [])[(value || []).length - 1]);else defaultPendingNode = treeMate.getNode(value);
        if (!defaultPendingNode || defaultPendingNode.disabled) defaultPendingNode = treeMate.getFirstAvailableNode();
      }
      if (defaultPendingNode) setPendingTmNode(defaultPendingNode);else setPendingTmNode(null);
    }
    function clearPendingNodeIfInvalid() {
      const {
        value: pendingNode
      } = pendingNodeRef;
      if (pendingNode && !props.treeMate.getNode(pendingNode.key)) pendingNodeRef.value = null;
    }
    let initPendingNodeWatchStopHandle;
    watch(() => props.show, show => {
      if (show) initPendingNodeWatchStopHandle = watch(() => props.treeMate, () => {
        if (props.resetMenuOnOptionsChange) {
          if (props.autoPending) initPendingNode();else clearPendingNodeIfInvalid();
          nextTick(scrollToPendingNode);
        } else clearPendingNodeIfInvalid();
      }, {
        immediate: true
      });else initPendingNodeWatchStopHandle?.();
    }, {
      immediate: true
    });
    onBeforeUnmount(() => {
      initPendingNodeWatchStopHandle?.();
    });
    const itemSizeRef = computed(() => {
      return depx(themeRef.value.self[createKey("optionHeight", props.size)]);
    });
    const paddingRef = computed(() => {
      return getPadding(themeRef.value.self[createKey("padding", props.size)]);
    });
    const valueSetRef = computed(() => {
      if (props.multiple && Array.isArray(props.value)) return new Set(props.value);
      return /* @__PURE__ */new Set();
    });
    const emptyRef = computed(() => {
      const tmNodes = flattenedNodesRef.value;
      return tmNodes && tmNodes.length === 0;
    });
    const mergedRenderEmptyRef = computed(() => {
      return mergedComponentPropsRef?.value?.Select?.renderEmpty;
    });
    function doToggle(tmNode) {
      const {
        onToggle
      } = props;
      if (onToggle) onToggle(tmNode);
    }
    function doScroll(e) {
      const {
        onScroll
      } = props;
      if (onScroll) onScroll(e);
    }
    function handleVirtualListScroll(e) {
      scrollbarRef.value?.sync();
      doScroll(e);
    }
    function handleVirtualListResize() {
      scrollbarRef.value?.sync();
    }
    function getPendingTmNode() {
      const {
        value: pendingTmNode
      } = pendingNodeRef;
      if (pendingTmNode) return pendingTmNode;
      return null;
    }
    function handleOptionMouseEnter(e, tmNode) {
      if (tmNode.disabled) return;
      setPendingTmNode(tmNode, false);
    }
    function handleOptionClick(e, tmNode) {
      if (tmNode.disabled) return;
      doToggle(tmNode);
    }
    function handleKeyUp(e) {
      if (happensIn(e, "action")) return;
      props.onKeyup?.(e);
    }
    function handleKeyDown(e) {
      if (happensIn(e, "action")) return;
      props.onKeydown?.(e);
    }
    function handleMouseDown(e) {
      props.onMousedown?.(e);
      if (props.focusable) return;
      e.preventDefault();
    }
    function next() {
      const {
        value: pendingTmNode
      } = pendingNodeRef;
      if (pendingTmNode) setPendingTmNode(pendingTmNode.getNext({
        loop: true
      }), true);
    }
    function prev() {
      const {
        value: pendingTmNode
      } = pendingNodeRef;
      if (pendingTmNode) setPendingTmNode(pendingTmNode.getPrev({
        loop: true
      }), true);
    }
    function setPendingTmNode(tmNode, doScroll = false) {
      pendingNodeRef.value = tmNode;
      if (doScroll) scrollToPendingNode();
    }
    function scrollToPendingNode() {
      const tmNode = pendingNodeRef.value;
      if (!tmNode) return;
      const fIndex = fIndexGetterRef.value(tmNode.key);
      if (fIndex === null) return;
      if (props.virtualScroll) virtualListRef.value?.scrollTo({
        index: fIndex
      });else scrollbarRef.value?.scrollTo({
        index: fIndex,
        elSize: itemSizeRef.value
      });
    }
    function handleFocusin(e) {
      if (selfRef.value?.contains(e.target)) props.onFocus?.(e);
    }
    function handleFocusout(e) {
      if (!selfRef.value?.contains(e.relatedTarget)) props.onBlur?.(e);
    }
    provide(internalSelectionMenuInjectionKey, {
      handleOptionMouseEnter,
      handleOptionClick,
      valueSetRef,
      pendingTmNodeRef: pendingNodeRef,
      nodePropsRef: toRef(props, "nodeProps"),
      showCheckmarkRef: toRef(props, "showCheckmark"),
      multipleRef: toRef(props, "multiple"),
      valueRef: toRef(props, "value"),
      renderLabelRef: toRef(props, "renderLabel"),
      renderOptionRef: toRef(props, "renderOption"),
      labelFieldRef: toRef(props, "labelField"),
      valueFieldRef: toRef(props, "valueField")
    });
    provide(internalSelectionMenuBodyInjectionKey, selfRef);
    onMounted(() => {
      const {
        value
      } = scrollbarRef;
      if (value) value.sync();
    });
    const cssVarsRef = computed(() => {
      const {
        size
      } = props;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          height,
          borderRadius,
          color,
          groupHeaderTextColor,
          actionDividerColor,
          optionTextColorPressed,
          optionTextColor,
          optionTextColorDisabled,
          optionTextColorActive,
          optionOpacityDisabled,
          optionCheckColor,
          actionTextColor,
          optionColorPending,
          optionColorActive,
          loadingColor,
          loadingSize,
          optionColorActivePending,
          [createKey("optionFontSize", size)]: fontSize,
          [createKey("optionHeight", size)]: optionHeight,
          [createKey("optionPadding", size)]: optionPadding
        }
      } = themeRef.value;
      return {
        "--n-height": height,
        "--n-action-divider-color": actionDividerColor,
        "--n-action-text-color": actionTextColor,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-border-radius": borderRadius,
        "--n-color": color,
        "--n-option-font-size": fontSize,
        "--n-group-header-text-color": groupHeaderTextColor,
        "--n-option-check-color": optionCheckColor,
        "--n-option-color-pending": optionColorPending,
        "--n-option-color-active": optionColorActive,
        "--n-option-color-active-pending": optionColorActivePending,
        "--n-option-height": optionHeight,
        "--n-option-opacity-disabled": optionOpacityDisabled,
        "--n-option-text-color": optionTextColor,
        "--n-option-text-color-active": optionTextColorActive,
        "--n-option-text-color-disabled": optionTextColorDisabled,
        "--n-option-text-color-pressed": optionTextColorPressed,
        "--n-option-padding": optionPadding,
        "--n-option-padding-left": getPadding(optionPadding, "left"),
        "--n-option-padding-right": getPadding(optionPadding, "right"),
        "--n-loading-color": loadingColor,
        "--n-loading-size": loadingSize
      };
    });
    const {
      inlineThemeDisabled
    } = props;
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("internal-select-menu", computed(() => props.size[0]), cssVarsRef, props) : void 0;
    const exposedProps = {
      selfRef,
      next,
      prev,
      getPendingTmNode
    };
    useOnResize(selfRef, props.onResize);
    return {
      mergedTheme: themeRef,
      mergedClsPrefix: mergedClsPrefixRef,
      rtlEnabled: rtlEnabledRef,
      virtualListRef,
      scrollbarRef,
      itemSize: itemSizeRef,
      padding: paddingRef,
      flattenedNodes: flattenedNodesRef,
      empty: emptyRef,
      mergedRenderEmpty: mergedRenderEmptyRef,
      virtualListContainer() {
        const {
          value
        } = virtualListRef;
        return value?.listElRef;
      },
      virtualListContent() {
        const {
          value
        } = virtualListRef;
        return value?.itemsElRef;
      },
      doScroll,
      handleFocusin,
      handleFocusout,
      handleKeyUp,
      handleKeyDown,
      handleMouseDown,
      handleVirtualListResize,
      handleVirtualListScroll,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender,
      ...exposedProps
    };
  },
  render() {
    const {
      $slots,
      virtualScroll,
      clsPrefix,
      mergedTheme,
      themeClass,
      onRender
    } = this;
    onRender?.();
    return openBlock(), createElementBlock("div", {
      ref: "selfRef",
      tabindex: this.focusable ? 0 : -1,
      class: normalizeClass$1([`${clsPrefix}-base-select-menu`, `${clsPrefix}-base-select-menu--${this.size}-size`, this.rtlEnabled && `${clsPrefix}-base-select-menu--rtl`, themeClass, this.multiple && `${clsPrefix}-base-select-menu--multiple`]),
      style: normalizeStyle(this.cssVars),
      onFocusin: this.handleFocusin,
      onFocusout: this.handleFocusout,
      onKeyup: this.handleKeyUp,
      onKeydown: this.handleKeyDown,
      onMousedown: this.handleMouseDown,
      onMouseenter: this.onMouseenter,
      onMouseleave: this.onMouseleave
    }, [normalizeVNode(() => resolveWrappedSlot($slots.header, children => children && (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${clsPrefix}-base-select-menu__header`),
      "data-header": true,
      key: "header"
    }, [normalizeVNode(() => children)], 2)))), this.loading ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${clsPrefix}-base-select-menu__loading`)
    }, [(openBlock(), createBlock(Loading_default, {
      clsPrefix,
      strokeWidth: 20
    }, null, 8, ["clsPrefix"]))], 2)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [!this.empty ? (openBlock(), createBlock(Scrollbar, mergeProps({
      key: 0,
      ref: "scrollbarRef",
      theme: mergedTheme.peers.Scrollbar,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar,
      scrollable: this.scrollable,
      container: virtualScroll ? this.virtualListContainer : void 0,
      content: virtualScroll ? this.virtualListContent : void 0,
      onScroll: virtualScroll ? void 0 : this.doScroll
    }, this.scrollbarProps), {
      default: () => {
        return virtualScroll ? (openBlock(), createBlock(VirtualList, {
          key: 1,
          ref: "virtualListRef",
          class: normalizeClass$1(`${clsPrefix}-virtual-list`),
          items: this.flattenedNodes,
          itemSize: this.itemSize,
          showScrollbar: false,
          paddingTop: this.padding.top,
          paddingBottom: this.padding.bottom,
          onResize: this.handleVirtualListResize,
          onScroll: this.handleVirtualListScroll,
          itemResizable: true
        }, {
          default: ({
            item: tmNode
          }) => {
            return tmNode.isGroup ? (openBlock(), createBlock(SelectGroupHeader_default, {
              key: tmNode.key,
              clsPrefix,
              tmNode
            }, null, 8, ["clsPrefix", "tmNode"])) : tmNode.ignored ? null : (openBlock(), createBlock(SelectOption_default, {
              clsPrefix,
              key: tmNode.key,
              tmNode
            }, null, 8, ["clsPrefix", "tmNode"]));
          }
        }, 1032, ["class", "items", "itemSize", "paddingTop", "paddingBottom", "onResize", "onScroll"])) : (openBlock(), createElementBlock("div", {
          key: 4,
          class: normalizeClass$1(`${clsPrefix}-base-select-menu-option-wrapper`),
          style: normalizeStyle({
            paddingTop: this.padding.top,
            paddingBottom: this.padding.bottom
          })
        }, [normalizeVNode(() => this.flattenedNodes.map(tmNode => tmNode.isGroup ? (openBlock(), createBlock(SelectGroupHeader_default, {
          key: tmNode.key,
          clsPrefix,
          tmNode
        }, null, 8, ["clsPrefix", "tmNode"])) : (openBlock(), createBlock(SelectOption_default, {
          clsPrefix,
          key: tmNode.key,
          tmNode
        }, null, 8, ["clsPrefix", "tmNode"]))))], 6));
      }
    }, 1040, ["theme", "themeOverrides", "scrollable", "container", "content", "onScroll"])) : (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass$1(`${clsPrefix}-base-select-menu__empty`),
      "data-empty": true
    }, [normalizeVNode(() => resolveSlot($slots.empty, () => {
      return [this.mergedRenderEmpty?.() || (openBlock(), createBlock(Empty_default, {
        theme: mergedTheme.peers.Empty,
        themeOverrides: mergedTheme.peerOverrides.Empty,
        size: this.size
      }, null, 8, ["theme", "themeOverrides", "size"]))];
    }))], 2))], 64)), normalizeVNode(() => resolveWrappedSlot($slots.action, children => children && [(openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${clsPrefix}-base-select-menu__action`),
      "data-action": true,
      key: "action"
    }, [normalizeVNode(() => children)], 2)), (openBlock(), createBlock(focus_detector_default, {
      onFocus: this.onTabOut,
      key: "focus-detector"
    }, null, 8, ["onFocus"]))]))], 46, _hoisted_1);
  }
});
//#endregion
export { SelectMenu_default as default };