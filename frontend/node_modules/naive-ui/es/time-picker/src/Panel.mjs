import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import focus_detector_default from "../../_internal/focus-detector/index.mjs";
import Scrollbar from "../../_internal/scrollbar/src/Scrollbar.mjs";
import Button from "../../button/src/Button.mjs";
import { timePickerInjectionKey } from "./interface.mjs";
import PanelCol_default from "./PanelCol.mjs";
import { getAmPm, getTimeUnits, time } from "./utils.mjs";
import { computed, createBlock, createElementBlock, createElementVNode, defineComponent, inject, openBlock, ref } from "vue";
//#region src/time-picker/src/Panel.tsx
const _hoisted_1 = ["onFocusin", "onFocusout", "onKeydown"];
var Panel_default = defineComponent({
  name: "TimePickerPanel",
  props: {
    actions: {
      type: Array,
      default: () => ["now", "confirm"]
    },
    showHour: {
      type: Boolean,
      default: true
    },
    showMinute: {
      type: Boolean,
      default: true
    },
    showSecond: {
      type: Boolean,
      default: true
    },
    showPeriod: {
      type: Boolean,
      default: true
    },
    isHourInvalid: Boolean,
    isMinuteInvalid: Boolean,
    isSecondInvalid: Boolean,
    isAmPmInvalid: Boolean,
    isValueInvalid: Boolean,
    hourValue: {
      type: Number,
      default: null
    },
    minuteValue: {
      type: Number,
      default: null
    },
    secondValue: {
      type: Number,
      default: null
    },
    amPmValue: {
      type: String,
      default: null
    },
    isHourDisabled: Function,
    isMinuteDisabled: Function,
    isSecondDisabled: Function,
    onHourClick: {
      type: Function,
      required: true
    },
    onMinuteClick: {
      type: Function,
      required: true
    },
    onSecondClick: {
      type: Function,
      required: true
    },
    onAmPmClick: {
      type: Function,
      required: true
    },
    onNowClick: Function,
    clearText: String,
    nowText: String,
    confirmText: String,
    transitionDisabled: Boolean,
    onClearClick: Function,
    onConfirmClick: Function,
    onFocusin: Function,
    onFocusout: Function,
    onFocusDetectorFocus: Function,
    onKeydown: Function,
    hours: [Number, Array],
    minutes: [Number, Array],
    seconds: [Number, Array],
    use12Hours: Boolean
  },
  setup(props) {
    const {
      mergedThemeRef,
      mergedClsPrefixRef
    } = inject(timePickerInjectionKey);
    return {
      mergedTheme: mergedThemeRef,
      mergedClsPrefix: mergedClsPrefixRef,
      hours: computed(() => {
        const {
          isHourDisabled,
          hours,
          use12Hours,
          amPmValue
        } = props;
        if (!use12Hours) return getTimeUnits(time.hours, hours).map(hour => {
          return {
            label: hour,
            value: Number(hour),
            disabled: isHourDisabled ? isHourDisabled(Number(hour)) : false
          };
        });else {
          const mergedAmPmValue = amPmValue ?? getAmPm(Date.now());
          return getTimeUnits(time.hours, hours, mergedAmPmValue).map(hour => {
            const hourAs12FormattedNumber = Number(hour);
            const hourAs24FormattedNumber = mergedAmPmValue === "pm" && hourAs12FormattedNumber !== 12 ? hourAs12FormattedNumber + 12 : hourAs12FormattedNumber;
            return {
              label: hour,
              value: hourAs24FormattedNumber,
              disabled: isHourDisabled ? isHourDisabled(hourAs24FormattedNumber) : false
            };
          });
        }
      }),
      minutes: computed(() => {
        const {
          isMinuteDisabled,
          minutes
        } = props;
        return getTimeUnits(time.minutes, minutes).map(minute => {
          return {
            label: minute,
            value: Number(minute),
            disabled: isMinuteDisabled ? isMinuteDisabled(Number(minute), props.hourValue) : false
          };
        });
      }),
      seconds: computed(() => {
        const {
          isSecondDisabled,
          seconds
        } = props;
        return getTimeUnits(time.seconds, seconds).map(second => {
          return {
            label: second,
            value: Number(second),
            disabled: isSecondDisabled ? isSecondDisabled(Number(second), props.minuteValue, props.hourValue) : false
          };
        });
      }),
      amPm: computed(() => {
        const {
          isHourDisabled
        } = props;
        let amDisabled = true;
        let pmDisabled = true;
        for (let i = 0; i < 12; ++i) if (!isHourDisabled?.(i)) {
          amDisabled = false;
          break;
        }
        for (let i = 12; i < 24; ++i) if (!isHourDisabled?.(i)) {
          pmDisabled = false;
          break;
        }
        return [{
          label: "AM",
          value: "am",
          disabled: amDisabled
        }, {
          label: "PM",
          value: "pm",
          disabled: pmDisabled
        }];
      }),
      hourScrollRef: ref(null),
      minuteScrollRef: ref(null),
      secondScrollRef: ref(null),
      amPmScrollRef: ref(null)
    };
  },
  render() {
    const {
      mergedClsPrefix,
      mergedTheme
    } = this;
    return openBlock(), createElementBlock("div", {
      tabindex: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-time-picker-panel`),
      onFocusin: this.onFocusin,
      onFocusout: this.onFocusout,
      onKeydown: this.onKeydown
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-time-picker-cols`)
    }, [this.showHour ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1([`${mergedClsPrefix}-time-picker-col`, this.isHourInvalid && `${mergedClsPrefix}-time-picker-col--invalid`, this.transitionDisabled && `${mergedClsPrefix}-time-picker-col--transition-disabled`])
    }, [(openBlock(), createBlock(Scrollbar, {
      ref: "hourScrollRef",
      theme: mergedTheme.peers.Scrollbar,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar
    }, {
      default: () => [(openBlock(), createBlock(PanelCol_default, {
        clsPrefix: mergedClsPrefix,
        data: this.hours,
        activeValue: this.hourValue,
        onItemClick: this.onHourClick
      }, null, 8, ["clsPrefix", "data", "activeValue", "onItemClick"])), (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-time-picker-col__padding`)
      }, null, 2))]
    }, 1032, ["theme", "themeOverrides"]))], 2)) : normalizeVNode(() => null), this.showMinute ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1([`${mergedClsPrefix}-time-picker-col`, this.transitionDisabled && `${mergedClsPrefix}-time-picker-col--transition-disabled`, this.isMinuteInvalid && `${mergedClsPrefix}-time-picker-col--invalid`])
    }, [(openBlock(), createBlock(Scrollbar, {
      ref: "minuteScrollRef",
      theme: mergedTheme.peers.Scrollbar,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar
    }, {
      default: () => [(openBlock(), createBlock(PanelCol_default, {
        clsPrefix: mergedClsPrefix,
        data: this.minutes,
        activeValue: this.minuteValue,
        onItemClick: this.onMinuteClick
      }, null, 8, ["clsPrefix", "data", "activeValue", "onItemClick"])), (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-time-picker-col__padding`)
      }, null, 2))]
    }, 1032, ["theme", "themeOverrides"]))], 2)) : normalizeVNode(() => null), this.showSecond ? (openBlock(), createElementBlock("div", {
      key: 4,
      class: normalizeClass$1([`${mergedClsPrefix}-time-picker-col`, this.isSecondInvalid && `${mergedClsPrefix}-time-picker-col--invalid`, this.transitionDisabled && `${mergedClsPrefix}-time-picker-col--transition-disabled`])
    }, [(openBlock(), createBlock(Scrollbar, {
      ref: "secondScrollRef",
      theme: mergedTheme.peers.Scrollbar,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar
    }, {
      default: () => [(openBlock(), createBlock(PanelCol_default, {
        clsPrefix: mergedClsPrefix,
        data: this.seconds,
        activeValue: this.secondValue,
        onItemClick: this.onSecondClick
      }, null, 8, ["clsPrefix", "data", "activeValue", "onItemClick"])), (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-time-picker-col__padding`)
      }, null, 2))]
    }, 1032, ["theme", "themeOverrides"]))], 2)) : normalizeVNode(() => null), this.use12Hours ? (openBlock(), createElementBlock("div", {
      key: 6,
      class: normalizeClass$1([`${mergedClsPrefix}-time-picker-col`, this.isAmPmInvalid && `${mergedClsPrefix}-time-picker-col--invalid`, this.transitionDisabled && `${mergedClsPrefix}-time-picker-col--transition-disabled`])
    }, [(openBlock(), createBlock(Scrollbar, {
      ref: "amPmScrollRef",
      theme: mergedTheme.peers.Scrollbar,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar
    }, {
      default: () => [(openBlock(), createBlock(PanelCol_default, {
        clsPrefix: mergedClsPrefix,
        data: this.amPm,
        activeValue: this.amPmValue,
        onItemClick: this.onAmPmClick
      }, null, 8, ["clsPrefix", "data", "activeValue", "onItemClick"])), (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-time-picker-col__padding`)
      }, null, 2))]
    }, 1032, ["theme", "themeOverrides"]))], 2)) : normalizeVNode(() => null)], 2), this.actions?.length ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-time-picker-actions`)
    }, [this.actions?.includes("clear") ? (openBlock(), createBlock(Button, {
      key: 0,
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      size: "tiny",
      onClick: this.onClearClick
    }, {
      default: () => this.clearText
    }, 1032, ["theme", "themeOverrides", "onClick"])) : normalizeVNode(() => null), this.actions?.includes("now") ? (openBlock(), createBlock(Button, {
      key: 2,
      size: "tiny",
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      onClick: this.onNowClick
    }, {
      default: () => this.nowText
    }, 1032, ["theme", "themeOverrides", "onClick"])) : normalizeVNode(() => null), this.actions?.includes("confirm") ? (openBlock(), createBlock(Button, {
      key: 4,
      size: "tiny",
      type: "primary",
      class: normalizeClass$1(`${mergedClsPrefix}-time-picker-actions__confirm`),
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      disabled: this.isValueInvalid,
      onClick: this.onConfirmClick
    }, {
      default: () => this.confirmText
    }, 1032, ["class", "theme", "themeOverrides", "disabled", "onClick"])) : normalizeVNode(() => null)], 2)) : normalizeVNode(() => null), (openBlock(), createBlock(focus_detector_default, {
      onFocus: this.onFocusDetectorFocus
    }, null, 8, ["onFocus"]))], 42, _hoisted_1);
  }
});
//#endregion
export { Panel_default as default };