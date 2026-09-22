import { warnOnce } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { resolveSlot, resolveSlotWithTypedProps } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import { formItemInjectionKey } from "../../_mixins/use-form-item.mjs";
import useLocale from "../../_mixins/use-locale.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Add_default from "../../_internal/icons/Add.mjs";
import ArrowDown_default from "../../_internal/icons/ArrowDown.mjs";
import ArrowUp_default from "../../_internal/icons/ArrowUp.mjs";
import Remove_default from "../../_internal/icons/Remove.mjs";
import Button from "../../button/src/Button.mjs";
import ButtonGroup_default from "../../button-group/src/ButtonGroup.mjs";
import dynamicInputLight from "../styles/light.mjs";
import { dynamicInputInjectionKey } from "./interface.mjs";
import InputPreset_default from "./InputPreset.mjs";
import PairPreset_default from "./PairPreset.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { createId } from "seemly";
import { Fragment, computed, createBlock, createElementBlock, defineComponent, inject, isProxy, mergeProps, normalizeStyle, openBlock, provide, ref, toRaw, toRef, watchEffect } from "vue";
import { useMergedState } from "vooks";
//#region src/dynamic-input/src/DynamicInput.tsx
const _hoisted_1 = ["data-key"];
const globalDataKeyMap = /* @__PURE__ */new WeakMap();
const dynamicInputProps = {
  ...useTheme.props,
  max: Number,
  min: {
    type: Number,
    default: 0
  },
  value: Array,
  defaultValue: {
    type: Array,
    default: () => []
  },
  preset: {
    type: String,
    default: "input"
  },
  keyField: String,
  itemClass: String,
  itemStyle: [String, Object],
  keyPlaceholder: {
    type: String,
    default: ""
  },
  valuePlaceholder: {
    type: String,
    default: ""
  },
  placeholder: {
    type: String,
    default: ""
  },
  disabled: Boolean,
  showSortButton: Boolean,
  createButtonProps: Object,
  onCreate: Function,
  onRemove: Function,
  "onUpdate:value": [Function, Array],
  onUpdateValue: [Function, Array],
  onClear: Function,
  onInput: [Function, Array]
};
var DynamicInput_default = defineComponent({
  name: "DynamicInput",
  props: dynamicInputProps,
  setup(props, {
    slots
  }) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.onClear !== void 0) warnOnce("dynamic-input", "`on-clear` is deprecated, it is out of usage anymore.");
      if (props.onInput !== void 0) warnOnce("dynamic-input", "`on-input` is deprecated, please use `on-update:value` instead.");
    });
    const {
      mergedComponentPropsRef,
      mergedClsPrefixRef,
      mergedRtlRef,
      inlineThemeDisabled
    } = useConfig();
    const NFormItem = inject(formItemInjectionKey, null);
    const uncontrolledValueRef = ref(props.defaultValue);
    const controlledValueRef = toRef(props, "value");
    const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
    const themeRef = useTheme("DynamicInput", "-dynamic-input", index_cssr_default, dynamicInputLight, props, mergedClsPrefixRef);
    const insertionDisabledRef = computed(() => {
      const {
        value: mergedValue
      } = mergedValueRef;
      if (Array.isArray(mergedValue)) {
        const {
          max
        } = props;
        return max !== void 0 && mergedValue.length >= max;
      }
      return false;
    });
    const removeDisabledRef = computed(() => {
      const {
        value: mergedValue
      } = mergedValueRef;
      if (Array.isArray(mergedValue)) return mergedValue.length <= props.min;
      return true;
    });
    const buttonSizeRef = computed(() => {
      return mergedComponentPropsRef?.value?.DynamicInput?.buttonSize;
    });
    function doUpdateValue(value) {
      const {
        onInput,
        "onUpdate:value": _onUpdateValue,
        onUpdateValue
      } = props;
      if (onInput) call(onInput, value);
      if (_onUpdateValue) call(_onUpdateValue, value);
      if (onUpdateValue) call(onUpdateValue, value);
      uncontrolledValueRef.value = value;
    }
    function ensureKey(value, index) {
      if (value === void 0 || value === null) return index;
      if (typeof value !== "object") return index;
      const rawValue = isProxy(value) ? toRaw(value) : value;
      let key = globalDataKeyMap.get(rawValue);
      if (key === void 0) globalDataKeyMap.set(rawValue, key = createId());
      return key;
    }
    function handleValueChange(index, value) {
      const {
        value: mergedValue
      } = mergedValueRef;
      const newValue = Array.from(mergedValue ?? []);
      const originalItem = newValue[index];
      newValue[index] = value;
      if (originalItem && value && typeof originalItem === "object" && typeof value === "object") {
        const rawOriginal = isProxy(originalItem) ? toRaw(originalItem) : originalItem;
        const rawNew = isProxy(value) ? toRaw(value) : value;
        const originalKey = globalDataKeyMap.get(rawOriginal);
        if (originalKey !== void 0) globalDataKeyMap.set(rawNew, originalKey);
      }
      doUpdateValue(newValue);
    }
    function handleCreateClick() {
      createItem(-1);
    }
    function createItem(index) {
      const {
        value: mergedValue
      } = mergedValueRef;
      const {
        onCreate
      } = props;
      const newValue = Array.from(mergedValue ?? []);
      if (onCreate) {
        newValue.splice(index + 1, 0, onCreate(index + 1));
        doUpdateValue(newValue);
      } else if (slots.default) {
        newValue.splice(index + 1, 0, null);
        doUpdateValue(newValue);
      } else switch (props.preset) {
        case "input":
          newValue.splice(index + 1, 0, "");
          doUpdateValue(newValue);
          break;
        case "pair":
          newValue.splice(index + 1, 0, {
            key: "",
            value: ""
          });
          doUpdateValue(newValue);
      }
    }
    function remove(index) {
      const {
        value: mergedValue
      } = mergedValueRef;
      if (!Array.isArray(mergedValue)) return;
      const {
        min
      } = props;
      if (mergedValue.length <= min) return;
      const {
        onRemove
      } = props;
      if (onRemove) onRemove(index);
      const newValue = Array.from(mergedValue);
      newValue.splice(index, 1);
      doUpdateValue(newValue);
    }
    function swap(array, currentIndex, targetIndex) {
      if (currentIndex < 0 || targetIndex < 0 || currentIndex >= array.length || targetIndex >= array.length) return;
      if (currentIndex === targetIndex) return;
      const currentItem = array[currentIndex];
      array[currentIndex] = array[targetIndex];
      array[targetIndex] = currentItem;
    }
    function move(type, index) {
      const {
        value: mergedValue
      } = mergedValueRef;
      if (!Array.isArray(mergedValue)) return;
      const newValue = Array.from(mergedValue);
      if (type === "up") swap(newValue, index, index - 1);
      if (type === "down") swap(newValue, index, index + 1);
      doUpdateValue(newValue);
    }
    provide(dynamicInputInjectionKey, {
      mergedThemeRef: themeRef,
      keyPlaceholderRef: toRef(props, "keyPlaceholder"),
      valuePlaceholderRef: toRef(props, "valuePlaceholder"),
      placeholderRef: toRef(props, "placeholder")
    });
    const rtlEnabledRef = useRtl("DynamicInput", mergedRtlRef, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        self: {
          actionMargin,
          actionMarginRtl
        }
      } = themeRef.value;
      return {
        "--action-margin": actionMargin,
        "--action-margin-rtl": actionMarginRtl
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("dynamic-input", void 0, cssVarsRef, props) : void 0;
    return {
      locale: useLocale("DynamicInput").localeRef,
      rtlEnabled: rtlEnabledRef,
      buttonSize: buttonSizeRef,
      mergedClsPrefix: mergedClsPrefixRef,
      NFormItem,
      uncontrolledValue: uncontrolledValueRef,
      mergedValue: mergedValueRef,
      insertionDisabled: insertionDisabledRef,
      removeDisabled: removeDisabledRef,
      handleCreateClick,
      ensureKey,
      handleValueChange,
      remove,
      move,
      createItem,
      mergedTheme: themeRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      $slots,
      itemClass,
      buttonSize,
      mergedClsPrefix,
      mergedValue,
      locale,
      mergedTheme,
      keyField,
      itemStyle,
      preset,
      showSortButton,
      NFormItem,
      ensureKey,
      handleValueChange,
      remove,
      createItem,
      move,
      onRender,
      disabled
    } = this;
    onRender?.();
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-dynamic-input`, this.rtlEnabled && `${mergedClsPrefix}-dynamic-input--rtl`, this.themeClass]),
      style: normalizeStyle(this.cssVars)
    }, [!Array.isArray(mergedValue) || mergedValue.length === 0 ? (openBlock(), createBlock(Button, mergeProps({
      key: 0,
      block: true,
      ghost: true,
      dashed: true,
      size: buttonSize
    }, this.createButtonProps, {
      disabled: this.insertionDisabled || disabled,
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      onClick: this.handleCreateClick
    }), {
      default: () => resolveSlot($slots["create-button-default"], () => [locale.create]),
      icon: () => resolveSlot($slots["create-button-icon"], () => [(openBlock(), createBlock(Icon_default, {
        clsPrefix: mergedClsPrefix
      }, {
        default: () => (openBlock(), createBlock(Add_default))
      }, 1032, ["clsPrefix"]))])
    }, 1040, ["size", "disabled", "theme", "themeOverrides", "onClick"])) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => mergedValue.map((_, index) => (openBlock(), createElementBlock("div", {
      key: keyField ? _[keyField] : ensureKey(_, index),
      "data-key": keyField ? _[keyField] : ensureKey(_, index),
      class: normalizeClass$1([`${mergedClsPrefix}-dynamic-input-item`, itemClass]),
      style: normalizeStyle(itemStyle)
    }, [normalizeVNode(() => resolveSlotWithTypedProps($slots.default, {
      value: mergedValue[index],
      index
    }, () => {
      return [preset === "input" ? (openBlock(), createBlock(InputPreset_default, {
        key: 1,
        disabled,
        clsPrefix: mergedClsPrefix,
        value: mergedValue[index],
        parentPath: NFormItem ? NFormItem.path.value : void 0,
        path: NFormItem?.path.value ? `${NFormItem.path.value}[${index}]` : void 0,
        onUpdateValue: v => {
          handleValueChange(index, v);
        }
      }, null, 8, ["disabled", "clsPrefix", "value", "parentPath", "path", "onUpdateValue"])) : preset === "pair" ? (openBlock(), createBlock(PairPreset_default, {
        key: 2,
        disabled,
        clsPrefix: mergedClsPrefix,
        value: mergedValue[index],
        parentPath: NFormItem ? NFormItem.path.value : void 0,
        path: NFormItem?.path.value ? `${NFormItem.path.value}[${index}]` : void 0,
        onUpdateValue: v => {
          handleValueChange(index, v);
        }
      }, null, 8, ["disabled", "clsPrefix", "value", "parentPath", "path", "onUpdateValue"])) : null];
    })), normalizeVNode(() => resolveSlotWithTypedProps($slots.action, {
      value: mergedValue[index],
      index,
      create: createItem,
      remove,
      move
    }, () => [(openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-dynamic-input-item__action`)
    }, [(openBlock(), createBlock(ButtonGroup_default, {
      size: buttonSize
    }, {
      default: () => [(openBlock(), createBlock(Button, {
        disabled: this.removeDisabled || disabled,
        theme: mergedTheme.peers.Button,
        themeOverrides: mergedTheme.peerOverrides.Button,
        circle: true,
        onClick: () => {
          remove(index);
        }
      }, {
        icon: () => (openBlock(), createBlock(Icon_default, {
          clsPrefix: mergedClsPrefix
        }, {
          default: () => (openBlock(), createBlock(Remove_default))
        }, 1032, ["clsPrefix"]))
      }, 1032, ["disabled", "theme", "themeOverrides", "onClick"])), (openBlock(), createBlock(Button, {
        disabled: this.insertionDisabled || disabled,
        circle: true,
        theme: mergedTheme.peers.Button,
        themeOverrides: mergedTheme.peerOverrides.Button,
        onClick: () => {
          createItem(index);
        }
      }, {
        icon: () => (openBlock(), createBlock(Icon_default, {
          clsPrefix: mergedClsPrefix
        }, {
          default: () => (openBlock(), createBlock(Add_default))
        }, 1032, ["clsPrefix"]))
      }, 1032, ["disabled", "theme", "themeOverrides", "onClick"])), showSortButton ? (openBlock(), createBlock(Button, {
        key: 3,
        disabled: index === 0 || disabled,
        circle: true,
        theme: mergedTheme.peers.Button,
        themeOverrides: mergedTheme.peerOverrides.Button,
        onClick: () => {
          move("up", index);
        }
      }, {
        icon: () => (openBlock(), createBlock(Icon_default, {
          clsPrefix: mergedClsPrefix
        }, {
          default: () => (openBlock(), createBlock(ArrowUp_default))
        }, 1032, ["clsPrefix"]))
      }, 1032, ["disabled", "theme", "themeOverrides", "onClick"])) : null, showSortButton ? (openBlock(), createBlock(Button, {
        key: 4,
        disabled: index === mergedValue.length - 1 || disabled,
        circle: true,
        theme: mergedTheme.peers.Button,
        themeOverrides: mergedTheme.peerOverrides.Button,
        onClick: () => {
          move("down", index);
        }
      }, {
        icon: () => (openBlock(), createBlock(Icon_default, {
          clsPrefix: mergedClsPrefix
        }, {
          default: () => (openBlock(), createBlock(ArrowDown_default))
        }, 1032, ["clsPrefix"]))
      }, 1032, ["disabled", "theme", "themeOverrides", "onClick"])) : null]
    }, 1032, ["size"]))], 2))]))], 14, _hoisted_1))))], 64))], 6);
  }
});
//#endregion
export { DynamicInput_default as default, dynamicInputProps };