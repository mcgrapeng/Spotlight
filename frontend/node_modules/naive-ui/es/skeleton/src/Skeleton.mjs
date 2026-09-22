import { useHoudini } from "../../_utils/composable/use-houdini.mjs";
import { createKey } from "../../_utils/cssr/index.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { skeletonLight } from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { pxfy, repeat } from "seemly";
import { Fragment, computed, createElementBlock, defineComponent, h, mergeProps, openBlock } from "vue";
//#region src/skeleton/src/Skeleton.tsx
const skeletonProps = {
  ...useTheme.props,
  text: Boolean,
  round: Boolean,
  circle: Boolean,
  height: [String, Number],
  width: [String, Number],
  size: String,
  repeat: {
    type: Number,
    default: 1
  },
  animated: {
    type: Boolean,
    default: true
  },
  sharp: {
    type: Boolean,
    default: true
  }
};
var Skeleton_default = defineComponent({
  name: "Skeleton",
  inheritAttrs: false,
  props: skeletonProps,
  setup(props) {
    useHoudini();
    const {
      mergedClsPrefixRef,
      mergedComponentPropsRef
    } = useConfig(props);
    const mergedSizeRef = computed(() => {
      return props.size || mergedComponentPropsRef?.value?.Skeleton?.size;
    });
    const themeRef = useTheme("Skeleton", "-skeleton", index_cssr_default, skeletonLight, props, mergedClsPrefixRef);
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      style: computed(() => {
        const theme = themeRef.value;
        const {
          common: {
            cubicBezierEaseInOut
          }
        } = theme;
        const selfThemeVars = theme.self;
        const {
          color,
          colorEnd,
          borderRadius
        } = selfThemeVars;
        let sizeHeight;
        const {
          circle,
          sharp,
          round,
          width,
          height,
          text,
          animated
        } = props;
        const mergedSize = mergedSizeRef.value;
        if (mergedSize !== void 0) sizeHeight = selfThemeVars[createKey("height", mergedSize)];
        const mergedWidth = circle ? width ?? height ?? sizeHeight : width;
        const mergedHeight = (circle ? width ?? height : height) ?? sizeHeight;
        return {
          display: text ? "inline-block" : "",
          verticalAlign: text ? "-0.125em" : "",
          borderRadius: circle ? "50%" : round ? "4096px" : sharp ? "" : borderRadius,
          width: typeof mergedWidth === "number" ? pxfy(mergedWidth) : mergedWidth,
          height: typeof mergedHeight === "number" ? pxfy(mergedHeight) : mergedHeight,
          animation: !animated ? "none" : "",
          "--n-bezier": cubicBezierEaseInOut,
          "--n-color-start": color,
          "--n-color-end": colorEnd
        };
      })
    };
  },
  render() {
    const {
      repeat: repeatProp,
      style,
      mergedClsPrefix,
      $attrs
    } = this;
    const child = h("div", mergeProps({
      class: `${mergedClsPrefix}-skeleton`,
      style
    }, $attrs));
    if (repeatProp > 1) return openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => repeat(repeatProp, null).map(_ => [child, "\n"]))], 64);
    return child;
  }
});
//#endregion
export { Skeleton_default as default, skeletonProps };