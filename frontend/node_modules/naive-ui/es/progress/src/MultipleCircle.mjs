import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { computed, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/progress/src/MultipleCircle.tsx
const _hoisted_1 = ["id"];
const _hoisted_2 = ["stop-color"];
const _hoisted_3 = ["stop-color"];
const _hoisted_4 = ["d", "stroke-width"];
const _hoisted_5 = ["d", "stroke-width"];
const _hoisted_6 = ["viewBox"];
function circlePath(r, sw, vw = 100) {
  return `m ${vw / 2} ${vw / 2 - r} a ${r} ${r} 0 1 1 0 ${2 * r} a ${r} ${r} 0 1 1 0 -${2 * r}`;
}
var MultipleCircle_default = defineComponent({
  name: "ProgressMultipleCircle",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    viewBoxWidth: {
      type: Number,
      required: true
    },
    percentage: {
      type: Array,
      default: [0]
    },
    strokeWidth: {
      type: Number,
      required: true
    },
    circleGap: {
      type: Number,
      required: true
    },
    showIndicator: {
      type: Boolean,
      required: true
    },
    fillColor: {
      type: Array,
      default: () => []
    },
    railColor: {
      type: Array,
      default: () => []
    },
    railStyle: {
      type: Array,
      default: () => []
    }
  },
  setup(props, {
    slots
  }) {
    const strokeDasharrayRef = computed(() => {
      return props.percentage.map((v, i) => `${Math.PI * v / 100 * (props.viewBoxWidth / 2 - props.strokeWidth / 2 * (1 + 2 * i) - props.circleGap * i) * 2}, ${props.viewBoxWidth * 8}`);
    });
    const createGradientNode = (p, index) => {
      const item = props.fillColor[index];
      const form = typeof item === "object" ? item.stops[0] : "";
      const to = typeof item === "object" ? item.stops[1] : "";
      return typeof props.fillColor[index] === "object" && (openBlock(), createElementBlock("linearGradient", {
        id: `gradient-${index}`,
        x1: "100%",
        y1: "0%",
        x2: "0%",
        y2: "100%"
      }, [createElementVNode("stop", {
        offset: "0%",
        "stop-color": form
      }, null, 8, _hoisted_2), createElementVNode("stop", {
        offset: "100%",
        "stop-color": to
      }, null, 8, _hoisted_3)], 8, _hoisted_1));
    };
    return () => {
      const {
        viewBoxWidth,
        strokeWidth,
        circleGap,
        showIndicator,
        fillColor,
        railColor,
        railStyle,
        percentage,
        clsPrefix
      } = props;
      return openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${clsPrefix}-progress-content`),
        role: "none"
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${clsPrefix}-progress-graph`),
        "aria-hidden": true
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${clsPrefix}-progress-graph-circle`)
      }, [(openBlock(), createElementBlock("svg", {
        viewBox: `0 0 ${viewBoxWidth} ${viewBoxWidth}`
      }, [createElementVNode("defs", null, [normalizeVNode(() => percentage.map((p, index) => {
        return createGradientNode(p, index);
      }))]), normalizeVNode(() => percentage.map((p, index) => {
        return openBlock(), createElementBlock("g", {
          key: index
        }, [createElementVNode("path", {
          class: normalizeClass$1(`${clsPrefix}-progress-graph-circle-rail`),
          d: circlePath(viewBoxWidth / 2 - strokeWidth / 2 * (1 + 2 * index) - circleGap * index, strokeWidth, viewBoxWidth),
          "stroke-width": strokeWidth,
          "stroke-linecap": "round",
          fill: "none",
          style: normalizeStyle([{
            strokeDashoffset: 0,
            stroke: railColor[index]
          }, railStyle[index]])
        }, null, 14, _hoisted_4), createElementVNode("path", {
          class: normalizeClass$1([`${clsPrefix}-progress-graph-circle-fill`, p === 0 && `${clsPrefix}-progress-graph-circle-fill--empty`]),
          d: circlePath(viewBoxWidth / 2 - strokeWidth / 2 * (1 + 2 * index) - circleGap * index, strokeWidth, viewBoxWidth),
          "stroke-width": strokeWidth,
          "stroke-linecap": "round",
          fill: "none",
          style: normalizeStyle({
            strokeDasharray: strokeDasharrayRef.value[index],
            strokeDashoffset: 0,
            stroke: typeof fillColor[index] === "object" ? `url(#gradient-${index})` : fillColor[index]
          })
        }, null, 14, _hoisted_5)]);
      }))], 8, _hoisted_6))], 2)], 2), showIndicator && slots.default ? (openBlock(), createElementBlock("div", {
        key: 0
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${clsPrefix}-progress-text`)
      }, [normalizeVNode(() => slots.default())], 2)])) : normalizeVNode(() => null)], 2);
    };
  }
});
//#endregion
export { MultipleCircle_default as default };