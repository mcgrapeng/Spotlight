import { createKey } from "../../_utils/cssr/index.mjs";
import { flatten } from "../../_utils/vue/flatten.mjs";
import { getSlot } from "../../_utils/vue/get-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import flexLight from "../styles/light.mjs";
import { depx, getGap } from "seemly";
import { computed, createElementBlock, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/flex/src/Flex.tsx
const flexProps = {
  ...useTheme.props,
  align: String,
  justify: {
    type: String,
    default: "start"
  },
  inline: Boolean,
  vertical: Boolean,
  reverse: Boolean,
  size: {
    type: [String, Number, Array],
    default: "medium"
  },
  wrap: {
    type: Boolean,
    default: true
  }
};
var Flex_default = defineComponent({
  name: "Flex",
  props: flexProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      mergedRtlRef
    } = useConfig(props);
    const themeRef = useTheme("Flex", "-flex", void 0, flexLight, props, mergedClsPrefixRef);
    return {
      rtlEnabled: useRtl("Flex", mergedRtlRef, mergedClsPrefixRef),
      mergedClsPrefix: mergedClsPrefixRef,
      margin: computed(() => {
        const {
          size
        } = props;
        if (Array.isArray(size)) return {
          horizontal: size[0],
          vertical: size[1]
        };
        if (typeof size === "number") return {
          horizontal: size,
          vertical: size
        };
        const {
          self: {
            [createKey("gap", size)]: gap
          }
        } = themeRef.value;
        const {
          row,
          col
        } = getGap(gap);
        return {
          horizontal: depx(col),
          vertical: depx(row)
        };
      })
    };
  },
  render() {
    const {
      vertical,
      reverse,
      align,
      inline,
      justify,
      margin,
      wrap,
      mergedClsPrefix,
      rtlEnabled
    } = this;
    const children = flatten(getSlot(this), false);
    if (!children.length) return null;
    return openBlock(), createElementBlock("div", {
      role: "none",
      class: normalizeClass$1([`${mergedClsPrefix}-flex`, rtlEnabled && `${mergedClsPrefix}-flex--rtl`]),
      style: normalizeStyle({
        display: inline ? "inline-flex" : "flex",
        flexDirection: (() => {
          if (vertical && !reverse) return "column";
          if (vertical && reverse) return "column-reverse";
          if (!vertical && reverse) return "row-reverse";else return "row";
        })(),
        justifyContent: justify,
        flexWrap: !wrap || vertical ? "nowrap" : "wrap",
        alignItems: align,
        gap: `${margin.vertical}px ${margin.horizontal}px`
      })
    }, [normalizeVNode(() => children)], 6);
  }
});
//#endregion
export { Flex_default as default, flexProps };