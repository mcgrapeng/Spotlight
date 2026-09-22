import { formatLength } from "../../_utils/css/format-length.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Error_default from "../../_internal/icons/Error.mjs";
import Info_default from "../../_internal/icons/Info.mjs";
import Success_default from "../../_internal/icons/Success.mjs";
import Warning_default from "../../_internal/icons/Warning.mjs";
import { Fragment, computed, createBlock, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/progress/src/Line.tsx
const iconMap = {
  success: (openBlock(), createBlock(Success_default)),
  error: (openBlock(), createBlock(Error_default)),
  warning: (openBlock(), createBlock(Warning_default)),
  info: (openBlock(), createBlock(Info_default))
};
var Line_default = defineComponent({
  name: "ProgressLine",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    percentage: {
      type: Number,
      default: 0
    },
    railColor: String,
    railStyle: [String, Object],
    fillColor: [String, Object],
    status: {
      type: String,
      required: true
    },
    indicatorPlacement: {
      type: String,
      required: true
    },
    indicatorTextColor: String,
    unit: {
      type: String,
      default: "%"
    },
    processing: {
      type: Boolean,
      required: true
    },
    showIndicator: {
      type: Boolean,
      required: true
    },
    height: [String, Number],
    railBorderRadius: [String, Number],
    fillBorderRadius: [String, Number]
  },
  setup(props, {
    slots
  }) {
    const styleHeightRef = computed(() => {
      return formatLength(props.height);
    });
    const styleFillColorRef = computed(() => {
      return typeof props.fillColor === "object" ? `linear-gradient(to right, ${props.fillColor?.stops[0]} , ${props.fillColor?.stops[1]})` : props.fillColor;
    });
    const styleRailBorderRadiusRef = computed(() => {
      if (props.railBorderRadius !== void 0) return formatLength(props.railBorderRadius);
      if (props.height !== void 0) return formatLength(props.height, {
        c: .5
      });
      return "";
    });
    const styleFillBorderRadiusRef = computed(() => {
      if (props.fillBorderRadius !== void 0) return formatLength(props.fillBorderRadius);
      if (props.railBorderRadius !== void 0) return formatLength(props.railBorderRadius);
      if (props.height !== void 0) return formatLength(props.height, {
        c: .5
      });
      return "";
    });
    return () => {
      const {
        indicatorPlacement,
        railColor,
        railStyle,
        percentage,
        unit,
        indicatorTextColor,
        status,
        showIndicator,
        processing,
        clsPrefix
      } = props;
      return openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${clsPrefix}-progress-content`),
        role: "none"
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${clsPrefix}-progress-graph`),
        "aria-hidden": true
      }, [createElementVNode("div", {
        class: normalizeClass$1([`${clsPrefix}-progress-graph-line`, {
          [`${clsPrefix}-progress-graph-line--indicator-${indicatorPlacement}`]: true
        }])
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${clsPrefix}-progress-graph-line-rail`),
        style: normalizeStyle([{
          backgroundColor: railColor,
          height: styleHeightRef.value,
          borderRadius: styleRailBorderRadiusRef.value
        }, railStyle])
      }, [createElementVNode("div", {
        class: normalizeClass$1([`${clsPrefix}-progress-graph-line-fill`, processing && `${clsPrefix}-progress-graph-line-fill--processing`]),
        style: normalizeStyle({
          maxWidth: `${props.percentage}%`,
          background: styleFillColorRef.value,
          height: styleHeightRef.value,
          lineHeight: styleHeightRef.value,
          borderRadius: styleFillBorderRadiusRef.value
        })
      }, [indicatorPlacement === "inside" ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass$1(`${clsPrefix}-progress-graph-line-indicator`),
        style: normalizeStyle({
          color: indicatorTextColor
        })
      }, [slots.default ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => slots.default())], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => `${percentage}${unit}`)], 64))], 6)) : normalizeVNode(() => null)], 6)], 6)], 2)], 2), showIndicator && indicatorPlacement === "outside" ? (openBlock(), createElementBlock("div", {
        key: 0
      }, [slots.default ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass$1(`${clsPrefix}-progress-custom-content`),
        style: normalizeStyle({
          color: indicatorTextColor
        }),
        role: "none"
      }, [normalizeVNode(() => slots.default())], 6)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [status === "default" ? (openBlock(), createElementBlock("div", {
        key: 0,
        role: "none",
        class: normalizeClass$1(`${clsPrefix}-progress-icon ${clsPrefix}-progress-icon--as-text`),
        style: normalizeStyle({
          color: indicatorTextColor
        })
      }, [normalizeVNode(() => percentage), normalizeVNode(() => unit)], 6)) : (openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass$1(`${clsPrefix}-progress-icon`),
        "aria-hidden": true
      }, [(openBlock(), createBlock(Icon_default, {
        clsPrefix
      }, {
        default: () => iconMap[status]
      }, 1032, ["clsPrefix"]))], 2))], 64))])) : normalizeVNode(() => null)], 2);
    };
  }
});
//#endregion
export { Line_default as default };