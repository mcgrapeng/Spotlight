import useStyle from "../../../_mixins/use-style.mjs";
import { normalizeClass as normalizeClass$1 } from "../../../vue-jsx-vapor/vdom.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { createElementBlock, defineComponent, nextTick, onBeforeUnmount, openBlock, ref, toRef } from "vue";
//#region src/_internal/wave/src/Wave.tsx
var Wave_default = defineComponent({
  name: "BaseWave",
  props: {
    clsPrefix: {
      type: String,
      required: true
    }
  },
  setup(props) {
    useStyle("-base-wave", index_cssr_default, toRef(props, "clsPrefix"));
    const selfRef = ref(null);
    const activeRef = ref(false);
    let animationTimerId = null;
    onBeforeUnmount(() => {
      if (animationTimerId !== null) window.clearTimeout(animationTimerId);
    });
    return {
      active: activeRef,
      selfRef,
      play() {
        if (animationTimerId !== null) {
          window.clearTimeout(animationTimerId);
          activeRef.value = false;
          animationTimerId = null;
        }
        nextTick(() => {
          selfRef.value?.offsetHeight;
          activeRef.value = true;
          animationTimerId = window.setTimeout(() => {
            activeRef.value = false;
            animationTimerId = null;
          }, 1e3);
        });
      }
    };
  },
  render() {
    const {
      clsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      ref: "selfRef",
      "aria-hidden": true,
      class: normalizeClass$1([`${clsPrefix}-base-wave`, this.active && `${clsPrefix}-base-wave--active`])
    }, null, 2);
  }
});
//#endregion
export { Wave_default as default };