import { normalizeClass as normalizeClass$1 } from "../../../vue-jsx-vapor/vdom.mjs";
import { dataTableInjectionKey } from "../interface.mjs";
import { createElementBlock, defineComponent, inject, onBeforeUnmount, openBlock, ref } from "vue";
import { off, on } from "evtd";
//#region src/data-table/src/HeaderButton/ResizeButton.tsx
const _hoisted_1 = ["onMousedown"];
var ResizeButton_default = defineComponent({
  name: "ColumnResizeButton",
  props: {
    onResizeStart: Function,
    onResize: Function,
    onResizeEnd: Function
  },
  setup(props) {
    const {
      mergedClsPrefixRef
    } = inject(dataTableInjectionKey);
    const activeRef = ref(false);
    let startX = 0;
    function getMouseX(e) {
      return e.clientX;
    }
    function handleMousedown(e) {
      e.preventDefault();
      const alreadyStarted = activeRef.value;
      startX = getMouseX(e);
      activeRef.value = true;
      if (!alreadyStarted) {
        on("mousemove", window, handleMousemove);
        on("mouseup", window, handleMouseup);
        props.onResizeStart?.();
      }
    }
    function handleMousemove(e) {
      props.onResize?.(getMouseX(e) - startX);
    }
    function handleMouseup() {
      activeRef.value = false;
      props.onResizeEnd?.();
      off("mousemove", window, handleMousemove);
      off("mouseup", window, handleMouseup);
    }
    onBeforeUnmount(() => {
      off("mousemove", window, handleMousemove);
      off("mouseup", window, handleMouseup);
    });
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      active: activeRef,
      handleMousedown
    };
  },
  render() {
    const {
      mergedClsPrefix
    } = this;
    return openBlock(), createElementBlock("span", {
      "data-data-table-resizable": true,
      class: normalizeClass$1([`${mergedClsPrefix}-data-table-resize-button`, this.active && `${mergedClsPrefix}-data-table-resize-button--active`]),
      onMousedown: this.handleMousedown
    }, null, 42, _hoisted_1);
  }
});
//#endregion
export { ResizeButton_default as default };