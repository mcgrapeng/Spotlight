import { createRefSetter } from "../../_utils/vue/create-ref-setter.mjs";
import { keep } from "../../_utils/vue/keep.mjs";
import { mergeEventHandlers } from "../../_utils/vue/merge-handlers.mjs";
import { omit } from "../../_utils/vue/omit.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeSlot } from "../../vue-jsx-vapor/vdom.mjs";
import Popover_default, { popoverBaseProps } from "../../popover/src/Popover.mjs";
import popselectLight from "../styles/light.mjs";
import { popselectInjectionKey } from "./interface.mjs";
import PopselectPanel_default, { panelPropKeys, panelProps } from "./PopselectPanel.mjs";
import { createBlock, defineComponent, mergeProps, openBlock, provide, ref } from "vue";
//#region src/popselect/src/Popselect.tsx
const popselectProps = {
  ...useTheme.props,
  ...omit(popoverBaseProps, ["showArrow", "arrow"]),
  placement: {
    ...popoverBaseProps.placement,
    default: "bottom"
  },
  trigger: {
    type: String,
    default: "hover"
  },
  ...panelProps,
  scrollbarProps: Object
};
var Popselect_default = defineComponent({
  name: "Popselect",
  props: popselectProps,
  slots: Object,
  inheritAttrs: false,
  __popover__: true,
  setup(props) {
    const {
      mergedClsPrefixRef
    } = useConfig(props);
    const themeRef = useTheme("Popselect", "-popselect", void 0, popselectLight, props, mergedClsPrefixRef);
    const popoverInstRef = ref(null);
    function syncPosition() {
      popoverInstRef.value?.syncPosition();
    }
    function setShow(value) {
      popoverInstRef.value?.setShow(value);
    }
    provide(popselectInjectionKey, {
      props,
      mergedThemeRef: themeRef,
      syncPosition,
      setShow
    });
    return {
      syncPosition,
      setShow,
      popoverInstRef,
      mergedTheme: themeRef
    };
  },
  render() {
    const {
      mergedTheme
    } = this;
    const popoverProps = {
      theme: mergedTheme.peers.Popover,
      themeOverrides: mergedTheme.peerOverrides.Popover,
      builtinThemeOverrides: {
        padding: "0"
      },
      ref: "popoverInstRef",
      internalRenderBody: (className, ref, style, onMouseenter, onMouseleave) => {
        const {
          $attrs
        } = this;
        return openBlock(), createBlock(PopselectPanel_default, mergeProps($attrs, {
          class: [$attrs.class, className],
          style: [$attrs.style, ...style]
        }, keep(this.$props, panelPropKeys), {
          ref: createRefSetter(ref),
          onMouseenter: mergeEventHandlers([onMouseenter, $attrs.onMouseenter]),
          onMouseleave: mergeEventHandlers([onMouseleave, $attrs.onMouseleave])
        }), {
          header: () => this.$slots.header?.(),
          action: () => this.$slots.action?.(),
          empty: () => this.$slots.empty?.()
        }, 1040, ["class", "style", "onMouseenter", "onMouseleave"]);
      }
    };
    return openBlock(), createBlock(Popover_default, mergeProps(omit(this.$props, panelPropKeys), popoverProps, {
      internalDeactivateImmediately: true
    }), {
      _: 1,
      trigger: normalizeSlot(() => this.$slots.default?.())
    }, 16);
  }
});
//#endregion
export { Popselect_default as default, popselectProps };