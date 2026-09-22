import { createKey } from "../../_utils/cssr/index.mjs";
import { warn } from "../../_utils/naive/warn.mjs";
import { flatten } from "../../_utils/vue/flatten.mjs";
import { getSlot } from "../../_utils/vue/get-slot.mjs";
import { getVNodeChildren } from "../../_utils/vue/get-v-node-children.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import descriptionsLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { isDescriptionsItem } from "./utils.mjs";
import { repeat } from "seemly";
import { computed, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock } from "vue";
import { useCompitable } from "vooks";
//#region src/descriptions/src/Descriptions.tsx
const _hoisted_1 = ["colspan"];
const _hoisted_2 = ["colspan"];
const _hoisted_3 = ["colspan"];
const _hoisted_4 = ["colspan"];
const descriptionsProps = {
  ...useTheme.props,
  title: String,
  column: {
    type: Number,
    default: 3
  },
  columns: Number,
  labelPlacement: {
    type: String,
    default: "top"
  },
  labelAlign: {
    type: String,
    default: "left"
  },
  separator: {
    type: String,
    default: ":"
  },
  size: String,
  bordered: Boolean,
  labelClass: String,
  labelStyle: [Object, String],
  contentClass: String,
  contentStyle: [Object, String]
};
var Descriptions_default = defineComponent({
  name: "Descriptions",
  props: descriptionsProps,
  slots: Object,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedComponentPropsRef
    } = useConfig(props);
    const mergedSizeRef = computed(() => {
      return props.size || mergedComponentPropsRef?.value?.Descriptions?.size || "medium";
    });
    const themeRef = useTheme("Descriptions", "-descriptions", index_cssr_default, descriptionsLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        bordered
      } = props;
      const mergedSize = mergedSizeRef.value;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          titleTextColor,
          thColor,
          thColorModal,
          thColorPopover,
          thTextColor,
          thFontWeight,
          tdTextColor,
          tdColor,
          tdColorModal,
          tdColorPopover,
          borderColor,
          borderColorModal,
          borderColorPopover,
          borderRadius,
          lineHeight,
          [createKey("fontSize", mergedSize)]: fontSize,
          [createKey(bordered ? "thPaddingBordered" : "thPadding", mergedSize)]: thPadding,
          [createKey(bordered ? "tdPaddingBordered" : "tdPadding", mergedSize)]: tdPadding
        }
      } = themeRef.value;
      return {
        "--n-title-text-color": titleTextColor,
        "--n-th-padding": thPadding,
        "--n-td-padding": tdPadding,
        "--n-font-size": fontSize,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-th-font-weight": thFontWeight,
        "--n-line-height": lineHeight,
        "--n-th-text-color": thTextColor,
        "--n-td-text-color": tdTextColor,
        "--n-th-color": thColor,
        "--n-th-color-modal": thColorModal,
        "--n-th-color-popover": thColorPopover,
        "--n-td-color": tdColor,
        "--n-td-color-modal": tdColorModal,
        "--n-td-color-popover": tdColorPopover,
        "--n-border-radius": borderRadius,
        "--n-border-color": borderColor,
        "--n-border-color-modal": borderColorModal,
        "--n-border-color-popover": borderColorPopover
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("descriptions", computed(() => {
      let hash = "";
      const {
        bordered
      } = props;
      if (bordered) hash += "a";
      hash += mergedSizeRef.value[0];
      return hash;
    }), cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender,
      compitableColumn: useCompitable(props, ["columns", "column"]),
      inlineThemeDisabled,
      mergedSize: mergedSizeRef
    };
  },
  render() {
    const defaultSlots = this.$slots.default;
    const children = defaultSlots ? flatten(defaultSlots()) : [];
    const memorizedLength = children.length;
    const {
      contentClass,
      labelClass,
      compitableColumn,
      labelPlacement,
      labelAlign,
      mergedSize,
      bordered,
      title,
      cssVars,
      mergedClsPrefix,
      separator,
      onRender
    } = this;
    onRender?.();
    const filteredChildren = children.filter(child => isDescriptionsItem(child));
    if (process.env.NODE_ENV !== "production" && memorizedLength !== filteredChildren.length) warn("descriptions", "`n-descriptions` only takes `n-descriptions-item` as children.");
    const rows = filteredChildren.reduce((state, vNode, index) => {
      const props = vNode.props || {};
      const isLastIteration = filteredChildren.length - 1 === index;
      const itemLabel = ["label" in props ? props.label : getVNodeChildren(vNode, "label")];
      const itemChildren = [getVNodeChildren(vNode)];
      const itemSpan = props.span || 1;
      const memorizedSpan = state.span;
      state.span += itemSpan;
      const labelStyle = props.labelStyle || props["label-style"] || this.labelStyle;
      const contentStyle = props.contentStyle || props["content-style"] || this.contentStyle;
      if (labelPlacement === "left") {
        if (bordered) state.row.push((openBlock(), createElementBlock("th", {
          key: 1,
          class: normalizeClass$1([`${mergedClsPrefix}-descriptions-table-header`, labelClass]),
          colspan: 1,
          style: normalizeStyle(labelStyle)
        }, [normalizeVNode(() => itemLabel)], 6)), (openBlock(), createElementBlock("td", {
          key: 2,
          class: normalizeClass$1([`${mergedClsPrefix}-descriptions-table-content`, contentClass]),
          colspan: isLastIteration ? (compitableColumn - memorizedSpan) * 2 + 1 : itemSpan * 2 - 1,
          style: normalizeStyle(contentStyle)
        }, [normalizeVNode(() => itemChildren)], 14, _hoisted_1)));else state.row.push((openBlock(), createElementBlock("td", {
          key: 3,
          class: normalizeClass$1(`${mergedClsPrefix}-descriptions-table-content`),
          colspan: isLastIteration ? (compitableColumn - memorizedSpan) * 2 : itemSpan * 2
        }, [createElementVNode("span", {
          class: normalizeClass$1([`${mergedClsPrefix}-descriptions-table-content__label`, labelClass]),
          style: normalizeStyle(labelStyle)
        }, [normalizeVNode(() => [...itemLabel, separator && (openBlock(), createElementBlock("span", {
          key: 4,
          class: normalizeClass$1(`${mergedClsPrefix}-descriptions-separator`)
        }, [normalizeVNode(() => separator)], 2))])], 6), createElementVNode("span", {
          class: normalizeClass$1([`${mergedClsPrefix}-descriptions-table-content__content`, contentClass]),
          style: normalizeStyle(contentStyle)
        }, [normalizeVNode(() => itemChildren)], 6)], 10, _hoisted_2)));
      } else {
        const colspan = isLastIteration ? (compitableColumn - memorizedSpan) * 2 : itemSpan * 2;
        state.row.push((openBlock(), createElementBlock("th", {
          key: 5,
          class: normalizeClass$1([`${mergedClsPrefix}-descriptions-table-header`, labelClass]),
          colspan,
          style: normalizeStyle(labelStyle)
        }, [normalizeVNode(() => itemLabel)], 14, _hoisted_3)));
        state.secondRow.push((openBlock(), createElementBlock("td", {
          key: 6,
          class: normalizeClass$1([`${mergedClsPrefix}-descriptions-table-content`, contentClass]),
          colspan,
          style: normalizeStyle(contentStyle)
        }, [normalizeVNode(() => itemChildren)], 14, _hoisted_4)));
      }
      if (state.span >= compitableColumn || isLastIteration) {
        state.span = 0;
        if (state.row.length) {
          state.rows.push(state.row);
          state.row = [];
        }
        if (labelPlacement !== "left") {
          if (state.secondRow.length) {
            state.rows.push(state.secondRow);
            state.secondRow = [];
          }
        }
      }
      return state;
    }, {
      span: 0,
      row: [],
      secondRow: [],
      rows: []
    }).rows.map(row => (openBlock(), createElementBlock("tr", {
      class: normalizeClass$1(`${mergedClsPrefix}-descriptions-table-row`)
    }, [normalizeVNode(() => row)], 2)));
    return openBlock(), createElementBlock("div", {
      style: normalizeStyle(cssVars),
      class: normalizeClass$1([`${mergedClsPrefix}-descriptions`, this.themeClass, `${mergedClsPrefix}-descriptions--${labelPlacement}-label-placement`, `${mergedClsPrefix}-descriptions--${labelAlign}-label-align`, `${mergedClsPrefix}-descriptions--${mergedSize}-size`, bordered && `${mergedClsPrefix}-descriptions--bordered`])
    }, [title || this.$slots.header ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-descriptions-header`)
    }, [normalizeVNode(() => title || getSlot(this, "header"))], 2)) : normalizeVNode(() => null), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-descriptions-table-wrapper`)
    }, [createElementVNode("table", {
      class: normalizeClass$1(`${mergedClsPrefix}-descriptions-table`)
    }, [createElementVNode("tbody", null, [normalizeVNode(() => labelPlacement === "top" && (openBlock(), createElementBlock("tr", {
      class: normalizeClass$1(`${mergedClsPrefix}-descriptions-table-row`),
      style: {
        visibility: "collapse"
      }
    }, [normalizeVNode(() => repeat(compitableColumn * 2, (openBlock(), createElementBlock("td"))))], 2))), normalizeVNode(() => rows)])], 2)], 2)], 6);
  }
});
//#endregion
export { Descriptions_default as default, descriptionsProps };