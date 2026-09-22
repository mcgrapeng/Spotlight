import { formatLength } from "../../_utils/css/format-length.mjs";
import { throwError } from "../../_utils/naive/warn.mjs";
import { keysOf } from "../../_utils/vue/keysOf.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { rowInjectionKey } from "./Row.mjs";
import { Fragment, computed, createElementBlock, defineComponent, inject, normalizeStyle, openBlock } from "vue";
//#region src/legacy-grid/src/Col.tsx
const colProps = {
  span: {
    type: [String, Number],
    default: 1
  },
  push: {
    type: [String, Number],
    default: 0
  },
  pull: {
    type: [String, Number],
    default: 0
  },
  offset: {
    type: [String, Number],
    default: 0
  }
};
const colPropKeys = keysOf(colProps);
var Col_default = defineComponent({
  name: "Col",
  props: colProps,
  setup(props) {
    const NRow = inject(rowInjectionKey, null);
    if (!NRow) throwError("col", "`n-col` must be placed inside `n-row`.");
    return {
      mergedClsPrefix: NRow.mergedClsPrefixRef,
      gutter: NRow.gutterRef,
      stylePadding: computed(() => `${formatLength(NRow.verticalGutterRef.value, {
        c: .5
      })} ${formatLength(NRow.horizontalGutterRef.value, {
        c: .5
      })}`),
      mergedPush: computed(() => Number(props.push) - Number(props.pull))
    };
  },
  render() {
    const {
      $slots,
      span,
      mergedPush,
      offset,
      stylePadding,
      gutter,
      mergedClsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-col`, {
        [`${mergedClsPrefix}-col--${span}-span`]: true,
        [`${mergedClsPrefix}-col--${mergedPush}-push`]: mergedPush > 0,
        [`${mergedClsPrefix}-col--${-mergedPush}-pull`]: mergedPush < 0,
        [`${mergedClsPrefix}-col--${offset}-offset`]: offset
      }]),
      style: normalizeStyle({
        padding: stylePadding
      })
    }, [gutter ? (openBlock(), createElementBlock("div", {
      key: 0
    }, [normalizeVNode(() => $slots.default?.())])) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => $slots.default?.())], 64))], 6);
  }
});
//#endregion
export { colPropKeys, colProps, Col_default as default };