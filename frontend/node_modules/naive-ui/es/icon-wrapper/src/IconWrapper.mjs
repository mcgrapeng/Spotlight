import { formatLength } from "../../_utils/css/format-length.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import iconWrapperLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { computed, createElementBlock, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/icon-wrapper/src/IconWrapper.tsx
const iconWrapperProps = {
  ...useTheme.props,
  size: {
    type: Number,
    default: 24
  },
  borderRadius: {
    type: Number,
    default: 6
  },
  color: String,
  iconColor: String
};
const NIconWrapper = defineComponent({
  name: "IconWrapper",
  props: iconWrapperProps,
  setup(props, {
    slots
  }) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("IconWrapper", "-icon-wrapper", index_cssr_default, iconWrapperLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          color,
          iconColor
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-color": color,
        "--n-icon-color": iconColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("icon-wrapper", void 0, cssVarsRef, props) : void 0;
    return () => {
      const size = formatLength(props.size);
      themeClassHandle?.onRender();
      return openBlock(), createElementBlock("div", {
        class: normalizeClass$1([`${mergedClsPrefixRef.value}-icon-wrapper`, themeClassHandle?.themeClass.value]),
        style: normalizeStyle([cssVarsRef?.value, {
          height: size,
          width: size,
          borderRadius: formatLength(props.borderRadius),
          backgroundColor: props.color,
          color: props.iconColor
        }])
      }, [normalizeVNode(() => slots.default?.())], 6);
    };
  }
});
//#endregion
export { NIconWrapper, iconWrapperProps };