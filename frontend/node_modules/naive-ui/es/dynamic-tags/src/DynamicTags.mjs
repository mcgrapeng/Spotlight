import { smallerSize } from "../../_utils/naive/prop.mjs";
import { warnOnce } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import useLocale from "../../_mixins/use-locale.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1 } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Add_default from "../../_internal/icons/Add.mjs";
import common_props_default from "../../tag/src/common-props.mjs";
import Tag_default from "../../tag/src/Tag.mjs";
import Input_default from "../../input/src/Input.mjs";
import Button from "../../button/src/Button.mjs";
import Space_default from "../../space/src/Space.mjs";
import dynamicTagsLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { computed, createBlock, defineComponent, mergeProps, nextTick, normalizeStyle, openBlock, ref, toRef, watchEffect } from "vue";
import { useMergedState } from "vooks";
//#region src/dynamic-tags/src/DynamicTags.tsx
const dynamicTagsProps = {
  ...useTheme.props,
  ...common_props_default,
  size: String,
  closable: {
    type: Boolean,
    default: true
  },
  defaultValue: {
    type: Array,
    default: () => []
  },
  value: Array,
  inputClass: String,
  inputStyle: [String, Object],
  inputProps: Object,
  max: Number,
  tagClass: String,
  tagStyle: [String, Object],
  renderTag: Function,
  onCreate: {
    type: Function,
    default: label => label
  },
  "onUpdate:value": [Function, Array],
  onUpdateValue: [Function, Array],
  onChange: [Function, Array]
};
var DynamicTags_default = defineComponent({
  name: "DynamicTags",
  props: dynamicTagsProps,
  slots: Object,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.onChange !== void 0) warnOnce("dynamic-tags", "`on-change` is deprecated, please use `on-update:value` instead.");
    });
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedComponentPropsRef
    } = useConfig(props);
    const mergedSizeRef = computed(() => {
      return props.size || mergedComponentPropsRef?.value?.DynamicTags?.size || "medium";
    });
    const {
      localeRef
    } = useLocale("DynamicTags");
    const formItem = useFormItem(props);
    const {
      mergedDisabledRef
    } = formItem;
    const inputValueRef = ref("");
    const showInputRef = ref(false);
    const inputForceFocusedRef = ref(true);
    const inputInstRef = ref(null);
    const themeRef = useTheme("DynamicTags", "-dynamic-tags", index_cssr_default, dynamicTagsLight, props, mergedClsPrefixRef);
    const uncontrolledValueRef = ref(props.defaultValue);
    const controlledValueRef = toRef(props, "value");
    const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
    const localizedAddRef = computed(() => {
      return localeRef.value.add;
    });
    const inputSizeRef = computed(() => {
      return smallerSize(mergedSizeRef.value);
    });
    const triggerDisabledRef = computed(() => {
      return mergedDisabledRef.value || !!props.max && mergedValueRef.value.length >= props.max;
    });
    function doChange(value) {
      const {
        onChange,
        "onUpdate:value": _onUpdateValue,
        onUpdateValue
      } = props;
      const {
        nTriggerFormInput,
        nTriggerFormChange
      } = formItem;
      if (onChange) call(onChange, value);
      if (onUpdateValue) call(onUpdateValue, value);
      if (_onUpdateValue) call(_onUpdateValue, value);
      uncontrolledValueRef.value = value;
      nTriggerFormInput();
      nTriggerFormChange();
    }
    function handleCloseClick(index) {
      const tags = mergedValueRef.value.slice(0);
      tags.splice(index, 1);
      doChange(tags);
    }
    function handleInputKeyDown(e) {
      if (inputInstRef.value?.isCompositing) return;
      switch (e.key) {
        case "Enter":
          handleInputConfirm();
      }
    }
    function handleInputConfirm(externalValue) {
      const nextValue = externalValue ?? inputValueRef.value;
      if (nextValue) {
        const tags = mergedValueRef.value.slice(0);
        tags.push(props.onCreate(nextValue));
        doChange(tags);
      }
      showInputRef.value = false;
      inputForceFocusedRef.value = true;
      inputValueRef.value = "";
    }
    function handleInputBlur() {
      handleInputConfirm();
    }
    function handleAddClick() {
      showInputRef.value = true;
      nextTick(() => {
        inputInstRef.value?.focus();
        inputForceFocusedRef.value = false;
      });
    }
    const cssVarsRef = computed(() => {
      const {
        self: {
          inputWidth
        }
      } = themeRef.value;
      return {
        "--n-input-width": inputWidth
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("dynamic-tags", void 0, cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      inputInstRef,
      localizedAdd: localizedAddRef,
      inputSize: inputSizeRef,
      mergedSize: mergedSizeRef,
      inputValue: inputValueRef,
      showInput: showInputRef,
      inputForceFocused: inputForceFocusedRef,
      mergedValue: mergedValueRef,
      mergedDisabled: mergedDisabledRef,
      triggerDisabled: triggerDisabledRef,
      handleInputKeyDown,
      handleAddClick,
      handleInputBlur,
      handleCloseClick,
      handleInputConfirm,
      mergedTheme: themeRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedTheme,
      cssVars,
      mergedClsPrefix,
      onRender,
      renderTag
    } = this;
    onRender?.();
    return openBlock(), createBlock(Space_default, {
      class: normalizeClass$1([`${mergedClsPrefix}-dynamic-tags`, this.themeClass]),
      size: "small",
      style: normalizeStyle(cssVars),
      theme: mergedTheme.peers.Space,
      themeOverrides: mergedTheme.peerOverrides.Space,
      itemStyle: "display: flex;"
    }, {
      default: () => {
        const {
          mergedTheme,
          tagClass,
          tagStyle,
          type,
          round,
          mergedSize,
          color,
          closable,
          mergedDisabled,
          showInput,
          inputValue,
          inputClass,
          inputStyle,
          inputSize,
          inputForceFocused,
          triggerDisabled,
          handleInputKeyDown,
          handleInputBlur,
          handleAddClick,
          handleCloseClick,
          handleInputConfirm,
          $slots
        } = this;
        return this.mergedValue.map((tag, index) => renderTag ? renderTag(tag, index) : (openBlock(), createBlock(Tag_default, {
          key: index,
          theme: mergedTheme.peers.Tag,
          themeOverrides: mergedTheme.peerOverrides.Tag,
          class: normalizeClass$1(tagClass),
          style: normalizeStyle(tagStyle),
          type,
          round,
          size: mergedSize,
          color,
          closable,
          disabled: mergedDisabled,
          onClose: () => {
            handleCloseClick(index);
          }
        }, {
          default: () => typeof tag === "string" ? tag : tag.label
        }, 1032, ["theme", "themeOverrides", "class", "style", "type", "round", "size", "color", "closable", "disabled", "onClose"]))).concat(showInput ? $slots.input ? $slots.input({
          submit: handleInputConfirm,
          deactivate: handleInputBlur
        }) : (openBlock(), createBlock(Input_default, mergeProps({
          key: 2,
          placeholder: "",
          size: inputSize,
          style: inputStyle,
          class: inputClass,
          autosize: true
        }, this.inputProps, {
          ref: "inputInstRef",
          value: inputValue,
          onUpdateValue: v => {
            this.inputValue = v;
          },
          theme: mergedTheme.peers.Input,
          themeOverrides: mergedTheme.peerOverrides.Input,
          onKeydown: handleInputKeyDown,
          onBlur: handleInputBlur,
          internalForceFocus: inputForceFocused
        }), null, 16, ["size", "style", "class", "value", "onUpdateValue", "theme", "themeOverrides", "onKeydown", "onBlur", "internalForceFocus"])) : $slots.trigger ? $slots.trigger({
          activate: handleAddClick,
          disabled: triggerDisabled
        }) : (openBlock(), createBlock(Button, {
          key: 3,
          dashed: true,
          disabled: triggerDisabled,
          theme: mergedTheme.peers.Button,
          themeOverrides: mergedTheme.peerOverrides.Button,
          size: inputSize,
          onClick: handleAddClick
        }, {
          icon: () => (openBlock(), createBlock(Icon_default, {
            clsPrefix: mergedClsPrefix
          }, {
            default: () => (openBlock(), createBlock(Add_default))
          }, 1032, ["clsPrefix"]))
        }, 1032, ["disabled", "theme", "themeOverrides", "size", "onClick"])));
      }
    }, 1032, ["class", "style", "theme", "themeOverrides"]);
  }
});
//#endregion
export { DynamicTags_default as default, dynamicTagsProps };