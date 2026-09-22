import { warnOnce } from "../../../_utils/naive/warn.mjs";
import { resolveSlotWithTypedProps, resolveWrappedSlot } from "../../../_utils/vue/resolve-slot.mjs";
import useLocale from "../../../_mixins/use-locale.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import focus_detector_default from "../../../_internal/focus-detector/index.mjs";
import Scrollbar from "../../../_internal/scrollbar/src/Scrollbar.mjs";
import { XButton } from "../../../button/src/Button.mjs";
import { getMonthString, getQuarterString, getYearString } from "../utils.mjs";
import "../config.mjs";
import { useDualCalendar, useDualCalendarProps } from "./use-dual-calendar.mjs";
import { Fragment, createBlock, createElementBlock, createElementVNode, defineComponent, onMounted, openBlock, watchEffect } from "vue";
import { VirtualList } from "vueuc";
//#region src/date-picker/src/panel/monthrange.tsx
const _hoisted_1 = ["onClick"];
const _hoisted_2 = ["onKeydown", "onFocus"];
var monthrange_default = defineComponent({
  name: "MonthRangePanel",
  props: {
    ...useDualCalendarProps,
    type: {
      type: String,
      required: true
    }
  },
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.actions?.includes("now")) warnOnce("date-picker", `The \`now\` action is not supported for n-date-picker of ${props.type}type`);
    });
    const useCalendarRef = useDualCalendar(props, props.type);
    const {
      dateLocaleRef
    } = useLocale("DatePicker");
    const renderItem = (item, i, mergedClsPrefix, type) => {
      const {
        handleColItemClick
      } = useCalendarRef;
      return openBlock(), createElementBlock("div", {
        "data-n-date": true,
        key: i,
        class: normalizeClass$1([`${mergedClsPrefix}-date-panel-month-calendar__picker-col-item`, item.isCurrent && `${mergedClsPrefix}-date-panel-month-calendar__picker-col-item--current`, item.selected && `${mergedClsPrefix}-date-panel-month-calendar__picker-col-item--selected`, false]),
        onClick: () => {
          handleColItemClick(item, type);
        }
      }, [item.type === "month" ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => getMonthString(item.dateObject.month, item.monthFormat, dateLocaleRef.value.locale))], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [item.type === "quarter" ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => getQuarterString(item.dateObject.quarter, item.quarterFormat, dateLocaleRef.value.locale))], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => getYearString(item.dateObject.year, item.yearFormat, dateLocaleRef.value.locale))], 64))], 64))], 10, _hoisted_1);
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
      type,
      renderItem,
      onRender
    } = this;
    onRender?.();
    return openBlock(), createElementBlock("div", {
      ref: "selfRef",
      tabindex: 0,
      class: normalizeClass$1([`${mergedClsPrefix}-date-panel`, `${mergedClsPrefix}-date-panel--daterange`, !this.panel && `${mergedClsPrefix}-date-panel--shadow`, this.themeClass]),
      onKeydown: this.handlePanelKeyDown,
      onFocus: this.handlePanelFocus
    }, [createElementVNode("div", {
      ref: "startDatesElRef",
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-calendar ${mergedClsPrefix}-date-panel-calendar--start`)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month-calendar`)
    }, [(openBlock(), createBlock(Scrollbar, {
      ref: "startYearScrollbarRef",
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month-calendar__picker-col`),
      theme: mergedTheme.peers.Scrollbar,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar,
      container: () => this.virtualListContainer("start"),
      content: () => this.virtualListContent("start"),
      horizontalRailStyle: {
        zIndex: 1
      },
      verticalRailStyle: {
        zIndex: 1
      }
    }, {
      default: () => (openBlock(), createBlock(VirtualList, {
        ref: "startYearVlRef",
        items: this.startYearArray,
        itemSize: 40,
        showScrollbar: false,
        keyField: "ts",
        onScroll: this.handleStartYearVlScroll,
        paddingBottom: 4
      }, {
        default: ({
          item,
          index
        }) => {
          return renderItem(item, index, mergedClsPrefix, "start");
        }
      }, 1032, ["items", "itemSize", "onScroll"]))
    }, 1032, ["class", "theme", "themeOverrides", "container", "content"])), type === "monthrange" || type === "quarterrange" ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month-calendar__picker-col`)
    }, [(openBlock(), createBlock(Scrollbar, {
      ref: "startMonthScrollbarRef",
      theme: mergedTheme.peers.Scrollbar,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar
    }, {
      default: () => [(type === "monthrange" ? this.startMonthArray : this.startQuarterArray).map((item, i) => renderItem(item, i, mergedClsPrefix, "start")), type === "monthrange" && (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month-calendar__padding`)
      }, null, 2))]
    }, 1032, ["theme", "themeOverrides"]))], 2)) : normalizeVNode(() => null)], 2)], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel__vertical-divider`)
    }, null, 2), createElementVNode("div", {
      ref: "endDatesElRef",
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-calendar ${mergedClsPrefix}-date-panel-calendar--end`)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month-calendar`)
    }, [(openBlock(), createBlock(Scrollbar, {
      ref: "endYearScrollbarRef",
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month-calendar__picker-col`),
      theme: mergedTheme.peers.Scrollbar,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar,
      container: () => this.virtualListContainer("end"),
      content: () => this.virtualListContent("end"),
      horizontalRailStyle: {
        zIndex: 1
      },
      verticalRailStyle: {
        zIndex: 1
      }
    }, {
      default: () => (openBlock(), createBlock(VirtualList, {
        ref: "endYearVlRef",
        items: this.endYearArray,
        itemSize: 40,
        showScrollbar: false,
        keyField: "ts",
        onScroll: this.handleEndYearVlScroll,
        paddingBottom: 4
      }, {
        default: ({
          item,
          index
        }) => {
          return renderItem(item, index, mergedClsPrefix, "end");
        }
      }, 1032, ["items", "itemSize", "onScroll"]))
    }, 1032, ["class", "theme", "themeOverrides", "container", "content"])), type === "monthrange" || type === "quarterrange" ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month-calendar__picker-col`)
    }, [(openBlock(), createBlock(Scrollbar, {
      ref: "endMonthScrollbarRef",
      theme: mergedTheme.peers.Scrollbar,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar
    }, {
      default: () => [(type === "monthrange" ? this.endMonthArray : this.endQuarterArray).map((item, i) => renderItem(item, i, mergedClsPrefix, "end")), type === "monthrange" && (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month-calendar__padding`)
      }, null, 2))]
    }, 1032, ["theme", "themeOverrides"]))], 2)) : normalizeVNode(() => null)], 2)], 2), normalizeVNode(() => resolveWrappedSlot(this.datePickerSlots.footer, children => {
      return children ? (openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass$1(`${mergedClsPrefix}-date-panel-footer`)
      }, [normalizeVNode(() => children)], 2)) : null;
    })), this.actions?.length || shortcuts ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-actions`)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-actions__prefix`)
    }, [normalizeVNode(() => shortcuts && Object.keys(shortcuts).map(key => {
      const shortcut = shortcuts[key];
      return Array.isArray(shortcut) || typeof shortcut === "function" ? (openBlock(), createBlock(XButton, {
        key: 2,
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
    }, [normalizeVNode(() => resolveSlotWithTypedProps(this.datePickerSlots.clear, {
      onClear: this.handleClearClick,
      text: this.locale.clear
    }, () => [(openBlock(), createBlock(XButton, {
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      size: "tiny",
      onClick: this.handleClearClick
    }, {
      default: () => this.locale.clear
    }, 1032, ["theme", "themeOverrides", "onClick"]))]))], 64)) : normalizeVNode(() => null), this.actions?.includes("confirm") ? (openBlock(), createElementBlock(Fragment, {
      key: 2
    }, [normalizeVNode(() => resolveSlotWithTypedProps(this.datePickerSlots.confirm, {
      disabled: this.isRangeInvalid,
      onConfirm: this.handleConfirmClick,
      text: this.locale.confirm
    }, () => [(openBlock(), createBlock(XButton, {
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      size: "tiny",
      type: "primary",
      disabled: this.isRangeInvalid,
      onClick: this.handleConfirmClick
    }, {
      default: () => this.locale.confirm
    }, 1032, ["theme", "themeOverrides", "disabled", "onClick"]))]))], 64)) : normalizeVNode(() => null)], 2)], 2)) : normalizeVNode(() => null), (openBlock(), createBlock(focus_detector_default, {
      onFocus: this.handleFocusDetectorFocus
    }, null, 8, ["onFocus"]))], 42, _hoisted_2);
  }
});
//#endregion
export { monthrange_default as default };