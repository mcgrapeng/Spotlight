import { resolveSlotWithTypedProps } from "../../_utils/vue/resolve-slot.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Tooltip_default from "../../tooltip/src/Tooltip.mjs";
import { computed, createBlock, createElementBlock, defineComponent, mergeProps, normalizeStyle, openBlock } from "vue";
//#region src/heatmap/src/Rect.tsx
var Rect_default = defineComponent({
  name: "HeatmapRect",
  slots: Object,
  props: {
    mergedClsPrefix: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    style: Object,
    loading: Boolean,
    loadingClass: String,
    tooltip: {
      type: [Boolean, Object],
      default: true
    }
  },
  setup(props) {
    return {
      cssVars: computed(() => ({
        "--n-rect-color": props.color
      })),
      tooltipProps: computed(() => {
        return typeof props.tooltip === "object" ? props.tooltip : {};
      }),
      defaultTooltipContent: computed(() => {
        const date = new Date(props.data.timestamp).toLocaleDateString();
        return props.data.value !== null ? `${date} ${props.data.value}` : date;
      })
    };
  },
  render() {
    const {
      mergedClsPrefix,
      style,
      cssVars,
      tooltip,
      tooltipProps,
      defaultTooltipContent,
      loading,
      data
    } = this;
    const triggerNode = (openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-heatmap-rect`, loading && `${mergedClsPrefix}-heatmap-rect--loading`, loading && this.loadingClass]),
      style: normalizeStyle([cssVars, style])
    }, null, 6));
    return tooltip === false || loading ? triggerNode : (openBlock(), createBlock(Tooltip_default, mergeProps({
      key: 1,
      trigger: "hover"
    }, tooltipProps), {
      default: () => resolveSlotWithTypedProps(this.$slots.tooltip, data, () => [(openBlock(), createElementBlock("div", null, [normalizeVNode(() => defaultTooltipContent)]))]),
      trigger: () => triggerNode
    }, 1040));
  }
});
//#endregion
export { Rect_default as default };