import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Error_default from "../../_internal/icons/Error.mjs";
import Info_default from "../../_internal/icons/Info.mjs";
import Success_default from "../../_internal/icons/Success.mjs";
import Warning_default from "../../_internal/icons/Warning.mjs";
import { Fragment, computed, createBlock, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock } from "vue";
import { hash } from "css-render";
//#region src/progress/src/Circle.tsx
const _hoisted_1 = ["id"];
const _hoisted_2 = ["stop-color"];
const _hoisted_3 = ["stop-color"];
const _hoisted_4 = ["viewBox"];
const _hoisted_5 = ["d", "stroke-width"];
const _hoisted_6 = ["d", "stroke-width"];
const iconMap = {
  success: (openBlock(), createBlock(Success_default)),
  error: (openBlock(), createBlock(Error_default)),
  warning: (openBlock(), createBlock(Warning_default)),
  info: (openBlock(), createBlock(Info_default))
};
var Circle_default = defineComponent({
  name: "ProgressCircle",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    strokeWidth: {
      type: Number,
      required: true
    },
    fillColor: [String, Object],
    railColor: String,
    railStyle: [String, Object],
    percentage: {
      type: Number,
      default: 0
    },
    offsetDegree: {
      type: Number,
      default: 0
    },
    showIndicator: {
      type: Boolean,
      required: true
    },
    indicatorTextColor: String,
    unit: String,
    viewBoxWidth: {
      type: Number,
      required: true
    },
    gapDegree: {
      type: Number,
      required: true
    },
    gapOffsetDegree: {
      type: Number,
      default: 0
    }
  },
  setup(props, {
    slots
  }) {
    const gradientIdRef = computed(() => {
      const base = "gradient";
      const {
        fillColor
      } = props;
      if (typeof fillColor === "object") return `${base}-${hash(JSON.stringify(fillColor))}`;
      return base;
    });
    function getPathStyles(percent, offsetDegree, strokeColor, type) {
      const {
        gapDegree,
        viewBoxWidth,
        strokeWidth
      } = props;
      const radius = 50;
      const beginPositionX = 0;
      const beginPositionY = radius;
      const endPositionX = 0;
      const endPositionY = 100;
      const centerX = 50 + strokeWidth / 2;
      const pathString = `M ${centerX},${centerX} m ${beginPositionX},${beginPositionY}
      a ${radius},${radius} 0 1 1 ${endPositionX},-100
      a ${radius},${radius} 0 1 1 0,${endPositionY}`;
      const len = Math.PI * 2 * radius;
      return {
        pathString,
        pathStyle: {
          stroke: type === "rail" ? strokeColor : typeof props.fillColor === "object" ? `url(#${gradientIdRef.value})` : strokeColor,
          strokeDasharray: `${Math.min(percent, 100) / 100 * (len - gapDegree)}px ${viewBoxWidth * 8}px`,
          strokeDashoffset: `-${gapDegree / 2}px`,
          transformOrigin: offsetDegree ? "center" : void 0,
          transform: offsetDegree ? `rotate(${offsetDegree}deg)` : void 0
        }
      };
    }
    const createGradientNode = () => {
      const isGradient = typeof props.fillColor === "object";
      const from = isGradient ? props.fillColor.stops[0] : "";
      const to = isGradient ? props.fillColor.stops[1] : "";
      return isGradient && (openBlock(), createElementBlock("defs", null, [createElementVNode("linearGradient", {
        id: gradientIdRef.value,
        x1: "0%",
        y1: "100%",
        x2: "100%",
        y2: "0%"
      }, [createElementVNode("stop", {
        offset: "0%",
        "stop-color": from
      }, null, 8, _hoisted_2), createElementVNode("stop", {
        offset: "100%",
        "stop-color": to
      }, null, 8, _hoisted_3)], 8, _hoisted_1)]));
    };
    return () => {
      const {
        fillColor,
        railColor,
        strokeWidth,
        offsetDegree,
        status,
        percentage,
        showIndicator,
        indicatorTextColor,
        unit,
        gapOffsetDegree,
        clsPrefix
      } = props;
      const {
        pathString: railPathString,
        pathStyle: railPathStyle
      } = getPathStyles(100, 0, railColor, "rail");
      const {
        pathString: fillPathString,
        pathStyle: fillPathStyle
      } = getPathStyles(percentage, offsetDegree, fillColor, "fill");
      const viewBoxSize = 100 + strokeWidth;
      return openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${clsPrefix}-progress-content`),
        role: "none"
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${clsPrefix}-progress-graph`),
        "aria-hidden": true
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${clsPrefix}-progress-graph-circle`),
        style: normalizeStyle({
          transform: gapOffsetDegree ? `rotate(${gapOffsetDegree}deg)` : void 0
        })
      }, [(openBlock(), createElementBlock("svg", {
        viewBox: `0 0 ${viewBoxSize} ${viewBoxSize}`
      }, [normalizeVNode(() => createGradientNode()), createElementVNode("g", null, [createElementVNode("path", {
        class: normalizeClass$1(`${clsPrefix}-progress-graph-circle-rail`),
        d: railPathString,
        "stroke-width": strokeWidth,
        "stroke-linecap": "round",
        fill: "none",
        style: normalizeStyle(railPathStyle)
      }, null, 14, _hoisted_5)]), createElementVNode("g", null, [createElementVNode("path", {
        class: normalizeClass$1([`${clsPrefix}-progress-graph-circle-fill`, percentage === 0 && `${clsPrefix}-progress-graph-circle-fill--empty`]),
        d: fillPathString,
        "stroke-width": strokeWidth,
        "stroke-linecap": "round",
        fill: "none",
        style: normalizeStyle(fillPathStyle)
      }, null, 14, _hoisted_6)])], 8, _hoisted_4))], 6)], 2), showIndicator ? (openBlock(), createElementBlock("div", {
        key: 0
      }, [slots.default ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass$1(`${clsPrefix}-progress-custom-content`),
        role: "none"
      }, [normalizeVNode(() => slots.default())], 2)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [status !== "default" ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass$1(`${clsPrefix}-progress-icon`),
        "aria-hidden": true
      }, [(openBlock(), createBlock(Icon_default, {
        clsPrefix
      }, {
        default: () => iconMap[status]
      }, 1032, ["clsPrefix"]))], 2)) : (openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass$1(`${clsPrefix}-progress-text`),
        style: normalizeStyle({
          color: indicatorTextColor
        }),
        role: "none"
      }, [createElementVNode("span", {
        class: normalizeClass$1(`${clsPrefix}-progress-text__percentage`)
      }, [normalizeVNode(() => percentage)], 2), createElementVNode("span", {
        class: normalizeClass$1(`${clsPrefix}-progress-text__unit`)
      }, [normalizeVNode(() => unit)], 2)], 6))], 64))])) : normalizeVNode(() => null)], 2);
    };
  }
});
//#endregion
export { Circle_default as default };