import useLocale from "../../_mixins/use-locale.mjs";
import { tween } from "./utils.mjs";
import { computed, defineComponent, onMounted, ref, watchEffect } from "vue";
import { round } from "lodash-es";
//#region src/number-animation/src/NumberAnimation.tsx
const numberAnimationProps = {
  to: {
    type: Number,
    default: 0
  },
  precision: {
    type: Number,
    default: 0
  },
  showSeparator: Boolean,
  locale: String,
  from: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  duration: {
    type: Number,
    default: 2e3
  },
  onFinish: Function
};
var NumberAnimation_default = defineComponent({
  name: "NumberAnimation",
  props: numberAnimationProps,
  setup(props) {
    const {
      localeRef
    } = useLocale("name");
    const {
      duration
    } = props;
    const displayedValueRef = ref(props.from);
    const mergedLocaleRef = computed(() => {
      const {
        locale
      } = props;
      if (locale !== void 0) return locale;
      return localeRef.value;
    });
    let animating = false;
    const onUpdate = currentValue => {
      displayedValueRef.value = currentValue;
    };
    const onFinish = () => {
      displayedValueRef.value = props.to;
      animating = false;
      props.onFinish?.();
    };
    const animate = (from = props.from, to = props.to) => {
      animating = true;
      displayedValueRef.value = props.from;
      if (from !== to) tween({
        from,
        to,
        duration,
        onUpdate,
        onFinish
      });
    };
    const formattedValueRef = computed(() => {
      const splitValue = round(displayedValueRef.value, props.precision).toFixed(props.precision).split(".");
      const numberFormatter = new Intl.NumberFormat(mergedLocaleRef.value);
      const decimalSeparator = numberFormatter.formatToParts(.5).find(part => part.type === "decimal")?.value;
      return {
        integer: props.showSeparator ? numberFormatter.format(Number(splitValue[0])) : splitValue[0],
        decimal: splitValue[1],
        decimalSeparator
      };
    });
    function play() {
      if (animating) return;
      animate();
    }
    onMounted(() => {
      watchEffect(() => {
        if (props.active) animate();
      });
    });
    return {
      formattedValue: formattedValueRef,
      play
    };
  },
  render() {
    const {
      formattedValue: {
        integer,
        decimal,
        decimalSeparator
      }
    } = this;
    return [integer, decimal ? decimalSeparator : null, decimal];
  }
});
//#endregion
export { NumberAnimation_default as default, numberAnimationProps };