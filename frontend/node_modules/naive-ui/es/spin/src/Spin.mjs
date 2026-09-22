import { createKey } from "../../_utils/cssr/index.mjs";
import { warnOnce } from "../../_utils/naive/warn.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Loading_default, { exposedLoadingProps } from "../../_internal/loading/src/Loading.mjs";
import spinLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { pxfy } from "seemly";
import { Transition, computed, createBlock, createElementBlock, createElementVNode, createVNode, defineComponent, normalizeStyle, openBlock, ref, watchEffect } from "vue";
import { useCompitable } from "vooks";
//#region src/spin/src/Spin.tsx
const STROKE_WIDTH = {
  small: 20,
  medium: 18,
  large: 16
};
const spinProps = {
  ...useTheme.props,
  contentClass: String,
  contentStyle: [Object, String],
  description: String,
  size: {
    type: [String, Number],
    default: "medium"
  },
  show: {
    type: Boolean,
    default: true
  },
  rotate: {
    type: Boolean,
    default: true
  },
  spinning: {
    type: Boolean,
    validator: () => {
      return true;
    },
    default: void 0
  },
  delay: Number,
  ...exposedLoadingProps,
  strokeWidth: Number
};
var Spin_default = defineComponent({
  name: "Spin",
  props: spinProps,
  slots: Object,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.spinning !== void 0) warnOnce("spin", "`spinning` is deprecated, please use `show` instead.");
    });
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Spin", "-spin", index_cssr_default, spinLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        size: spinSize
      } = props;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self
      } = themeRef.value;
      const {
        opacitySpinning,
        color,
        textColor
      } = self;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-opacity-spinning": opacitySpinning,
        "--n-size": typeof spinSize === "number" ? pxfy(spinSize) : self[createKey("size", spinSize)],
        "--n-color": color,
        "--n-text-color": textColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("spin", computed(() => {
      const {
        size
      } = props;
      return typeof size === "number" ? String(size) : size[0];
    }), cssVarsRef, props) : void 0;
    const compitableShow = useCompitable(props, ["spinning", "show"]);
    const activeRef = ref(false);
    watchEffect(onCleanup => {
      let timerId;
      if (compitableShow.value) {
        const {
          delay
        } = props;
        if (delay) {
          timerId = window.setTimeout(() => {
            activeRef.value = true;
          }, delay);
          onCleanup(() => {
            clearTimeout(timerId);
          });
          return;
        }
      }
      activeRef.value = compitableShow.value;
    });
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      active: activeRef,
      mergedStrokeWidth: computed(() => {
        const {
          strokeWidth
        } = props;
        if (strokeWidth !== void 0) return strokeWidth;
        const {
          size
        } = props;
        return STROKE_WIDTH[typeof size === "number" ? "medium" : size];
      }),
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      $slots,
      mergedClsPrefix,
      description
    } = this;
    const rotate = $slots.icon && this.rotate;
    const descriptionNode = (description || $slots.description) && (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-spin-description`)
    }, [normalizeVNode(() => description || $slots.description?.())], 2));
    const icon = $slots.icon ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass$1([`${mergedClsPrefix}-spin-body`, this.themeClass])
    }, [createElementVNode("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-spin`, rotate && `${mergedClsPrefix}-spin--rotate`]),
      style: normalizeStyle($slots.default ? "" : this.cssVars)
    }, [normalizeVNode(() => $slots.icon())], 6), normalizeVNode(() => descriptionNode)], 2)) : (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1([`${mergedClsPrefix}-spin-body`, this.themeClass])
    }, [(openBlock(), createBlock(Loading_default, {
      clsPrefix: mergedClsPrefix,
      style: normalizeStyle($slots.default ? "" : this.cssVars),
      stroke: this.stroke,
      "stroke-width": this.mergedStrokeWidth,
      radius: this.radius,
      scale: this.scale,
      class: normalizeClass$1(`${mergedClsPrefix}-spin`)
    }, null, 8, ["clsPrefix", "style", "stroke", "stroke-width", "radius", "scale", "class"])), normalizeVNode(() => descriptionNode)], 2));
    this.onRender?.();
    return $slots.default ? (openBlock(), createElementBlock("div", {
      key: 3,
      class: normalizeClass$1([`${mergedClsPrefix}-spin-container`, this.themeClass]),
      style: normalizeStyle(this.cssVars)
    }, [createElementVNode("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-spin-content`, this.active && `${mergedClsPrefix}-spin-content--spinning`, this.contentClass]),
      style: normalizeStyle(this.contentStyle)
    }, [normalizeVNode(() => $slots.default?.())], 6), createVNode(Transition, {
      name: "fade-in-transition"
    }, {
      default: () => this.active ? icon : null
    }, 1024)], 6)) : icon;
  }
});
//#endregion
export { Spin_default as default, spinProps };