import { createKey } from "../../_utils/cssr/index.mjs";
import { flatten } from "../../_utils/vue/flatten.mjs";
import { getSlot } from "../../_utils/vue/get-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import spaceLight from "../styles/light.mjs";
import { ensureSupportFlexGap } from "./utils.mjs";
import { depx, getGap } from "seemly";
import { Comment, Fragment, computed, createElementBlock, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/space/src/Space.tsx
const spaceProps = {
  ...useTheme.props,
  align: String,
  justify: {
    type: String,
    default: "start"
  },
  inline: Boolean,
  vertical: Boolean,
  reverse: Boolean,
  size: [String, Number, Array],
  wrapItem: {
    type: Boolean,
    default: true
  },
  itemClass: String,
  itemStyle: [String, Object],
  wrap: {
    type: Boolean,
    default: true
  },
  internalUseGap: {
    type: Boolean,
    default: void 0
  }
};
var Space_default = defineComponent({
  name: "Space",
  props: spaceProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      mergedRtlRef,
      mergedComponentPropsRef
    } = useConfig(props);
    const mergedSizeRef = computed(() => {
      return props.size ?? mergedComponentPropsRef?.value?.Space?.size ?? "medium";
    });
    const themeRef = useTheme("Space", "-space", void 0, spaceLight, props, mergedClsPrefixRef);
    const rtlEnabledRef = useRtl("Space", mergedRtlRef, mergedClsPrefixRef);
    return {
      useGap: ensureSupportFlexGap(),
      rtlEnabled: rtlEnabledRef,
      mergedClsPrefix: mergedClsPrefixRef,
      margin: computed(() => {
        const size = mergedSizeRef.value;
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
      itemClass,
      itemStyle,
      margin,
      wrap,
      mergedClsPrefix,
      rtlEnabled,
      useGap,
      wrapItem,
      internalUseGap
    } = this;
    const children = flatten(getSlot(this), false);
    if (!children.length) return null;
    const horizontalMargin = `${margin.horizontal}px`;
    const semiHorizontalMargin = `${margin.horizontal / 2}px`;
    const verticalMargin = `${margin.vertical}px`;
    const semiVerticalMargin = `${margin.vertical / 2}px`;
    const lastIndex = children.length - 1;
    const isJustifySpace = justify.startsWith("space-");
    return openBlock(), createElementBlock("div", {
      role: "none",
      class: normalizeClass$1([`${mergedClsPrefix}-space`, rtlEnabled && `${mergedClsPrefix}-space--rtl`]),
      style: normalizeStyle({
        display: inline ? "inline-flex" : "flex",
        flexDirection: (() => {
          if (vertical && !reverse) return "column";
          if (vertical && reverse) return "column-reverse";
          if (!vertical && reverse) return "row-reverse";else return "row";
        })(),
        justifyContent: ["start", "end"].includes(justify) ? `flex-${justify}` : justify,
        flexWrap: !wrap || vertical ? "nowrap" : "wrap",
        marginTop: useGap || vertical ? "" : `-${semiVerticalMargin}`,
        marginBottom: useGap || vertical ? "" : `-${semiVerticalMargin}`,
        alignItems: align,
        gap: useGap ? `${margin.vertical}px ${margin.horizontal}px` : ""
      })
    }, [!wrapItem && (useGap || internalUseGap) ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => children)], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => children.map((child, index) => child.type === Comment ? child : (openBlock(), createElementBlock("div", {
      key: 1,
      role: "none",
      class: normalizeClass$1(itemClass),
      style: normalizeStyle([itemStyle, {
        maxWidth: "100%"
      }, useGap ? "" : vertical ? {
        marginBottom: index !== lastIndex ? verticalMargin : ""
      } : rtlEnabled ? {
        marginLeft: isJustifySpace ? justify === "space-between" && index === lastIndex ? "" : semiHorizontalMargin : index !== lastIndex ? horizontalMargin : "",
        marginRight: isJustifySpace ? justify === "space-between" && index === 0 ? "" : semiHorizontalMargin : "",
        paddingTop: semiVerticalMargin,
        paddingBottom: semiVerticalMargin
      } : {
        marginRight: isJustifySpace ? justify === "space-between" && index === lastIndex ? "" : semiHorizontalMargin : index !== lastIndex ? horizontalMargin : "",
        marginLeft: isJustifySpace ? justify === "space-between" && index === 0 ? "" : semiHorizontalMargin : "",
        paddingTop: semiVerticalMargin,
        paddingBottom: semiVerticalMargin
      }])
    }, [normalizeVNode(() => child)], 6))))], 64))], 6);
  }
});
//#endregion
export { Space_default as default, spaceProps };