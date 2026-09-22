import { normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { logInjectionKey } from "./context.mjs";
import { Fragment, computed, createElementBlock, defineComponent, inject, onMounted, openBlock, ref, toRef, watch } from "vue";
//#region src/log/src/LogLine.tsx
const _hoisted_1 = {
  ref: "selfRef"
};
var LogLine_default = defineComponent({
  props: {
    line: {
      type: String,
      default: ""
    }
  },
  setup(props) {
    const {
      trimRef,
      highlightRef,
      languageRef,
      mergedHljsRef
    } = inject(logInjectionKey);
    const selfRef = ref(null);
    const maybeTrimmedLinesRef = computed(() => {
      return trimRef.value ? props.line.trim() : props.line;
    });
    function setInnerHTML() {
      if (selfRef.value) selfRef.value.innerHTML = generateCodeHTML(languageRef.value, maybeTrimmedLinesRef.value);
    }
    function generateCodeHTML(language, code) {
      const {
        value: hljs
      } = mergedHljsRef;
      if (hljs) {
        if (language && hljs.getLanguage(language)) return hljs.highlight(code, {
          language
        }).value;
      }
      return code;
    }
    onMounted(() => {
      if (highlightRef.value) setInnerHTML();
    });
    watch(toRef(props, "line"), () => {
      if (highlightRef.value) setInnerHTML();
    });
    return {
      highlight: highlightRef,
      selfRef,
      maybeTrimmedLines: maybeTrimmedLinesRef
    };
  },
  render() {
    const {
      highlight,
      maybeTrimmedLines
    } = this;
    return openBlock(), createElementBlock("pre", _hoisted_1, [highlight ? normalizeVNode(() => null) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => maybeTrimmedLines)], 64))], 512);
  }
});
//#endregion
export { LogLine_default as default };