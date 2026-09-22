import { useAdjustedTo } from "../../_utils/composable/use-adjusted-to.mjs";
import { useOnResize } from "../../_utils/composable/use-resize.mjs";
import { markEventEffectPerformed } from "../../_utils/event/index.mjs";
import { warnOnce } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { resolveSlot, resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import useLocale from "../../_mixins/use-locale.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import focus_detector_default from "../../_internal/focus-detector/index.mjs";
import Empty_default from "../../empty/src/Empty.mjs";
import Selection_default from "../../_internal/selection/src/Selection.mjs";
import treeSelectLight from "../styles/light.mjs";
import { treeSelectInjectionKey } from "./interface.mjs";
import { useMergedCheckStrategy } from "../../tree/src/utils.mjs";
import Tree_default, { createTreeMateOptions, treeSharedProps } from "../../tree/src/Tree.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { treeOption2SelectOption, treeOption2SelectOptionWithPath } from "./utils.mjs";
import { getPreciseEventTarget, happensIn } from "seemly";
import { Transition, computed, createBlock, createElementBlock, createVNode, defineComponent, mergeProps, openBlock, provide, ref, toRef, watchEffect, withDirectives } from "vue";
import { useIsMounted, useMergedState } from "vooks";
import { VBinder, VFollower, VTarget } from "vueuc";
import { createTreeMate } from "treemate";
import { clickoutside } from "vdirs";
//#region src/tree-select/src/TreeSelect.tsx
const _hoisted_1 = ["onMousedown", "onKeydown", "onFocusin", "onFocusout"];
const treeSelectProps = {
  ...useTheme.props,
  bordered: {
    type: Boolean,
    default: true
  },
  cascade: Boolean,
  checkable: Boolean,
  clearable: Boolean,
  clearFilterAfterSelect: {
    type: Boolean,
    default: true
  },
  consistentMenuWidth: {
    type: Boolean,
    default: true
  },
  defaultShow: Boolean,
  defaultValue: {
    type: [String, Number, Array],
    default: null
  },
  disabled: {
    type: Boolean,
    default: void 0
  },
  filterable: Boolean,
  checkStrategy: {
    type: String,
    default: "all"
  },
  loading: Boolean,
  maxTagCount: [String, Number],
  multiple: Boolean,
  showLine: Boolean,
  showPath: Boolean,
  separator: {
    type: String,
    default: " / "
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: String,
  placement: {
    type: String,
    default: "bottom-start"
  },
  show: {
    type: Boolean,
    default: void 0
  },
  size: String,
  value: [String, Number, Array],
  to: useAdjustedTo.propTo,
  menuProps: Object,
  virtualScroll: {
    type: Boolean,
    default: true
  },
  status: String,
  renderTag: Function,
  ellipsisTagPopoverProps: Object,
  ...treeSharedProps,
  renderLabel: Function,
  renderPrefix: Function,
  renderSuffix: Function,
  nodeProps: Function,
  watchProps: Array,
  getChildren: Function,
  onBlur: Function,
  onFocus: Function,
  onLoad: Function,
  onUpdateShow: [Function, Array],
  onUpdateValue: [Function, Array],
  "onUpdate:value": [Function, Array],
  "onUpdate:show": [Function, Array],
  /**
  * @deprecated
  */
  leafOnly: Boolean
};
var TreeSelect_default = defineComponent({
  name: "TreeSelect",
  props: treeSelectProps,
  slots: Object,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.leafOnly) warnOnce("tree-select", "`leaf-only` is deprecated, please use `check-strategy=\"child\"` instead.");
    });
    const followerInstRef = ref(null);
    const triggerInstRef = ref(null);
    const treeInstRef = ref(null);
    const menuElRef = ref(null);
    const {
      mergedClsPrefixRef,
      namespaceRef,
      inlineThemeDisabled,
      mergedComponentPropsRef
    } = useConfig(props);
    const {
      localeRef
    } = useLocale("Select");
    const {
      mergedSizeRef,
      mergedDisabledRef,
      mergedStatusRef,
      nTriggerFormBlur,
      nTriggerFormChange,
      nTriggerFormFocus,
      nTriggerFormInput
    } = useFormItem(props, {
      mergedSize: NFormItem => {
        const {
          size
        } = props;
        if (size) return size;
        const {
          mergedSize: formItemSize
        } = NFormItem || {};
        if (formItemSize?.value) return formItemSize.value;
        const configSize = mergedComponentPropsRef?.value?.TreeSelect?.size;
        if (configSize) return configSize;
        return "medium";
      }
    });
    const uncontrolledValueRef = ref(props.defaultValue);
    const controlledValueRef = toRef(props, "value");
    const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
    const uncontrolledShowRef = ref(props.defaultShow);
    const controlledShowRef = toRef(props, "show");
    const mergedShowRef = useMergedState(controlledShowRef, uncontrolledShowRef);
    const patternRef = ref("");
    const mergedFilterRef = computed(() => {
      const {
        filter
      } = props;
      if (filter) return filter;
      const {
        labelField
      } = props;
      return (pattern, node) => {
        if (!pattern.length) return true;
        return node[labelField].toLowerCase().includes(pattern.toLowerCase());
      };
    });
    const dataTreeMateRef = computed(() => createTreeMate(props.options, createTreeMateOptions(props.keyField, props.childrenField, props.disabledField, void 0)));
    const {
      value: initMergedValue
    } = mergedValueRef;
    const pendingNodeKeyRef = ref(props.checkable ? null : Array.isArray(initMergedValue) && initMergedValue.length ? initMergedValue[initMergedValue.length - 1] : null);
    const mergedCascadeRef = computed(() => {
      return props.multiple && props.cascade && props.checkable;
    });
    const uncontrolledExpandedKeysRef = ref(props.defaultExpandAll ? void 0 : props.defaultExpandedKeys || props.expandedKeys);
    const controlledExpandedKeysRef = toRef(props, "expandedKeys");
    const mergedExpandedKeysRef = useMergedState(controlledExpandedKeysRef, uncontrolledExpandedKeysRef);
    const focusedRef = ref(false);
    const mergedPlaceholderRef = computed(() => {
      const {
        placeholder
      } = props;
      if (placeholder !== void 0) return placeholder;
      return localeRef.value.placeholder;
    });
    const treeCheckedKeysRef = computed(() => {
      const {
        value: mergedValue
      } = mergedValueRef;
      if (props.multiple) {
        if (Array.isArray(mergedValue)) return mergedValue;else return [];
      } else if (mergedValue === null || Array.isArray(mergedValue)) return [];else return [mergedValue];
    });
    const treeSelectedKeysRef = computed(() => {
      if (props.checkable) return [];
      return treeCheckedKeysRef.value;
    });
    const selectedOptionRef = computed(() => {
      const {
        multiple,
        showPath,
        separator,
        labelField
      } = props;
      if (multiple) return null;
      const {
        value: mergedValue
      } = mergedValueRef;
      if (!Array.isArray(mergedValue) && mergedValue !== null) {
        const {
          value: treeMate
        } = dataTreeMateRef;
        const tmNode = treeMate.getNode(mergedValue);
        if (tmNode !== null) return showPath ? treeOption2SelectOptionWithPath(tmNode, treeMate.getPath(mergedValue).treeNodePath, separator, labelField) : treeOption2SelectOption(tmNode, labelField);
      }
      return null;
    });
    const selectedOptionsRef = computed(() => {
      const {
        multiple,
        showPath,
        separator
      } = props;
      if (!multiple) return null;
      const {
        value: mergedValue
      } = mergedValueRef;
      if (Array.isArray(mergedValue)) {
        const res = [];
        const {
          value: treeMate
        } = dataTreeMateRef;
        const {
          checkedKeys
        } = treeMate.getCheckedKeys(mergedValue, {
          checkStrategy: props.checkStrategy,
          cascade: mergedCascadeRef.value,
          allowNotLoaded: props.allowCheckingNotLoaded
        });
        const {
          labelField
        } = props;
        checkedKeys.forEach(value => {
          const tmNode = treeMate.getNode(value);
          if (tmNode !== null) res.push(showPath ? treeOption2SelectOptionWithPath(tmNode, treeMate.getPath(value).treeNodePath, separator, labelField) : treeOption2SelectOption(tmNode, labelField));
        });
        return res;
      }
      return [];
    });
    function focusSelection() {
      triggerInstRef.value?.focus();
    }
    function focusSelectionInput() {
      triggerInstRef.value?.focusInput();
    }
    function doUpdateShow(value) {
      const {
        onUpdateShow,
        "onUpdate:show": _onUpdateShow
      } = props;
      if (onUpdateShow) call(onUpdateShow, value);
      if (_onUpdateShow) call(_onUpdateShow, value);
      uncontrolledShowRef.value = value;
    }
    function doUpdateValue(value, option, meta) {
      const {
        onUpdateValue,
        "onUpdate:value": _onUpdateValue
      } = props;
      if (onUpdateValue) call(onUpdateValue, value, option, meta);
      if (_onUpdateValue) call(_onUpdateValue, value, option, meta);
      uncontrolledValueRef.value = value;
      nTriggerFormInput();
      nTriggerFormChange();
    }
    function doUpdateIndeterminateKeys(value, option) {
      const {
        onUpdateIndeterminateKeys,
        "onUpdate:indeterminateKeys": _onUpdateIndeterminateKeys
      } = props;
      if (onUpdateIndeterminateKeys) call(onUpdateIndeterminateKeys, value, option);
      if (_onUpdateIndeterminateKeys) call(_onUpdateIndeterminateKeys, value, option);
    }
    function doUpdateExpandedKeys(keys, option, meta) {
      const {
        onUpdateExpandedKeys,
        "onUpdate:expandedKeys": _onUpdateExpandedKeys
      } = props;
      if (onUpdateExpandedKeys) call(onUpdateExpandedKeys, keys, option, meta);
      if (_onUpdateExpandedKeys) call(_onUpdateExpandedKeys, keys, option, meta);
      uncontrolledExpandedKeysRef.value = keys;
    }
    function doFocus(e) {
      const {
        onFocus
      } = props;
      if (onFocus) onFocus(e);
      nTriggerFormFocus();
    }
    function doBlur(e) {
      closeMenu();
      const {
        onBlur
      } = props;
      if (onBlur) onBlur(e);
      nTriggerFormBlur();
    }
    function closeMenu() {
      doUpdateShow(false);
    }
    function openMenu() {
      if (!mergedDisabledRef.value) {
        patternRef.value = "";
        doUpdateShow(true);
        if (props.filterable) focusSelectionInput();
      }
    }
    function handleMenuLeave() {
      patternRef.value = "";
    }
    function handleMenuClickoutside(e) {
      if (mergedShowRef.value) {
        if (!triggerInstRef.value?.$el.contains(getPreciseEventTarget(e))) closeMenu();
      }
    }
    function handleTriggerClick() {
      if (mergedDisabledRef.value) return;
      if (!mergedShowRef.value) openMenu();else if (!props.filterable) closeMenu();
    }
    function getOptionsByKeys(keys) {
      const {
        value: {
          getNode
        }
      } = dataTreeMateRef;
      return keys.map(key => getNode(key)?.rawNode || null);
    }
    function handleUpdateCheckedKeys(keys, _, meta) {
      const options = getOptionsByKeys(keys);
      const action = meta.action === "check" ? "select" : "unselect";
      const node = meta.node;
      if (props.multiple) {
        doUpdateValue(keys, options, {
          node,
          action
        });
        if (props.filterable) {
          focusSelectionInput();
          if (props.clearFilterAfterSelect) patternRef.value = "";
        }
      } else {
        if (keys.length) doUpdateValue(keys[0], options[0] || null, {
          node,
          action
        });else doUpdateValue(null, null, {
          node,
          action
        });
        closeMenu();
        focusSelection();
      }
    }
    function handleUpdateIndeterminateKeys(keys) {
      if (props.checkable) doUpdateIndeterminateKeys(keys, getOptionsByKeys(keys));
    }
    function handleTriggerFocus(e) {
      if (menuElRef.value?.contains(e.relatedTarget)) return;
      focusedRef.value = true;
      doFocus(e);
    }
    function handleTriggerBlur(e) {
      if (menuElRef.value?.contains(e.relatedTarget)) return;
      focusedRef.value = false;
      doBlur(e);
    }
    function handleMenuFocusin(e) {
      if (menuElRef.value?.contains(e.relatedTarget) || triggerInstRef.value?.$el?.contains(e.relatedTarget)) return;
      focusedRef.value = true;
      doFocus(e);
    }
    function handleMenuFocusout(e) {
      if (menuElRef.value?.contains(e.relatedTarget) || triggerInstRef.value?.$el?.contains(e.relatedTarget)) return;
      focusedRef.value = false;
      doBlur(e);
    }
    function handleClear(e) {
      e.stopPropagation();
      const {
        multiple
      } = props;
      if (!multiple && props.filterable) closeMenu();
      if (multiple) doUpdateValue([], [], {
        node: null,
        action: "clear"
      });else doUpdateValue(null, null, {
        node: null,
        action: "clear"
      });
    }
    function handleDeleteOption(option) {
      const {
        value: mergedValue
      } = mergedValueRef;
      if (Array.isArray(mergedValue)) {
        const {
          value: treeMate
        } = dataTreeMateRef;
        const {
          checkedKeys: checkedKeysValue
        } = treeMate.getCheckedKeys(mergedValue, {
          cascade: mergedCascadeRef.value,
          allowNotLoaded: props.allowCheckingNotLoaded
        });
        const index = checkedKeysValue.findIndex(key => key === option.value);
        if (~index) {
          const checkedKeyToBeRemoved = checkedKeysValue[index];
          const checkOptionToBeRemoved = getOptionsByKeys([checkedKeyToBeRemoved])[0];
          if (props.checkable) {
            const {
              checkedKeys
            } = treeMate.uncheck(option.value, checkedKeysValue, {
              checkStrategy: props.checkStrategy,
              cascade: mergedCascadeRef.value,
              allowNotLoaded: props.allowCheckingNotLoaded
            });
            doUpdateValue(checkedKeys, getOptionsByKeys(checkedKeys), {
              node: checkOptionToBeRemoved,
              action: "delete"
            });
          } else {
            const nextValue = Array.from(checkedKeysValue);
            nextValue.splice(index, 1);
            doUpdateValue(nextValue, getOptionsByKeys(nextValue), {
              node: checkOptionToBeRemoved,
              action: "delete"
            });
          }
        }
      }
    }
    function handlePatternInput(e) {
      const {
        value
      } = e.target;
      patternRef.value = value;
    }
    function treeHandleKeydown(e) {
      const {
        value: treeInst
      } = treeInstRef;
      if (treeInst) return treeInst.handleKeydown(e);
      return {
        enterBehavior: null
      };
    }
    function handleKeydown(e) {
      if (e.key === "Enter") {
        if (mergedShowRef.value) {
          const {
            enterBehavior
          } = treeHandleKeydown(e);
          if (!props.multiple) switch (enterBehavior) {
            case "default":
            case "toggleSelect":
              closeMenu();
              focusSelection();
          }
        } else openMenu();
        e.preventDefault();
      } else if (e.key === "Escape") {
        if (mergedShowRef.value) {
          markEventEffectPerformed(e);
          closeMenu();
          focusSelection();
        }
      } else if (mergedShowRef.value) treeHandleKeydown(e);else if (e.key === "ArrowDown") openMenu();
    }
    function handleTabOut() {
      closeMenu();
      focusSelection();
    }
    function handleMenuMousedown(e) {
      if (!happensIn(e, "action") && !happensIn(e, "header")) e.preventDefault();
    }
    const selectionRenderTagRef = computed(() => {
      const {
        renderTag
      } = props;
      if (!renderTag) return void 0;
      return function selectionRenderTag({
        option,
        handleClose
      }) {
        const {
          value
        } = option;
        if (value !== void 0) {
          const treeOption = dataTreeMateRef.value.getNode(value);
          if (treeOption) return renderTag({
            option: treeOption.rawNode,
            handleClose
          });
        }
        return value;
      };
    });
    provide(treeSelectInjectionKey, {
      pendingNodeKeyRef,
      dataTreeMate: dataTreeMateRef
    });
    function handleTriggerOrMenuResize() {
      if (!mergedShowRef.value) return;
      followerInstRef.value?.syncPosition();
    }
    useOnResize(menuElRef, handleTriggerOrMenuResize);
    const mergedCheckStrategyRef = useMergedCheckStrategy(props);
    const exposedCheckedStatusRef = computed(() => {
      if (props.checkable) {
        const mergedValue = mergedValueRef.value;
        if (props.multiple && Array.isArray(mergedValue)) return dataTreeMateRef.value.getCheckedKeys(mergedValue, {
          cascade: props.cascade,
          checkStrategy: mergedCheckStrategyRef.value,
          allowNotLoaded: props.allowCheckingNotLoaded
        });else return {
          checkedKeys: Array.isArray(mergedValue) || mergedValue === null ? [] : [mergedValue],
          indeterminateKeys: []
        };
      }
      return {
        checkedKeys: [],
        indeterminateKeys: []
      };
    });
    const exposedMethods = {
      getCheckedData: () => {
        const {
          checkedKeys
        } = exposedCheckedStatusRef.value;
        return {
          keys: checkedKeys,
          options: getOptionsByKeys(checkedKeys)
        };
      },
      getIndeterminateData: () => {
        const {
          indeterminateKeys
        } = exposedCheckedStatusRef.value;
        return {
          keys: indeterminateKeys,
          options: getOptionsByKeys(indeterminateKeys)
        };
      },
      focus: () => triggerInstRef.value?.focus(),
      focusInput: () => triggerInstRef.value?.focusInput(),
      blur: () => triggerInstRef.value?.blur(),
      blurInput: () => triggerInstRef.value?.blurInput()
    };
    const themeRef = useTheme("TreeSelect", "-tree-select", index_cssr_default, treeSelectLight, props, mergedClsPrefixRef);
    const mergedRenderEmptyRef = computed(() => {
      return mergedComponentPropsRef?.value?.TreeSelect?.renderEmpty;
    });
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          menuBoxShadow,
          menuBorderRadius,
          menuColor,
          menuHeight,
          actionPadding,
          actionDividerColor,
          actionTextColor,
          headerDividerColor,
          headerPadding,
          headerTextColor
        }
      } = themeRef.value;
      return {
        "--n-menu-box-shadow": menuBoxShadow,
        "--n-menu-border-radius": menuBorderRadius,
        "--n-menu-color": menuColor,
        "--n-menu-height": menuHeight,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-action-padding": actionPadding,
        "--n-action-text-color": actionTextColor,
        "--n-action-divider-color": actionDividerColor,
        "--n-header-padding": headerPadding,
        "--n-header-text-color": headerTextColor,
        "--n-header-divider-color": headerDividerColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("tree-select", void 0, cssVarsRef, props) : void 0;
    const menuPaddingRef = computed(() => {
      const {
        self: {
          menuPadding
        }
      } = themeRef.value;
      return menuPadding;
    });
    return {
      ...exposedMethods,
      menuElRef,
      mergedStatus: mergedStatusRef,
      triggerInstRef,
      followerInstRef,
      treeInstRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedValue: mergedValueRef,
      mergedShow: mergedShowRef,
      namespace: namespaceRef,
      adjustedTo: useAdjustedTo(props),
      isMounted: useIsMounted(),
      focused: focusedRef,
      menuPadding: menuPaddingRef,
      mergedPlaceholder: mergedPlaceholderRef,
      mergedExpandedKeys: mergedExpandedKeysRef,
      treeSelectedKeys: treeSelectedKeysRef,
      treeCheckedKeys: treeCheckedKeysRef,
      mergedSize: mergedSizeRef,
      mergedDisabled: mergedDisabledRef,
      selectedOption: selectedOptionRef,
      selectedOptions: selectedOptionsRef,
      pattern: patternRef,
      pendingNodeKey: pendingNodeKeyRef,
      mergedCascade: mergedCascadeRef,
      mergedFilter: mergedFilterRef,
      selectionRenderTag: selectionRenderTagRef,
      handleTriggerOrMenuResize,
      doUpdateExpandedKeys,
      handleMenuLeave,
      handleTriggerClick,
      handleMenuClickoutside,
      handleUpdateCheckedKeys,
      handleUpdateIndeterminateKeys,
      handleTriggerFocus,
      handleTriggerBlur,
      handleMenuFocusin,
      handleMenuFocusout,
      handleClear,
      handleDeleteOption,
      handlePatternInput,
      handleKeydown,
      handleTabOut,
      handleMenuMousedown,
      mergedTheme: themeRef,
      mergedRenderEmpty: mergedRenderEmptyRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedTheme,
      mergedClsPrefix,
      $slots
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-tree-select`)
    }, [createVNode(VBinder, null, {
      default: () => [(openBlock(), createBlock(VTarget, null, {
        default: () => (openBlock(), createBlock(Selection_default, {
          ref: "triggerInstRef",
          onResize: this.handleTriggerOrMenuResize,
          status: this.mergedStatus,
          focused: this.focused,
          clsPrefix: mergedClsPrefix,
          theme: mergedTheme.peers.InternalSelection,
          themeOverrides: mergedTheme.peerOverrides.InternalSelection,
          ellipsisTagPopoverProps: this.ellipsisTagPopoverProps,
          renderTag: this.selectionRenderTag,
          selectedOption: this.selectedOption,
          selectedOptions: this.selectedOptions,
          size: this.mergedSize,
          bordered: this.bordered,
          placeholder: this.mergedPlaceholder,
          disabled: this.mergedDisabled,
          active: this.mergedShow,
          loading: this.loading,
          multiple: this.multiple,
          maxTagCount: this.maxTagCount,
          showArrow: true,
          filterable: this.filterable,
          clearable: this.clearable,
          pattern: this.pattern,
          onPatternInput: this.handlePatternInput,
          onClear: this.handleClear,
          onClick: this.handleTriggerClick,
          onFocus: this.handleTriggerFocus,
          onBlur: this.handleTriggerBlur,
          onDeleteOption: this.handleDeleteOption,
          onKeydown: this.handleKeydown
        }, {
          arrow: () => [this.$slots.arrow?.()]
        }, 1032, ["onResize", "status", "focused", "clsPrefix", "theme", "themeOverrides", "ellipsisTagPopoverProps", "renderTag", "selectedOption", "selectedOptions", "size", "bordered", "placeholder", "disabled", "active", "loading", "multiple", "maxTagCount", "filterable", "clearable", "pattern", "onPatternInput", "onClear", "onClick", "onFocus", "onBlur", "onDeleteOption", "onKeydown"]))
      }, 1024)), (openBlock(), createBlock(VFollower, {
        ref: "followerInstRef",
        show: this.mergedShow,
        placement: this.placement,
        to: this.adjustedTo,
        teleportDisabled: this.adjustedTo === useAdjustedTo.tdkey,
        containerClass: this.namespace,
        width: this.consistentMenuWidth ? "target" : void 0,
        minWidth: "target"
      }, {
        default: () => (openBlock(), createBlock(Transition, {
          name: "fade-in-scale-up-transition",
          appear: this.isMounted,
          onLeave: this.handleMenuLeave
        }, {
          default: () => {
            if (!this.mergedShow) return null;
            const {
              mergedClsPrefix,
              checkable,
              multiple,
              menuProps,
              options
            } = this;
            this.onRender?.();
            return withDirectives((openBlock(), createElementBlock("div", mergeProps(menuProps, {
              class: [`${mergedClsPrefix}-tree-select-menu`, menuProps?.class, this.themeClass],
              ref: "menuElRef",
              style: [menuProps?.style || "", this.cssVars],
              tabindex: 0,
              onMousedown: this.handleMenuMousedown,
              onKeydown: this.handleKeydown,
              onFocusin: this.handleMenuFocusin,
              onFocusout: this.handleMenuFocusout
            }), [normalizeVNode(() => resolveWrappedSlot($slots.header, children => {
              return children ? (openBlock(), createElementBlock("div", {
                key: 1,
                class: normalizeClass$1(`${mergedClsPrefix}-tree-select-menu__header`),
                "data-header": true
              }, [normalizeVNode(() => children)], 2)) : null;
            })), (openBlock(), createBlock(Tree_default, {
              ref: "treeInstRef",
              blockLine: true,
              allowCheckingNotLoaded: this.allowCheckingNotLoaded,
              showIrrelevantNodes: false,
              animated: false,
              pattern: this.pattern,
              getChildren: this.getChildren,
              filter: this.mergedFilter,
              data: options,
              cancelable: multiple,
              labelField: this.labelField,
              keyField: this.keyField,
              disabledField: this.disabledField,
              childrenField: this.childrenField,
              theme: mergedTheme.peers.Tree,
              themeOverrides: mergedTheme.peerOverrides.Tree,
              defaultExpandAll: this.defaultExpandAll,
              defaultExpandedKeys: this.defaultExpandedKeys,
              indent: this.indent,
              expandedKeys: this.mergedExpandedKeys,
              checkedKeys: this.treeCheckedKeys,
              selectedKeys: this.treeSelectedKeys,
              checkable,
              checkStrategy: this.checkStrategy,
              cascade: this.mergedCascade,
              leafOnly: this.leafOnly,
              multiple: this.multiple,
              showLine: this.showLine,
              renderLabel: this.renderLabel,
              renderPrefix: this.renderPrefix,
              renderSuffix: this.renderSuffix,
              renderSwitcherIcon: this.renderSwitcherIcon,
              nodeProps: this.nodeProps,
              watchProps: this.watchProps,
              virtualScroll: this.consistentMenuWidth && this.virtualScroll,
              overrideDefaultNodeClickBehavior: this.overrideDefaultNodeClickBehavior,
              internalTreeSelect: true,
              internalUnifySelectCheck: true,
              internalScrollable: true,
              internalScrollablePadding: this.menuPadding,
              internalFocusable: false,
              internalCheckboxFocusable: false,
              internalRenderEmpty: () => (openBlock(), createElementBlock("div", {
                class: normalizeClass$1(`${mergedClsPrefix}-tree-select-menu__empty`)
              }, [normalizeVNode(() => resolveSlot($slots.empty, () => {
                return [this.mergedRenderEmpty?.() || (openBlock(), createBlock(Empty_default, {
                  theme: mergedTheme.peers.Empty,
                  themeOverrides: mergedTheme.peerOverrides.Empty
                }, null, 8, ["theme", "themeOverrides"]))];
              }))], 2)),
              onLoad: this.onLoad,
              onUpdateCheckedKeys: this.handleUpdateCheckedKeys,
              onUpdateIndeterminateKeys: this.handleUpdateIndeterminateKeys,
              onUpdateExpandedKeys: this.doUpdateExpandedKeys
            }, null, 8, ["allowCheckingNotLoaded", "pattern", "getChildren", "filter", "data", "cancelable", "labelField", "keyField", "disabledField", "childrenField", "theme", "themeOverrides", "defaultExpandAll", "defaultExpandedKeys", "indent", "expandedKeys", "checkedKeys", "selectedKeys", "checkable", "checkStrategy", "cascade", "leafOnly", "multiple", "showLine", "renderLabel", "renderPrefix", "renderSuffix", "renderSwitcherIcon", "nodeProps", "watchProps", "virtualScroll", "overrideDefaultNodeClickBehavior", "internalScrollablePadding", "onLoad", "onUpdateCheckedKeys", "onUpdateIndeterminateKeys", "onUpdateExpandedKeys"])), normalizeVNode(() => resolveWrappedSlot($slots.action, children => {
              return children ? (openBlock(), createElementBlock("div", {
                key: 2,
                class: normalizeClass$1(`${mergedClsPrefix}-tree-select-menu__action`),
                "data-action": true
              }, [normalizeVNode(() => children)], 2)) : null;
            })), (openBlock(), createBlock(focus_detector_default, {
              onFocus: this.handleTabOut
            }, null, 8, ["onFocus"]))], 16, _hoisted_1)), [[clickoutside, this.handleMenuClickoutside, void 0, {
              capture: true
            }]]);
          }
        }, 1032, ["appear", "onLeave"]))
      }, 1032, ["show", "placement", "to", "teleportDisabled", "containerClass", "width"]))]
    }, 1024)], 2);
  }
});
//#endregion
export { TreeSelect_default as default, treeSelectProps };