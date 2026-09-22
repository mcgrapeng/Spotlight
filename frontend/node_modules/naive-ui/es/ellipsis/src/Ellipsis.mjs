import { useMergedClsPrefix } from "../../_mixins/use-config.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { createVNodeCache, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import ellipsisLight from "../styles/light.mjs";
import Tooltip_default from "../../tooltip/src/Tooltip.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { Fragment, computed, createBlock, createElementBlock, defineComponent, mergeProps, onDeactivated, openBlock, ref } from "vue";
//#region src/ellipsis/src/Ellipsis.tsx
const _hoisted_1 = ["onClick"];
function createLineClampClass(clsPrefix) {
  return `${clsPrefix}-ellipsis--line-clamp`;
}
function createCursorClass(clsPrefix, cursor) {
  return `${clsPrefix}-ellipsis--cursor-${cursor}`;
}
const ellipsisProps = {
  ...useTheme.props,
  expandTrigger: String,
  lineClamp: [Number, String],
  tooltip: {
    type: [Boolean, Object],
    default: true
  }
};
var Ellipsis_default = defineComponent({
  name: "Ellipsis",
  inheritAttrs: false,
  props: ellipsisProps,
  slots: Object,
  setup(props, {
    slots,
    attrs
  }) {
    const mergedClsPrefixRef = useMergedClsPrefix();
    const mergedTheme = useTheme("Ellipsis", "-ellipsis", index_cssr_default, ellipsisLight, props, mergedClsPrefixRef);
    const triggerRef = ref(null);
    const triggerInnerRef = ref(null);
    const tooltipRef = ref(null);
    const expandedRef = ref(false);
    const ellipsisStyleRef = computed(() => {
      const {
        lineClamp
      } = props;
      const {
        value: expanded
      } = expandedRef;
      if (lineClamp !== void 0) return {
        textOverflow: "",
        "-webkit-line-clamp": expanded ? "" : lineClamp
      };else return {
        textOverflow: expanded ? "" : "ellipsis",
        "-webkit-line-clamp": ""
      };
    });
    function getTooltipDisabled() {
      let tooltipDisabled = false;
      const {
        value: expanded
      } = expandedRef;
      if (expanded) return true;
      const {
        value: trigger
      } = triggerRef;
      if (trigger) {
        const {
          lineClamp
        } = props;
        syncEllipsisStyle(trigger);
        if (lineClamp !== void 0) tooltipDisabled = trigger.scrollHeight <= trigger.offsetHeight;else {
          const {
            value: triggerInner
          } = triggerInnerRef;
          if (triggerInner) tooltipDisabled = triggerInner.getBoundingClientRect().width <= trigger.getBoundingClientRect().width;
        }
        syncCursorStyle(trigger, tooltipDisabled);
      }
      return tooltipDisabled;
    }
    function handleClick() {
      if (props.expandTrigger !== "click") return;
      const {
        value: expanded
      } = expandedRef;
      if (expanded) tooltipRef.value?.setShow(false);
      expandedRef.value = !expanded;
    }
    onDeactivated(() => {
      if (props.tooltip) tooltipRef.value?.setShow(false);
    });
    const renderTrigger = () => (() => {
      const _cache = createVNodeCache("c61f52eafd841df5");
      return openBlock(), createElementBlock("span", mergeProps(mergeProps(attrs, {
        class: [`${mergedClsPrefixRef.value}-ellipsis`, props.lineClamp !== void 0 ? createLineClampClass(mergedClsPrefixRef.value) : void 0, props.expandTrigger === "click" ? createCursorClass(mergedClsPrefixRef.value, "pointer") : void 0],
        style: ellipsisStyleRef.value
      }), {
        ref: "triggerRef",
        onClick: handleClick,
        onMouseenter: _cache[0] || (_cache[0] = props.expandTrigger === "click" ? getTooltipDisabled : void 0)
      }), [props.lineClamp ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => slots.default?.())], 64)) : (openBlock(), createElementBlock("span", {
        key: 1,
        ref: "triggerInnerRef"
      }, [normalizeVNode(() => slots.default?.())], 512))], 16, _hoisted_1);
    })();
    function syncEllipsisStyle(trigger) {
      if (!trigger) return;
      const latestStyle = ellipsisStyleRef.value;
      const lineClampClass = createLineClampClass(mergedClsPrefixRef.value);
      if (props.lineClamp !== void 0) syncTriggerClass(trigger, lineClampClass, "add");else syncTriggerClass(trigger, lineClampClass, "remove");
      for (const key in latestStyle) if (trigger.style[key] !== latestStyle[key]) trigger.style[key] = latestStyle[key];
    }
    function syncCursorStyle(trigger, tooltipDisabled) {
      const cursorClass = createCursorClass(mergedClsPrefixRef.value, "pointer");
      if (props.expandTrigger === "click" && !tooltipDisabled) syncTriggerClass(trigger, cursorClass, "add");else syncTriggerClass(trigger, cursorClass, "remove");
    }
    function syncTriggerClass(trigger, styleClass, action) {
      if (action === "add") {
        if (!trigger.classList.contains(styleClass)) trigger.classList.add(styleClass);
      } else if (trigger.classList.contains(styleClass)) trigger.classList.remove(styleClass);
    }
    return {
      mergedTheme,
      triggerRef,
      triggerInnerRef,
      tooltipRef,
      renderTrigger,
      getTooltipDisabled
    };
  },
  render() {
    const {
      tooltip,
      renderTrigger,
      $slots
    } = this;
    if (tooltip) {
      const {
        mergedTheme
      } = this;
      return openBlock(), createBlock(Tooltip_default, mergeProps({
        key: 1,
        ref: "tooltipRef",
        placement: "top"
      }, tooltip, {
        getDisabled: this.getTooltipDisabled,
        theme: mergedTheme.peers.Tooltip,
        themeOverrides: mergedTheme.peerOverrides.Tooltip
      }), {
        trigger: renderTrigger,
        default: $slots.tooltip ?? $slots.default
      }, 1040, ["getDisabled", "theme", "themeOverrides"]);
    } else return renderTrigger();
  }
});
//#endregion
export { createCursorClass, createLineClampClass, Ellipsis_default as default, ellipsisProps };