import { useHoudini } from "../../_utils/composable/use-houdini.mjs";
import { formatLength } from "../../_utils/css/format-length.mjs";
import { createKey } from "../../_utils/cssr/index.mjs";
import { throwError } from "../../_utils/naive/warn.mjs";
import { resolveSlot, resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { timelineInjectionKey } from "./Timeline.mjs";
import { computed, createElementBlock, createElementVNode, defineComponent, inject, normalizeStyle, openBlock } from "vue";
//#region src/timeline/src/TimelineItem.tsx
const timelineItemProps = {
  time: [String, Number],
  title: String,
  content: String,
  color: String,
  lineType: {
    type: String,
    default: "default"
  },
  type: {
    type: String,
    default: "default"
  }
};
var TimelineItem_default = defineComponent({
  name: "TimelineItem",
  props: timelineItemProps,
  slots: Object,
  setup(props) {
    const NTimeline = inject(timelineInjectionKey);
    if (!NTimeline) throwError("timeline-item", "`n-timeline-item` must be placed inside `n-timeline`.");
    useHoudini();
    const {
      inlineThemeDisabled
    } = useConfig();
    const cssVarsRef = computed(() => {
      const {
        props: {
          size,
          iconSize: iconSizeProp
        },
        mergedThemeRef
      } = NTimeline;
      const {
        type
      } = props;
      const {
        self: {
          titleTextColor,
          contentTextColor,
          metaTextColor,
          lineColor,
          titleFontWeight,
          contentFontSize,
          [createKey("iconSize", size)]: iconSize,
          [createKey("titleMargin", size)]: titleMargin,
          [createKey("titleFontSize", size)]: titleFontSize,
          [createKey("circleBorder", type)]: circleBorder,
          [createKey("iconColor", type)]: iconColor
        },
        common: {
          cubicBezierEaseInOut
        }
      } = mergedThemeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-circle-border": circleBorder,
        "--n-icon-color": iconColor,
        "--n-content-font-size": contentFontSize,
        "--n-content-text-color": contentTextColor,
        "--n-line-color": lineColor,
        "--n-meta-text-color": metaTextColor,
        "--n-title-font-size": titleFontSize,
        "--n-title-font-weight": titleFontWeight,
        "--n-title-margin": titleMargin,
        "--n-title-text-color": titleTextColor,
        "--n-icon-size": formatLength(iconSizeProp) || iconSize
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("timeline-item", computed(() => {
      const {
        props: {
          size,
          iconSize: iconSizeProp
        }
      } = NTimeline;
      const {
        type
      } = props;
      return `${size[0]}${iconSizeProp || "a"}${type[0]}`;
    }), cssVarsRef, NTimeline.props) : void 0;
    return {
      mergedClsPrefix: NTimeline.mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedClsPrefix,
      color,
      onRender,
      $slots
    } = this;
    onRender?.();
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-timeline-item`, this.themeClass, `${mergedClsPrefix}-timeline-item--${this.type}-type`, `${mergedClsPrefix}-timeline-item--${this.lineType}-line-type`]),
      style: normalizeStyle(this.cssVars)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-timeline-item-timeline`)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-timeline-item-timeline__line`)
    }, null, 2), normalizeVNode(() => resolveWrappedSlot($slots.icon, children => {
      return children ? (openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass$1(`${mergedClsPrefix}-timeline-item-timeline__icon`),
        style: normalizeStyle({
          color
        })
      }, [normalizeVNode(() => children)], 6)) : (openBlock(), createElementBlock("div", {
        key: 2,
        class: normalizeClass$1(`${mergedClsPrefix}-timeline-item-timeline__circle`),
        style: normalizeStyle({
          borderColor: color
        })
      }, null, 6));
    }))], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-timeline-item-content`)
    }, [normalizeVNode(() => resolveWrappedSlot($slots.header, children => {
      if (children || this.title) return openBlock(), createElementBlock("div", {
        key: 3,
        class: normalizeClass$1(`${mergedClsPrefix}-timeline-item-content__title`)
      }, [normalizeVNode(() => children || this.title)], 2);
      return null;
    })), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-timeline-item-content__content`)
    }, [normalizeVNode(() => resolveSlot($slots.default, () => [this.content]))], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-timeline-item-content__meta`)
    }, [normalizeVNode(() => resolveSlot($slots.footer, () => [this.time]))], 2)], 2)], 6);
  }
});
//#endregion
export { TimelineItem_default as default, timelineItemProps };