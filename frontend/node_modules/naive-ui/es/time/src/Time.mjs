import useLocale from "../../_mixins/use-locale.mjs";
import { computed, createTextVNode, defineComponent, h } from "vue";
import { format, formatDistanceStrict, fromUnixTime } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
//#region src/time/src/Time.ts
const timeProps = {
  time: {
    type: [Number, Date],
    default: void 0
  },
  type: {
    type: String,
    default: "datetime"
  },
  to: {
    type: [Number, Date],
    default: void 0
  },
  unix: Boolean,
  format: String,
  text: Boolean,
  timeZone: String
};
var Time_default = defineComponent({
  name: "Time",
  props: timeProps,
  setup(props) {
    const now = Date.now();
    const {
      localeRef,
      dateLocaleRef
    } = useLocale("Time");
    const mergedFormatRef = computed(() => {
      const {
        timeZone
      } = props;
      if (timeZone) return (time, _format, options) => {
        return formatInTimeZone(time, timeZone, _format, options);
      };
      return format;
    });
    const dateFnsOptionsRef = computed(() => {
      return {
        locale: dateLocaleRef.value.locale
      };
    });
    const mergedTimeRef = computed(() => {
      const {
        time
      } = props;
      if (props.unix) {
        if (time === void 0) return now;
        return fromUnixTime(typeof time === "number" ? time : time.valueOf());
      }
      return time ?? now;
    });
    const mergedToRef = computed(() => {
      const {
        to
      } = props;
      if (props.unix) {
        if (to === void 0) return now;
        return fromUnixTime(typeof to === "number" ? to : to.valueOf());
      }
      return to ?? now;
    });
    return {
      renderedTime: computed(() => {
        if (props.format) return mergedFormatRef.value(mergedTimeRef.value, props.format, dateFnsOptionsRef.value);else if (props.type === "date") return mergedFormatRef.value(mergedTimeRef.value, localeRef.value.dateFormat, dateFnsOptionsRef.value);else if (props.type === "datetime") return mergedFormatRef.value(mergedTimeRef.value, localeRef.value.dateTimeFormat, dateFnsOptionsRef.value);else return formatDistanceStrict(mergedTimeRef.value, mergedToRef.value, {
          addSuffix: true,
          locale: dateLocaleRef.value.locale
        });
      })
    };
  },
  render() {
    return this.text ? createTextVNode(this.renderedTime) : h("time", [this.renderedTime]);
  }
});
//#endregion
export { Time_default as default, timeProps };