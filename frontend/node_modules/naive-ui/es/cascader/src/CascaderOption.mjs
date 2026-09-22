import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Checkmark_default from "../../_internal/icons/Checkmark.mjs";
import ChevronRight_default from "../../_internal/icons/ChevronRight.mjs";
import Loading_default from "../../_internal/loading/src/Loading.mjs";
import Checkbox_default from "../../checkbox/src/Checkbox.mjs";
import { cascaderInjectionKey } from "./interface.mjs";
import { happensIn } from "seemly";
import { Fragment, Transition, computed, createBlock, createElementBlock, createElementVNode, defineComponent, inject, mergeProps, openBlock } from "vue";
import { useMemo } from "vooks";
//#region src/cascader/src/CascaderOption.tsx
const _hoisted_1 = ["onMouseenter", "onMousemove", "onClick"];
var CascaderOption_default = defineComponent({
  name: "NCascaderOption",
  props: {
    tmNode: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const {
      expandTriggerRef,
      remoteRef,
      multipleRef,
      mergedValueRef,
      checkedKeysRef,
      indeterminateKeysRef,
      hoverKeyPathRef,
      keyboardKeyRef,
      loadingKeySetRef,
      cascadeRef,
      mergedCheckStrategyRef,
      onLoadRef,
      mergedClsPrefixRef,
      mergedThemeRef,
      labelFieldRef,
      showCheckboxRef,
      renderPrefixRef,
      renderSuffixRef,
      spinPropsRef,
      updateHoverKey,
      updateKeyboardKey,
      addLoadingKey,
      deleteLoadingKey,
      closeMenu,
      doCheck,
      doUncheck,
      renderLabelRef
    } = inject(cascaderInjectionKey);
    const valueRef = computed(() => props.tmNode.key);
    const useHoverTriggerRef = computed(() => {
      const {
        value: expandTrigger
      } = expandTriggerRef;
      const {
        value: remote
      } = remoteRef;
      return !remote && expandTrigger === "hover";
    });
    const mergedHandleMouseEnterRef = computed(() => {
      if (useHoverTriggerRef.value) return handleMouseEnter;
    });
    const mergedHandleMouseMoveRef = computed(() => {
      if (useHoverTriggerRef.value) return handleMouseMove;
    });
    const checkedRef = useMemo(() => {
      const {
        value: multiple
      } = multipleRef;
      if (!multiple) return mergedValueRef.value === valueRef.value;
      return checkedKeysRef.value.includes(valueRef.value);
    });
    const indeterminateRef = useMemo(() => {
      if (!multipleRef.value) return false;
      return indeterminateKeysRef.value.includes(valueRef.value);
    });
    const hoverPendingRef = useMemo(() => {
      return hoverKeyPathRef.value.includes(valueRef.value);
    });
    const keyboardPendingRef = useMemo(() => {
      const {
        value: keyboardKey
      } = keyboardKeyRef;
      if (keyboardKey === null) return false;
      return keyboardKey === valueRef.value;
    });
    const isLoadingRef = useMemo(() => {
      if (remoteRef.value) return loadingKeySetRef.value.has(valueRef.value);
      return false;
    });
    const isLeafRef = computed(() => props.tmNode.isLeaf);
    const disabledRef = computed(() => props.tmNode.disabled);
    const labelRef = computed(() => props.tmNode.rawNode[labelFieldRef.value]);
    const isShallowLoadedRef = computed(() => {
      return props.tmNode.shallowLoaded;
    });
    function handleClick(e) {
      if (disabledRef.value) return;
      const {
        value: remote
      } = remoteRef;
      const {
        value: loadingKeySet
      } = loadingKeySetRef;
      const {
        value: onLoad
      } = onLoadRef;
      const {
        value
      } = valueRef;
      const {
        value: isLeaf
      } = isLeafRef;
      const {
        value: isShallowLoaded
      } = isShallowLoadedRef;
      if (!happensIn(e, "checkbox")) {
        if (remote && !isShallowLoaded && !loadingKeySet.has(value) && onLoad) {
          addLoadingKey(value);
          onLoad(props.tmNode.rawNode).then(() => {
            deleteLoadingKey(value);
          }).catch(() => {
            deleteLoadingKey(value);
          });
        }
        updateHoverKey(value);
        updateKeyboardKey(value);
      }
      if (isLeaf) toggleCheckbox();
    }
    function handleMouseEnter() {
      if (!useHoverTriggerRef.value || disabledRef.value) return;
      const {
        value
      } = valueRef;
      updateHoverKey(value);
      updateKeyboardKey(value);
    }
    function handleMouseMove() {
      if (!useHoverTriggerRef.value) return;
      handleMouseEnter();
    }
    function handleCheckboxUpdateValue() {
      const {
        value: isLeaf
      } = isLeafRef;
      if (!isLeaf) toggleCheckbox();
    }
    function toggleCheckbox() {
      const {
        value: multiple
      } = multipleRef;
      const {
        value
      } = valueRef;
      if (multiple) {
        if (indeterminateRef.value || checkedRef.value) doUncheck(value);else doCheck(value);
      } else {
        doCheck(value);
        closeMenu(true);
      }
    }
    return {
      checkStrategy: mergedCheckStrategyRef,
      multiple: multipleRef,
      cascade: cascadeRef,
      checked: checkedRef,
      indeterminate: indeterminateRef,
      hoverPending: hoverPendingRef,
      keyboardPending: keyboardPendingRef,
      isLoading: isLoadingRef,
      showCheckbox: showCheckboxRef,
      isLeaf: isLeafRef,
      disabled: disabledRef,
      label: labelRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedTheme: mergedThemeRef,
      spinProps: spinPropsRef,
      handleClick,
      handleCheckboxUpdateValue,
      mergedHandleMouseEnter: mergedHandleMouseEnterRef,
      mergedHandleMouseMove: mergedHandleMouseMoveRef,
      renderLabel: renderLabelRef,
      renderPrefix: renderPrefixRef,
      renderSuffix: renderSuffixRef
    };
  },
  render() {
    const {
      mergedClsPrefix,
      showCheckbox,
      renderLabel,
      renderPrefix,
      renderSuffix
    } = this;
    let prefixNode = null;
    if (showCheckbox || renderPrefix) {
      const originalNode = this.showCheckbox ? (openBlock(), createBlock(Checkbox_default, {
        key: 1,
        focusable: false,
        "data-checkbox": true,
        disabled: this.disabled,
        checked: this.checked,
        indeterminate: this.indeterminate,
        theme: this.mergedTheme.peers.Checkbox,
        themeOverrides: this.mergedTheme.peerOverrides.Checkbox,
        onUpdateChecked: this.handleCheckboxUpdateValue
      }, null, 8, ["disabled", "checked", "indeterminate", "theme", "themeOverrides", "onUpdateChecked"])) : null;
      prefixNode = (prefixNode => {
        return openBlock(), createElementBlock("div", {
          key: 2,
          class: normalizeClass$1(`${mergedClsPrefix}-cascader-option__prefix`)
        }, [renderPrefix ? (openBlock(), createElementBlock(Fragment, {
          key: 0
        }, [normalizeVNode(() => renderPrefix({
          option: this.tmNode.rawNode,
          checked: this.checked,
          node: originalNode
        }))], 64)) : (openBlock(), createElementBlock(Fragment, {
          key: 1
        }, [normalizeVNode(() => originalNode)], 64))], 2);
      })(prefixNode);
    }
    let suffixNode = null;
    const originalSuffixChild = (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-cascader-option-icon-placeholder`)
    }, [!this.isLeaf ? (openBlock(), createBlock(Loading_default, mergeProps({
      key: 0,
      clsPrefix: mergedClsPrefix,
      scale: .85,
      strokeWidth: 24,
      show: this.isLoading,
      class: `${mergedClsPrefix}-cascader-option-icon`
    }, this.spinProps), {
      default: () => (openBlock(), createBlock(Icon_default, {
        clsPrefix: mergedClsPrefix,
        key: "arrow",
        class: normalizeClass$1(`${mergedClsPrefix}-cascader-option-icon ${mergedClsPrefix}-cascader-option-icon--arrow`)
      }, {
        default: () => (openBlock(), createBlock(ChevronRight_default))
      }, 1032, ["clsPrefix", "class"]))
    }, 1040, ["clsPrefix", "show", "class"])) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [this.checkStrategy === "child" && !(this.multiple && this.cascade) ? (openBlock(), createBlock(Transition, {
      key: 0,
      name: "fade-in-scale-up-transition"
    }, {
      default: () => this.checked ? (openBlock(), createBlock(Icon_default, {
        key: 3,
        clsPrefix: mergedClsPrefix,
        class: normalizeClass$1(`${mergedClsPrefix}-cascader-option-icon ${mergedClsPrefix}-cascader-option-icon--checkmark`)
      }, {
        default: () => (openBlock(), createBlock(Checkmark_default))
      }, 1032, ["clsPrefix", "class"])) : null
    }, 1024)) : normalizeVNode(() => null)], 64))], 2));
    suffixNode = (suffixNode => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-cascader-option__suffix`)
      }, [renderSuffix ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => renderSuffix({
        option: this.tmNode.rawNode,
        checked: this.checked,
        node: originalSuffixChild
      }))], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => originalSuffixChild)], 64))], 2);
    })(suffixNode);
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-cascader-option`, this.keyboardPending || this.hoverPending && `${mergedClsPrefix}-cascader-option--pending`, this.disabled && `${mergedClsPrefix}-cascader-option--disabled`, this.showCheckbox && `${mergedClsPrefix}-cascader-option--show-prefix`]),
      onMouseenter: this.mergedHandleMouseEnter,
      onMousemove: this.mergedHandleMouseMove,
      onClick: this.handleClick
    }, [normalizeVNode(() => prefixNode), createElementVNode("span", {
      class: normalizeClass$1(`${mergedClsPrefix}-cascader-option__label`)
    }, [renderLabel ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => renderLabel(this.tmNode.rawNode, this.checked))], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => this.label)], 64))], 2), normalizeVNode(() => suffixNode)], 42, _hoisted_1);
  }
});
//#endregion
export { CascaderOption_default as default };