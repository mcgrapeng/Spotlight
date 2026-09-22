import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
import { flatten } from "../../_utils/vue/flatten.mjs";
import { getSlot } from "../../_utils/vue/get-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import stepsLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { createElementBlock, defineComponent, openBlock, provide } from "vue";
//#region src/steps/src/Steps.tsx
function stepWithIndex(step, i) {
  if (typeof step !== "object" || step === null || Array.isArray(step)) return null;
  if (!step.props) step.props = {};
  step.props.internalIndex = i + 1;
  return step;
}
function stepsWithIndex(steps) {
  return steps.map((step, i) => stepWithIndex(step, i));
}
const stepsProps = {
  ...useTheme.props,
  current: Number,
  status: {
    type: String,
    default: "process"
  },
  size: {
    type: String,
    default: "medium"
  },
  vertical: Boolean,
  contentPlacement: {
    type: String,
    default: "right"
  },
  "onUpdate:current": [Function, Array],
  onUpdateCurrent: [Function, Array]
};
const stepsInjectionKey = createInjectionKey("n-steps");
var Steps_default = defineComponent({
  name: "Steps",
  props: stepsProps,
  slots: Object,
  setup(props, {
    slots
  }) {
    const {
      mergedClsPrefixRef,
      mergedRtlRef
    } = useConfig(props);
    const rtlEnabledRef = useRtl("Steps", mergedRtlRef, mergedClsPrefixRef);
    const themeRef = useTheme("Steps", "-steps", index_cssr_default, stepsLight, props, mergedClsPrefixRef);
    provide(stepsInjectionKey, {
      props,
      mergedThemeRef: themeRef,
      mergedClsPrefixRef,
      stepsSlots: slots
    });
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      rtlEnabled: rtlEnabledRef
    };
  },
  render() {
    const {
      mergedClsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-steps`, this.rtlEnabled && `${mergedClsPrefix}-steps--rtl`, this.vertical && `${mergedClsPrefix}-steps--vertical`, this.contentPlacement === "bottom" && `${mergedClsPrefix}-steps--content-bottom`])
    }, [normalizeVNode(() => stepsWithIndex(flatten(getSlot(this))))], 2);
  }
});
//#endregion
export { Steps_default as default, stepsInjectionKey, stepsProps };