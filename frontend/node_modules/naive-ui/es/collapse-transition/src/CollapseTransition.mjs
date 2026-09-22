import { warnOnce } from "../../_utils/naive/warn.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeSlot } from "../../vue-jsx-vapor/vdom.mjs";
import FadeInExpandTransition_default from "../../_internal/fade-in-expand-transition/src/FadeInExpandTransition.mjs";
import collapseTransitionLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { computed, createBlock, defineComponent, h, mergeProps, openBlock, vShow, watchEffect, withDirectives } from "vue";
import { useFalseUntilTruthy } from "vooks";
//#region src/collapse-transition/src/CollapseTransition.tsx
const collapseTransitionProps = {
  ...useTheme.props,
  show: {
    type: Boolean,
    default: true
  },
  appear: Boolean,
  displayDirective: {
    type: String,
    default: "if"
  },
  /** @deprecated */
  collapsed: {
    type: Boolean,
    default: void 0
  }
};
var CollapseTransition_default = defineComponent({
  name: "CollapseTransition",
  props: collapseTransitionProps,
  inheritAttrs: false,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.collapsed !== void 0) warnOnce("collapse-transition", "`collapsed` is deprecated, please use `show` instead");
    });
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef
    } = useConfig(props);
    const mergedThemeRef = useTheme("CollapseTransition", "-collapse-transition", index_cssr_default, collapseTransitionLight, props, mergedClsPrefixRef);
    const rtlEnabledRef = useRtl("CollapseTransition", mergedRtlRef, mergedClsPrefixRef);
    const mergedShowRef = computed(() => {
      if (props.collapsed !== void 0) return props.collapsed;
      return props.show;
    });
    const onceTrueRef = useFalseUntilTruthy(mergedShowRef);
    const cssVarsRef = computed(() => {
      const {
        self: {
          bezier
        }
      } = mergedThemeRef.value;
      return {
        "--n-bezier": bezier
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("collapse-transition", void 0, cssVarsRef, props) : void 0;
    return {
      rtlEnabled: rtlEnabledRef,
      mergedShow: mergedShowRef,
      onceTrue: onceTrueRef,
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    return openBlock(), createBlock(FadeInExpandTransition_default, {
      appear: this.appear
    }, {
      _: 1,
      default: normalizeSlot(() => {
        const {
          mergedShow,
          displayDirective,
          onceTrue
        } = this;
        const useVShow = displayDirective === "show" && onceTrue;
        if (!useVShow && !mergedShow) return;
        this.onRender?.();
        const contentNode = h("div", mergeProps({
          class: [`${this.mergedClsPrefix}-collapse-transition`, this.rtlEnabled && `${this.mergedClsPrefix}-collapse-transition--rtl`, this.themeClass],
          style: this.cssVars
        }, this.$attrs), this.$slots);
        return useVShow ? withDirectives(contentNode, [[vShow, mergedShow]]) : contentNode;
      })
    }, 8, ["appear"]);
  }
});
//#endregion
export { collapseTransitionProps, CollapseTransition_default as default };