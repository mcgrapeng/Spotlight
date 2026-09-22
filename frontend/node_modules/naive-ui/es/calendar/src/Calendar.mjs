import { call } from "../../_utils/vue/call.mjs";
import { resolveSlotWithTypedProps } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useLocale from "../../_mixins/use-locale.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import ChevronLeft_default from "../../_internal/icons/ChevronLeft.mjs";
import ChevronRight_default from "../../_internal/icons/ChevronRight.mjs";
import Button from "../../button/src/Button.mjs";
import ButtonGroup_default from "../../button-group/src/ButtonGroup.mjs";
import { dateArray } from "../../date-picker/src/utils.mjs";
import calendarLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { Fragment, computed, createBlock, createElementBlock, createElementVNode, createVNode, defineComponent, normalizeStyle, openBlock, ref, toRef } from "vue";
import { useMergedState } from "vooks";
import { addMonths, format, getMonth, getYear, startOfDay, startOfMonth } from "date-fns";
//#region src/calendar/src/Calendar.tsx
const _hoisted_1 = ["title"];
const _hoisted_2 = ["onClick"];
const _hoisted_3 = ["title"];
const calendarProps = {
  ...useTheme.props,
  isDateDisabled: Function,
  value: Number,
  defaultValue: {
    type: Number,
    default: null
  },
  onPanelChange: Function,
  "onUpdate:value": [Function, Array],
  onUpdateValue: [Function, Array]
};
var Calendar_default = defineComponent({
  name: "Calendar",
  props: calendarProps,
  slots: Object,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Calendar", "-calendar", index_cssr_default, calendarLight, props, mergedClsPrefixRef);
    const {
      localeRef,
      dateLocaleRef
    } = useLocale("DatePicker");
    const now = Date.now();
    const monthTsRef = ref(startOfMonth(props.defaultValue ?? now).valueOf());
    const uncontrolledValueRef = ref(props.defaultValue || null);
    const mergedValueRef = useMergedState(toRef(props, "value"), uncontrolledValueRef);
    function doUpdateValue(value, time) {
      const {
        onUpdateValue,
        "onUpdate:value": _onUpdateValue
      } = props;
      if (onUpdateValue) call(onUpdateValue, value, time);
      if (_onUpdateValue) call(_onUpdateValue, value, time);
      uncontrolledValueRef.value = value;
    }
    function handlePrevClick() {
      const monthTs = addMonths(monthTsRef.value, -1).valueOf();
      monthTsRef.value = monthTs;
      props.onPanelChange?.({
        year: getYear(monthTs),
        month: getMonth(monthTs) + 1
      });
    }
    function handleNextClick() {
      const monthTs = addMonths(monthTsRef.value, 1).valueOf();
      monthTsRef.value = monthTs;
      props.onPanelChange?.({
        year: getYear(monthTs),
        month: getMonth(monthTs) + 1
      });
    }
    function handleTodayClick() {
      const {
        value: monthTs
      } = monthTsRef;
      const oldYear = getYear(monthTs);
      const oldMonth = getMonth(monthTs);
      const newMonthTs = startOfMonth(now).valueOf();
      monthTsRef.value = newMonthTs;
      const newYear = getYear(newMonthTs);
      const newMonth = getMonth(newMonthTs);
      if (oldYear !== newYear || oldMonth !== newMonth) props.onPanelChange?.({
        year: newYear,
        month: newMonth + 1
      });
    }
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          borderColor,
          borderColorModal,
          borderColorPopover,
          borderRadius,
          titleFontSize,
          textColor,
          titleFontWeight,
          titleTextColor,
          dayTextColor,
          fontSize,
          lineHeight,
          dateColorCurrent,
          dateTextColorCurrent,
          cellColorHover,
          cellColor,
          cellColorModal,
          barColor,
          cellColorPopover,
          cellColorHoverModal,
          cellColorHoverPopover
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-border-color": borderColor,
        "--n-border-color-modal": borderColorModal,
        "--n-border-color-popover": borderColorPopover,
        "--n-border-radius": borderRadius,
        "--n-text-color": textColor,
        "--n-title-font-weight": titleFontWeight,
        "--n-title-font-size": titleFontSize,
        "--n-title-text-color": titleTextColor,
        "--n-day-text-color": dayTextColor,
        "--n-font-size": fontSize,
        "--n-line-height": lineHeight,
        "--n-date-color-current": dateColorCurrent,
        "--n-date-text-color-current": dateTextColorCurrent,
        "--n-cell-color": cellColor,
        "--n-cell-color-modal": cellColorModal,
        "--n-cell-color-popover": cellColorPopover,
        "--n-cell-color-hover": cellColorHover,
        "--n-cell-color-hover-modal": cellColorHoverModal,
        "--n-cell-color-hover-popover": cellColorHoverPopover,
        "--n-bar-color": barColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("calendar", void 0, cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      locale: localeRef,
      dateLocale: dateLocaleRef,
      now,
      mergedValue: mergedValueRef,
      monthTs: monthTsRef,
      dateItems: computed(() => {
        return dateArray(monthTsRef.value, mergedValueRef.value, now, localeRef.value.firstDayOfWeek, true);
      }),
      doUpdateValue,
      handleTodayClick,
      handlePrevClick,
      handleNextClick,
      mergedTheme: themeRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      isDateDisabled,
      mergedClsPrefix,
      monthTs,
      cssVars,
      mergedValue,
      mergedTheme,
      $slots,
      locale: {
        monthBeforeYear,
        today
      },
      dateLocale: {
        locale
      },
      handleTodayClick,
      handlePrevClick,
      handleNextClick,
      onRender
    } = this;
    onRender?.();
    const normalizedValue = mergedValue && startOfDay(mergedValue).valueOf();
    const year = getYear(monthTs);
    const calendarMonth = getMonth(monthTs) + 1;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-calendar`, this.themeClass]),
      style: normalizeStyle(cssVars)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-calendar-header`)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-calendar-header__title`)
    }, [normalizeVNode(() => resolveSlotWithTypedProps($slots.header, {
      year,
      month: calendarMonth
    }, () => {
      const localeMonth = format(monthTs, "MMMM", {
        locale
      });
      return [monthBeforeYear ? `${localeMonth} ${year}` : `${year} ${localeMonth}`];
    }))], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-calendar-header__extra`)
    }, [createVNode(ButtonGroup_default, null, {
      default: () => (openBlock(), createElementBlock(Fragment, null, [(openBlock(), createBlock(Button, {
        size: "small",
        onClick: handlePrevClick,
        theme: mergedTheme.peers.Button,
        themeOverrides: mergedTheme.peerOverrides.Button
      }, {
        icon: () => (openBlock(), createBlock(Icon_default, {
          clsPrefix: mergedClsPrefix,
          class: normalizeClass$1(`${mergedClsPrefix}-calendar-prev-btn`)
        }, {
          default: () => (openBlock(), createBlock(ChevronLeft_default))
        }, 1032, ["clsPrefix", "class"]))
      }, 1032, ["onClick", "theme", "themeOverrides"])), (openBlock(), createBlock(Button, {
        size: "small",
        onClick: handleTodayClick,
        theme: mergedTheme.peers.Button,
        themeOverrides: mergedTheme.peerOverrides.Button
      }, {
        default: () => today
      }, 1032, ["onClick", "theme", "themeOverrides"])), (openBlock(), createBlock(Button, {
        size: "small",
        onClick: handleNextClick,
        theme: mergedTheme.peers.Button,
        themeOverrides: mergedTheme.peerOverrides.Button
      }, {
        icon: () => (openBlock(), createBlock(Icon_default, {
          clsPrefix: mergedClsPrefix,
          class: normalizeClass$1(`${mergedClsPrefix}-calendar-next-btn`)
        }, {
          default: () => (openBlock(), createBlock(ChevronRight_default))
        }, 1032, ["clsPrefix", "class"]))
      }, 1032, ["onClick", "theme", "themeOverrides"]))], 64))
    }, 1024)], 2)], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-calendar-dates`)
    }, [normalizeVNode(() => this.dateItems.map(({
      dateObject,
      ts,
      inCurrentMonth,
      isCurrentDate
    }, index) => {
      const {
        year,
        month,
        date
      } = dateObject;
      const fullDate = format(ts, "yyyy-MM-dd");
      const notInCurrentMonth = !inCurrentMonth;
      const disabled = isDateDisabled?.(ts) === true;
      const selected = normalizedValue === startOfDay(ts).valueOf();
      return openBlock(), createElementBlock("div", {
        key: `${calendarMonth}-${index}`,
        class: normalizeClass$1([`${mergedClsPrefix}-calendar-cell`, disabled && `${mergedClsPrefix}-calendar-cell--disabled`, notInCurrentMonth && `${mergedClsPrefix}-calendar-cell--other-month`, disabled && `${mergedClsPrefix}-calendar-cell--not-allowed`, isCurrentDate && `${mergedClsPrefix}-calendar-cell--current`, selected && `${mergedClsPrefix}-calendar-cell--selected`]),
        onClick: () => {
          if (disabled) return;
          const monthTs = startOfMonth(ts).valueOf();
          this.monthTs = monthTs;
          if (notInCurrentMonth) this.onPanelChange?.({
            year: getYear(monthTs),
            month: getMonth(monthTs) + 1
          });
          this.doUpdateValue(ts, {
            year,
            month: month + 1,
            date
          });
        }
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-calendar-date`)
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-calendar-date__date`),
        title: fullDate
      }, [normalizeVNode(() => date)], 10, _hoisted_3), normalizeVNode(() => index < 7 && (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-calendar-date__day`),
        title: fullDate
      }, [normalizeVNode(() => format(ts, "EEE", {
        locale
      }))], 10, _hoisted_1)))], 2), normalizeVNode(() => $slots.default?.({
        year,
        month: month + 1,
        date
      })), createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-calendar-cell__bar`)
      }, null, 2)], 10, _hoisted_2);
    }))], 2)], 6);
  }
});
//#endregion
export { calendarProps, Calendar_default as default };