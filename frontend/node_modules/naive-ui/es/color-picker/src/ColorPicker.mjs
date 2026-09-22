import { useAdjustedTo } from "../../_utils/composable/use-adjusted-to.mjs";
import { createKey } from "../../_utils/cssr/index.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { keep } from "../../_utils/vue/keep.mjs";
import { mergeEventHandlers } from "../../_utils/vue/merge-handlers.mjs";
import { resolveWrappedSlotWithProps } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import useLocale from "../../_mixins/use-locale.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { createVNodeCache, normalizeClass as normalizeClass$1, normalizeSlot, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Button from "../../button/src/Button.mjs";
import colorPickerLight from "../styles/light.mjs";
import { deriveDefaultValue, getModeFromValue } from "./utils.mjs";
import AlphaSlider_default from "./AlphaSlider.mjs";
import { colorPickerInjectionKey } from "./context.mjs";
import ColorInput_default from "./ColorInput.mjs";
import ColorPickerSwatches_default from "./ColorPickerSwatches.mjs";
import ColorPickerTrigger_default from "./ColorPickerTrigger.mjs";
import ColorPreview_default from "./ColorPreview.mjs";
import HueSlider_default from "./HueSlider.mjs";
import Pallete_default from "./Pallete.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { getPreciseEventTarget, hsl2hsv, hsl2rgb, hsla, hsv2hsl, hsv2rgb, hsva, rgb2hsl, rgb2hsv, rgba, toHexString, toHexaString, toHslString, toHslaString, toHsvString, toHsvaString, toRgbString, toRgbaString } from "seemly";
import { Fragment, Transition, computed, createBlock, createElementBlock, createElementVNode, defineComponent, mergeProps, nextTick, normalizeStyle, openBlock, provide, ref, toRef, watch, watchEffect, withDirectives } from "vue";
import { useIsMounted, useMergedState } from "vooks";
import { VBinder, VFollower, VTarget } from "vueuc";
import { clickoutside } from "vdirs";
//#region src/color-picker/src/ColorPicker.tsx
const colorPickerProps = {
  ...useTheme.props,
  value: String,
  show: {
    type: Boolean,
    default: void 0
  },
  defaultShow: Boolean,
  defaultValue: String,
  modes: {
    type: Array,
    default: () => ["rgb", "hex", "hsl"]
  },
  placement: {
    type: String,
    default: "bottom-start"
  },
  to: useAdjustedTo.propTo,
  showAlpha: {
    type: Boolean,
    default: true
  },
  showPreview: Boolean,
  swatches: Array,
  disabled: {
    type: Boolean,
    default: void 0
  },
  actions: {
    type: Array,
    default: null
  },
  internalActions: Array,
  size: String,
  renderLabel: Function,
  onComplete: Function,
  onConfirm: Function,
  onClear: Function,
  "onUpdate:show": [Function, Array],
  onUpdateShow: [Function, Array],
  "onUpdate:value": [Function, Array],
  onUpdateValue: [Function, Array]
};
var ColorPicker_default = defineComponent({
  name: "ColorPicker",
  inheritAttrs: false,
  props: colorPickerProps,
  slots: Object,
  setup(props, {
    slots
  }) {
    let triggerRef = null;
    function setTriggerRef(el) {
      triggerRef = el;
    }
    let upcomingValue = null;
    const {
      mergedClsPrefixRef,
      namespaceRef,
      inlineThemeDisabled,
      mergedComponentPropsRef
    } = useConfig(props);
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
        const configSize = mergedComponentPropsRef?.value?.ColorPicker?.size;
        if (configSize) return configSize;
        return "medium";
      }
    });
    const {
      mergedSizeRef,
      mergedDisabledRef
    } = formItem;
    const {
      localeRef
    } = useLocale("global");
    const themeRef = useTheme("ColorPicker", "-color-picker", index_cssr_default, colorPickerLight, props, mergedClsPrefixRef);
    provide(colorPickerInjectionKey, {
      themeRef,
      renderLabelRef: toRef(props, "renderLabel"),
      colorPickerSlots: slots
    });
    const uncontrolledShowRef = ref(props.defaultShow);
    const mergedShowRef = useMergedState(toRef(props, "show"), uncontrolledShowRef);
    function doUpdateShow(value) {
      const {
        onUpdateShow,
        "onUpdate:show": _onUpdateShow
      } = props;
      if (onUpdateShow) call(onUpdateShow, value);
      if (_onUpdateShow) call(_onUpdateShow, value);
      uncontrolledShowRef.value = value;
    }
    const {
      defaultValue
    } = props;
    const uncontrolledValueRef = ref(defaultValue === void 0 ? deriveDefaultValue(props.modes, props.showAlpha) : defaultValue);
    const mergedValueRef = useMergedState(toRef(props, "value"), uncontrolledValueRef);
    const undoStackRef = ref([mergedValueRef.value]);
    const valueIndexRef = ref(0);
    const valueModeRef = computed(() => getModeFromValue(mergedValueRef.value));
    const {
      modes
    } = props;
    const displayedModeRef = ref(getModeFromValue(mergedValueRef.value) || modes[0] || "rgb");
    function handleUpdateDisplayedMode() {
      const {
        modes
      } = props;
      const {
        value: displayedMode
      } = displayedModeRef;
      const currentModeIndex = modes.findIndex(mode => mode === displayedMode);
      if (~currentModeIndex) displayedModeRef.value = modes[(currentModeIndex + 1) % modes.length];else displayedModeRef.value = "rgb";
    }
    let _h, s, l, v, r, g, b, a;
    const hsvaRef = computed(() => {
      const {
        value: mergedValue
      } = mergedValueRef;
      if (!mergedValue) return null;
      switch (valueModeRef.value) {
        case "hsv":
          return hsva(mergedValue);
        case "hsl":
          [_h, s, l, a] = hsla(mergedValue);
          return [...hsl2hsv(_h, s, l), a];
        case "rgb":
        case "hex":
          [r, g, b, a] = rgba(mergedValue);
          return [...rgb2hsv(r, g, b), a];
      }
    });
    const rgbaRef = computed(() => {
      const {
        value: mergedValue
      } = mergedValueRef;
      if (!mergedValue) return null;
      switch (valueModeRef.value) {
        case "rgb":
        case "hex":
          return rgba(mergedValue);
        case "hsv":
          [_h, s, v, a] = hsva(mergedValue);
          return [...hsv2rgb(_h, s, v), a];
        case "hsl":
          [_h, s, l, a] = hsla(mergedValue);
          return [...hsl2rgb(_h, s, l), a];
      }
    });
    const hslaRef = computed(() => {
      const {
        value: mergedValue
      } = mergedValueRef;
      if (!mergedValue) return null;
      switch (valueModeRef.value) {
        case "hsl":
          return hsla(mergedValue);
        case "hsv":
          [_h, s, v, a] = hsva(mergedValue);
          return [...hsv2hsl(_h, s, v), a];
        case "rgb":
        case "hex":
          [r, g, b, a] = rgba(mergedValue);
          return [...rgb2hsl(r, g, b), a];
      }
    });
    const mergedValueArrRef = computed(() => {
      switch (displayedModeRef.value) {
        case "rgb":
        case "hex":
          return rgbaRef.value;
        case "hsv":
          return hsvaRef.value;
        case "hsl":
          return hslaRef.value;
      }
    });
    const displayedHueRef = ref(0);
    const displayedAlphaRef = ref(1);
    const displayedSvRef = ref([0, 0]);
    function handleUpdateSv(s, v) {
      const {
        value: hsvaArr
      } = hsvaRef;
      const hue = displayedHueRef.value;
      const alpha = hsvaArr ? hsvaArr[3] : 1;
      displayedSvRef.value = [s, v];
      const {
        showAlpha
      } = props;
      switch (displayedModeRef.value) {
        case "hsv":
          doUpdateValue((showAlpha ? toHsvaString : toHsvString)([hue, s, v, alpha]), "cursor");
          break;
        case "hsl":
          doUpdateValue((showAlpha ? toHslaString : toHslString)([...hsv2hsl(hue, s, v), alpha]), "cursor");
          break;
        case "rgb":
          doUpdateValue((showAlpha ? toRgbaString : toRgbString)([...hsv2rgb(hue, s, v), alpha]), "cursor");
          break;
        case "hex":
          doUpdateValue((showAlpha ? toHexaString : toHexString)([...hsv2rgb(hue, s, v), alpha]), "cursor");
      }
    }
    function handleUpdateHue(hue) {
      displayedHueRef.value = hue;
      const {
        value: hsvaArr
      } = hsvaRef;
      if (!hsvaArr) return;
      const [, s, v, a] = hsvaArr;
      const {
        showAlpha
      } = props;
      switch (displayedModeRef.value) {
        case "hsv":
          doUpdateValue((showAlpha ? toHsvaString : toHsvString)([hue, s, v, a]), "cursor");
          break;
        case "rgb":
          doUpdateValue((showAlpha ? toRgbaString : toRgbString)([...hsv2rgb(hue, s, v), a]), "cursor");
          break;
        case "hex":
          doUpdateValue((showAlpha ? toHexaString : toHexString)([...hsv2rgb(hue, s, v), a]), "cursor");
          break;
        case "hsl":
          doUpdateValue((showAlpha ? toHslaString : toHslString)([...hsv2hsl(hue, s, v), a]), "cursor");
      }
    }
    function handleUpdateAlpha(alpha) {
      switch (displayedModeRef.value) {
        case "hsv":
          [_h, s, v] = hsvaRef.value;
          doUpdateValue(toHsvaString([_h, s, v, alpha]), "cursor");
          break;
        case "rgb":
          [r, g, b] = rgbaRef.value;
          doUpdateValue(toRgbaString([r, g, b, alpha]), "cursor");
          break;
        case "hex":
          [r, g, b] = rgbaRef.value;
          doUpdateValue(toHexaString([r, g, b, alpha]), "cursor");
          break;
        case "hsl":
          [_h, s, l] = hslaRef.value;
          doUpdateValue(toHslaString([_h, s, l, alpha]), "cursor");
      }
      displayedAlphaRef.value = alpha;
    }
    function doUpdateValue(value, updateSource) {
      if (updateSource === "cursor") upcomingValue = value;else upcomingValue = null;
      const {
        nTriggerFormChange,
        nTriggerFormInput
      } = formItem;
      const {
        onUpdateValue,
        "onUpdate:value": _onUpdateValue
      } = props;
      if (onUpdateValue) call(onUpdateValue, value);
      if (_onUpdateValue) call(_onUpdateValue, value);
      nTriggerFormChange();
      nTriggerFormInput();
      uncontrolledValueRef.value = value;
    }
    function handleInputUpdateValue(value) {
      doUpdateValue(value, "input");
      nextTick(handleComplete);
    }
    function handleComplete(pushStack = true) {
      const {
        value
      } = mergedValueRef;
      if (value) {
        const {
          nTriggerFormChange,
          nTriggerFormInput
        } = formItem;
        const {
          onComplete
        } = props;
        if (onComplete) onComplete(value);
        const {
          value: undoStack
        } = undoStackRef;
        const {
          value: valueIndex
        } = valueIndexRef;
        if (pushStack) {
          undoStack.splice(valueIndex + 1, undoStack.length, value);
          valueIndexRef.value = valueIndex + 1;
        }
        nTriggerFormChange();
        nTriggerFormInput();
      }
    }
    function undo() {
      const {
        value: valueIndex
      } = valueIndexRef;
      if (valueIndex - 1 < 0) return;
      doUpdateValue(undoStackRef.value[valueIndex - 1], "input");
      handleComplete(false);
      valueIndexRef.value = valueIndex - 1;
    }
    function redo() {
      const {
        value: valueIndex
      } = valueIndexRef;
      if (valueIndex < 0 || valueIndex + 1 >= undoStackRef.value.length) return;
      doUpdateValue(undoStackRef.value[valueIndex + 1], "input");
      handleComplete(false);
      valueIndexRef.value = valueIndex + 1;
    }
    function handleClear() {
      doUpdateValue(null, "input");
      const {
        onClear
      } = props;
      if (onClear) onClear();
      doUpdateShow(false);
    }
    function handleConfirm() {
      const {
        value
      } = mergedValueRef;
      const {
        onConfirm
      } = props;
      if (onConfirm) onConfirm(value);
      doUpdateShow(false);
    }
    const undoableRef = computed(() => valueIndexRef.value >= 1);
    const redoableRef = computed(() => {
      const {
        value: undoStack
      } = undoStackRef;
      return undoStack.length > 1 && valueIndexRef.value < undoStack.length - 1;
    });
    watch(mergedShowRef, value => {
      if (!value) {
        undoStackRef.value = [mergedValueRef.value];
        valueIndexRef.value = 0;
      }
    });
    watchEffect(() => {
      if (upcomingValue && upcomingValue === mergedValueRef.value) {} else {
        const {
          value
        } = hsvaRef;
        if (value) {
          displayedHueRef.value = value[0];
          displayedAlphaRef.value = value[3];
          displayedSvRef.value = [value[1], value[2]];
        }
      }
      upcomingValue = null;
    });
    const cssVarsRef = computed(() => {
      const {
        value: mergedSize
      } = mergedSizeRef;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          textColor,
          color,
          panelFontSize,
          boxShadow,
          border,
          borderRadius,
          dividerColor,
          [createKey("height", mergedSize)]: height,
          [createKey("fontSize", mergedSize)]: fontSize
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-text-color": textColor,
        "--n-color": color,
        "--n-panel-font-size": panelFontSize,
        "--n-font-size": fontSize,
        "--n-box-shadow": boxShadow,
        "--n-border": border,
        "--n-border-radius": borderRadius,
        "--n-height": height,
        "--n-divider-color": dividerColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("color-picker", computed(() => {
      return mergedSizeRef.value[0];
    }), cssVarsRef, props) : void 0;
    function renderPanel() {
      const {
        value: rgba
      } = rgbaRef;
      const {
        value: displayedHue
      } = displayedHueRef;
      const {
        internalActions,
        modes,
        actions
      } = props;
      const {
        value: mergedTheme
      } = themeRef;
      const {
        value: mergedClsPrefix
      } = mergedClsPrefixRef;
      return (() => {
        const _cache = createVNodeCache("550d4636453f407b");
        return openBlock(), createElementBlock("div", {
          class: normalizeClass$1([`${mergedClsPrefix}-color-picker-panel`, themeClassHandle?.themeClass.value]),
          onDragstart: _cache[0] || (_cache[0] = e => {
            e.preventDefault();
          }),
          style: normalizeStyle(inlineThemeDisabled ? void 0 : cssVarsRef.value)
        }, [createElementVNode("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-color-picker-control`)
        }, [(openBlock(), createBlock(Pallete_default, {
          clsPrefix: mergedClsPrefix,
          rgba,
          displayedHue,
          displayedSv: displayedSvRef.value,
          onUpdateSV: handleUpdateSv,
          onComplete: handleComplete
        }, null, 8, ["clsPrefix", "rgba", "displayedHue", "displayedSv", "onUpdateSV", "onComplete"])), createElementVNode("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-color-picker-preview`)
        }, [createElementVNode("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-color-picker-preview__sliders`)
        }, [(openBlock(), createBlock(HueSlider_default, {
          clsPrefix: mergedClsPrefix,
          hue: displayedHue,
          onUpdateHue: handleUpdateHue,
          onComplete: handleComplete
        }, null, 8, ["clsPrefix", "hue", "onUpdateHue", "onComplete"])), props.showAlpha ? (openBlock(), createBlock(AlphaSlider_default, {
          key: 0,
          clsPrefix: mergedClsPrefix,
          rgba,
          alpha: displayedAlphaRef.value,
          onUpdateAlpha: handleUpdateAlpha,
          onComplete: handleComplete
        }, null, 8, ["clsPrefix", "rgba", "alpha", "onUpdateAlpha", "onComplete"])) : normalizeVNode(() => null)], 2), props.showPreview ? (openBlock(), createBlock(ColorPreview_default, {
          key: 0,
          clsPrefix: mergedClsPrefix,
          mode: displayedModeRef.value,
          color: rgbaRef.value && toHexString(rgbaRef.value),
          onUpdateColor: _cache[1] || (_cache[1] = color => {
            doUpdateValue(color, "input");
          })
        }, null, 8, ["clsPrefix", "mode", "color"])) : normalizeVNode(() => null)], 2), (openBlock(), createBlock(ColorInput_default, {
          clsPrefix: mergedClsPrefix,
          showAlpha: props.showAlpha,
          mode: displayedModeRef.value,
          modes,
          onUpdateMode: handleUpdateDisplayedMode,
          value: mergedValueRef.value,
          valueArr: mergedValueArrRef.value,
          onUpdateValue: handleInputUpdateValue
        }, null, 8, ["clsPrefix", "showAlpha", "mode", "modes", "onUpdateMode", "value", "valueArr", "onUpdateValue"])), normalizeVNode(() => props.swatches?.length && (() => {
          const _cache = createVNodeCache("1de0b88852ebf5cb");
          return openBlock(), createBlock(ColorPickerSwatches_default, {
            clsPrefix: mergedClsPrefix,
            mode: displayedModeRef.value,
            swatches: props.swatches,
            onUpdateColor: _cache[0] || (_cache[0] = color => {
              doUpdateValue(color, "input");
            })
          }, null, 8, ["clsPrefix", "mode", "swatches"]);
        })())], 2), actions?.length ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass$1(`${mergedClsPrefix}-color-picker-action`)
        }, [normalizeVNode(() => actions.includes("confirm") && (openBlock(), createBlock(Button, {
          size: "small",
          onClick: handleConfirm,
          theme: mergedTheme.peers.Button,
          themeOverrides: mergedTheme.peerOverrides.Button
        }, {
          default: () => localeRef.value.confirm
        }, 1032, ["onClick", "theme", "themeOverrides"]))), normalizeVNode(() => actions.includes("clear") && (openBlock(), createBlock(Button, {
          size: "small",
          onClick: handleClear,
          disabled: !mergedValueRef.value,
          theme: mergedTheme.peers.Button,
          themeOverrides: mergedTheme.peerOverrides.Button
        }, {
          default: () => localeRef.value.clear
        }, 1032, ["onClick", "disabled", "theme", "themeOverrides"])))], 2)) : normalizeVNode(() => null), slots.action ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: normalizeClass$1(`${mergedClsPrefix}-color-picker-action`)
        }, [normalizeVNode(() => slots.action?.())], 2)) : (openBlock(), createElementBlock(Fragment, {
          key: 3
        }, [internalActions ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass$1(`${mergedClsPrefix}-color-picker-action`)
        }, [normalizeVNode(() => internalActions.includes("undo") && (openBlock(), createBlock(Button, {
          size: "small",
          onClick: undo,
          disabled: !undoableRef.value,
          theme: mergedTheme.peers.Button,
          themeOverrides: mergedTheme.peerOverrides.Button
        }, {
          default: () => localeRef.value.undo
        }, 1032, ["onClick", "disabled", "theme", "themeOverrides"]))), normalizeVNode(() => internalActions.includes("redo") && (openBlock(), createBlock(Button, {
          size: "small",
          onClick: redo,
          disabled: !redoableRef.value,
          theme: mergedTheme.peers.Button,
          themeOverrides: mergedTheme.peerOverrides.Button
        }, {
          default: () => localeRef.value.redo
        }, 1032, ["onClick", "disabled", "theme", "themeOverrides"])))], 2)) : normalizeVNode(() => null)], 64))], 38);
      })();
    }
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      namespace: namespaceRef,
      hsla: hslaRef,
      rgba: rgbaRef,
      mergedShow: mergedShowRef,
      mergedDisabled: mergedDisabledRef,
      isMounted: useIsMounted(),
      adjustedTo: useAdjustedTo(props),
      mergedValue: mergedValueRef,
      handleTriggerClick() {
        if (mergedDisabledRef.value) return;
        doUpdateShow(true);
      },
      setTriggerRef,
      handleClickOutside(e) {
        if (triggerRef instanceof Element) {
          if (triggerRef.contains(getPreciseEventTarget(e))) return;
        } else if (triggerRef) {
          if (triggerRef.$el.contains(getPreciseEventTarget(e))) return;
        }
        doUpdateShow(false);
      },
      renderPanel,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedClsPrefix,
      onRender
    } = this;
    onRender?.();
    return openBlock(), createBlock(VBinder, null, {
      default: () => [(openBlock(), createBlock(VTarget, null, {
        default: () => {
          const triggerProps = mergeProps(this.$attrs, {
            ref: this.setTriggerRef,
            value: this.mergedValue,
            style: this.cssVars,
            class: this.themeClass
          });
          triggerProps.onClick = mergeEventHandlers([this.mergedDisabled ? void 0 : this.handleTriggerClick, this.$attrs.onClick]);
          return resolveWrappedSlotWithProps(this.$slots.trigger, keep(triggerProps, ["value", "onClick", "ref"]), children => {
            return children || (openBlock(), createBlock(ColorPickerTrigger_default, mergeProps(triggerProps, {
              clsPrefix: mergedClsPrefix,
              hsla: this.hsla,
              disabled: this.mergedDisabled
            }), null, 16, ["clsPrefix", "hsla", "disabled"]));
          });
        }
      }, 1024)), (openBlock(), createBlock(VFollower, {
        placement: this.placement,
        show: this.mergedShow,
        containerClass: this.namespace,
        teleportDisabled: this.adjustedTo === useAdjustedTo.tdkey,
        to: this.adjustedTo
      }, {
        _: 1,
        default: normalizeSlot(() => (openBlock(), createBlock(Transition, {
          name: "fade-in-scale-up-transition",
          appear: this.isMounted
        }, {
          _: 1,
          default: normalizeSlot(() => this.mergedShow ? withDirectives(this.renderPanel(), [[clickoutside, this.handleClickOutside, void 0, {
            capture: true
          }]]) : null)
        }, 8, ["appear"])))
      }, 8, ["placement", "show", "containerClass", "teleportDisabled", "to"]))]
    }, 1024);
  }
});
//#endregion
export { colorPickerProps, ColorPicker_default as default };