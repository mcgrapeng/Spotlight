import { color2Class } from "../../_utils/css/color-to-class.mjs";
import { createKey } from "../../_utils/cssr/index.mjs";
import { call } from "../../_utils/vue/call.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import themeLight from "../styles/light.mjs";
import StarIcon_default from "./StarIcon.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { computed, createBlock, createElementBlock, defineComponent, normalizeStyle, openBlock, ref, renderList, toRef } from "vue";
import { useMergedState } from "vooks";
//#region src/rate/src/Rate.tsx
const _hoisted_1 = ["onClick", "onMouseenter", "onMousemove"];
const _hoisted_2 = ["onMouseleave"];
const rateProps = {
  ...useTheme.props,
  allowHalf: Boolean,
  count: {
    type: Number,
    default: 5
  },
  value: Number,
  defaultValue: {
    type: Number,
    default: null
  },
  readonly: Boolean,
  size: [String, Number],
  clearable: Boolean,
  color: String,
  onClear: Function,
  "onUpdate:value": [Function, Array],
  onUpdateValue: [Function, Array],
  "onUpdate:hoverValue": [Function, Array],
  onUpdateHoverValue: [Function, Array]
};
var Rate_default = defineComponent({
  name: "Rate",
  props: rateProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedComponentPropsRef
    } = useConfig(props);
    const themeRef = useTheme("Rate", "-rate", index_cssr_default, themeLight, props, mergedClsPrefixRef);
    const controlledValueRef = toRef(props, "value");
    const uncontrolledValueRef = ref(props.defaultValue);
    const hoverIndexRef = ref(null);
    const formItem = useFormItem(props, {
      mergedSize(NFormItem) {
        if (props.size !== void 0) return props.size;
        if (NFormItem) return NFormItem.mergedSize.value;
        const configSize = mergedComponentPropsRef?.value?.Rate?.size;
        if (configSize !== void 0) return configSize;
        return "medium";
      }
    });
    const mergedValue = useMergedState(controlledValueRef, uncontrolledValueRef);
    function doUpdateValue(value) {
      const {
        "onUpdate:value": _onUpdateValue,
        onUpdateValue
      } = props;
      const {
        nTriggerFormChange,
        nTriggerFormInput
      } = formItem;
      if (_onUpdateValue) call(_onUpdateValue, value);
      if (onUpdateValue) call(onUpdateValue, value);
      uncontrolledValueRef.value = value;
      nTriggerFormChange();
      nTriggerFormInput();
    }
    function getDerivedValue(index, e) {
      if (props.allowHalf) {
        if (e.offsetX >= Math.floor(e.currentTarget.offsetWidth / 2)) return index + 1;else return index + .5;
      } else return index + 1;
    }
    let cleared = false;
    function updateHoverIndex(value) {
      if (hoverIndexRef.value === value) return;
      hoverIndexRef.value = value;
      const {
        "onUpdate:hoverValue": _onUpdateHoverValue,
        onUpdateHoverValue
      } = props;
      if (_onUpdateHoverValue) call(_onUpdateHoverValue, value);
      if (onUpdateHoverValue) call(onUpdateHoverValue, value);
    }
    function handleMouseMove(index, e) {
      if (cleared) return;
      updateHoverIndex(getDerivedValue(index, e));
    }
    function handleMouseLeave() {
      updateHoverIndex(null);
    }
    function handleClick(index, e) {
      const {
        clearable
      } = props;
      const derivedValue = getDerivedValue(index, e);
      if (clearable && derivedValue === mergedValue.value) {
        cleared = true;
        props.onClear?.();
        updateHoverIndex(null);
        doUpdateValue(null);
      } else doUpdateValue(derivedValue);
    }
    function handleMouseEnterSomeStar() {
      cleared = false;
    }
    const {
      mergedSizeRef: _mergedSizeRef
    } = formItem;
    const mergedSizeRef = computed(() => {
      const size = _mergedSizeRef.value;
      const {
        self
      } = themeRef.value;
      if (typeof size === "number") return `${size}px`;else return self[createKey("size", size)];
    });
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self
      } = themeRef.value;
      const {
        itemColor,
        itemColorActive
      } = self;
      const {
        color
      } = props;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-item-color": itemColor,
        "--n-item-color-active": color || itemColorActive,
        "--n-item-size": mergedSizeRef.value
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("rate", computed(() => {
      const size = mergedSizeRef.value;
      const {
        color
      } = props;
      let hash = "";
      if (size) hash += size[0];
      if (color) hash += color2Class(color);
      return hash;
    }), cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      mergedValue,
      hoverIndex: hoverIndexRef,
      handleMouseMove,
      handleClick,
      handleMouseLeave,
      handleMouseEnterSomeStar,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      readonly,
      hoverIndex,
      mergedValue,
      mergedClsPrefix,
      onRender,
      $slots: {
        default: defaultSlot
      }
    } = this;
    onRender?.();
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-rate`, {
        [`${mergedClsPrefix}-rate--readonly`]: readonly
      }, this.themeClass]),
      style: normalizeStyle(this.cssVars),
      onMouseleave: this.handleMouseLeave
    }, [normalizeVNode(() => renderList(this.count, (_, index) => {
      const icon = defaultSlot ? defaultSlot({
        index
      }) : (openBlock(), createBlock(Icon_default, {
        key: 1,
        clsPrefix: mergedClsPrefix
      }, {
        default: StarIcon_default
      }, 1032, ["clsPrefix"]));
      const entireStarActive = hoverIndex !== null ? index + 1 <= hoverIndex : index + 1 <= (mergedValue || 0);
      return openBlock(), createElementBlock("div", {
        key: index,
        class: normalizeClass$1([`${mergedClsPrefix}-rate__item`, entireStarActive && `${mergedClsPrefix}-rate__item--active`]),
        onClick: readonly ? void 0 : e => {
          this.handleClick(index, e);
        },
        onMouseenter: this.handleMouseEnterSomeStar,
        onMousemove: readonly ? void 0 : e => {
          this.handleMouseMove(index, e);
        }
      }, [normalizeVNode(() => icon), this.allowHalf ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass$1([`${mergedClsPrefix}-rate__half`, {
          [`${mergedClsPrefix}-rate__half--active`]: !entireStarActive && hoverIndex !== null ? index + .5 <= hoverIndex : index + .5 <= (mergedValue || 0)
        }])
      }, [normalizeVNode(() => icon)], 2)) : normalizeVNode(() => null)], 42, _hoisted_1);
    }))], 46, _hoisted_2);
  }
});
//#endregion
export { Rate_default as default, rateProps };