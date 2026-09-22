import useStyle from "../../../_mixins/use-style.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import IconSwitchTransition_default from "../../icon-switch-transition/src/IconSwitchTransition.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { createElementBlock, createElementVNode, createVNode, defineComponent, normalizeStyle, openBlock, toRef } from "vue";
//#region src/_internal/loading/src/Loading.tsx
const _hoisted_1 = ["viewBox"];
const _hoisted_2 = ["values", "dur"];
const _hoisted_3 = ["stroke-width", "cx", "cy", "r", "stroke-dasharray", "stroke-dashoffset"];
const _hoisted_4 = ["values", "dur"];
const _hoisted_5 = ["values", "dur"];
const duration = "1.6s";
const exposedLoadingProps = {
  strokeWidth: {
    type: Number,
    default: 28
  },
  stroke: {
    type: String,
    default: void 0
  },
  scale: {
    type: Number,
    default: 1
  },
  radius: {
    type: Number,
    default: 100
  }
};
var Loading_default = defineComponent({
  name: "BaseLoading",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    show: {
      type: Boolean,
      default: true
    },
    ...exposedLoadingProps
  },
  setup(props) {
    useStyle("-base-loading", index_cssr_default, toRef(props, "clsPrefix"));
  },
  render() {
    const {
      clsPrefix,
      radius,
      strokeWidth,
      stroke,
      scale
    } = this;
    const scaledRadius = radius / scale;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${clsPrefix}-base-loading`),
      role: "img",
      "aria-label": "loading"
    }, [createVNode(IconSwitchTransition_default, null, {
      default: () => this.show ? (openBlock(), createElementBlock("div", {
        key: "icon",
        class: normalizeClass$1(`${clsPrefix}-base-loading__transition-wrapper`)
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${clsPrefix}-base-loading__container`)
      }, [(openBlock(), createElementBlock("svg", {
        class: normalizeClass$1(`${clsPrefix}-base-loading__icon`),
        viewBox: `0 0 ${2 * scaledRadius} ${2 * scaledRadius}`,
        xmlns: "http://www.w3.org/2000/svg",
        style: normalizeStyle({
          color: stroke
        })
      }, [createElementVNode("g", null, [createElementVNode("animateTransform", {
        attributeName: "transform",
        type: "rotate",
        values: `0 ${scaledRadius} ${scaledRadius};270 ${scaledRadius} ${scaledRadius}`,
        begin: "0s",
        dur: duration,
        fill: "freeze",
        repeatCount: "indefinite"
      }, null, 8, _hoisted_2), createElementVNode("circle", {
        class: normalizeClass$1(`${clsPrefix}-base-loading__icon`),
        fill: "none",
        stroke: "currentColor",
        "stroke-width": strokeWidth,
        "stroke-linecap": "round",
        cx: scaledRadius,
        cy: scaledRadius,
        r: radius - strokeWidth / 2,
        "stroke-dasharray": 5.67 * radius,
        "stroke-dashoffset": 18.48 * radius
      }, [createElementVNode("animateTransform", {
        attributeName: "transform",
        type: "rotate",
        values: `0 ${scaledRadius} ${scaledRadius};135 ${scaledRadius} ${scaledRadius};450 ${scaledRadius} ${scaledRadius}`,
        begin: "0s",
        dur: duration,
        fill: "freeze",
        repeatCount: "indefinite"
      }, null, 8, _hoisted_4), createElementVNode("animate", {
        attributeName: "stroke-dashoffset",
        values: `${5.67 * radius};${1.42 * radius};${5.67 * radius}`,
        begin: "0s",
        dur: duration,
        fill: "freeze",
        repeatCount: "indefinite"
      }, null, 8, _hoisted_5)], 10, _hoisted_3)])], 14, _hoisted_1))], 2)], 2)) : (openBlock(), createElementBlock("div", {
        key: "placeholder",
        class: normalizeClass$1(`${clsPrefix}-base-loading__placeholder`)
      }, [normalizeVNode(() => this.$slots.default?.())], 2))
    }, 1024)], 2);
  }
});
//#endregion
export { Loading_default as default, exposedLoadingProps };