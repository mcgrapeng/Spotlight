import { warnOnce } from "../../../_utils/naive/warn.mjs";
import { resolveSlot, resolveSlotWithTypedProps } from "../../../_utils/vue/resolve-slot.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import Backward_default from "../../../_internal/icons/Backward.mjs";
import FastBackward_default from "../../../_internal/icons/FastBackward.mjs";
import FastForward_default from "../../../_internal/icons/FastForward.mjs";
import Forward_default from "../../../_internal/icons/Forward.mjs";
import focus_detector_default from "../../../_internal/focus-detector/index.mjs";
import Input_default from "../../../input/src/Input.mjs";
import Button, { XButton } from "../../../button/src/Button.mjs";
import panelHeader_default from "./panelHeader.mjs";
import { useDualCalendar, useDualCalendarProps } from "./use-dual-calendar.mjs";
import TimePicker_default from "../../../time-picker/src/TimePicker.mjs";
import { Fragment, createBlock, createElementBlock, createElementVNode, defineComponent, mergeProps, openBlock, watchEffect } from "vue";
//#region src/date-picker/src/panel/datetimerange.tsx
const _hoisted_1 = ["onClick", "onMouseenter"];
const _hoisted_2 = ["onClick", "onMouseenter"];
const _hoisted_3 = ["onKeydown", "onFocus"];
const _hoisted_4 = ["onClick"];
const _hoisted_5 = ["onClick"];
const _hoisted_6 = ["onClick"];
const _hoisted_7 = ["onClick"];
const _hoisted_8 = ["onClick"];
const _hoisted_9 = ["onClick"];
const _hoisted_10 = ["onClick"];
const _hoisted_11 = ["onClick"];
var datetimerange_default = defineComponent({
  name: "DateTimeRangePanel",
  props: useDualCalendarProps,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.actions?.includes("now")) warnOnce("date-picker", "The `now` action is not supported for n-date-picker of `datetimerange` type");
    });
    return useDualCalendar(props, "datetimerange");
  },
  render() {
    const {
      mergedClsPrefix,
      mergedTheme,
      shortcuts,
      timePickerProps,
      onRender,
      datePickerSlots
    } = this;
    onRender?.();
    return openBlock(), createElementBlock("div", {
      ref: "selfRef",
      tabindex: 0,
      class: normalizeClass$1([`${mergedClsPrefix}-date-panel`, `${mergedClsPrefix}-date-panel--datetimerange`, !this.panel && `${mergedClsPrefix}-date-panel--shadow`, this.themeClass]),
      onKeydown: this.handlePanelKeyDown,
      onFocus: this.handlePanelFocus
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-header`)
    }, [(openBlock(), createBlock(Input_default, {
      value: this.startDateDisplayString,
      theme: mergedTheme.peers.Input,
      themeOverrides: mergedTheme.peerOverrides.Input,
      size: this.timePickerSize,
      stateful: false,
      readonly: this.inputReadonly,
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-date-input`),
      textDecoration: this.isStartValueInvalid ? "line-through" : "",
      placeholder: this.locale.selectDate,
      onBlur: this.handleStartDateInputBlur,
      onUpdateValue: this.handleStartDateInput
    }, null, 8, ["value", "theme", "themeOverrides", "size", "readonly", "class", "textDecoration", "placeholder", "onBlur", "onUpdateValue"])), (openBlock(), createBlock(TimePicker_default, mergeProps({
      placeholder: this.locale.selectTime,
      format: this.timePickerFormat,
      size: this.timePickerSize
    }, Array.isArray(timePickerProps) ? timePickerProps[0] : timePickerProps, {
      value: this.startTimeValue,
      to: false,
      showIcon: false,
      disabled: this.isSelecting,
      theme: mergedTheme.peers.TimePicker,
      themeOverrides: mergedTheme.peerOverrides.TimePicker,
      stateful: false,
      isHourDisabled: this.isStartHourDisabled,
      isMinuteDisabled: this.isStartMinuteDisabled,
      isSecondDisabled: this.isStartSecondDisabled,
      onUpdateValue: this.handleStartTimePickerChange
    }), null, 16, ["placeholder", "format", "size", "value", "disabled", "theme", "themeOverrides", "isHourDisabled", "isMinuteDisabled", "isSecondDisabled", "onUpdateValue"])), (openBlock(), createBlock(Input_default, {
      value: this.endDateInput,
      theme: mergedTheme.peers.Input,
      themeOverrides: mergedTheme.peerOverrides.Input,
      stateful: false,
      size: this.timePickerSize,
      readonly: this.inputReadonly,
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-date-input`),
      textDecoration: this.isEndValueInvalid ? "line-through" : "",
      placeholder: this.locale.selectDate,
      onBlur: this.handleEndDateInputBlur,
      onUpdateValue: this.handleEndDateInput
    }, null, 8, ["value", "theme", "themeOverrides", "size", "readonly", "class", "textDecoration", "placeholder", "onBlur", "onUpdateValue"])), (openBlock(), createBlock(TimePicker_default, mergeProps({
      placeholder: this.locale.selectTime,
      format: this.timePickerFormat,
      size: this.timePickerSize
    }, Array.isArray(timePickerProps) ? timePickerProps[1] : timePickerProps, {
      disabled: this.isSelecting,
      showIcon: false,
      theme: mergedTheme.peers.TimePicker,
      themeOverrides: mergedTheme.peerOverrides.TimePicker,
      to: false,
      stateful: false,
      value: this.endTimeValue,
      isHourDisabled: this.isEndHourDisabled,
      isMinuteDisabled: this.isEndMinuteDisabled,
      isSecondDisabled: this.isEndSecondDisabled,
      onUpdateValue: this.handleEndTimePickerChange
    }), null, 16, ["placeholder", "format", "size", "disabled", "theme", "themeOverrides", "value", "isHourDisabled", "isMinuteDisabled", "isSecondDisabled", "onUpdateValue"]))], 2), createElementVNode("div", {
      ref: "startDatesElRef",
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-calendar ${mergedClsPrefix}-date-panel-calendar--start`)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month`)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month__fast-prev`),
      onClick: this.startCalendarPrevYear
    }, [normalizeVNode(() => resolveSlot(datePickerSlots["prev-year"], () => [(openBlock(), createBlock(FastBackward_default))]))], 10, _hoisted_4), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month__prev`),
      onClick: this.startCalendarPrevMonth
    }, [normalizeVNode(() => resolveSlot(datePickerSlots["prev-month"], () => [(openBlock(), createBlock(Backward_default))]))], 10, _hoisted_5), (openBlock(), createBlock(panelHeader_default, {
      fastYearSelect: this.fastYearSelect,
      fastMonthSelect: this.fastMonthSelect,
      monthYearSeparator: this.calendarHeaderMonthYearSeparator,
      monthBeforeYear: this.calendarMonthBeforeYear,
      value: this.startCalendarDateTime,
      onUpdateValue: this.onUpdateStartCalendarValue,
      mergedClsPrefix,
      calendarMonth: this.startCalendarMonth,
      calendarYear: this.startCalendarYear
    }, null, 8, ["fastYearSelect", "fastMonthSelect", "monthYearSeparator", "monthBeforeYear", "value", "onUpdateValue", "mergedClsPrefix", "calendarMonth", "calendarYear"])), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month__next`),
      onClick: this.startCalendarNextMonth
    }, [normalizeVNode(() => resolveSlot(datePickerSlots["next-month"], () => [(openBlock(), createBlock(Forward_default))]))], 10, _hoisted_6), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month__fast-next`),
      onClick: this.startCalendarNextYear
    }, [normalizeVNode(() => resolveSlot(datePickerSlots["next-year"], () => [(openBlock(), createBlock(FastForward_default))]))], 10, _hoisted_7)], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-weekdays`)
    }, [normalizeVNode(() => this.weekdays.map(weekday => (openBlock(), createElementBlock("div", {
      key: weekday,
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-weekdays__day`)
    }, [normalizeVNode(() => weekday)], 2))))], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel__divider`)
    }, null, 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-dates`)
    }, [normalizeVNode(() => this.startDateArray.map((dateItem, i) => {
      const disabled = this.mergedIsDateDisabled(dateItem.ts);
      return openBlock(), createElementBlock("div", {
        "data-n-date": true,
        key: i,
        class: normalizeClass$1([`${mergedClsPrefix}-date-panel-date`, {
          [`${mergedClsPrefix}-date-panel-date--excluded`]: !dateItem.inCurrentMonth,
          [`${mergedClsPrefix}-date-panel-date--current`]: dateItem.isCurrentDate,
          [`${mergedClsPrefix}-date-panel-date--selected`]: dateItem.selected,
          [`${mergedClsPrefix}-date-panel-date--covered`]: dateItem.inSpan,
          [`${mergedClsPrefix}-date-panel-date--start`]: dateItem.startOfSpan,
          [`${mergedClsPrefix}-date-panel-date--end`]: dateItem.endOfSpan,
          [`${mergedClsPrefix}-date-panel-date--disabled`]: disabled
        }]),
        onClick: disabled ? void 0 : () => {
          this.handleDateClick(dateItem);
        },
        onMouseenter: disabled ? void 0 : () => {
          this.handleDateMouseEnter(dateItem);
        }
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-date-panel-date__trigger`)
      }, null, 2), normalizeVNode(() => dateItem.dateObject.date), dateItem.isCurrentDate ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass$1(`${mergedClsPrefix}-date-panel-date__sup`)
      }, null, 2)) : normalizeVNode(() => null)], 42, _hoisted_1);
    }))], 2)], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel__vertical-divider`)
    }, null, 2), createElementVNode("div", {
      ref: "endDatesElRef",
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-calendar ${mergedClsPrefix}-date-panel-calendar--end`)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month`)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month__fast-prev`),
      onClick: this.endCalendarPrevYear
    }, [normalizeVNode(() => resolveSlot(datePickerSlots["prev-year"], () => [(openBlock(), createBlock(FastBackward_default))]))], 10, _hoisted_8), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month__prev`),
      onClick: this.endCalendarPrevMonth
    }, [normalizeVNode(() => resolveSlot(datePickerSlots["prev-month"], () => [(openBlock(), createBlock(Backward_default))]))], 10, _hoisted_9), (openBlock(), createBlock(panelHeader_default, {
      fastYearSelect: this.fastYearSelect,
      fastMonthSelect: this.fastMonthSelect,
      monthBeforeYear: this.calendarMonthBeforeYear,
      value: this.endCalendarDateTime,
      onUpdateValue: this.onUpdateEndCalendarValue,
      mergedClsPrefix,
      monthYearSeparator: this.calendarHeaderMonthYearSeparator,
      calendarMonth: this.endCalendarMonth,
      calendarYear: this.endCalendarYear
    }, null, 8, ["fastYearSelect", "fastMonthSelect", "monthBeforeYear", "value", "onUpdateValue", "mergedClsPrefix", "monthYearSeparator", "calendarMonth", "calendarYear"])), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month__next`),
      onClick: this.endCalendarNextMonth
    }, [normalizeVNode(() => resolveSlot(datePickerSlots["next-month"], () => [(openBlock(), createBlock(Forward_default))]))], 10, _hoisted_10), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month__fast-next`),
      onClick: this.endCalendarNextYear
    }, [normalizeVNode(() => resolveSlot(datePickerSlots["next-year"], () => [(openBlock(), createBlock(FastForward_default))]))], 10, _hoisted_11)], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-weekdays`)
    }, [normalizeVNode(() => this.weekdays.map(weekday => (openBlock(), createElementBlock("div", {
      key: weekday,
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-weekdays__day`)
    }, [normalizeVNode(() => weekday)], 2))))], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel__divider`)
    }, null, 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-dates`)
    }, [normalizeVNode(() => this.endDateArray.map((dateItem, i) => {
      const disabled = this.mergedIsDateDisabled(dateItem.ts);
      return openBlock(), createElementBlock("div", {
        "data-n-date": true,
        key: i,
        class: normalizeClass$1([`${mergedClsPrefix}-date-panel-date`, {
          [`${mergedClsPrefix}-date-panel-date--excluded`]: !dateItem.inCurrentMonth,
          [`${mergedClsPrefix}-date-panel-date--current`]: dateItem.isCurrentDate,
          [`${mergedClsPrefix}-date-panel-date--selected`]: dateItem.selected,
          [`${mergedClsPrefix}-date-panel-date--covered`]: dateItem.inSpan,
          [`${mergedClsPrefix}-date-panel-date--start`]: dateItem.startOfSpan,
          [`${mergedClsPrefix}-date-panel-date--end`]: dateItem.endOfSpan,
          [`${mergedClsPrefix}-date-panel-date--disabled`]: disabled
        }]),
        onClick: disabled ? void 0 : () => {
          this.handleDateClick(dateItem);
        },
        onMouseenter: disabled ? void 0 : () => {
          this.handleDateMouseEnter(dateItem);
        }
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-date-panel-date__trigger`)
      }, null, 2), normalizeVNode(() => dateItem.dateObject.date), dateItem.isCurrentDate ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass$1(`${mergedClsPrefix}-date-panel-date__sup`)
      }, null, 2)) : normalizeVNode(() => null)], 42, _hoisted_2);
    }))], 2)], 2), this.datePickerSlots.footer ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-footer`)
    }, [normalizeVNode(() => this.datePickerSlots.footer())], 2)) : normalizeVNode(() => null), this.actions?.length || shortcuts ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-actions`)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-actions__prefix`)
    }, [normalizeVNode(() => shortcuts && Object.keys(shortcuts).map(key => {
      const shortcut = shortcuts[key];
      return Array.isArray(shortcut) || typeof shortcut === "function" ? (openBlock(), createBlock(XButton, {
        key: 1,
        size: "tiny",
        onMouseenter: () => {
          this.handleRangeShortcutMouseenter(shortcut);
        },
        onClick: () => {
          this.handleRangeShortcutClick(shortcut);
        },
        onMouseleave: () => {
          this.handleShortcutMouseleave();
        }
      }, {
        default: () => key
      }, 1032, ["onMouseenter", "onClick", "onMouseleave"])) : null;
    }))], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-actions__suffix`)
    }, [this.actions?.includes("clear") ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => resolveSlotWithTypedProps(datePickerSlots.clear, {
      onClear: this.handleClearClick,
      text: this.locale.clear
    }, () => [(openBlock(), createBlock(Button, {
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      size: "tiny",
      onClick: this.handleClearClick
    }, {
      default: () => this.locale.clear
    }, 1032, ["theme", "themeOverrides", "onClick"]))]))], 64)) : normalizeVNode(() => null), this.actions?.includes("confirm") ? (openBlock(), createElementBlock(Fragment, {
      key: 2
    }, [normalizeVNode(() => resolveSlotWithTypedProps(datePickerSlots.confirm, {
      onConfirm: this.handleConfirmClick,
      disabled: this.isRangeInvalid || this.isSelecting,
      text: this.locale.confirm
    }, () => [(openBlock(), createBlock(Button, {
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      size: "tiny",
      type: "primary",
      disabled: this.isRangeInvalid || this.isSelecting,
      onClick: this.handleConfirmClick
    }, {
      default: () => this.locale.confirm
    }, 1032, ["theme", "themeOverrides", "disabled", "onClick"]))]))], 64)) : normalizeVNode(() => null)], 2)], 2)) : normalizeVNode(() => null), (openBlock(), createBlock(focus_detector_default, {
      onFocus: this.handleFocusDetectorFocus
    }, null, 8, ["onFocus"]))], 42, _hoisted_3);
  }
});
//#endregion
export { datetimerange_default as default };