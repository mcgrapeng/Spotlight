import { color2Class } from "../../_utils/css/color-to-class.mjs";
import { createKey } from "../../_utils/cssr/index.mjs";
import { getTitleAttribute } from "../../_utils/naive/attribute.mjs";
import { isSlotEmpty, resolveSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import SlotMachine_default from "../../_internal/slot-machine/src/SlotMachine.mjs";
import Wave_default from "../../_internal/wave/src/Wave.mjs";
import badgeLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { Transition, computed, createBlock, createElementBlock, defineComponent, normalizeStyle, onMounted, openBlock, ref } from "vue";
//#region src/badge/src/Badge.tsx
const _hoisted_1 = ["title"];
const badgeProps = {
  ...useTheme.props,
  value: [String, Number],
  max: Number,
  dot: Boolean,
  type: {
    type: String,
    default: "default"
  },
  show: {
    type: Boolean,
    default: true
  },
  showZero: Boolean,
  processing: Boolean,
  color: String,
  offset: Array
};
var Badge_default = defineComponent({
  name: "Badge",
  props: badgeProps,
  setup(props, {
    slots
  }) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef
    } = useConfig(props);
    const themeRef = useTheme("Badge", "-badge", index_cssr_default, badgeLight, props, mergedClsPrefixRef);
    const appearedRef = ref(false);
    const handleAfterEnter = () => {
      appearedRef.value = true;
    };
    const handleAfterLeave = () => {
      appearedRef.value = false;
    };
    const showBadgeRef = computed(() => {
      return props.show && (props.dot || props.value !== void 0 && !(!props.showZero && Number(props.value) <= 0) || !isSlotEmpty(slots.value));
    });
    onMounted(() => {
      if (showBadgeRef.value) appearedRef.value = true;
    });
    const rtlEnabledRef = useRtl("Badge", mergedRtlRef, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        type,
        color: propColor
      } = props;
      const {
        common: {
          cubicBezierEaseInOut,
          cubicBezierEaseOut
        },
        self: {
          [createKey("color", type)]: color,
          fontFamily,
          fontSize
        }
      } = themeRef.value;
      return {
        "--n-font-size": fontSize,
        "--n-font-family": fontFamily,
        "--n-color": propColor || color,
        "--n-ripple-color": propColor || color,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-ripple-bezier": cubicBezierEaseOut
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("badge", computed(() => {
      let hash = "";
      const {
        type,
        color
      } = props;
      if (type) hash += type[0];
      if (color) hash += color2Class(color);
      return hash;
    }), cssVarsRef, props) : void 0;
    const offsetStyleRef = computed(() => {
      const {
        offset
      } = props;
      if (!offset) return void 0;
      const [x, y] = offset;
      const reslovedOffsetX = typeof x === "number" ? `${x}px` : x;
      const reslovedOffsetY = typeof y === "number" ? `${y}px` : y;
      return {
        transform: `translate(calc(${rtlEnabledRef?.value ? "50%" : "-50%"} + ${reslovedOffsetX}), ${reslovedOffsetY})`
      };
    });
    return {
      rtlEnabled: rtlEnabledRef,
      mergedClsPrefix: mergedClsPrefixRef,
      appeared: appearedRef,
      showBadge: showBadgeRef,
      handleAfterEnter,
      handleAfterLeave,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender,
      offsetStyle: offsetStyleRef
    };
  },
  render() {
    const {
      mergedClsPrefix,
      onRender,
      themeClass,
      $slots
    } = this;
    onRender?.();
    const children = $slots.default?.();
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-badge`, this.rtlEnabled && `${mergedClsPrefix}-badge--rtl`, themeClass, {
        [`${mergedClsPrefix}-badge--dot`]: this.dot,
        [`${mergedClsPrefix}-badge--as-is`]: !children
      }]),
      style: normalizeStyle(this.cssVars)
    }, [normalizeVNode(() => children), (openBlock(), createBlock(Transition, {
      name: "fade-in-scale-up-transition",
      onAfterEnter: this.handleAfterEnter,
      onAfterLeave: this.handleAfterLeave
    }, {
      default: () => this.showBadge ? (openBlock(), createElementBlock("sup", {
        key: 1,
        class: normalizeClass$1(`${mergedClsPrefix}-badge-sup`),
        title: getTitleAttribute(this.value),
        style: normalizeStyle(this.offsetStyle)
      }, [normalizeVNode(() => resolveSlot($slots.value, () => [!this.dot ? (openBlock(), createBlock(SlotMachine_default, {
        key: 2,
        clsPrefix: mergedClsPrefix,
        appeared: this.appeared,
        max: this.max,
        value: this.value
      }, null, 8, ["clsPrefix", "appeared", "max", "value"])) : null])), this.processing ? (openBlock(), createBlock(Wave_default, {
        key: 0,
        clsPrefix: mergedClsPrefix
      }, null, 8, ["clsPrefix"])) : normalizeVNode(() => null)], 14, _hoisted_1)) : null
    }, 1032, ["onAfterEnter", "onAfterLeave"]))], 6);
  }
});
//#endregion
export { badgeProps, Badge_default as default };