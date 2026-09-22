import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1 } from "../../vue-jsx-vapor/vdom.mjs";
import { loadingBarProviderInjectionKey } from "./context.mjs";
import loadingBarLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { Transition, computed, createBlock, createElementBlock, createElementVNode, defineComponent, inject, nextTick, normalizeStyle, openBlock, ref, vShow, withDirectives } from "vue";
//#region src/loading-bar/src/LoadingBar.tsx
function createClassName(status, clsPrefix) {
  return `${clsPrefix}-loading-bar ${clsPrefix}-loading-bar--${status}`;
}
var LoadingBar_default = defineComponent({
  name: "LoadingBar",
  props: {
    containerClass: String,
    containerStyle: [String, Object]
  },
  setup() {
    const {
      inlineThemeDisabled
    } = useConfig();
    const {
      props: providerProps,
      mergedClsPrefixRef
    } = inject(loadingBarProviderInjectionKey);
    const loadingBarRef = ref(null);
    const enteringRef = ref(false);
    const startedRef = ref(false);
    const loadingRef = ref(false);
    const transitionDisabledRef = ref(false);
    let finishing = false;
    const erroringRef = ref(false);
    const mergedLoadingBarStyle = computed(() => {
      const {
        loadingBarStyle
      } = providerProps;
      if (!loadingBarStyle) return "";
      return loadingBarStyle[erroringRef.value ? "error" : "loading"];
    });
    async function init() {
      enteringRef.value = false;
      loadingRef.value = false;
      finishing = false;
      erroringRef.value = false;
      transitionDisabledRef.value = true;
      await nextTick();
      transitionDisabledRef.value = false;
    }
    async function start(fromProgress = 0, toProgress = 80, status = "starting") {
      startedRef.value = true;
      await init();
      if (finishing) return;
      loadingRef.value = true;
      await nextTick();
      const el = loadingBarRef.value;
      if (!el) return;
      el.style.maxWidth = `${fromProgress}%`;
      el.style.transition = "none";
      el.offsetWidth;
      el.className = createClassName(status, mergedClsPrefixRef.value);
      el.style.transition = "";
      el.style.maxWidth = `${toProgress}%`;
    }
    async function finish() {
      if (finishing || erroringRef.value) return;
      if (startedRef.value) await nextTick();
      finishing = true;
      const el = loadingBarRef.value;
      if (!el) return;
      el.className = createClassName("finishing", mergedClsPrefixRef.value);
      el.style.maxWidth = "100%";
      el.offsetWidth;
      loadingRef.value = false;
    }
    function error() {
      if (finishing || erroringRef.value) return;
      if (!loadingRef.value) start(100, 100, "error").then(() => {
        erroringRef.value = true;
        const el = loadingBarRef.value;
        if (!el) return;
        el.className = createClassName("error", mergedClsPrefixRef.value);
        el.offsetWidth;
        loadingRef.value = false;
      });else {
        erroringRef.value = true;
        const el = loadingBarRef.value;
        if (!el) return;
        el.className = createClassName("error", mergedClsPrefixRef.value);
        el.style.maxWidth = "100%";
        el.offsetWidth;
        loadingRef.value = false;
      }
    }
    function handleEnter() {
      enteringRef.value = true;
    }
    function handleAfterEnter() {
      enteringRef.value = false;
    }
    async function handleAfterLeave() {
      await init();
    }
    const themeRef = useTheme("LoadingBar", "-loading-bar", index_cssr_default, loadingBarLight, providerProps, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        self: {
          height,
          colorError,
          colorLoading
        }
      } = themeRef.value;
      return {
        "--n-height": height,
        "--n-color-loading": colorLoading,
        "--n-color-error": colorError
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("loading-bar", void 0, cssVarsRef, providerProps) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      loadingBarRef,
      started: startedRef,
      loading: loadingRef,
      entering: enteringRef,
      transitionDisabled: transitionDisabledRef,
      start,
      error,
      finish,
      handleEnter,
      handleAfterEnter,
      handleAfterLeave,
      mergedLoadingBarStyle,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    if (!this.started) return null;
    const {
      mergedClsPrefix
    } = this;
    return openBlock(), createBlock(Transition, {
      name: "fade-in-transition",
      appear: true,
      onEnter: this.handleEnter,
      onAfterEnter: this.handleAfterEnter,
      onAfterLeave: this.handleAfterLeave,
      css: !this.transitionDisabled
    }, {
      default: () => {
        this.onRender?.();
        return withDirectives((openBlock(), createElementBlock("div", {
          class: normalizeClass$1([`${mergedClsPrefix}-loading-bar-container`, this.themeClass, this.containerClass]),
          style: normalizeStyle(this.containerStyle)
        }, [createElementVNode("div", {
          ref: "loadingBarRef",
          class: normalizeClass$1([`${mergedClsPrefix}-loading-bar`]),
          style: normalizeStyle([this.cssVars, this.mergedLoadingBarStyle])
        }, null, 6)], 6)), [[vShow, this.loading || !this.loading && this.entering]]);
      }
    }, 1032, ["onEnter", "onAfterEnter", "onAfterLeave", "css"]);
  }
});
//#endregion
export { LoadingBar_default as default };