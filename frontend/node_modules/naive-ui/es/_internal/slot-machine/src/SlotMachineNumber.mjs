import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import { computed, createElementBlock, createElementVNode, defineComponent, nextTick, openBlock, ref, toRef, watch } from "vue";
//#region src/_internal/slot-machine/src/SlotMachineNumber.tsx
var SlotMachineNumber_default = defineComponent({
  name: "SlotMachineNumber",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      required: true
    },
    oldOriginalNumber: {
      type: Number,
      default: void 0
    },
    newOriginalNumber: {
      type: Number,
      default: void 0
    }
  },
  setup(props) {
    const numberRef = ref(null);
    const oldNumberRef = ref(props.value);
    const newNumberRef = ref(props.value);
    const scrollAnimationDirectionRef = ref("up");
    const activeRef = ref(false);
    const newNumberScrollAnimationClassRef = computed(() => {
      return activeRef.value ? `${props.clsPrefix}-base-slot-machine-current-number--${scrollAnimationDirectionRef.value}-scroll` : null;
    });
    const oldNumberScrollAnimationClassRef = computed(() => {
      return activeRef.value ? `${props.clsPrefix}-base-slot-machine-old-number--${scrollAnimationDirectionRef.value}-scroll` : null;
    });
    watch(toRef(props, "value"), (value, oldValue) => {
      oldNumberRef.value = oldValue;
      newNumberRef.value = value;
      nextTick(scroll);
    });
    function scroll() {
      const newOriginalNumber = props.newOriginalNumber;
      const oldOriginalNumber = props.oldOriginalNumber;
      if (oldOriginalNumber === void 0 || newOriginalNumber === void 0) return;
      if (newOriginalNumber > oldOriginalNumber) scrollByDir("up");else if (oldOriginalNumber > newOriginalNumber) scrollByDir("down");
    }
    function scrollByDir(dir) {
      scrollAnimationDirectionRef.value = dir;
      activeRef.value = false;
      nextTick(() => {
        numberRef.value?.offsetWidth;
        activeRef.value = true;
      });
    }
    return () => {
      const {
        clsPrefix
      } = props;
      return openBlock(), createElementBlock("span", {
        ref: numberRef,
        class: normalizeClass$1(`${clsPrefix}-base-slot-machine-number`)
      }, [oldNumberRef.value !== null ? (openBlock(), createElementBlock("span", {
        key: 0,
        class: normalizeClass$1([`${clsPrefix}-base-slot-machine-old-number ${clsPrefix}-base-slot-machine-old-number--top`, oldNumberScrollAnimationClassRef.value])
      }, [normalizeVNode(() => oldNumberRef.value)], 2)) : normalizeVNode(() => null), createElementVNode("span", {
        class: normalizeClass$1([`${clsPrefix}-base-slot-machine-current-number`, newNumberScrollAnimationClassRef.value])
      }, [createElementVNode("span", {
        ref: "numberWrapper",
        class: normalizeClass$1([`${clsPrefix}-base-slot-machine-current-number__inner`, typeof props.value !== "number" && `${clsPrefix}-base-slot-machine-current-number__inner--not-number`])
      }, [normalizeVNode(() => newNumberRef.value)], 2)], 2), oldNumberRef.value !== null ? (openBlock(), createElementBlock("span", {
        key: 2,
        class: normalizeClass$1([`${clsPrefix}-base-slot-machine-old-number ${clsPrefix}-base-slot-machine-old-number--bottom`, oldNumberScrollAnimationClassRef.value])
      }, [normalizeVNode(() => oldNumberRef.value)], 2)) : normalizeVNode(() => null)], 2);
    };
  }
});
//#endregion
export { SlotMachineNumber_default as default };