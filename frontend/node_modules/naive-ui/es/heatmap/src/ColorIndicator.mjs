import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/heatmap/src/ColorIndicator.tsx
var ColorIndicator_default = defineComponent({
  name: "HeatmapColorIndicator",
  slots: Object,
  props: {
    colors: {
      type: Array,
      required: true
    },
    clsPrefix: {
      type: String,
      required: true
    }
  },
  setup(props, {
    slots
  }) {
    return () => {
      const {
        colors,
        clsPrefix
      } = props;
      return openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${clsPrefix}-heatmap-color-indicator`)
      }, [createElementVNode("span", {
        class: normalizeClass$1(`${clsPrefix}-heatmap-color-indicator__label`)
      }, [normalizeVNode(() => slots["leading-text"]?.())], 2), createElementVNode("div", {
        class: normalizeClass$1(`${clsPrefix}-heatmap-color-indicator__cells`)
      }, [normalizeVNode(() => colors.map((color, index) => (openBlock(), createElementBlock("div", {
        key: index,
        class: normalizeClass$1(`${clsPrefix}-heatmap-color-indicator__cell`),
        style: normalizeStyle({
          backgroundColor: color
        })
      }, null, 6))))], 2), createElementVNode("span", {
        class: normalizeClass$1(`${clsPrefix}-heatmap-color-indicator__label`)
      }, [normalizeVNode(() => slots["trailing-text"]?.())], 2)], 2);
    };
  }
});
//#endregion
export { ColorIndicator_default as default };