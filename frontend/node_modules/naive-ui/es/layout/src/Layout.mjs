import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
import { useReactivated } from "../../_utils/composable/use-reactivated.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeSlots, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Scrollbar from "../../_internal/scrollbar/src/Scrollbar.mjs";
import layoutLight from "../styles/light.mjs";
import { positionProp } from "./interface.mjs";
import layout_cssr_default from "./styles/layout.cssr.mjs";
import { computed, createBlock, createElementBlock, defineComponent, mergeProps, normalizeStyle, openBlock, provide, ref } from "vue";
//#region src/layout/src/Layout.tsx
const layoutProps = {
  embedded: Boolean,
  position: positionProp,
  nativeScrollbar: {
    type: Boolean,
    default: true
  },
  scrollbarProps: Object,
  onScroll: Function,
  contentClass: String,
  contentStyle: {
    type: [String, Object],
    default: ""
  },
  hasSider: Boolean,
  siderPlacement: {
    type: String,
    default: "left"
  }
};
const layoutInjectionKey = createInjectionKey("n-layout");
function createLayoutComponent(isContent) {
  return defineComponent({
    name: isContent ? "LayoutContent" : "Layout",
    props: {
      ...useTheme.props,
      ...layoutProps
    },
    setup(props) {
      const scrollableElRef = ref(null);
      const scrollbarInstRef = ref(null);
      const {
        mergedClsPrefixRef,
        inlineThemeDisabled
      } = useConfig(props);
      const themeRef = useTheme("Layout", "-layout", layout_cssr_default, layoutLight, props, mergedClsPrefixRef);
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
      provide(layoutInjectionKey, props);
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
      const hasSiderStyle = {
        display: "flex",
        flexWrap: "nowrap",
        width: "100%",
        flexDirection: "row"
      };
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
        return {
          "--n-bezier": cubicBezierEaseInOut,
          "--n-color": props.embedded ? self.colorEmbedded : self.color,
          "--n-text-color": self.textColor
        };
      });
      const themeClassHandle = inlineThemeDisabled ? useThemeClass("layout", computed(() => {
        return props.embedded ? "e" : "";
      }), cssVarsRef, props) : void 0;
      return {
        mergedClsPrefix: mergedClsPrefixRef,
        scrollableElRef,
        scrollbarInstRef,
        hasSiderStyle,
        mergedTheme: themeRef,
        handleNativeElScroll,
        cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
        themeClass: themeClassHandle?.themeClass,
        onRender: themeClassHandle?.onRender,
        ...exposedMethods
      };
    },
    render() {
      const {
        mergedClsPrefix,
        hasSider
      } = this;
      this.onRender?.();
      const hasSiderStyle = hasSider ? this.hasSiderStyle : void 0;
      const layoutClass = [this.themeClass, isContent && `${mergedClsPrefix}-layout-content`, `${mergedClsPrefix}-layout`, `${mergedClsPrefix}-layout--${this.position}-positioned`];
      return openBlock(), createElementBlock("div", {
        class: normalizeClass$1(layoutClass),
        style: normalizeStyle(this.cssVars)
      }, [this.nativeScrollbar ? (openBlock(), createElementBlock("div", {
        key: 0,
        ref: "scrollableElRef",
        class: normalizeClass$1([`${mergedClsPrefix}-layout-scroll-container`, this.contentClass]),
        style: normalizeStyle([this.contentStyle, hasSiderStyle]),
        onScroll: this.handleNativeElScroll
      }, [normalizeVNode(() => this.$slots.default?.())], 46, ["onScroll"])) : (openBlock(), createBlock(Scrollbar, mergeProps({
        key: 1
      }, this.scrollbarProps, {
        onScroll: this.onScroll,
        ref: "scrollbarInstRef",
        theme: this.mergedTheme.peers.Scrollbar,
        themeOverrides: this.mergedTheme.peerOverrides.Scrollbar,
        contentClass: this.contentClass,
        contentStyle: [this.contentStyle, hasSiderStyle]
      }), normalizeSlots(this.$slots), 1040, ["onScroll", "theme", "themeOverrides", "contentClass", "contentStyle"]))], 6);
    }
  });
}
var Layout_default = createLayoutComponent(false);
//#endregion
export { createLayoutComponent, Layout_default as default, layoutInjectionKey, layoutProps };