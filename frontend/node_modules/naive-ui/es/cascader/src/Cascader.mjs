import { useAdjustedTo } from "../../_utils/composable/use-adjusted-to.mjs";
import { markEventEffectPerformed } from "../../_utils/event/index.mjs";
import { warnOnce } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import useLocale from "../../_mixins/use-locale.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeSlot } from "../../vue-jsx-vapor/vdom.mjs";
import Selection_default from "../../_internal/selection/src/Selection.mjs";
import cascaderLight from "../styles/light.mjs";
import { cascaderInjectionKey } from "./interface.mjs";
import CascaderMenu_default from "./CascaderMenu.mjs";
import { getPathLabel, getRawNodePath } from "./utils.mjs";
import CascaderSelectMenu_default from "./CascaderSelectMenu.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { changeColor, depx, getPreciseEventTarget, happensIn } from "seemly";
import { computed, createBlock, createElementBlock, createVNode, defineComponent, isReactive, mergeProps, nextTick, openBlock, provide, ref, toRef, watch, watchEffect } from "vue";
import { useIsMounted, useMergedState } from "vooks";
import { VBinder, VFollower, VTarget } from "vueuc";
import { SubtreeNotLoadedError, createTreeMate } from "treemate";
//#region src/cascader/src/Cascader.tsx
const cascaderProps = {
  ...useTheme.props,
  allowCheckingNotLoaded: Boolean,
  to: useAdjustedTo.propTo,
  bordered: {
    type: Boolean,
    default: void 0
  },
  options: {
    type: Array,
    default: () => []
  },
  value: [String, Number, Array],
  defaultValue: {
    type: [String, Number, Array],
    default: null
  },
  placeholder: String,
  multiple: Boolean,
  size: String,
  filterable: Boolean,
  disabled: {
    type: Boolean,
    default: void 0
  },
  disabledField: {
    type: String,
    default: "disabled"
  },
  expandTrigger: {
    type: String,
    default: "click"
  },
  clearable: Boolean,
  clearFilterAfterSelect: {
    type: Boolean,
    default: true
  },
  remote: Boolean,
  onLoad: Function,
  separator: {
    type: String,
    default: " / "
  },
  filter: Function,
  placement: {
    type: String,
    default: "bottom-start"
  },
  cascade: {
    type: Boolean,
    default: true
  },
  leafOnly: Boolean,
  showPath: {
    type: Boolean,
    default: true
  },
  show: {
    type: Boolean,
    default: void 0
  },
  maxTagCount: [String, Number],
  ellipsisTagPopoverProps: Object,
  menuProps: Object,
  filterMenuProps: Object,
  virtualScroll: {
    type: Boolean,
    default: true
  },
  checkStrategy: {
    type: String,
    default: "all"
  },
  valueField: {
    type: String,
    default: "value"
  },
  labelField: {
    type: String,
    default: "label"
  },
  childrenField: {
    type: String,
    default: "children"
  },
  renderLabel: Function,
  status: String,
  "onUpdate:value": [Function, Array],
  onUpdateValue: [Function, Array],
  "onUpdate:show": [Function, Array],
  onUpdateShow: [Function, Array],
  onBlur: Function,
  onFocus: Function,
  getColumnStyle: Function,
  spinProps: Object,
  renderPrefix: Function,
  renderSuffix: Function,
  scrollbarProps: Object,
  onChange: [Function, Array]
};
var Cascader_default = defineComponent({
  name: "Cascader",
  props: cascaderProps,
  slots: Object,
  setup(props, {
    slots
  }) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.leafOnly) warnOnce("cascader", "`leaf-only` is deprecated, please use `check-strategy=\"child\"` instead");
      if (props.onChange !== void 0) warnOnce("cascader", "`on-change` is deprecated, please use `on-update:value` instead.");
    });
    const {
      mergedBorderedRef,
      mergedClsPrefixRef,
      namespaceRef,
      inlineThemeDisabled,
      mergedComponentPropsRef
    } = useConfig(props);
    const themeRef = useTheme("Cascader", "-cascader", index_cssr_default, cascaderLight, props, mergedClsPrefixRef);
    const {
      localeRef
    } = useLocale("Cascader");
    const uncontrolledValueRef = ref(props.defaultValue);
    const controlledValueRef = computed(() => props.value);
    const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
    const mergedCheckStrategyRef = computed(() => {
      return props.leafOnly ? "child" : props.checkStrategy;
    });
    const patternRef = ref("");
    const formItem = useFormItem(props, {
      mergedSize: NFormItem => {
        const {
          size
        } = props;
        if (size) return size;
        const {
          mergedSize: formItemSize
        } = NFormItem || {};
        if (formItemSize?.value) return formItemSize.value;
        const configSize = mergedComponentPropsRef?.value?.Cascader?.size;
        if (configSize) return configSize;
        return "medium";
      }
    });
    const {
      mergedSizeRef,
      mergedDisabledRef,
      mergedStatusRef
    } = formItem;
    const cascaderMenuInstRef = ref(null);
    const selectMenuInstRef = ref(null);
    const triggerInstRef = ref(null);
    const keyboardKeyRef = ref(null);
    const hoverKeyRef = ref(null);
    const loadingKeySetRef = ref(/* @__PURE__ */new Set());
    const selectMenuFollowerRef = ref(null);
    const cascaderMenuFollowerRef = ref(null);
    const adjustedToRef = useAdjustedTo(props);
    const focusedRef = ref(false);
    const addLoadingKey = key => {
      loadingKeySetRef.value.add(key);
    };
    const deleteLoadingKey = key => {
      loadingKeySetRef.value.delete(key);
    };
    const treeMateRef = computed(() => {
      const {
        valueField,
        childrenField,
        disabledField
      } = props;
      return createTreeMate(props.options, {
        getDisabled(node) {
          return node[disabledField];
        },
        getKey(node) {
          return node[valueField];
        },
        getChildren(node) {
          return node[childrenField];
        }
      });
    });
    const mergedKeysRef = computed(() => {
      const {
        cascade,
        multiple
      } = props;
      if (multiple && Array.isArray(mergedValueRef.value)) return treeMateRef.value.getCheckedKeys(mergedValueRef.value, {
        cascade,
        allowNotLoaded: props.allowCheckingNotLoaded
      });else return {
        checkedKeys: [],
        indeterminateKeys: []
      };
    });
    const checkedKeysRef = computed(() => mergedKeysRef.value.checkedKeys);
    const indeterminateKeysRef = computed(() => mergedKeysRef.value.indeterminateKeys);
    const menuModelRef = computed(() => {
      const {
        treeNodePath,
        treeNode
      } = treeMateRef.value.getPath(hoverKeyRef.value);
      let ret;
      if (treeNode === null) ret = [treeMateRef.value.treeNodes];else {
        ret = treeNodePath.map(treeNode => treeNode.siblings);
        if (!treeNode.isLeaf && !loadingKeySetRef.value.has(treeNode.key) && treeNode.children) ret.push(treeNode.children);
      }
      return ret;
    });
    const hoverKeyPathRef = computed(() => {
      const {
        keyPath
      } = treeMateRef.value.getPath(hoverKeyRef.value);
      return keyPath;
    });
    const optionHeightRef = computed(() => {
      return themeRef.value.self.optionHeight;
    });
    if (isReactive(props.options)) watch(props.options, (value, oldValue) => {
      if (!(value === oldValue)) {
        hoverKeyRef.value = null;
        keyboardKeyRef.value = null;
      }
    });
    const uncontrolledShowRef = ref(false);
    function doUpdateShow(value) {
      const {
        onUpdateShow,
        "onUpdate:show": _onUpdateShow
      } = props;
      if (onUpdateShow) call(onUpdateShow, value);
      if (_onUpdateShow) call(_onUpdateShow, value);
      uncontrolledShowRef.value = value;
    }
    function doUpdateValue(value, option, optionPath) {
      const {
        onUpdateValue,
        "onUpdate:value": _onUpdateValue,
        onChange
      } = props;
      const {
        nTriggerFormInput,
        nTriggerFormChange
      } = formItem;
      if (onUpdateValue) call(onUpdateValue, value, option, optionPath);
      if (_onUpdateValue) call(_onUpdateValue, value, option, optionPath);
      if (onChange) call(onChange, value, option, optionPath);
      uncontrolledValueRef.value = value;
      nTriggerFormInput();
      nTriggerFormChange();
    }
    function updateKeyboardKey(key) {
      keyboardKeyRef.value = key;
    }
    function updateHoverKey(key) {
      hoverKeyRef.value = key;
    }
    function getOptionsByKeys(keys) {
      const {
        value: {
          getNode
        }
      } = treeMateRef;
      return keys.map(keys => getNode(keys)?.rawNode || null);
    }
    function doCheck(key) {
      const {
        cascade,
        multiple,
        filterable
      } = props;
      const {
        value: {
          check,
          getNode,
          getPath
        }
      } = treeMateRef;
      if (multiple) try {
        const {
          checkedKeys
        } = check(key, mergedKeysRef.value.checkedKeys, {
          cascade,
          checkStrategy: mergedCheckStrategyRef.value,
          allowNotLoaded: props.allowCheckingNotLoaded
        });
        doUpdateValue(checkedKeys, getOptionsByKeys(checkedKeys), checkedKeys.map(checkedKey => getRawNodePath(getPath(checkedKey)?.treeNodePath)));
        if (filterable) focusSelectionInput();
        keyboardKeyRef.value = key;
        hoverKeyRef.value = key;
      } catch (err) {
        if (err instanceof SubtreeNotLoadedError) {
          if (cascaderMenuInstRef.value) {
            const tmNode = getNode(key);
            if (tmNode !== null) cascaderMenuInstRef.value.showErrorMessage(tmNode.rawNode[props.labelField]);
          }
        } else throw err;
      } else if (mergedCheckStrategyRef.value === "child") {
        const tmNode = getNode(key);
        if (tmNode?.isLeaf) doUpdateValue(key, tmNode.rawNode, getRawNodePath(getPath(key).treeNodePath));else return false;
      } else doUpdateValue(key, getNode(key)?.rawNode || null, getRawNodePath(getPath(key)?.treeNodePath));
      return true;
    }
    function doUncheck(key) {
      const {
        cascade,
        multiple
      } = props;
      if (multiple) {
        const {
          value: {
            uncheck,
            getNode,
            getPath
          }
        } = treeMateRef;
        const {
          checkedKeys
        } = uncheck(key, mergedKeysRef.value.checkedKeys, {
          cascade,
          checkStrategy: mergedCheckStrategyRef.value,
          allowNotLoaded: props.allowCheckingNotLoaded
        });
        doUpdateValue(checkedKeys, checkedKeys.map(checkedKey => getNode(checkedKey)?.rawNode || null), checkedKeys.map(checkedKey => getRawNodePath(getPath(checkedKey)?.treeNodePath)));
        keyboardKeyRef.value = key;
        hoverKeyRef.value = key;
      }
    }
    const selectedOptionsRef = computed(() => {
      if (props.multiple) {
        const {
          showPath,
          separator,
          labelField,
          cascade
        } = props;
        const {
          getCheckedKeys,
          getNode
        } = treeMateRef.value;
        return getCheckedKeys(checkedKeysRef.value, {
          cascade,
          checkStrategy: mergedCheckStrategyRef.value,
          allowNotLoaded: props.allowCheckingNotLoaded
        }).checkedKeys.map(key => {
          const node = getNode(key);
          if (node === null) return {
            label: String(key),
            value: key
          };else return {
            label: showPath ? getPathLabel(node, separator, labelField) : node.rawNode[labelField],
            value: node.key
          };
        });
      } else return [];
    });
    const selectedOptionRef = computed(() => {
      const {
        multiple,
        showPath,
        separator,
        labelField
      } = props;
      const {
        value
      } = mergedValueRef;
      if (!multiple && !Array.isArray(value)) {
        const {
          getNode
        } = treeMateRef.value;
        if (value === null) return null;
        const node = getNode(value);
        if (node === null) return {
          label: String(value),
          value
        };else return {
          label: showPath ? getPathLabel(node, separator, labelField) : node.rawNode[labelField],
          value: node.key
        };
      } else return null;
    });
    const controlledShowRef = toRef(props, "show");
    const mergedShowRef = useMergedState(controlledShowRef, uncontrolledShowRef);
    const localizedPlaceholderRef = computed(() => {
      const {
        placeholder
      } = props;
      if (placeholder !== void 0) return placeholder;
      return localeRef.value.placeholder;
    });
    const showSelectMenuRef = computed(() => {
      return !!(props.filterable && patternRef.value);
    });
    watch(mergedShowRef, show => {
      if (!show) return;
      if (props.multiple) return;
      const {
        value
      } = mergedValueRef;
      if (!Array.isArray(value) && value !== null) {
        keyboardKeyRef.value = value;
        hoverKeyRef.value = value;
        nextTick(() => {
          if (!mergedShowRef.value) return;
          const {
            value: hoverKey
          } = hoverKeyRef;
          if (mergedValueRef.value !== null) {
            const node = treeMateRef.value.getNode(hoverKey);
            if (node) cascaderMenuInstRef.value?.scroll(node.level, node.index, depx(optionHeightRef.value));
          }
        });
      } else {
        keyboardKeyRef.value = null;
        hoverKeyRef.value = null;
      }
    }, {
      immediate: true
    });
    function doBlur(e) {
      const {
        onBlur
      } = props;
      const {
        nTriggerFormBlur
      } = formItem;
      if (onBlur) call(onBlur, e);
      nTriggerFormBlur();
    }
    function doFocus(e) {
      const {
        onFocus
      } = props;
      const {
        nTriggerFormFocus
      } = formItem;
      if (onFocus) call(onFocus, e);
      nTriggerFormFocus();
    }
    function focusSelectionInput() {
      triggerInstRef.value?.focusInput();
    }
    function focusSelection() {
      triggerInstRef.value?.focus();
    }
    function openMenu() {
      if (!mergedDisabledRef.value) {
        patternRef.value = "";
        doUpdateShow(true);
        if (props.filterable) focusSelectionInput();
      }
    }
    function closeMenu(returnFocus = false) {
      if (returnFocus) focusSelection();
      doUpdateShow(false);
      patternRef.value = "";
    }
    function handleCascaderMenuClickOutside(e) {
      if (showSelectMenuRef.value) return;
      if (mergedShowRef.value) {
        if (!triggerInstRef.value?.$el.contains(getPreciseEventTarget(e))) closeMenu();
      }
    }
    function handleSelectMenuClickOutside(e) {
      if (!showSelectMenuRef.value) return;
      handleCascaderMenuClickOutside(e);
    }
    function clearPattern() {
      if (props.clearFilterAfterSelect) patternRef.value = "";
    }
    function move(direction) {
      const {
        value: keyboardKey
      } = keyboardKeyRef;
      const {
        value: treeMate
      } = treeMateRef;
      switch (direction) {
        case "prev":
          if (keyboardKey !== null) {
            const node = treeMate.getPrev(keyboardKey, {
              loop: true
            });
            if (node !== null) {
              updateKeyboardKey(node.key);
              cascaderMenuInstRef.value?.scroll(node.level, node.index, depx(optionHeightRef.value));
            }
          }
          break;
        case "next":
          if (keyboardKey === null) {
            const node = treeMate.getFirstAvailableNode();
            if (node !== null) {
              updateKeyboardKey(node.key);
              cascaderMenuInstRef.value?.scroll(node.level, node.index, depx(optionHeightRef.value));
            }
          } else {
            const node = treeMate.getNext(keyboardKey, {
              loop: true
            });
            if (node !== null) {
              updateKeyboardKey(node.key);
              cascaderMenuInstRef.value?.scroll(node.level, node.index, depx(optionHeightRef.value));
            }
          }
          break;
        case "child":
          if (keyboardKey !== null) {
            const currentNode = treeMate.getNode(keyboardKey);
            if (currentNode !== null) {
              if (currentNode.shallowLoaded) {
                const node = treeMate.getChild(keyboardKey);
                if (node !== null) {
                  updateHoverKey(keyboardKey);
                  updateKeyboardKey(node.key);
                }
              } else {
                const {
                  value: loadingKeySet
                } = loadingKeySetRef;
                if (!loadingKeySet.has(keyboardKey)) {
                  addLoadingKey(keyboardKey);
                  updateHoverKey(keyboardKey);
                  const {
                    onLoad
                  } = props;
                  if (onLoad) onLoad(currentNode.rawNode).then(() => {
                    deleteLoadingKey(keyboardKey);
                  }).catch(() => {
                    deleteLoadingKey(keyboardKey);
                  });
                }
              }
            }
          }
          break;
        case "parent":
          if (keyboardKey !== null) {
            const node = treeMate.getParent(keyboardKey);
            if (node !== null) {
              updateKeyboardKey(node.key);
              const parentNode = node.getParent();
              if (parentNode === null) updateHoverKey(null);else updateHoverKey(parentNode.key);
            }
          }
      }
    }
    function handleKeydown(e) {
      switch (e.key) {
        case " ":
        case "ArrowDown":
        case "ArrowUp":
          if (props.filterable && mergedShowRef.value) break;
          e.preventDefault();
      }
      if (happensIn(e, "action")) return;
      switch (e.key) {
        case " ":
          if (props.filterable) return;
        case "Enter":
          if (!mergedShowRef.value) openMenu();else {
            const {
              value: showSelectMenu
            } = showSelectMenuRef;
            const {
              value: keyboardKey
            } = keyboardKeyRef;
            if (!showSelectMenu) {
              if (keyboardKey !== null) {
                if (checkedKeysRef.value.includes(keyboardKey) || indeterminateKeysRef.value.includes(keyboardKey)) doUncheck(keyboardKey);else {
                  const checkIsValid = doCheck(keyboardKey);
                  if (!props.multiple && checkIsValid) closeMenu(true);
                }
              }
            } else if (selectMenuInstRef.value) {
              if (selectMenuInstRef.value.enter()) clearPattern();
            }
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (mergedShowRef.value) {
            if (showSelectMenuRef.value) selectMenuInstRef.value?.prev();else move("prev");
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (mergedShowRef.value) {
            if (showSelectMenuRef.value) selectMenuInstRef.value?.next();else move("next");
          } else openMenu();
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (mergedShowRef.value && !showSelectMenuRef.value) move("parent");
          break;
        case "ArrowRight":
          e.preventDefault();
          if (mergedShowRef.value && !showSelectMenuRef.value) move("child");
          break;
        case "Escape":
          if (mergedShowRef.value) {
            markEventEffectPerformed(e);
            closeMenu(true);
          }
      }
    }
    function handleMenuKeydown(e) {
      handleKeydown(e);
    }
    function handleClear(e) {
      e.stopPropagation();
      if (props.multiple) doUpdateValue([], [], []);else doUpdateValue(null, null, null);
    }
    function handleTriggerFocus(e) {
      if (!cascaderMenuInstRef.value?.$el.contains(e.relatedTarget)) {
        focusedRef.value = true;
        doFocus(e);
      }
    }
    function handleTriggerBlur(e) {
      if (!cascaderMenuInstRef.value?.$el.contains(e.relatedTarget)) {
        focusedRef.value = false;
        doBlur(e);
        closeMenu();
      }
    }
    function handleMenuFocus(e) {
      if (!triggerInstRef.value?.$el.contains(e.relatedTarget)) {
        focusedRef.value = true;
        doFocus(e);
      }
    }
    function handleMenuBlur(e) {
      if (!triggerInstRef.value?.$el.contains(e.relatedTarget)) {
        focusedRef.value = false;
        doBlur(e);
      }
    }
    function handleMenuMousedown(e) {
      if (!happensIn(e, "action")) {
        if (props.multiple && props.filter) {
          e.preventDefault();
          focusSelectionInput();
        }
      }
    }
    function handleMenuTabout() {
      closeMenu(true);
    }
    function handleTriggerClick() {
      if (props.filterable) openMenu();else if (mergedShowRef.value) closeMenu(true);else openMenu();
    }
    function handlePatternInput(e) {
      patternRef.value = e.target.value;
    }
    function handleDeleteOption(option) {
      const {
        multiple
      } = props;
      const {
        value: mergedValue
      } = mergedValueRef;
      if (multiple && Array.isArray(mergedValue) && option.value !== void 0) doUncheck(option.value);else doUpdateValue(null, null, null);
    }
    function syncSelectMenuPosition() {
      selectMenuFollowerRef.value?.syncPosition();
    }
    function syncCascaderMenuPosition() {
      cascaderMenuFollowerRef.value?.syncPosition();
    }
    function handleTriggerResize() {
      if (mergedShowRef.value) {
        if (showSelectMenuRef.value) syncSelectMenuPosition();else syncCascaderMenuPosition();
      }
    }
    const showCheckboxRef = computed(() => {
      if (props.multiple && props.cascade) return true;
      if (mergedCheckStrategyRef.value !== "child") return true;
      return false;
    });
    provide(cascaderInjectionKey, {
      slots,
      mergedClsPrefixRef,
      mergedThemeRef: themeRef,
      mergedValueRef,
      checkedKeysRef,
      indeterminateKeysRef,
      hoverKeyPathRef,
      mergedCheckStrategyRef,
      showCheckboxRef,
      cascadeRef: toRef(props, "cascade"),
      multipleRef: toRef(props, "multiple"),
      keyboardKeyRef,
      hoverKeyRef,
      remoteRef: toRef(props, "remote"),
      loadingKeySetRef,
      expandTriggerRef: toRef(props, "expandTrigger"),
      isMountedRef: useIsMounted(),
      onLoadRef: toRef(props, "onLoad"),
      virtualScrollRef: toRef(props, "virtualScroll"),
      optionHeightRef,
      localeRef,
      labelFieldRef: toRef(props, "labelField"),
      renderLabelRef: toRef(props, "renderLabel"),
      getColumnStyleRef: toRef(props, "getColumnStyle"),
      renderPrefixRef: toRef(props, "renderPrefix"),
      renderSuffixRef: toRef(props, "renderSuffix"),
      spinPropsRef: toRef(props, "spinProps"),
      syncCascaderMenuPosition,
      syncSelectMenuPosition,
      updateKeyboardKey,
      updateHoverKey,
      addLoadingKey,
      deleteLoadingKey,
      doCheck,
      doUncheck,
      closeMenu,
      handleSelectMenuClickOutside,
      handleCascaderMenuClickOutside,
      scrollbarPropsRef: toRef(props, "scrollbarProps"),
      clearPattern
    });
    const exposedMethods = {
      focus: () => {
        triggerInstRef.value?.focus();
      },
      blur: () => {
        triggerInstRef.value?.blur();
      },
      getCheckedData: () => {
        if (showCheckboxRef.value) {
          const checkedKeys = checkedKeysRef.value;
          return {
            keys: checkedKeys,
            options: getOptionsByKeys(checkedKeys)
          };
        }
        return {
          keys: [],
          options: []
        };
      },
      getIndeterminateData: () => {
        if (showCheckboxRef.value) {
          const indeterminateKeys = indeterminateKeysRef.value;
          return {
            keys: indeterminateKeys,
            options: getOptionsByKeys(indeterminateKeys)
          };
        }
        return {
          keys: [],
          options: []
        };
      }
    };
    const cssVarsRef = computed(() => {
      const {
        self: {
          optionArrowColor,
          optionTextColor,
          optionTextColorActive,
          optionTextColorDisabled,
          optionCheckMarkColor,
          menuColor,
          menuBoxShadow,
          menuDividerColor,
          menuBorderRadius,
          menuHeight,
          optionColorHover,
          optionHeight,
          optionFontSize,
          loadingColor,
          columnWidth
        },
        common: {
          cubicBezierEaseInOut
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-menu-border-radius": menuBorderRadius,
        "--n-menu-box-shadow": menuBoxShadow,
        "--n-menu-height": menuHeight,
        "--n-column-width": columnWidth,
        "--n-menu-color": menuColor,
        "--n-menu-divider-color": menuDividerColor,
        "--n-option-height": optionHeight,
        "--n-option-font-size": optionFontSize,
        "--n-option-text-color": optionTextColor,
        "--n-option-text-color-disabled": optionTextColorDisabled,
        "--n-option-text-color-active": optionTextColorActive,
        "--n-option-color-hover": optionColorHover,
        "--n-option-check-mark-color": optionCheckMarkColor,
        "--n-option-arrow-color": optionArrowColor,
        "--n-menu-mask-color": changeColor(menuColor, {
          alpha: .75
        }),
        "--n-loading-color": loadingColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("cascader", void 0, cssVarsRef, props) : void 0;
    return {
      ...exposedMethods,
      handleTriggerResize,
      mergedStatus: mergedStatusRef,
      selectMenuFollowerRef,
      cascaderMenuFollowerRef,
      triggerInstRef,
      selectMenuInstRef,
      cascaderMenuInstRef,
      mergedBordered: mergedBorderedRef,
      mergedClsPrefix: mergedClsPrefixRef,
      namespace: namespaceRef,
      mergedValue: mergedValueRef,
      mergedShow: mergedShowRef,
      showSelectMenu: showSelectMenuRef,
      pattern: patternRef,
      treeMate: treeMateRef,
      mergedSize: mergedSizeRef,
      mergedDisabled: mergedDisabledRef,
      localizedPlaceholder: localizedPlaceholderRef,
      selectedOption: selectedOptionRef,
      selectedOptions: selectedOptionsRef,
      adjustedTo: adjustedToRef,
      menuModel: menuModelRef,
      handleMenuTabout,
      handleMenuFocus,
      handleMenuBlur,
      handleMenuKeydown,
      handleMenuMousedown,
      handleTriggerFocus,
      handleTriggerBlur,
      handleTriggerClick,
      handleClear,
      handleDeleteOption,
      handlePatternInput,
      handleKeydown,
      focused: focusedRef,
      optionHeight: optionHeightRef,
      mergedTheme: themeRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedClsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-cascader`)
    }, [createVNode(VBinder, null, {
      default: () => [(openBlock(), createBlock(VTarget, null, {
        default: () => (openBlock(), createBlock(Selection_default, {
          onResize: this.handleTriggerResize,
          ref: "triggerInstRef",
          status: this.mergedStatus,
          clsPrefix: mergedClsPrefix,
          maxTagCount: this.maxTagCount,
          ellipsisTagPopoverProps: this.ellipsisTagPopoverProps,
          bordered: this.mergedBordered,
          size: this.mergedSize,
          theme: this.mergedTheme.peers.InternalSelection,
          themeOverrides: this.mergedTheme.peerOverrides.InternalSelection,
          active: this.mergedShow,
          pattern: this.pattern,
          placeholder: this.localizedPlaceholder,
          selectedOption: this.selectedOption,
          selectedOptions: this.selectedOptions,
          multiple: this.multiple,
          filterable: this.filterable,
          clearable: this.clearable,
          disabled: this.mergedDisabled,
          focused: this.focused,
          onFocus: this.handleTriggerFocus,
          onBlur: this.handleTriggerBlur,
          onClick: this.handleTriggerClick,
          onClear: this.handleClear,
          onDeleteOption: this.handleDeleteOption,
          onPatternInput: this.handlePatternInput,
          onKeydown: this.handleKeydown
        }, {
          arrow: () => this.$slots.arrow?.()
        }, 1032, ["onResize", "status", "clsPrefix", "maxTagCount", "ellipsisTagPopoverProps", "bordered", "size", "theme", "themeOverrides", "active", "pattern", "placeholder", "selectedOption", "selectedOptions", "multiple", "filterable", "clearable", "disabled", "focused", "onFocus", "onBlur", "onClick", "onClear", "onDeleteOption", "onPatternInput", "onKeydown"]))
      }, 1024)), (openBlock(), createBlock(VFollower, {
        key: "cascaderMenu",
        ref: "cascaderMenuFollowerRef",
        show: this.mergedShow && !this.showSelectMenu,
        containerClass: this.namespace,
        placement: this.placement,
        width: !this.options.length ? "target" : void 0,
        teleportDisabled: this.adjustedTo === useAdjustedTo.tdkey,
        to: this.adjustedTo
      }, {
        _: 1,
        default: normalizeSlot(() => {
          this.onRender?.();
          const {
            menuProps
          } = this;
          return openBlock(), createBlock(CascaderMenu_default, mergeProps(menuProps, {
            ref: "cascaderMenuInstRef",
            class: [this.themeClass, menuProps?.class],
            value: this.mergedValue,
            show: this.mergedShow && !this.showSelectMenu,
            menuModel: this.menuModel,
            style: [this.cssVars, menuProps?.style],
            onFocus: this.handleMenuFocus,
            onBlur: this.handleMenuBlur,
            onKeydown: this.handleMenuKeydown,
            onMousedown: this.handleMenuMousedown,
            onTabout: this.handleMenuTabout
          }), {
            action: () => this.$slots.action?.(),
            empty: () => this.$slots.empty?.()
          }, 1040, ["class", "value", "show", "menuModel", "style", "onFocus", "onBlur", "onKeydown", "onMousedown", "onTabout"]);
        })
      }, 8, ["show", "containerClass", "placement", "width", "teleportDisabled", "to"])), (openBlock(), createBlock(VFollower, {
        key: "selectMenu",
        ref: "selectMenuFollowerRef",
        show: this.mergedShow && this.showSelectMenu,
        containerClass: this.namespace,
        width: "target",
        placement: this.placement,
        to: this.adjustedTo,
        teleportDisabled: this.adjustedTo === useAdjustedTo.tdkey
      }, {
        _: 1,
        default: normalizeSlot(() => {
          this.onRender?.();
          const {
            filterMenuProps
          } = this;
          return openBlock(), createBlock(CascaderSelectMenu_default, mergeProps(filterMenuProps, {
            ref: "selectMenuInstRef",
            class: [this.themeClass, filterMenuProps?.class],
            value: this.mergedValue,
            show: this.mergedShow && this.showSelectMenu,
            pattern: this.pattern,
            multiple: this.multiple,
            tmNodes: this.treeMate.treeNodes,
            filter: this.filter,
            labelField: this.labelField,
            separator: this.separator,
            style: [this.cssVars, filterMenuProps?.style]
          }), null, 16, ["class", "value", "show", "pattern", "multiple", "tmNodes", "filter", "labelField", "separator", "style"]);
        })
      }, 8, ["show", "containerClass", "placement", "to", "teleportDisabled"]))]
    }, 1024)], 2);
  }
});
//#endregion
export { cascaderProps, Cascader_default as default };