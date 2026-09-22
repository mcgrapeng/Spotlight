import useConfig from "../../_mixins/use-config.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { loadingBarApiInjectionKey, loadingBarProviderInjectionKey } from "./context.mjs";
import LoadingBar_default from "./LoadingBar.mjs";
import { Fragment, Teleport, createBlock, createElementBlock, defineComponent, nextTick, openBlock, provide, ref } from "vue";
import { useIsMounted } from "vooks";
//#region src/loading-bar/src/LoadingBarProvider.tsx
const loadingBarProviderProps = {
  ...useTheme.props,
  to: {
    type: [String, Object, Boolean],
    default: void 0
  },
  containerClass: String,
  containerStyle: [String, Object],
  loadingBarStyle: {
    type: Object
  }
};
var LoadingBarProvider_default = defineComponent({
  name: "LoadingBarProvider",
  props: loadingBarProviderProps,
  setup(props) {
    const isMountedRef = useIsMounted();
    const loadingBarRef = ref(null);
    const methods = {
      start() {
        if (isMountedRef.value) loadingBarRef.value?.start();else nextTick(() => {
          loadingBarRef.value?.start();
        });
      },
      error() {
        if (isMountedRef.value) loadingBarRef.value?.error();else nextTick(() => {
          loadingBarRef.value?.error();
        });
      },
      finish() {
        if (isMountedRef.value) loadingBarRef.value?.finish();else nextTick(() => {
          loadingBarRef.value?.finish();
        });
      }
    };
    const {
      mergedClsPrefixRef
    } = useConfig(props);
    provide(loadingBarApiInjectionKey, methods);
    provide(loadingBarProviderInjectionKey, {
      props,
      mergedClsPrefixRef
    });
    return Object.assign(methods, {
      loadingBarRef
    });
  },
  render() {
    return openBlock(), createElementBlock(Fragment, null, [(openBlock(), createBlock(Teleport, {
      disabled: this.to === false,
      to: this.to || "body"
    }, [(openBlock(), createBlock(LoadingBar_default, {
      ref: "loadingBarRef",
      containerStyle: this.containerStyle,
      containerClass: this.containerClass
    }, null, 8, ["containerStyle", "containerClass"]))], 8, ["disabled", "to"])), normalizeVNode(() => this.$slots.default?.())], 64);
  }
});
//#endregion
export { LoadingBarProvider_default as default, loadingBarProviderProps };