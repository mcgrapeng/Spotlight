import { keysOf } from "../../_utils/vue/keysOf.mjs";
import { normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { gridInjectionKey } from "./config.mjs";
import { pxfy } from "seemly";
import { computed, createElementBlock, defineComponent, getCurrentInstance, inject, normalizeStyle, openBlock } from "vue";
//#region src/grid/src/GridItem.tsx
const defaultSpan = 1;
const gridItemProps = {
  span: {
    type: [Number, String],
    default: 1
  },
  offset: {
    type: [Number, String],
    default: 0
  },
  suffix: Boolean,
  privateOffset: Number,
  privateSpan: Number,
  privateColStart: Number,
  privateShow: {
    type: Boolean,
    default: true
  }
};
const gridItemPropKeys = keysOf(gridItemProps);
var GridItem_default = defineComponent({
  __GRID_ITEM__: true,
  name: "GridItem",
  alias: ["Gi"],
  props: gridItemProps,
  setup() {
    const {
      isSsrRef,
      xGapRef,
      itemStyleRef,
      overflowRef,
      layoutShiftDisabledRef
    } = inject(gridInjectionKey);
    const self = getCurrentInstance();
    return {
      overflow: overflowRef,
      itemStyle: itemStyleRef,
      layoutShiftDisabled: layoutShiftDisabledRef,
      mergedXGap: computed(() => {
        return pxfy(xGapRef.value || 0);
      }),
      deriveStyle: () => {
        isSsrRef.value;
        const {
          privateSpan = 1,
          privateShow = true,
          privateColStart = void 0,
          privateOffset = 0
        } = self.vnode.props;
        const {
          value: xGap
        } = xGapRef;
        const mergedXGap = pxfy(xGap || 0);
        return {
          display: !privateShow ? "none" : "",
          gridColumn: `${privateColStart ?? `span ${privateSpan}`} / span ${privateSpan}`,
          marginLeft: privateOffset ? `calc((100% - (${privateSpan} - 1) * ${mergedXGap}) / ${privateSpan} * ${privateOffset} + ${mergedXGap} * ${privateOffset})` : ""
        };
      }
    };
  },
  render() {
    if (this.layoutShiftDisabled) {
      const {
        span,
        offset,
        mergedXGap
      } = this;
      return openBlock(), createElementBlock("div", {
        key: 1,
        style: normalizeStyle({
          gridColumn: `span ${span} / span ${span}`,
          marginLeft: offset ? `calc((100% - (${span} - 1) * ${mergedXGap}) / ${span} * ${offset} + ${mergedXGap} * ${offset})` : ""
        })
      }, [normalizeVNode(() => this.$slots.default?.())], 4);
    }
    return openBlock(), createElementBlock("div", {
      style: normalizeStyle([this.itemStyle, this.deriveStyle()])
    }, [normalizeVNode(() => this.$slots.default?.({
      overflow: this.overflow
    }))], 4);
  }
});
//#endregion
export { GridItem_default as default, defaultSpan, gridItemPropKeys, gridItemProps };