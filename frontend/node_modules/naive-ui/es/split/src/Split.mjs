import { call } from "../../_utils/vue/call.mjs";
import { resolveSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import themeLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { depx } from "seemly";
import { computed, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock, ref, toRef, watchEffect } from "vue";
import { off, on } from "evtd";
import { useMergedState } from "vooks";
//#region src/split/src/Split.tsx
const _hoisted_1 = ["onMousedown"];
const splitProps = {
  ...useTheme.props,
  direction: {
    type: String,
    default: "horizontal"
  },
  resizeTriggerSize: {
    type: Number,
    default: 3
  },
  disabled: Boolean,
  defaultSize: {
    type: [String, Number],
    default: .5
  },
  "onUpdate:size": [Function, Array],
  onUpdateSize: [Function, Array],
  size: [String, Number],
  min: {
    type: [String, Number],
    default: 0
  },
  max: {
    type: [String, Number],
    default: 1
  },
  pane1Class: String,
  pane1Style: [Object, String],
  pane2Class: String,
  pane2Style: [Object, String],
  onDragStart: Function,
  onDragMove: Function,
  onDragEnd: Function,
  watchProps: Array
};
var Split_default = defineComponent({
  name: "Split",
  props: splitProps,
  slots: Object,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Split", "-split", index_cssr_default, themeLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          resizableTriggerColor,
          resizableTriggerColorHover
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-resize-trigger-color": resizableTriggerColor,
        "--n-resize-trigger-color-hover": resizableTriggerColorHover
      };
    });
    const resizeTriggerElRef = ref(null);
    const isDraggingRef = ref(false);
    const controlledSizeRef = toRef(props, "size");
    const uncontrolledSizeRef = ref(props.defaultSize);
    if (props.watchProps?.includes("defaultSize")) watchEffect(() => uncontrolledSizeRef.value = props.defaultSize);
    const doUpdateSize = size => {
      const _onUpdateSize = props["onUpdate:size"];
      if (props.onUpdateSize) call(props.onUpdateSize, size);
      if (_onUpdateSize) call(_onUpdateSize, size);
      uncontrolledSizeRef.value = size;
    };
    const mergedSizeRef = useMergedState(controlledSizeRef, uncontrolledSizeRef);
    const firstPaneStyle = computed(() => {
      const sizeValue = mergedSizeRef.value;
      if (typeof sizeValue === "string") return {
        flex: `0 0 ${sizeValue}`
      };else if (typeof sizeValue === "number") {
        const size = sizeValue * 100;
        return {
          flex: `0 0 calc(${size}% - ${props.resizeTriggerSize * size / 100}px)`
        };
      }
    });
    const resizeTriggerStyle = computed(() => {
      return props.direction === "horizontal" ? {
        width: `${props.resizeTriggerSize}px`,
        height: "100%"
      } : {
        width: "100%",
        height: `${props.resizeTriggerSize}px`
      };
    });
    const resizeTriggerWrapperStyle = computed(() => {
      const horizontal = props.direction === "horizontal";
      return {
        width: horizontal ? `${props.resizeTriggerSize}px` : "",
        height: horizontal ? "" : `${props.resizeTriggerSize}px`,
        cursor: props.direction === "horizontal" ? "col-resize" : "row-resize"
      };
    });
    let offset = 0;
    const handleMouseDown = e => {
      e.preventDefault();
      isDraggingRef.value = true;
      if (props.onDragStart) props.onDragStart(e);
      const mouseMoveEvent = "mousemove";
      const mouseUpEvent = "mouseup";
      const onMouseMove = e => {
        updateSize(e);
        if (props.onDragMove) props.onDragMove(e);
      };
      const onMouseUp = () => {
        off(mouseMoveEvent, document, onMouseMove);
        off(mouseUpEvent, document, onMouseUp);
        isDraggingRef.value = false;
        if (props.onDragEnd) props.onDragEnd(e);
        document.body.style.cursor = "";
      };
      document.body.style.cursor = resizeTriggerWrapperStyle.value.cursor;
      on(mouseMoveEvent, document, onMouseMove);
      on(mouseUpEvent, document, onMouseUp);
      const resizeTriggerEl = resizeTriggerElRef.value;
      if (resizeTriggerEl) {
        const elRect = resizeTriggerEl.getBoundingClientRect();
        if (props.direction === "horizontal") offset = e.clientX - elRect.left;else offset = elRect.top - e.clientY;
      }
      updateSize(e);
    };
    function updateSize(event) {
      const containerRect = resizeTriggerElRef.value?.parentElement?.getBoundingClientRect();
      if (!containerRect) return;
      const {
        direction
      } = props;
      const containerUsableWidth = containerRect.width - props.resizeTriggerSize;
      const containerUsableHeight = containerRect.height - props.resizeTriggerSize;
      const containerUsableSize = direction === "horizontal" ? containerUsableWidth : containerUsableHeight;
      const newPxSize = direction === "horizontal" ? event.clientX - containerRect.left - offset : event.clientY - containerRect.top + offset;
      const {
        min,
        max
      } = props;
      const pxMin = typeof min === "string" ? depx(min) : min * containerUsableSize;
      const pxMax = typeof max === "string" ? depx(max) : max * containerUsableSize;
      let nextPxSize = newPxSize;
      nextPxSize = Math.max(nextPxSize, pxMin);
      nextPxSize = Math.min(nextPxSize, pxMax, containerUsableSize);
      if (typeof mergedSizeRef.value === "string") doUpdateSize(`${nextPxSize}px`);else doUpdateSize(nextPxSize / containerUsableSize);
    }
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("split", void 0, cssVarsRef, props) : void 0;
    return {
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      resizeTriggerElRef,
      isDragging: isDraggingRef,
      mergedClsPrefix: mergedClsPrefixRef,
      resizeTriggerWrapperStyle,
      resizeTriggerStyle,
      handleMouseDown,
      firstPaneStyle
    };
  },
  render() {
    this.onRender?.();
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${this.mergedClsPrefix}-split`, `${this.mergedClsPrefix}-split--${this.direction}`, this.themeClass]),
      style: normalizeStyle(this.cssVars)
    }, [createElementVNode("div", {
      class: normalizeClass$1([`${this.mergedClsPrefix}-split-pane-1`, this.pane1Class]),
      style: normalizeStyle([this.firstPaneStyle, this.pane1Style])
    }, [normalizeVNode(() => this.$slots[1]?.())], 6), normalizeVNode(() => !this.disabled && (openBlock(), createElementBlock("div", {
      ref: "resizeTriggerElRef",
      class: normalizeClass$1(`${this.mergedClsPrefix}-split__resize-trigger-wrapper`),
      style: normalizeStyle(this.resizeTriggerWrapperStyle),
      onMousedown: this.handleMouseDown
    }, [normalizeVNode(() => resolveSlot(this.$slots["resize-trigger"], () => [(openBlock(), createElementBlock("div", {
      style: normalizeStyle(this.resizeTriggerStyle),
      class: normalizeClass$1([`${this.mergedClsPrefix}-split__resize-trigger`, this.isDragging && `${this.mergedClsPrefix}-split__resize-trigger--hover`])
    }, null, 6))]))], 46, _hoisted_1))), createElementVNode("div", {
      class: normalizeClass$1([`${this.mergedClsPrefix}-split-pane-2`, this.pane2Class]),
      style: normalizeStyle(this.pane2Style)
    }, [normalizeVNode(() => this.$slots[2]?.())], 6)], 6);
  }
});
//#endregion
export { Split_default as default, splitProps };