import { useAdjustedTo } from "../../_utils/composable/use-adjusted-to.mjs";
import { createKey } from "../../_utils/cssr/index.mjs";
import { smallerSize } from "../../_utils/naive/prop.mjs";
import { warn, warnOnce } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { resolveSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useLocale from "../../_mixins/use-locale.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { createVNodeCache, normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Backward_default from "../../_internal/icons/Backward.mjs";
import FastBackward_default from "../../_internal/icons/FastBackward.mjs";
import FastForward_default from "../../_internal/icons/FastForward.mjs";
import Forward_default from "../../_internal/icons/Forward.mjs";
import More_default from "../../_internal/icons/More.mjs";
import Input_default from "../../input/src/Input.mjs";
import Popselect_default from "../../popselect/src/Popselect.mjs";
import Select_default from "../../select/src/Select.mjs";
import paginationLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { createPageItemsInfo, getDefaultPageSize } from "./utils.mjs";
import { Fragment, computed, createBlock, createElementBlock, createElementVNode, defineComponent, mergeProps, nextTick, normalizeStyle, openBlock, ref, toRef, watchEffect } from "vue";
import { useMergedState } from "vooks";
//#region src/pagination/src/Pagination.tsx
const _hoisted_1 = ["onClick", "onMouseenter", "onMouseleave"];
const _hoisted_2 = ["onClick"];
const _hoisted_3 = ["onClick"];
const paginationProps = {
  ...useTheme.props,
  simple: Boolean,
  page: Number,
  defaultPage: {
    type: Number,
    default: 1
  },
  itemCount: Number,
  pageCount: Number,
  defaultPageCount: {
    type: Number,
    default: 1
  },
  showSizePicker: Boolean,
  pageSize: Number,
  defaultPageSize: Number,
  pageSizes: {
    type: Array,
    default() {
      return [10];
    }
  },
  showQuickJumper: Boolean,
  size: String,
  disabled: Boolean,
  pageSlot: {
    type: Number,
    default: 9
  },
  selectProps: Object,
  prev: Function,
  next: Function,
  goto: Function,
  prefix: Function,
  suffix: Function,
  label: Function,
  displayOrder: {
    type: Array,
    default: ["pages", "size-picker", "quick-jumper"]
  },
  to: useAdjustedTo.propTo,
  showQuickJumpDropdown: {
    type: Boolean,
    default: true
  },
  scrollbarProps: Object,
  "onUpdate:page": [Function, Array],
  onUpdatePage: [Function, Array],
  "onUpdate:pageSize": [Function, Array],
  onUpdatePageSize: [Function, Array],
  /** @deprecated */
  onPageSizeChange: [Function, Array],
  /** @deprecated */
  onChange: [Function, Array]
};
var Pagination_default = defineComponent({
  name: "Pagination",
  props: paginationProps,
  slots: Object,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.pageCount !== void 0 && props.itemCount !== void 0) warn("pagination", "`page-count` and `item-count` should't be specified together. Only `item-count` will take effect.");
      if (props.onPageSizeChange) warnOnce("pagination", "`on-page-size-change` is deprecated, please use `on-update:page-size` instead.");
      if (props.onChange) warnOnce("pagination", "`on-change` is deprecated, please use `on-update:page` instead.");
    });
    const {
      mergedComponentPropsRef,
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef
    } = useConfig(props);
    const mergedSizeRef = computed(() => {
      return props.size || mergedComponentPropsRef?.value?.Pagination?.size || "medium";
    });
    const themeRef = useTheme("Pagination", "-pagination", index_cssr_default, paginationLight, props, mergedClsPrefixRef);
    const {
      localeRef
    } = useLocale("Pagination");
    const selfRef = ref(null);
    const uncontrolledPageRef = ref(props.defaultPage);
    const uncontrolledPageSizeRef = ref(getDefaultPageSize(props));
    const mergedPageRef = useMergedState(toRef(props, "page"), uncontrolledPageRef);
    const mergedPageSizeRef = useMergedState(toRef(props, "pageSize"), uncontrolledPageSizeRef);
    const mergedPageCountRef = computed(() => {
      const {
        itemCount
      } = props;
      if (itemCount !== void 0) return Math.max(1, Math.ceil(itemCount / mergedPageSizeRef.value));
      const {
        pageCount
      } = props;
      if (pageCount !== void 0) return Math.max(pageCount, 1);
      return 1;
    });
    const jumperValueRef = ref("");
    watchEffect(() => {
      props.simple;
      jumperValueRef.value = String(mergedPageRef.value);
    });
    const fastForwardActiveRef = ref(false);
    const fastBackwardActiveRef = ref(false);
    const showFastForwardMenuRef = ref(false);
    const showFastBackwardMenuRef = ref(false);
    const handleFastForwardMouseenter = () => {
      if (props.disabled) return;
      fastForwardActiveRef.value = true;
      disableTransitionOneTick();
    };
    const handleFastForwardMouseleave = () => {
      if (props.disabled) return;
      fastForwardActiveRef.value = false;
      disableTransitionOneTick();
    };
    const handleFastBackwardMouseenter = () => {
      fastBackwardActiveRef.value = true;
      disableTransitionOneTick();
    };
    const handleFastBackwardMouseleave = () => {
      fastBackwardActiveRef.value = false;
      disableTransitionOneTick();
    };
    const handleMenuSelect = value => {
      doUpdatePage(value);
    };
    const pageItemsInfo = computed(() => createPageItemsInfo(mergedPageRef.value, mergedPageCountRef.value, props.pageSlot, props.showQuickJumpDropdown));
    watchEffect(() => {
      if (!pageItemsInfo.value.hasFastBackward) {
        fastBackwardActiveRef.value = false;
        showFastBackwardMenuRef.value = false;
      } else if (!pageItemsInfo.value.hasFastForward) {
        fastForwardActiveRef.value = false;
        showFastForwardMenuRef.value = false;
      }
    });
    const pageSizeOptionsRef = computed(() => {
      const suffix = localeRef.value.selectionSuffix;
      return props.pageSizes.map(size => {
        if (typeof size === "number") return {
          label: `${size} / ${suffix}`,
          value: size
        };else return size;
      });
    });
    const inputSizeRef = computed(() => {
      return mergedComponentPropsRef?.value?.Pagination?.inputSize || smallerSize(mergedSizeRef.value);
    });
    const selectSizeRef = computed(() => {
      return mergedComponentPropsRef?.value?.Pagination?.selectSize || smallerSize(mergedSizeRef.value);
    });
    const startIndexRef = computed(() => {
      return (mergedPageRef.value - 1) * mergedPageSizeRef.value;
    });
    const endIndexRef = computed(() => {
      const endIndex = mergedPageRef.value * mergedPageSizeRef.value - 1;
      const {
        itemCount
      } = props;
      if (itemCount !== void 0) return endIndex > itemCount - 1 ? itemCount - 1 : endIndex;
      return endIndex;
    });
    const mergedItemCountRef = computed(() => {
      const {
        itemCount
      } = props;
      if (itemCount !== void 0) return itemCount;
      return (props.pageCount || 1) * mergedPageSizeRef.value;
    });
    const rtlEnabledRef = useRtl("Pagination", mergedRtlRef, mergedClsPrefixRef);
    function disableTransitionOneTick() {
      nextTick(() => {
        const {
          value: selfEl
        } = selfRef;
        if (!selfEl) return;
        selfEl.classList.add("transition-disabled");
        selfRef.value?.offsetWidth;
        selfEl.classList.remove("transition-disabled");
      });
    }
    function doUpdatePage(page) {
      if (page === mergedPageRef.value) return;
      const {
        "onUpdate:page": _onUpdatePage,
        onUpdatePage,
        onChange,
        simple
      } = props;
      if (_onUpdatePage) call(_onUpdatePage, page);
      if (onUpdatePage) call(onUpdatePage, page);
      if (onChange) call(onChange, page);
      uncontrolledPageRef.value = page;
      if (simple) jumperValueRef.value = String(page);
    }
    function doUpdatePageSize(pageSize) {
      if (pageSize === mergedPageSizeRef.value) return;
      const {
        "onUpdate:pageSize": _onUpdatePageSize,
        onUpdatePageSize,
        onPageSizeChange
      } = props;
      if (_onUpdatePageSize) call(_onUpdatePageSize, pageSize);
      if (onUpdatePageSize) call(onUpdatePageSize, pageSize);
      if (onPageSizeChange) call(onPageSizeChange, pageSize);
      uncontrolledPageSizeRef.value = pageSize;
      if (mergedPageCountRef.value < mergedPageRef.value) doUpdatePage(mergedPageCountRef.value);
    }
    function forward() {
      if (props.disabled) return;
      doUpdatePage(Math.min(mergedPageRef.value + 1, mergedPageCountRef.value));
    }
    function backward() {
      if (props.disabled) return;
      doUpdatePage(Math.max(mergedPageRef.value - 1, 1));
    }
    function fastForward() {
      if (props.disabled) return;
      doUpdatePage(Math.min(pageItemsInfo.value.fastForwardTo, mergedPageCountRef.value));
    }
    function fastBackward() {
      if (props.disabled) return;
      doUpdatePage(Math.max(pageItemsInfo.value.fastBackwardTo, 1));
    }
    function handleSizePickerChange(value) {
      doUpdatePageSize(value);
    }
    function doQuickJump() {
      const page = Number.parseInt(jumperValueRef.value);
      if (Number.isNaN(page)) return;
      doUpdatePage(Math.max(1, Math.min(page, mergedPageCountRef.value)));
      if (!props.simple) jumperValueRef.value = "";
    }
    function handleQuickJumperChange() {
      doQuickJump();
    }
    function handlePageItemClick(pageItem) {
      if (props.disabled) return;
      switch (pageItem.type) {
        case "page":
          doUpdatePage(pageItem.label);
          break;
        case "fast-backward":
          fastBackward();
          break;
        case "fast-forward":
          fastForward();
      }
    }
    function handleJumperInput(value) {
      jumperValueRef.value = value.replace(/\D+/g, "");
    }
    watchEffect(() => {
      mergedPageRef.value;
      mergedPageSizeRef.value;
      disableTransitionOneTick();
    });
    const cssVarsRef = computed(() => {
      const size = mergedSizeRef.value;
      const {
        self: {
          buttonBorder,
          buttonBorderHover,
          buttonBorderPressed,
          buttonIconColor,
          buttonIconColorHover,
          buttonIconColorPressed,
          itemTextColor,
          itemTextColorHover,
          itemTextColorPressed,
          itemTextColorActive,
          itemTextColorDisabled,
          itemColor,
          itemColorHover,
          itemColorPressed,
          itemColorActive,
          itemColorActiveHover,
          itemColorDisabled,
          itemBorder,
          itemBorderHover,
          itemBorderPressed,
          itemBorderActive,
          itemBorderDisabled,
          itemBorderRadius,
          jumperTextColor,
          jumperTextColorDisabled,
          buttonColor,
          buttonColorHover,
          buttonColorPressed,
          [createKey("itemPadding", size)]: itemPadding,
          [createKey("itemMargin", size)]: itemMargin,
          [createKey("inputWidth", size)]: inputWidth,
          [createKey("selectWidth", size)]: selectWidth,
          [createKey("inputMargin", size)]: inputMargin,
          [createKey("selectMargin", size)]: selectMargin,
          [createKey("jumperFontSize", size)]: jumperFontSize,
          [createKey("prefixMargin", size)]: prefixMargin,
          [createKey("suffixMargin", size)]: suffixMargin,
          [createKey("itemSize", size)]: itemSize,
          [createKey("buttonIconSize", size)]: buttonIconSize,
          [createKey("itemFontSize", size)]: itemFontSize,
          [`${createKey("itemMargin", size)}Rtl`]: itemMarginRtl,
          [`${createKey("inputMargin", size)}Rtl`]: inputMarginRtl
        },
        common: {
          cubicBezierEaseInOut
        }
      } = themeRef.value;
      return {
        "--n-prefix-margin": prefixMargin,
        "--n-suffix-margin": suffixMargin,
        "--n-item-font-size": itemFontSize,
        "--n-select-width": selectWidth,
        "--n-select-margin": selectMargin,
        "--n-input-width": inputWidth,
        "--n-input-margin": inputMargin,
        "--n-input-margin-rtl": inputMarginRtl,
        "--n-item-size": itemSize,
        "--n-item-text-color": itemTextColor,
        "--n-item-text-color-disabled": itemTextColorDisabled,
        "--n-item-text-color-hover": itemTextColorHover,
        "--n-item-text-color-active": itemTextColorActive,
        "--n-item-text-color-pressed": itemTextColorPressed,
        "--n-item-color": itemColor,
        "--n-item-color-hover": itemColorHover,
        "--n-item-color-disabled": itemColorDisabled,
        "--n-item-color-active": itemColorActive,
        "--n-item-color-active-hover": itemColorActiveHover,
        "--n-item-color-pressed": itemColorPressed,
        "--n-item-border": itemBorder,
        "--n-item-border-hover": itemBorderHover,
        "--n-item-border-disabled": itemBorderDisabled,
        "--n-item-border-active": itemBorderActive,
        "--n-item-border-pressed": itemBorderPressed,
        "--n-item-padding": itemPadding,
        "--n-item-border-radius": itemBorderRadius,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-jumper-font-size": jumperFontSize,
        "--n-jumper-text-color": jumperTextColor,
        "--n-jumper-text-color-disabled": jumperTextColorDisabled,
        "--n-item-margin": itemMargin,
        "--n-item-margin-rtl": itemMarginRtl,
        "--n-button-icon-size": buttonIconSize,
        "--n-button-icon-color": buttonIconColor,
        "--n-button-icon-color-hover": buttonIconColorHover,
        "--n-button-icon-color-pressed": buttonIconColorPressed,
        "--n-button-color-hover": buttonColorHover,
        "--n-button-color": buttonColor,
        "--n-button-color-pressed": buttonColorPressed,
        "--n-button-border": buttonBorder,
        "--n-button-border-hover": buttonBorderHover,
        "--n-button-border-pressed": buttonBorderPressed
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("pagination", computed(() => {
      let hash = "";
      hash += mergedSizeRef.value[0];
      return hash;
    }), cssVarsRef, props) : void 0;
    return {
      rtlEnabled: rtlEnabledRef,
      mergedClsPrefix: mergedClsPrefixRef,
      locale: localeRef,
      selfRef,
      mergedPage: mergedPageRef,
      pageItems: computed(() => {
        return pageItemsInfo.value.items;
      }),
      mergedItemCount: mergedItemCountRef,
      jumperValue: jumperValueRef,
      pageSizeOptions: pageSizeOptionsRef,
      mergedPageSize: mergedPageSizeRef,
      inputSize: inputSizeRef,
      selectSize: selectSizeRef,
      mergedTheme: themeRef,
      mergedPageCount: mergedPageCountRef,
      startIndex: startIndexRef,
      endIndex: endIndexRef,
      showFastForwardMenu: showFastForwardMenuRef,
      showFastBackwardMenu: showFastBackwardMenuRef,
      fastForwardActive: fastForwardActiveRef,
      fastBackwardActive: fastBackwardActiveRef,
      handleMenuSelect,
      handleFastForwardMouseenter,
      handleFastForwardMouseleave,
      handleFastBackwardMouseenter,
      handleFastBackwardMouseleave,
      handleJumperInput,
      handleBackwardClick: backward,
      handleForwardClick: forward,
      handlePageItemClick,
      handleSizePickerChange,
      handleQuickJumperChange,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      $slots,
      mergedClsPrefix,
      disabled,
      cssVars,
      mergedPage,
      mergedPageCount,
      pageItems,
      showSizePicker,
      showQuickJumper,
      mergedTheme,
      locale,
      inputSize,
      selectSize,
      mergedPageSize,
      pageSizeOptions,
      jumperValue,
      simple,
      prev,
      next,
      prefix,
      suffix,
      label,
      goto,
      handleJumperInput,
      handleSizePickerChange,
      handleBackwardClick,
      handlePageItemClick,
      handleForwardClick,
      handleQuickJumperChange,
      onRender
    } = this;
    onRender?.();
    const renderPrefix = prefix || $slots.prefix;
    const renderSuffix = suffix || $slots.suffix;
    const renderPrev = prev || $slots.prev;
    const renderNext = next || $slots.next;
    const renderLabel = label || $slots.label;
    return openBlock(), createElementBlock("div", {
      ref: "selfRef",
      class: normalizeClass$1([`${mergedClsPrefix}-pagination`, this.themeClass, this.rtlEnabled && `${mergedClsPrefix}-pagination--rtl`, disabled && `${mergedClsPrefix}-pagination--disabled`, simple && `${mergedClsPrefix}-pagination--simple`]),
      style: normalizeStyle(cssVars)
    }, [renderPrefix ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-pagination-prefix`)
    }, [normalizeVNode(() => renderPrefix({
      page: mergedPage,
      pageSize: mergedPageSize,
      pageCount: mergedPageCount,
      startIndex: this.startIndex,
      endIndex: this.endIndex,
      itemCount: this.mergedItemCount
    }))], 2)) : normalizeVNode(() => null), normalizeVNode(() => this.displayOrder.map(part => {
      switch (part) {
        case "pages":
          return (() => {
            const _cache = createVNodeCache("9d36e2972681a71c");
            return openBlock(), createElementBlock(Fragment, {
              key: "pages"
            }, [createElementVNode("div", {
              class: normalizeClass$1([`${mergedClsPrefix}-pagination-item`, !renderPrev && `${mergedClsPrefix}-pagination-item--button`, (mergedPage <= 1 || mergedPage > mergedPageCount || disabled) && `${mergedClsPrefix}-pagination-item--disabled`]),
              onClick: handleBackwardClick
            }, [renderPrev ? (openBlock(), createElementBlock(Fragment, {
              key: 0
            }, [normalizeVNode(() => renderPrev({
              page: mergedPage,
              pageSize: mergedPageSize,
              pageCount: mergedPageCount,
              startIndex: this.startIndex,
              endIndex: this.endIndex,
              itemCount: this.mergedItemCount
            }))], 64)) : (openBlock(), createBlock(Icon_default, {
              key: 1,
              clsPrefix: mergedClsPrefix
            }, {
              default: () => this.rtlEnabled ? (openBlock(), createBlock(Forward_default, {
                key: 2
              })) : (openBlock(), createBlock(Backward_default, {
                key: 3
              }))
            }, 1032, ["clsPrefix"]))], 10, _hoisted_2), simple ? (openBlock(), createElementBlock(Fragment, {
              key: 0
            }, [createElementVNode("div", {
              class: normalizeClass$1(`${mergedClsPrefix}-pagination-quick-jumper`)
            }, [(openBlock(), createBlock(Input_default, {
              value: jumperValue,
              onUpdateValue: handleJumperInput,
              size: inputSize,
              placeholder: "",
              disabled,
              theme: mergedTheme.peers.Input,
              themeOverrides: mergedTheme.peerOverrides.Input,
              onChange: handleQuickJumperChange
            }, null, 8, ["value", "onUpdateValue", "size", "disabled", "theme", "themeOverrides", "onChange"]))], 2), _cache[0] || (_cache[0] = normalizeVNode("\xA0/", -1)), _cache[1] || (_cache[1] = normalizeVNode(" ", -1)), normalizeVNode(() => mergedPageCount)], 64)) : (openBlock(), createElementBlock(Fragment, {
              key: 1
            }, [normalizeVNode(() => pageItems.map(pageItem => {
              let contentNode;
              let onMouseenter;
              let onMouseleave;
              const {
                type
              } = pageItem;
              const itemKey = type === "page" ? `page-${pageItem.label}` : type;
              switch (type) {
                case "page":
                  const pageNode = pageItem.label;
                  if (renderLabel) contentNode = renderLabel({
                    type: "page",
                    node: pageNode,
                    active: pageItem.active
                  });else contentNode = pageNode;
                  break;
                case "fast-forward":
                  const fastForwardNode = this.fastForwardActive ? (openBlock(), createBlock(Icon_default, {
                    key: 6,
                    clsPrefix: mergedClsPrefix
                  }, {
                    default: () => this.rtlEnabled ? (openBlock(), createBlock(FastBackward_default, {
                      key: 7
                    })) : (openBlock(), createBlock(FastForward_default, {
                      key: 8
                    }))
                  }, 1032, ["clsPrefix"])) : (openBlock(), createBlock(Icon_default, {
                    key: 9,
                    clsPrefix: mergedClsPrefix
                  }, {
                    default: () => (openBlock(), createBlock(More_default))
                  }, 1032, ["clsPrefix"]));
                  if (renderLabel) contentNode = renderLabel({
                    type: "fast-forward",
                    node: fastForwardNode,
                    active: this.fastForwardActive || this.showFastForwardMenu
                  });else contentNode = fastForwardNode;
                  onMouseenter = this.handleFastForwardMouseenter;
                  onMouseleave = this.handleFastForwardMouseleave;
                  break;
                case "fast-backward":
                  const fastBackwardNode = this.fastBackwardActive ? (openBlock(), createBlock(Icon_default, {
                    key: 10,
                    clsPrefix: mergedClsPrefix
                  }, {
                    default: () => this.rtlEnabled ? (openBlock(), createBlock(FastForward_default, {
                      key: 11
                    })) : (openBlock(), createBlock(FastBackward_default, {
                      key: 12
                    }))
                  }, 1032, ["clsPrefix"])) : (openBlock(), createBlock(Icon_default, {
                    key: 13,
                    clsPrefix: mergedClsPrefix
                  }, {
                    default: () => (openBlock(), createBlock(More_default))
                  }, 1032, ["clsPrefix"]));
                  if (renderLabel) contentNode = renderLabel({
                    type: "fast-backward",
                    node: fastBackwardNode,
                    active: this.fastBackwardActive || this.showFastBackwardMenu
                  });else contentNode = fastBackwardNode;
                  onMouseenter = this.handleFastBackwardMouseenter;
                  onMouseleave = this.handleFastBackwardMouseleave;
              }
              const itemNode = (openBlock(), createElementBlock("div", {
                key: itemKey,
                class: normalizeClass$1([`${mergedClsPrefix}-pagination-item`, pageItem.active && `${mergedClsPrefix}-pagination-item--active`, type !== "page" && (type === "fast-backward" && this.showFastBackwardMenu || type === "fast-forward" && this.showFastForwardMenu) && `${mergedClsPrefix}-pagination-item--hover`, disabled && `${mergedClsPrefix}-pagination-item--disabled`, type === "page" && `${mergedClsPrefix}-pagination-item--clickable`]),
                onClick: () => {
                  handlePageItemClick(pageItem);
                },
                onMouseenter,
                onMouseleave
              }, [normalizeVNode(() => contentNode)], 42, _hoisted_1));
              if (type === "page" || !pageItem.options) return itemNode;
              return openBlock(), createBlock(Popselect_default, {
                to: this.to,
                key: itemKey,
                disabled,
                trigger: "hover",
                virtualScroll: true,
                style: {
                  width: "60px"
                },
                theme: mergedTheme.peers.Popselect,
                themeOverrides: mergedTheme.peerOverrides.Popselect,
                builtinThemeOverrides: {
                  peers: {
                    InternalSelectMenu: {
                      height: "calc(var(--n-option-height) * 4.6)"
                    }
                  }
                },
                nodeProps: () => ({
                  style: {
                    justifyContent: "center"
                  }
                }),
                show: type === "fast-backward" ? this.showFastBackwardMenu : this.showFastForwardMenu,
                onUpdateShow: value => {
                  if (value) {
                    if (type === "fast-backward") this.showFastBackwardMenu = value;else this.showFastForwardMenu = value;
                  } else {
                    this.showFastBackwardMenu = false;
                    this.showFastForwardMenu = false;
                  }
                },
                options: pageItem.options,
                onUpdateValue: this.handleMenuSelect,
                scrollable: true,
                scrollbarProps: this.scrollbarProps,
                showCheckmark: false
              }, {
                default: () => itemNode
              }, 1032, ["to", "disabled", "theme", "themeOverrides", "show", "onUpdateShow", "options", "onUpdateValue", "scrollbarProps"]);
            }))], 64)), createElementVNode("div", {
              class: normalizeClass$1([`${mergedClsPrefix}-pagination-item`, !renderNext && `${mergedClsPrefix}-pagination-item--button`, {
                [`${mergedClsPrefix}-pagination-item--disabled`]: mergedPage < 1 || mergedPage >= mergedPageCount || disabled
              }]),
              onClick: handleForwardClick
            }, [renderNext ? (openBlock(), createElementBlock(Fragment, {
              key: 0
            }, [normalizeVNode(() => renderNext({
              page: mergedPage,
              pageSize: mergedPageSize,
              pageCount: mergedPageCount,
              itemCount: this.mergedItemCount,
              startIndex: this.startIndex,
              endIndex: this.endIndex
            }))], 64)) : (openBlock(), createBlock(Icon_default, {
              key: 1,
              clsPrefix: mergedClsPrefix
            }, {
              default: () => this.rtlEnabled ? (openBlock(), createBlock(Backward_default, {
                key: 4
              })) : (openBlock(), createBlock(Forward_default, {
                key: 5
              }))
            }, 1032, ["clsPrefix"]))], 10, _hoisted_3)], 64);
          })();
        case "size-picker":
          return !simple && showSizePicker ? (openBlock(), createBlock(Select_default, mergeProps({
            key: 14,
            consistentMenuWidth: false,
            placeholder: "",
            showCheckmark: false,
            to: this.to
          }, this.selectProps, {
            size: selectSize,
            options: pageSizeOptions,
            value: mergedPageSize,
            disabled,
            scrollbarProps: this.scrollbarProps,
            theme: mergedTheme.peers.Select,
            themeOverrides: mergedTheme.peerOverrides.Select,
            onUpdateValue: handleSizePickerChange
          }), null, 16, ["to", "size", "options", "value", "disabled", "scrollbarProps", "theme", "themeOverrides", "onUpdateValue"])) : null;
        case "quick-jumper":
          return !simple && showQuickJumper ? (openBlock(), createElementBlock("div", {
            key: 15,
            class: normalizeClass$1(`${mergedClsPrefix}-pagination-quick-jumper`)
          }, [goto ? (openBlock(), createElementBlock(Fragment, {
            key: 0
          }, [normalizeVNode(() => goto())], 64)) : (openBlock(), createElementBlock(Fragment, {
            key: 1
          }, [normalizeVNode(() => resolveSlot(this.$slots.goto, () => [locale.goto]))], 64)), (openBlock(), createBlock(Input_default, {
            value: jumperValue,
            onUpdateValue: handleJumperInput,
            size: inputSize,
            placeholder: "",
            disabled,
            theme: mergedTheme.peers.Input,
            themeOverrides: mergedTheme.peerOverrides.Input,
            onChange: handleQuickJumperChange
          }, null, 8, ["value", "onUpdateValue", "size", "disabled", "theme", "themeOverrides", "onChange"]))], 2)) : null;
        default:
          return null;
      }
    })), renderSuffix ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1(`${mergedClsPrefix}-pagination-suffix`)
    }, [normalizeVNode(() => renderSuffix({
      page: mergedPage,
      pageSize: mergedPageSize,
      pageCount: mergedPageCount,
      startIndex: this.startIndex,
      endIndex: this.endIndex,
      itemCount: this.mergedItemCount
    }))], 2)) : normalizeVNode(() => null)], 6);
  }
});
//#endregion
export { Pagination_default as default, paginationProps };