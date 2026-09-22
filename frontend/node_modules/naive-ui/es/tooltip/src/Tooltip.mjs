import useConfig from "../../_mixins/use-config.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import Popover_default, { popoverBaseProps } from "../../popover/src/Popover.mjs";
import tooltipLight from "../styles/light.mjs";
import { computed, defineComponent, h, ref } from "vue";
//#region src/tooltip/src/Tooltip.ts
const tooltipProps = {
  ...popoverBaseProps,
  ...useTheme.props
};
var Tooltip_default = defineComponent({
  name: "Tooltip",
  props: tooltipProps,
  slots: Object,
  __popover__: true,
  setup(props) {
    const {
      mergedClsPrefixRef
    } = useConfig(props);
    const themeRef = useTheme("Tooltip", "-tooltip", void 0, tooltipLight, props, mergedClsPrefixRef);
    const popoverRef = ref(null);
    return {
      syncPosition() {
        popoverRef.value.syncPosition();
      },
      setShow(show) {
        popoverRef.value.setShow(show);
      },
      popoverRef,
      mergedTheme: themeRef,
      popoverThemeOverrides: computed(() => {
        return themeRef.value.self;
      })
    };
  },
  render() {
    const {
      mergedTheme,
      internalExtraClass
    } = this;
    return h(Popover_default, {
      ...this.$props,
      theme: mergedTheme.peers.Popover,
      themeOverrides: mergedTheme.peerOverrides.Popover,
      builtinThemeOverrides: this.popoverThemeOverrides,
      internalExtraClass: internalExtraClass.concat("tooltip"),
      ref: "popoverRef"
    }, this.$slots);
  }
});
//#endregion
export { Tooltip_default as default, tooltipProps };