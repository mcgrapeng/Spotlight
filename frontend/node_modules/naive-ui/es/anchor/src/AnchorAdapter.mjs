import { keep } from "../../_utils/vue/keep.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeSlots } from "../../vue-jsx-vapor/vdom.mjs";
import Affix_default, { affixPropKeys, affixProps } from "../../affix/src/Affix.mjs";
import anchorLight from "../styles/light.mjs";
import BaseAnchor_default, { baseAnchorPropKeys, baseAnchorProps } from "./BaseAnchor.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { computed, createBlock, defineComponent, mergeProps, openBlock, ref } from "vue";
//#region src/anchor/src/AnchorAdapter.tsx
const anchorProps = {
  ...useTheme.props,
  affix: Boolean,
  ...affixProps,
  ...baseAnchorProps
};
var AnchorAdapter_default = defineComponent({
  name: "Anchor",
  props: anchorProps,
  setup(props, {
    slots
  }) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Anchor", "-anchor", index_cssr_default, anchorLight, props, mergedClsPrefixRef);
    const anchorRef = ref(null);
    const cssVarsRef = computed(() => {
      const {
        self: {
          railColor,
          linkColor,
          railColorActive,
          linkTextColor,
          linkTextColorHover,
          linkTextColorPressed,
          linkTextColorActive,
          linkFontSize,
          railWidth,
          linkPadding,
          borderRadius
        },
        common: {
          cubicBezierEaseInOut
        }
      } = themeRef.value;
      return {
        "--n-link-border-radius": borderRadius,
        "--n-link-color": linkColor,
        "--n-link-font-size": linkFontSize,
        "--n-link-text-color": linkTextColor,
        "--n-link-text-color-hover": linkTextColorHover,
        "--n-link-text-color-active": linkTextColorActive,
        "--n-link-text-color-pressed": linkTextColorPressed,
        "--n-link-padding": linkPadding,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-rail-color": railColor,
        "--n-rail-color-active": railColorActive,
        "--n-rail-width": railWidth
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("anchor", void 0, cssVarsRef, props) : void 0;
    return {
      scrollTo(href) {
        anchorRef.value?.setActiveHref(href);
      },
      renderAnchor: () => {
        themeClassHandle?.onRender();
        return openBlock(), createBlock(BaseAnchor_default, mergeProps({
          ref: anchorRef,
          style: inlineThemeDisabled ? void 0 : cssVarsRef.value,
          class: themeClassHandle?.themeClass.value
        }, keep(props, baseAnchorPropKeys), {
          mergedClsPrefix: mergedClsPrefixRef.value
        }), normalizeSlots(slots), 1040, ["style", "class", "mergedClsPrefix"]);
      }
    };
  },
  render() {
    return !this.affix ? this.renderAnchor() : (openBlock(), createBlock(Affix_default, mergeProps({
      key: 1
    }, keep(this, affixPropKeys)), {
      default: this.renderAnchor
    }, 1040));
  }
});
//#endregion
export { anchorProps, AnchorAdapter_default as default };