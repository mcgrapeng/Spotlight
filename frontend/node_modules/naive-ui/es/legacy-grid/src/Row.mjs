import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
import { formatLength } from "../../_utils/css/format-length.mjs";
import { keysOf } from "../../_utils/vue/keysOf.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useStyle from "../../_mixins/use-style.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { createElementBlock, defineComponent, normalizeStyle, openBlock, provide, toRef } from "vue";
import { useMemo } from "vooks";
//#region src/legacy-grid/src/Row.tsx
const rowInjectionKey = createInjectionKey("n-row");
const rowProps = {
  gutter: {
    type: [Array, Number, String],
    default: 0
  },
  alignItems: String,
  justifyContent: String
};
const rowPropKeys = keysOf(rowProps);
var Row_default = defineComponent({
  name: "Row",
  props: rowProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      mergedRtlRef
    } = useConfig(props);
    useStyle("-legacy-grid", index_cssr_default, mergedClsPrefixRef);
    const rtlEnabledRef = useRtl("Row", mergedRtlRef, mergedClsPrefixRef);
    const verticalGutterRef = useMemo(() => {
      const {
        gutter
      } = props;
      if (Array.isArray(gutter)) return gutter[1] || 0;
      return 0;
    });
    const horizontalGutterRef = useMemo(() => {
      const {
        gutter
      } = props;
      if (Array.isArray(gutter)) return gutter[0];
      return Number(gutter);
    });
    provide(rowInjectionKey, {
      mergedClsPrefixRef,
      gutterRef: toRef(props, "gutter"),
      verticalGutterRef,
      horizontalGutterRef
    });
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      rtlEnabled: rtlEnabledRef,
      styleMargin: useMemo(() => `-${formatLength(verticalGutterRef.value, {
        c: .5
      })} -${formatLength(horizontalGutterRef.value, {
        c: .5
      })}`),
      styleWidth: useMemo(() => `calc(100% + ${formatLength(horizontalGutterRef.value)})`)
    };
  },
  render() {
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${this.mergedClsPrefix}-row`, this.rtlEnabled && `${this.mergedClsPrefix}-row--rtl`]),
      style: normalizeStyle({
        margin: this.styleMargin,
        width: this.styleWidth,
        alignItems: this.alignItems,
        justifyContent: this.justifyContent
      })
    }, [normalizeVNode(() => this.$slots.default?.())], 6);
  }
});
//#endregion
export { Row_default as default, rowInjectionKey, rowPropKeys, rowProps };