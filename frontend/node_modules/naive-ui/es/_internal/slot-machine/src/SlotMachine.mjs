import useStyle from "../../../_mixins/use-style.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import FadeInExpandTransition_default from "../../fade-in-expand-transition/src/FadeInExpandTransition.mjs";
import SlotMachineNumber_default from "./SlotMachineNumber.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { TransitionGroup, computed, createBlock, createElementBlock, createVNode, defineComponent, openBlock, ref, toRef, watch } from "vue";
//#region src/_internal/slot-machine/src/SlotMachine.tsx
var SlotMachine_default = defineComponent({
  name: "BaseSlotMachine",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      default: 0
    },
    max: {
      type: Number,
      default: void 0
    },
    appeared: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    useStyle("-base-slot-machine", index_cssr_default, toRef(props, "clsPrefix"));
    const oldValueRef = ref();
    const newValueRef = ref();
    const numbersRef = computed(() => {
      if (typeof props.value === "string") return [];
      if (props.value < 1) return [0];
      const numbers = [];
      let value = props.value;
      if (props.max !== void 0) value = Math.min(props.max, value);
      while (value >= 1) {
        numbers.push(value % 10);
        value /= 10;
        value = Math.floor(value);
      }
      numbers.reverse();
      return numbers;
    });
    watch(toRef(props, "value"), (value, oldValue) => {
      if (typeof value === "string") {
        newValueRef.value = void 0;
        oldValueRef.value = void 0;
      } else if (typeof oldValue === "string") {
        newValueRef.value = value;
        oldValueRef.value = void 0;
      } else {
        newValueRef.value = value;
        oldValueRef.value = oldValue;
      }
    });
    return () => {
      const {
        value,
        clsPrefix
      } = props;
      return typeof value === "number" ? (openBlock(), createElementBlock("span", {
        key: 1,
        class: normalizeClass$1(`${clsPrefix}-base-slot-machine`)
      }, [createVNode(TransitionGroup, {
        name: "fade-up-width-expand-transition",
        tag: "span"
      }, {
        default: () => numbersRef.value.map((number, i) => (openBlock(), createBlock(SlotMachineNumber_default, {
          clsPrefix,
          key: numbersRef.value.length - i - 1,
          oldOriginalNumber: oldValueRef.value,
          newOriginalNumber: newValueRef.value,
          value: number
        }, null, 8, ["clsPrefix", "oldOriginalNumber", "newOriginalNumber", "value"])))
      }, 1024), createVNode(FadeInExpandTransition_default, {
        key: "+",
        width: true
      }, {
        default: () => props.max !== void 0 && props.max < value ? (openBlock(), createBlock(SlotMachineNumber_default, {
          key: 2,
          clsPrefix,
          value: "+"
        }, null, 8, ["clsPrefix"])) : null
      }, 1024)], 2)) : (openBlock(), createElementBlock("span", {
        key: 3,
        class: normalizeClass$1(`${clsPrefix}-base-slot-machine`)
      }, [normalizeVNode(() => value)], 2));
    };
  }
});
//#endregion
export { SlotMachine_default as default };