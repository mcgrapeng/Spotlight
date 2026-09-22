import { useReactivated } from "../../_utils/composable/use-reactivated.mjs";
import { formatLength } from "../../_utils/css/format-length.mjs";
import { warn } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeSlots, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Scrollbar from "../../_internal/scrollbar/src/Scrollbar.mjs";
import layoutLight from "../styles/light.mjs";
import { layoutSiderInjectionKey, positionProp } from "./interface.mjs";
import { layoutInjectionKey } from "./Layout.mjs";
import layout_sider_cssr_default from "./styles/layout-sider.cssr.mjs";
import ToggleBar_default from "./ToggleBar.mjs";
import ToggleButton_default from "./ToggleButton.mjs";
import { Fragment, computed, createBlock, createElementBlock, defineComponent, inject, mergeProps, normalizeStyle, openBlock, provide, ref, toRef } from "vue";
import { useMergedState } from "vooks";
//#region src/layout/src/LayoutSider.tsx
const _hoisted_1 = ["onTransitionend"];
const layoutSiderProps = {
  position: positionProp,
  bordered: Boolean,
  collapsedWidth: {
    type: Number,
    default: 48
  },
  width: {
    type: [Number, String],
    default: 272
  },
  contentClass: String,
  contentStyle: {
    type: [String, Object],
    default: ""
  },
  collapseMode: {
    type: String,
    default: "transform"
  },
  collapsed: {
    type: Boolean,
    default: void 0
  },
  defaultCollapsed: Boolean,
  showCollapsedContent: {
    type: Boolean,
    default: true
  },
  showTrigger: {
    type: [Boolean, String],
    default: false
  },
  nativeScrollbar: {
    type: Boolean,
    default: true
  },
  inverted: Boolean,
  scrollbarProps: Object,
  triggerClass: String,
  triggerStyle: [String, Object],
  collapsedTriggerClass: String,
  collapsedTriggerStyle: [String, Object],
  "onUpdate:collapsed": [Function, Array],
  onUpdateCollapsed: [Function, Array],
  onAfterEnter: Function,
  onAfterLeave: Function,
  onExpand: [Function, Array],
  onCollapse: [Function, Array],
  onScroll: Function
};
var LayoutSider_default = defineComponent({
  name: "LayoutSider",
  props: {
    ...useTheme.props,
    ...layoutSiderProps
  },
  setup(props) {
    const layoutProps = inject(layoutInjectionKey);
    if (process.env.NODE_ENV !== "production") {
      if (!layoutProps) warn("layout-sider", "Layout sider is not allowed to be put outside layout.");else if (!layoutProps.hasSider) warn("layout-sider", "You are putting `n-layout-sider` in a `n-layout` but haven't set `has-sider` on the `n-layout`.");
    }
    const scrollableElRef = ref(null);
    const scrollbarInstRef = ref(null);
    const uncontrolledCollapsedRef = ref(props.defaultCollapsed);
    const mergedCollapsedRef = useMergedState(toRef(props, "collapsed"), uncontrolledCollapsedRef);
    const styleMaxWidthRef = computed(() => {
      return formatLength(mergedCollapsedRef.value ? props.collapsedWidth : props.width);
    });
    const scrollContainerStyleRef = computed(() => {
      if (props.collapseMode !== "transform") return {};
      return {
        minWidth: formatLength(props.width)
      };
    });
    const siderPlacementRef = computed(() => {
      return layoutProps ? layoutProps.siderPlacement : "left";
    });
    function scrollTo(options, y) {
      if (props.nativeScrollbar) {
        const {
          value: scrollableEl
        } = scrollableElRef;
        if (scrollableEl) {
          if (y === void 0) scrollableEl.scrollTo(options);else scrollableEl.scrollTo(options, y);
        }
      } else {
        const {
          value: scrollbarInst
        } = scrollbarInstRef;
        if (scrollbarInst) scrollbarInst.scrollTo(options, y);
      }
    }
    function handleTriggerClick() {
      const {
        "onUpdate:collapsed": _onUpdateCollapsed,
        onUpdateCollapsed,
        onExpand,
        onCollapse
      } = props;
      const {
        value: collapsed
      } = mergedCollapsedRef;
      if (onUpdateCollapsed) call(onUpdateCollapsed, !collapsed);
      if (_onUpdateCollapsed) call(_onUpdateCollapsed, !collapsed);
      uncontrolledCollapsedRef.value = !collapsed;
      if (collapsed) {
        if (onExpand) call(onExpand);
      } else if (onCollapse) call(onCollapse);
    }
    let scrollX = 0;
    let scrollY = 0;
    const handleNativeElScroll = e => {
      const target = e.target;
      scrollX = target.scrollLeft;
      scrollY = target.scrollTop;
      props.onScroll?.(e);
    };
    useReactivated(() => {
      if (props.nativeScrollbar) {
        const el = scrollableElRef.value;
        if (el) {
          el.scrollTop = scrollY;
          el.scrollLeft = scrollX;
        }
      }
    });
    provide(layoutSiderInjectionKey, {
      collapsedRef: mergedCollapsedRef,
      collapseModeRef: toRef(props, "collapseMode")
    });
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Layout", "-layout-sider", layout_sider_cssr_default, layoutLight, props, mergedClsPrefixRef);
    function handleTransitionend(e) {
      if (e.propertyName === "max-width") {
        if (mergedCollapsedRef.value) props.onAfterLeave?.();else props.onAfterEnter?.();
      }
    }
    const exposedMethods = {
      scrollTo
    };
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self
      } = themeRef.value;
      const {
        siderToggleButtonColor,
        siderToggleButtonBorder,
        siderToggleBarColor,
        siderToggleBarColorHover
      } = self;
      const vars = {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-toggle-button-color": siderToggleButtonColor,
        "--n-toggle-button-border": siderToggleButtonBorder,
        "--n-toggle-bar-color": siderToggleBarColor,
        "--n-toggle-bar-color-hover": siderToggleBarColorHover
      };
      if (props.inverted) {
        vars["--n-color"] = self.siderColorInverted;
        vars["--n-text-color"] = self.textColorInverted;
        vars["--n-border-color"] = self.siderBorderColorInverted;
        vars["--n-toggle-button-icon-color"] = self.siderToggleButtonIconColorInverted;
        vars.__invertScrollbar = self.__invertScrollbar;
      } else {
        vars["--n-color"] = self.siderColor;
        vars["--n-text-color"] = self.textColor;
        vars["--n-border-color"] = self.siderBorderColor;
        vars["--n-toggle-button-icon-color"] = self.siderToggleButtonIconColor;
      }
      return vars;
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("layout-sider", computed(() => props.inverted ? "a" : "b"), cssVarsRef, props) : void 0;
    return {
      scrollableElRef,
      scrollbarInstRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedTheme: themeRef,
      styleMaxWidth: styleMaxWidthRef,
      mergedCollapsed: mergedCollapsedRef,
      scrollContainerStyle: scrollContainerStyleRef,
      siderPlacement: siderPlacementRef,
      handleNativeElScroll,
      handleTransitionend,
      handleTriggerClick,
      inlineThemeDisabled,
      cssVars: cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender,
      ...exposedMethods
    };
  },
  render() {
    const {
      mergedClsPrefix,
      mergedCollapsed,
      showTrigger
    } = this;
    this.onRender?.();
    return openBlock(), createElementBlock("aside", {
      class: normalizeClass$1([`${mergedClsPrefix}-layout-sider`, this.themeClass, `${mergedClsPrefix}-layout-sider--${this.position}-positioned`, `${mergedClsPrefix}-layout-sider--${this.siderPlacement}-placement`, this.bordered && `${mergedClsPrefix}-layout-sider--bordered`, mergedCollapsed && `${mergedClsPrefix}-layout-sider--collapsed`, (!mergedCollapsed || this.showCollapsedContent) && `${mergedClsPrefix}-layout-sider--show-content`]),
      onTransitionend: this.handleTransitionend,
      style: normalizeStyle([this.inlineThemeDisabled ? void 0 : this.cssVars, {
        maxWidth: this.styleMaxWidth,
        width: formatLength(this.width)
      }])
    }, [!this.nativeScrollbar ? (openBlock(), createBlock(Scrollbar, mergeProps({
      key: 0
    }, this.scrollbarProps, {
      onScroll: this.onScroll,
      ref: "scrollbarInstRef",
      style: this.scrollContainerStyle,
      contentStyle: this.contentStyle,
      contentClass: this.contentClass,
      theme: this.mergedTheme.peers.Scrollbar,
      themeOverrides: this.mergedTheme.peerOverrides.Scrollbar,
      builtinThemeOverrides: this.inverted && this.cssVars.__invertScrollbar === "true" ? {
        colorHover: "rgba(255, 255, 255, .4)",
        color: "rgba(255, 255, 255, .3)"
      } : void 0
    }), normalizeSlots(this.$slots), 1040, ["onScroll", "style", "contentStyle", "contentClass", "theme", "themeOverrides", "builtinThemeOverrides"])) : (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass$1([`${mergedClsPrefix}-layout-sider-scroll-container`, this.contentClass]),
      onScroll: this.handleNativeElScroll,
      style: normalizeStyle([this.scrollContainerStyle, {
        overflow: "auto"
      }, this.contentStyle]),
      ref: "scrollableElRef"
    }, [normalizeVNode(() => this.$slots.default?.())], 46, ["onScroll"])), showTrigger ? (openBlock(), createElementBlock(Fragment, {
      key: 2
    }, [showTrigger === "bar" ? (openBlock(), createBlock(ToggleBar_default, {
      key: 0,
      clsPrefix: mergedClsPrefix,
      class: normalizeClass$1(mergedCollapsed ? this.collapsedTriggerClass : this.triggerClass),
      style: normalizeStyle(mergedCollapsed ? this.collapsedTriggerStyle : this.triggerStyle),
      onClick: this.handleTriggerClick
    }, null, 8, ["clsPrefix", "class", "style", "onClick"])) : (openBlock(), createBlock(ToggleButton_default, {
      key: 1,
      clsPrefix: mergedClsPrefix,
      class: normalizeClass$1(mergedCollapsed ? this.collapsedTriggerClass : this.triggerClass),
      style: normalizeStyle(mergedCollapsed ? this.collapsedTriggerStyle : this.triggerStyle),
      onClick: this.handleTriggerClick
    }, null, 8, ["clsPrefix", "class", "style", "onClick"]))], 64)) : normalizeVNode(() => null), this.bordered ? (openBlock(), createElementBlock("div", {
      key: 4,
      class: normalizeClass$1(`${mergedClsPrefix}-layout-sider__border`)
    }, null, 2)) : normalizeVNode(() => null)], 46, _hoisted_1);
  }
});
//#endregion
export { LayoutSider_default as default, layoutSiderProps };