import { resolveSlotWithTypedProps, resolveWrappedSlot } from "../../../_utils/vue/resolve-slot.mjs";
import useLocale from "../../../_mixins/use-locale.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import focus_detector_default from "../../../_internal/focus-detector/index.mjs";
import Scrollbar from "../../../_internal/scrollbar/src/Scrollbar.mjs";
import Button, { XButton } from "../../../button/src/Button.mjs";
import { getMonthString, getQuarterString, getYearString } from "../utils.mjs";
import "../config.mjs";
import { useCalendar, useCalendarProps } from "./use-calendar.mjs";
import { Fragment, createBlock, createElementBlock, createElementVNode, defineComponent, onMounted, openBlock } from "vue";
import { VirtualList } from "vueuc";
//#region src/date-picker/src/panel/month.tsx
const _hoisted_1 = ["onClick"];
const _hoisted_2 = ["onFocus", "onKeydown"];
/**
* Month Panel
* Update picker value on:
* 1. item click
* 2. clear click
*/
var month_default = defineComponent({
  name: "MonthPanel",
  props: {
    ...useCalendarProps,
    type: {
      type: String,
      required: true
    },
    useAsQuickJump: Boolean
  },
  setup(props) {
    const useCalendarRef = useCalendar(props, props.type);
    const {
      dateLocaleRef
    } = useLocale("DatePicker");
    const getRenderContent = item => {
      switch (item.type) {
        case "year":
          return getYearString(item.dateObject.year, item.yearFormat, dateLocaleRef.value.locale);
        case "month":
          return getMonthString(item.dateObject.month, item.monthFormat, dateLocaleRef.value.locale);
        case "quarter":
          return getQuarterString(item.dateObject.quarter, item.quarterFormat, dateLocaleRef.value.locale);
      }
    };
    const {
      useAsQuickJump
    } = props;
    const renderItem = (item, i, mergedClsPrefix) => {
      const {
        mergedIsDateDisabled,
        handleDateClick,
        handleQuickMonthClick
      } = useCalendarRef;
      return openBlock(), createElementBlock("div", {
        "data-n-date": true,
        key: i,
        class: normalizeClass$1([`${mergedClsPrefix}-date-panel-month-calendar__picker-col-item`, item.isCurrent && `${mergedClsPrefix}-date-panel-month-calendar__picker-col-item--current`, item.selected && `${mergedClsPrefix}-date-panel-month-calendar__picker-col-item--selected`, !useAsQuickJump && mergedIsDateDisabled(item.ts, item.type === "year" ? {
          type: "year",
          year: item.dateObject.year
        } : item.type === "month" ? {
          type: "month",
          year: item.dateObject.year,
          month: item.dateObject.month
        } : item.type === "quarter" ? {
          type: "month",
          year: item.dateObject.year,
          month: item.dateObject.quarter
        } : null) && `${mergedClsPrefix}-date-panel-month-calendar__picker-col-item--disabled`]),
        onClick: () => {
          if (item.type === "year") props.onSelectYear?.();else if (item.type === "month") props.onSelectMonth?.();
          if (useAsQuickJump) handleQuickMonthClick(item, value => {
            props.onUpdateValue(value, false);
          });else handleDateClick(item);
        }
      }, [normalizeVNode(() => getRenderContent(item))], 10, _hoisted_1);
    };
    onMounted(() => {
      useCalendarRef.justifyColumnsScrollState();
    });
    return {
      ...useCalendarRef,
      renderItem
    };
  },
  render() {
    const {
      mergedClsPrefix,
      mergedTheme,
      shortcuts,
      actions,
      renderItem,
      type,
      onRender
    } = this;
    onRender?.();
    return openBlock(), createElementBlock("div", {
      ref: "selfRef",
      tabindex: 0,
      class: normalizeClass$1([`${mergedClsPrefix}-date-panel`, `${mergedClsPrefix}-date-panel--month`, !this.panel && `${mergedClsPrefix}-date-panel--shadow`, this.themeClass]),
      onFocus: this.handlePanelFocus,
      onKeydown: this.handlePanelKeyDown
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month-calendar`)
    }, [(openBlock(), createBlock(Scrollbar, {
      ref: "yearScrollbarRef",
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month-calendar__picker-col`),
      theme: mergedTheme.peers.Scrollbar,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar,
      container: this.virtualListContainer,
      content: this.virtualListContent,
      horizontalRailStyle: {
        zIndex: 1
      },
      verticalRailStyle: {
        zIndex: 1
      }
    }, {
      default: () => (openBlock(), createBlock(VirtualList, {
        ref: "yearVlRef",
        items: this.yearArray,
        itemSize: 40,
        showScrollbar: false,
        keyField: "ts",
        onScroll: this.handleVirtualListScroll,
        paddingBottom: 4
      }, {
        default: ({
          item,
          index
        }) => {
          return renderItem(item, index, mergedClsPrefix);
        }
      }, 1032, ["items", "itemSize", "onScroll"]))
    }, 1032, ["class", "theme", "themeOverrides", "container", "content"])), type === "month" || type === "quarter" ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month-calendar__picker-col`)
    }, [(openBlock(), createBlock(Scrollbar, {
      ref: "monthScrollbarRef",
      theme: mergedTheme.peers.Scrollbar,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar
    }, {
      default: () => [(type === "month" ? this.monthArray : this.quarterArray).map((item, i) => renderItem(item, i, mergedClsPrefix)), (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-date-panel-${type}-calendar__padding`)
      }, null, 2))]
    }, 1032, ["theme", "themeOverrides"]))], 2)) : normalizeVNode(() => null)], 2), normalizeVNode(() => resolveWrappedSlot(this.datePickerSlots.footer, children => {
      return children ? (openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass$1(`${mergedClsPrefix}-date-panel-footer`)
      }, [normalizeVNode(() => children)], 2)) : null;
    })), actions?.length || shortcuts ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-actions`)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-actions__prefix`)
    }, [normalizeVNode(() => shortcuts && Object.keys(shortcuts).map(key => {
      const shortcut = shortcuts[key];
      return Array.isArray(shortcut) ? null : (openBlock(), createBlock(XButton, {
        key: 2,
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
    }, [actions?.includes("clear") ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => resolveSlotWithTypedProps(this.datePickerSlots.clear, {
      onClear: this.handleClearClick,
      text: this.locale.clear
    }, () => [(openBlock(), createBlock(Button, {
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      size: "tiny",
      onClick: this.handleClearClick
    }, {
      default: () => this.locale.clear
    }, 1032, ["theme", "themeOverrides", "onClick"]))]))], 64)) : normalizeVNode(() => null), actions?.includes("now") ? (openBlock(), createElementBlock(Fragment, {
      key: 2
    }, [normalizeVNode(() => resolveSlotWithTypedProps(this.datePickerSlots.now, {
      onNow: this.handleNowClick,
      text: this.locale.now
    }, () => [(openBlock(), createBlock(Button, {
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      size: "tiny",
      onClick: this.handleNowClick
    }, {
      default: () => this.locale.now
    }, 1032, ["theme", "themeOverrides", "onClick"]))]))], 64)) : normalizeVNode(() => null), actions?.includes("confirm") ? (openBlock(), createElementBlock(Fragment, {
      key: 4
    }, [normalizeVNode(() => resolveSlotWithTypedProps(this.datePickerSlots.confirm, {
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
export { month_default as default };