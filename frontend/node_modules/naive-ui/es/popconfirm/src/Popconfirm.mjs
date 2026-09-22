import { call } from "../../_utils/vue/call.mjs";
import { keep } from "../../_utils/vue/keep.mjs";
import { omit } from "../../_utils/vue/omit.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeSlots } from "../../vue-jsx-vapor/vdom.mjs";
import Popover_default, { popoverBaseProps } from "../../popover/src/Popover.mjs";
import popconfirmLight from "../styles/light.mjs";
import { popconfirmInjectionKey } from "./interface.mjs";
import PopconfirmPanel_default, { panelPropKeys } from "./PopconfirmPanel.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { createBlock, defineComponent, mergeProps, openBlock, provide, ref } from "vue";
//#region src/popconfirm/src/Popconfirm.tsx
const popconfirmProps = {
  ...useTheme.props,
  ...popoverBaseProps,
  positiveText: String,
  negativeText: String,
  showIcon: {
    type: Boolean,
    default: true
  },
  trigger: {
    type: String,
    default: "click"
  },
  positiveButtonProps: Object,
  negativeButtonProps: Object,
  onPositiveClick: Function,
  onNegativeClick: Function
};
var Popconfirm_default = defineComponent({
  name: "Popconfirm",
  props: popconfirmProps,
  slots: Object,
  __popover__: true,
  setup(props) {
    const {
      mergedClsPrefixRef
    } = useConfig();
    const themeRef = useTheme("Popconfirm", "-popconfirm", index_cssr_default, popconfirmLight, props, mergedClsPrefixRef);
    const popoverInstRef = ref(null);
    function handlePositiveClick(e) {
      if (!popoverInstRef.value?.getMergedShow()) return;
      const {
        onPositiveClick,
        "onUpdate:show": onUpdateShow
      } = props;
      Promise.resolve(onPositiveClick ? onPositiveClick(e) : true).then(value => {
        if (value === false) return;
        popoverInstRef.value?.setShow(false);
        if (onUpdateShow) call(onUpdateShow, false);
      });
    }
    function handleNegativeClick(e) {
      if (!popoverInstRef.value?.getMergedShow()) return;
      const {
        onNegativeClick,
        "onUpdate:show": onUpdateShow
      } = props;
      Promise.resolve(onNegativeClick ? onNegativeClick(e) : true).then(value => {
        if (value === false) return;
        popoverInstRef.value?.setShow(false);
        if (onUpdateShow) call(onUpdateShow, false);
      });
    }
    provide(popconfirmInjectionKey, {
      mergedThemeRef: themeRef,
      mergedClsPrefixRef,
      props
    });
    return {
      setShow(value) {
        popoverInstRef.value?.setShow(value);
      },
      syncPosition() {
        popoverInstRef.value?.syncPosition();
      },
      mergedTheme: themeRef,
      popoverInstRef,
      handlePositiveClick,
      handleNegativeClick
    };
  },
  render() {
    const {
      $slots: slots,
      $props: props,
      mergedTheme
    } = this;
    return openBlock(), createBlock(Popover_default, mergeProps(omit(props, panelPropKeys), {
      theme: mergedTheme.peers.Popover,
      themeOverrides: mergedTheme.peerOverrides.Popover,
      internalExtraClass: ["popconfirm"],
      ref: "popoverInstRef"
    }), {
      trigger: slots.trigger,
      default: () => {
        const panelProps = keep(props, panelPropKeys);
        return openBlock(), createBlock(PopconfirmPanel_default, {
          ...panelProps,
          onPositiveClick: this.handlePositiveClick,
          onNegativeClick: this.handleNegativeClick
        }, normalizeSlots(slots), 1040);
      }
    }, 1040, ["theme", "themeOverrides"]);
  }
});
//#endregion
export { Popconfirm_default as default, popconfirmProps };