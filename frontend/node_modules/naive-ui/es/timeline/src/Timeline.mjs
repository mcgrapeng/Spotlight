import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import timelineLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { createElementBlock, defineComponent, openBlock, provide } from "vue";
//#region src/timeline/src/Timeline.tsx
const timelineProps = {
  ...useTheme.props,
  horizontal: Boolean,
  itemPlacement: {
    type: String,
    default: "left"
  },
  size: {
    type: String,
    default: "medium"
  },
  iconSize: Number
};
const timelineInjectionKey = createInjectionKey("n-timeline");
var Timeline_default = defineComponent({
  name: "Timeline",
  props: timelineProps,
  setup(props, {
    slots
  }) {
    const {
      mergedClsPrefixRef
    } = useConfig(props);
    const themeRef = useTheme("Timeline", "-timeline", index_cssr_default, timelineLight, props, mergedClsPrefixRef);
    provide(timelineInjectionKey, {
      props,
      mergedThemeRef: themeRef,
      mergedClsPrefixRef
    });
    return () => {
      const {
        value: mergedClsPrefix
      } = mergedClsPrefixRef;
      return openBlock(), createElementBlock("div", {
        class: normalizeClass$1([`${mergedClsPrefix}-timeline`, props.horizontal && `${mergedClsPrefix}-timeline--horizontal`, `${mergedClsPrefix}-timeline--${props.size}-size`, !props.horizontal && `${mergedClsPrefix}-timeline--${props.itemPlacement}-placement`])
      }, [normalizeVNode(() => slots.default?.())], 2);
    };
  }
});
//#endregion
export { Timeline_default as default, timelineInjectionKey, timelineProps };