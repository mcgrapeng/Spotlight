import { defineComponent, onBeforeUnmount, onMounted, ref, watchEffect } from "vue";
//#region src/countdown/src/Countdown.tsx
const countdownProps = {
  duration: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  precision: {
    type: Number,
    default: 0
  },
  render: Function,
  onFinish: Function
};
var Countdown_default = defineComponent({
  name: "Countdown",
  props: countdownProps,
  setup(props) {
    let timerId = null;
    let elapsed = 0;
    let finished = false;
    const distanceRef = ref(0);
    watchEffect(() => {
      distanceRef.value = props.duration;
    });
    let pnow = -1;
    function getDistance(time) {
      return props.duration - elapsed + pnow - time;
    }
    function getTimeInfo(distance) {
      return {
        hours: Math.floor(distance / 36e5),
        minutes: Math.floor(distance % 36e5 / 6e4),
        seconds: Math.floor(distance % 6e4 / 1e3),
        milliseconds: Math.floor(distance % 1e3)
      };
    }
    function getDisplayValue(info) {
      const {
        hours,
        minutes,
        seconds,
        milliseconds
      } = info;
      const {
        precision
      } = props;
      switch (precision) {
        case 0:
          return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        default:
          return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(Math.floor(milliseconds / (precision === 1 ? 100 : precision === 2 ? 10 : 1))).padStart(precision, "0")}`;
      }
    }
    const frame = () => {
      const {
        precision
      } = props;
      const distance = getDistance(performance.now());
      if (distance <= 0) {
        distanceRef.value = 0;
        stopTimer();
        if (!finished) {
          finished = true;
          props.onFinish?.();
        }
        return;
      }
      let leftTime;
      switch (precision) {
        case 3:
        case 2:
          leftTime = distance % 34;
          break;
        case 1:
          leftTime = distance % 100;
          break;
        default:
          leftTime = distance % 1e3;
      }
      distanceRef.value = distance;
      timerId = window.setTimeout(() => {
        frame();
      }, leftTime);
    };
    function stopTimer() {
      if (timerId !== null) {
        window.clearTimeout(timerId);
        timerId = null;
      }
    }
    onMounted(() => {
      watchEffect(() => {
        if (props.active) {
          pnow = performance.now();
          frame();
        } else {
          const now = performance.now();
          if (pnow !== -1) elapsed += now - pnow;
          stopTimer();
        }
      });
    });
    onBeforeUnmount(() => {
      stopTimer();
    });
    function reset() {
      distanceRef.value = props.duration;
      elapsed = 0;
      pnow = performance.now();
      if (props.active && finished) frame();
      finished = false;
    }
    return Object.assign({
      reset
    }, {
      distance: distanceRef,
      getTimeInfo,
      getDisplayValue
    });
  },
  render() {
    const {
      render,
      precision,
      distance,
      getTimeInfo,
      getDisplayValue
    } = this;
    let timeInfo;
    switch (precision) {
      case 0:
        timeInfo = getTimeInfo(distance + 999);
        timeInfo.milliseconds = 0;
        break;
      case 1:
        timeInfo = getTimeInfo(distance + 99);
        timeInfo.milliseconds = Math.floor(timeInfo.milliseconds / 100) * 100;
        break;
      case 2:
        timeInfo = getTimeInfo(distance + 9);
        timeInfo.milliseconds = Math.floor(timeInfo.milliseconds / 10) * 10;
        break;
      case 3:
        timeInfo = getTimeInfo(distance);
    }
    if (render) return render(timeInfo);else return getDisplayValue(timeInfo);
  }
});
//#endregion
export { countdownProps, Countdown_default as default };