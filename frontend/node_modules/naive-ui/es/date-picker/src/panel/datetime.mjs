import { resolveSlot, resolveSlotWithTypedProps } from "../../../_utils/vue/resolve-slot.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import Backward_default from "../../../_internal/icons/Backward.mjs";
import FastBackward_default from "../../../_internal/icons/FastBackward.mjs";
import FastForward_default from "../../../_internal/icons/FastForward.mjs";
import Forward_default from "../../../_internal/icons/Forward.mjs";
import focus_detector_default from "../../../_internal/focus-detector/index.mjs";
import Input_default from "../../../input/src/Input.mjs";
import Button, { XButton } from "../../../button/src/Button.mjs";
import { useCalendar, useCalendarProps } from "./use-calendar.mjs";
import panelHeader_default from "./panelHeader.mjs";
import TimePicker_default from "../../../time-picker/src/TimePicker.mjs";
import { Fragment, createBlock, createElementBlock, createElementVNode, defineComponent, mergeProps, openBlock } from "vue";
//#region src/date-picker/src/panel/datetime.tsx
const _hoisted_1 = ["onClick"];
const _hoisted_2 = ["onKeydown", "onFocus"];
const _hoisted_3 = ["onClick"];
const _hoisted_4 = ["onClick"];
const _hoisted_5 = ["onClick"];
const _hoisted_6 = ["onClick"];
/**
* DateTime Panel
* Update picker value on:
* 1. confirm click
* 2. clear click
*/
var datetime_default = defineComponent({
  name: "DateTimePanel",
  props: useCalendarProps,
  setup(props) {
    return useCalendar(props, "datetime");
  },
  render() {
    const {
      mergedClsPrefix,
      mergedTheme,
      shortcuts,
      timePickerProps,
      datePickerSlots,
      onRender
    } = this;
    onRender?.();
    return openBlock(), createElementBlock("div", {
      ref: "selfRef",
      tabindex: 0,
      class: normalizeClass$1([`${mergedClsPrefix}-date-panel`, `${mergedClsPrefix}-date-panel--datetime`, !this.panel && `${mergedClsPrefix}-date-panel--shadow`, this.themeClass]),
      onKeydown: this.handlePanelKeyDown,
      onFocus: this.handlePanelFocus
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-header`)
    }, [(openBlock(), createBlock(Input_default, {
      value: this.dateInputValue,
      theme: mergedTheme.peers.Input,
      themeOverrides: mergedTheme.peerOverrides.Input,
      stateful: false,
      size: this.timePickerSize,
      readonly: this.inputReadonly,
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-date-input`),
      textDecoration: this.isDateInvalid ? "line-through" : "",
      placeholder: this.locale.selectDate,
      onBlur: this.handleDateInputBlur,
      onUpdateValue: this.handleDateInput
    }, null, 8, ["value", "theme", "themeOverrides", "size", "readonly", "class", "textDecoration", "placeholder", "onBlur", "onUpdateValue"])), (openBlock(), createBlock(TimePicker_default, mergeProps({
      size: this.timePickerSize,
      placeholder: this.locale.selectTime,
      format: this.timePickerFormat
    }, Array.isArray(timePickerProps) ? void 0 : timePickerProps, {
      showIcon: false,
      to: false,
      theme: mergedTheme.peers.TimePicker,
      themeOverrides: mergedTheme.peerOverrides.TimePicker,
      value: Array.isArray(this.value) ? null : this.value,
      isHourDisabled: this.isHourDisabled,
      isMinuteDisabled: this.isMinuteDisabled,
      isSecondDisabled: this.isSecondDisabled,
      onUpdateValue: this.handleTimePickerChange,
      stateful: false
    }), null, 16, ["size", "placeholder", "format", "theme", "themeOverrides", "value", "isHourDisabled", "isMinuteDisabled", "isSecondDisabled", "onUpdateValue"]))], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-calendar`)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month`)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month__fast-prev`),
      onClick: this.prevYear
    }, [normalizeVNode(() => resolveSlot(datePickerSlots["prev-year"], () => [(openBlock(), createBlock(FastBackward_default))]))], 10, _hoisted_3), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month__prev`),
      onClick: this.prevMonth
    }, [normalizeVNode(() => resolveSlot(datePickerSlots["prev-month"], () => [(openBlock(), createBlock(Backward_default))]))], 10, _hoisted_4), (openBlock(), createBlock(panelHeader_default, {
      fastYearSelect: this.fastYearSelect,
      fastMonthSelect: this.fastMonthSelect,
      monthYearSeparator: this.calendarHeaderMonthYearSeparator,
      monthBeforeYear: this.calendarMonthBeforeYear,
      value: this.calendarValue,
      onUpdateValue: this.onUpdateCalendarValue,
      mergedClsPrefix,
      calendarMonth: this.calendarMonth,
      calendarYear: this.calendarYear
    }, null, 8, ["fastYearSelect", "fastMonthSelect", "monthYearSeparator", "monthBeforeYear", "value", "onUpdateValue", "mergedClsPrefix", "calendarMonth", "calendarYear"])), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month__next`),
      onClick: this.nextMonth
    }, [normalizeVNode(() => resolveSlot(datePickerSlots["next-month"], () => [(openBlock(), createBlock(Forward_default))]))], 10, _hoisted_5), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month__fast-next`),
      onClick: this.nextYear
    }, [normalizeVNode(() => resolveSlot(datePickerSlots["next-year"], () => [(openBlock(), createBlock(FastForward_default))]))], 10, _hoisted_6)], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-weekdays`)
    }, [normalizeVNode(() => this.weekdays.map(weekday => (openBlock(), createElementBlock("div", {
      key: weekday,
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-weekdays__day`)
    }, [normalizeVNode(() => weekday)], 2))))], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-dates`)
    }, [normalizeVNode(() => this.dateArray.map((dateItem, i) => (openBlock(), createElementBlock("div", {
      "data-n-date": true,
      key: i,
      class: normalizeClass$1([`${mergedClsPrefix}-date-panel-date`, {
        [`${mergedClsPrefix}-date-panel-date--current`]: dateItem.isCurrentDate,
        [`${mergedClsPrefix}-date-panel-date--selected`]: dateItem.selected,
        [`${mergedClsPrefix}-date-panel-date--excluded`]: !dateItem.inCurrentMonth,
        [`${mergedClsPrefix}-date-panel-date--disabled`]: this.mergedIsDateDisabled(dateItem.ts, {
          type: "date",
          year: dateItem.dateObject.year,
          month: dateItem.dateObject.month,
          date: dateItem.dateObject.date
        })
      }]),
      onClick: () => {
        this.handleDateClick(dateItem);
      }
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-date__trigger`)
    }, null, 2), normalizeVNode(() => dateItem.dateObject.date), dateItem.isCurrentDate ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-date__sup`)
    }, null, 2)) : normalizeVNode(() => null)], 10, _hoisted_1))))], 2)], 2), this.datePickerSlots.footer ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-footer`)
    }, [normalizeVNode(() => this.datePickerSlots.footer())], 2)) : normalizeVNode(() => null), this.actions?.length || shortcuts ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-actions`)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-actions__prefix`)
    }, [normalizeVNode(() => shortcuts && Object.keys(shortcuts).map(key => {
      const shortcut = shortcuts[key];
      return Array.isArray(shortcut) ? null : (openBlock(), createBlock(XButton, {
        key: 1,
        size: "tiny",
        onMouseenter: () => {
          this.handleSingleShortcutMouseenter(shortcut);
        },
        onClick: () => {
          this.handleSingleShortcutClick(shortcut);
        },
        onMouseleave: () => {
          this.handleShortcutMouseleave();
        }
      }, {
        default: () => key
      }, 1032, ["onMouseenter", "onClick", "onMouseleave"]));
    }))], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-actions__suffix`)
    }, [this.actions?.includes("clear") ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => resolveSlotWithTypedProps(this.datePickerSlots.clear, {
      onClear: this.clearSelectedDateTime,
      text: this.locale.clear
    }, () => [(openBlock(), createBlock(Button, {
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      size: "tiny",
      onClick: this.clearSelectedDateTime
    }, {
      default: () => this.locale.clear
    }, 1032, ["theme", "themeOverrides", "onClick"]))]))], 64)) : normalizeVNode(() => null), this.actions?.includes("now") ? (openBlock(), createElementBlock(Fragment, {
      key: 2
    }, [normalizeVNode(() => resolveSlotWithTypedProps(datePickerSlots.now, {
      onNow: this.handleNowClick,
      text: this.locale.now
    }, () => [(openBlock(), createBlock(Button, {
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      size: "tiny",
      onClick: this.handleNowClick
    }, {
      default: () => this.locale.now
    }, 1032, ["theme", "themeOverrides", "onClick"]))]))], 64)) : normalizeVNode(() => null), this.actions?.includes("confirm") ? (openBlock(), createElementBlock(Fragment, {
      key: 4
    }, [normalizeVNode(() => resolveSlotWithTypedProps(datePickerSlots.confirm, {
      onConfirm: this.handleConfirmClick,
      disabled: this.isDateInvalid,
      text: this.locale.confirm
    }, () => [(openBlock(), createBlock(Button, {
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      size: "tiny",
      type: "primary",
      disabled: this.isDateInvalid,
      onClick: this.handleConfirmClick
    }, {
      default: () => this.locale.confirm
    }, 1032, ["theme", "themeOverrides", "disabled", "onClick"]))]))], 64)) : normalizeVNode(() => null)], 2)], 2)) : normalizeVNode(() => null), (openBlock(), createBlock(focus_detector_default, {
      onFocus: this.handleFocusDetectorFocus
    }, null, 8, ["onFocus"]))], 42, _hoisted_2);
  }
});
//#endregion
export { datetime_default as default };