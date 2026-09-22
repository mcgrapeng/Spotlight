import { createKey } from "../../_utils/cssr/index.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeSlots, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import progressLight from "../styles/light.mjs";
import Circle_default from "./Circle.mjs";
import Line_default from "./Line.mjs";
import MultipleCircle_default from "./MultipleCircle.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { Fragment, computed, createBlock, createElementBlock, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/progress/src/Progress.tsx
const _hoisted_1 = ["aria-valuenow", "role"];
const progressProps = {
  ...useTheme.props,
  processing: Boolean,
  type: {
    type: String,
    default: "line"
  },
  gapDegree: Number,
  gapOffsetDegree: Number,
  status: {
    type: String,
    default: "default"
  },
  railColor: [String, Array],
  railStyle: [String, Array],
  color: [String, Array, Object],
  viewBoxWidth: {
    type: Number,
    default: 100
  },
  strokeWidth: {
    type: Number,
    default: 7
  },
  percentage: [Number, Array],
  unit: {
    type: String,
    default: "%"
  },
  showIndicator: {
    type: Boolean,
    default: true
  },
  indicatorPosition: {
    type: String,
    default: "outside"
  },
  indicatorPlacement: {
    type: String,
    default: "outside"
  },
  indicatorTextColor: String,
  circleGap: {
    type: Number,
    default: 1
  },
  height: Number,
  borderRadius: [String, Number],
  fillBorderRadius: [String, Number],
  offsetDegree: Number
};
var Progress_default = defineComponent({
  name: "Progress",
  props: progressProps,
  setup(props) {
    const mergedIndicatorPlacementRef = computed(() => {
      return props.indicatorPlacement || props.indicatorPosition;
    });
    const gapDeg = computed(() => {
      if (props.gapDegree || props.gapDegree === 0) return props.gapDegree;
      if (props.type === "dashboard") return 75;
    });
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Progress", "-progress", index_cssr_default, progressLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        status
      } = props;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          fontSize,
          fontSizeCircle,
          railColor,
          railHeight,
          iconSizeCircle,
          iconSizeLine,
          textColorCircle,
          textColorLineInner,
          textColorLineOuter,
          lineBgProcessing,
          fontWeightCircle,
          [createKey("iconColor", status)]: iconColor,
          [createKey("fillColor", status)]: fillColor
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-fill-color": fillColor,
        "--n-font-size": fontSize,
        "--n-font-size-circle": fontSizeCircle,
        "--n-font-weight-circle": fontWeightCircle,
        "--n-icon-color": iconColor,
        "--n-icon-size-circle": iconSizeCircle,
        "--n-icon-size-line": iconSizeLine,
        "--n-line-bg-processing": lineBgProcessing,
        "--n-rail-color": railColor,
        "--n-rail-height": railHeight,
        "--n-text-color-circle": textColorCircle,
        "--n-text-color-line-inner": textColorLineInner,
        "--n-text-color-line-outer": textColorLineOuter
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("progress", computed(() => props.status[0]), cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      mergedIndicatorPlacement: mergedIndicatorPlacementRef,
      gapDeg,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      type,
      cssVars,
      indicatorTextColor,
      showIndicator,
      status,
      railColor,
      railStyle,
      color,
      percentage,
      viewBoxWidth,
      strokeWidth,
      mergedIndicatorPlacement,
      unit,
      borderRadius,
      fillBorderRadius,
      height,
      processing,
      circleGap,
      mergedClsPrefix,
      gapDeg,
      gapOffsetDegree,
      themeClass,
      $slots,
      onRender
    } = this;
    onRender?.();
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([themeClass, `${mergedClsPrefix}-progress`, `${mergedClsPrefix}-progress--${type}`, `${mergedClsPrefix}-progress--${status}`]),
      style: normalizeStyle(cssVars),
      "aria-valuemax": 100,
      "aria-valuemin": 0,
      "aria-valuenow": percentage,
      role: type === "circle" || type === "line" || type === "dashboard" ? "progressbar" : "none"
    }, [type === "circle" || type === "dashboard" ? (openBlock(), createBlock(Circle_default, {
      key: 0,
      clsPrefix: mergedClsPrefix,
      status,
      showIndicator,
      indicatorTextColor,
      railColor,
      fillColor: color,
      railStyle,
      offsetDegree: this.offsetDegree,
      percentage,
      viewBoxWidth,
      strokeWidth,
      gapDegree: gapDeg === void 0 ? type === "dashboard" ? 75 : 0 : gapDeg,
      gapOffsetDegree,
      unit
    }, normalizeSlots($slots), 1032, ["clsPrefix", "status", "showIndicator", "indicatorTextColor", "railColor", "fillColor", "railStyle", "offsetDegree", "percentage", "viewBoxWidth", "strokeWidth", "gapDegree", "gapOffsetDegree", "unit"])) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [type === "line" ? (openBlock(), createBlock(Line_default, {
      key: 0,
      clsPrefix: mergedClsPrefix,
      status,
      showIndicator,
      indicatorTextColor,
      railColor,
      fillColor: color,
      railStyle,
      percentage,
      processing,
      indicatorPlacement: mergedIndicatorPlacement,
      unit,
      fillBorderRadius,
      railBorderRadius: borderRadius,
      height
    }, normalizeSlots($slots), 1032, ["clsPrefix", "status", "showIndicator", "indicatorTextColor", "railColor", "fillColor", "railStyle", "percentage", "processing", "indicatorPlacement", "unit", "fillBorderRadius", "railBorderRadius", "height"])) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [type === "multiple-circle" ? (openBlock(), createBlock(MultipleCircle_default, {
      key: 0,
      clsPrefix: mergedClsPrefix,
      strokeWidth,
      railColor,
      fillColor: color,
      railStyle,
      viewBoxWidth,
      percentage,
      showIndicator,
      circleGap
    }, normalizeSlots($slots), 1032, ["clsPrefix", "strokeWidth", "railColor", "fillColor", "railStyle", "viewBoxWidth", "percentage", "showIndicator", "circleGap"])) : normalizeVNode(() => null)], 64))], 64))], 14, _hoisted_1);
  }
});
//#endregion
export { Progress_default as default, progressProps };