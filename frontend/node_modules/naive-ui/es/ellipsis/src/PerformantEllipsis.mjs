import { useMergedClsPrefix } from "../../_mixins/use-config.mjs";
import useStyle from "../../_mixins/use-style.mjs";
import { createVNodeCache, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import Ellipsis_default, { createCursorClass, createLineClampClass, ellipsisProps } from "./Ellipsis.mjs";
import { Fragment, createElementBlock, defineComponent, h, mergeProps, openBlock, ref } from "vue";
//#region src/ellipsis/src/PerformantEllipsis.tsx
const NPerformantEllipsis = defineComponent({
  name: "PerformantEllipsis",
  props: ellipsisProps,
  inheritAttrs: false,
  setup(props, {
    attrs,
    slots
  }) {
    const mouseEnteredRef = ref(false);
    const mergedClsPrefixRef = useMergedClsPrefix();
    useStyle("-ellipsis", index_cssr_default, mergedClsPrefixRef);
    const renderTrigger = () => {
      const {
        lineClamp
      } = props;
      const mergedClsPrefix = mergedClsPrefixRef.value;
      return (() => {
        const _cache = createVNodeCache("dba02f32d69b23e6");
        return openBlock(), createElementBlock("span", mergeProps(mergeProps(attrs, {
          class: [`${mergedClsPrefix}-ellipsis`, lineClamp !== void 0 ? createLineClampClass(mergedClsPrefix) : void 0, props.expandTrigger === "click" ? createCursorClass(mergedClsPrefix, "pointer") : void 0],
          style: lineClamp === void 0 ? {
            textOverflow: "ellipsis"
          } : {
            "-webkit-line-clamp": lineClamp
          }
        }), {
          onMouseenter: _cache[0] || (_cache[0] = () => {
            mouseEnteredRef.value = true;
          })
        }), [lineClamp ? (openBlock(), createElementBlock(Fragment, {
          key: 0
        }, [normalizeVNode(() => slots.default?.())], 64)) : (openBlock(), createElementBlock("span", {
          key: 1
        }, [normalizeVNode(() => slots.default?.())]))], 16);
      })();
    };
    return {
      mouseEntered: mouseEnteredRef,
      renderTrigger
    };
  },
  render() {
    if (this.mouseEntered) return h(Ellipsis_default, mergeProps({}, this.$attrs, this.$props), this.$slots);else return this.renderTrigger();
  }
});
//#endregion
export { NPerformantEllipsis };