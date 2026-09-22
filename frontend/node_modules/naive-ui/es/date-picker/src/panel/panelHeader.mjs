import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import month_default from "./month.mjs";
import { getPreciseEventTarget } from "seemly";
import { Fragment, Transition, createBlock, createElementBlock, createVNode, defineComponent, openBlock, ref, withDirectives } from "vue";
import { VBinder, VFollower, VTarget } from "vueuc";
import { clickoutside } from "vdirs";
//#region src/date-picker/src/panel/panelHeader.tsx
const _hoisted_1 = ["onClick"];
var panelHeader_default = defineComponent({
  props: {
    mergedClsPrefix: {
      type: String,
      required: true
    },
    value: Number,
    monthBeforeYear: {
      type: Boolean,
      required: true
    },
    monthYearSeparator: {
      type: String,
      required: true
    },
    fastYearSelect: Boolean,
    fastMonthSelect: Boolean,
    calendarMonth: {
      type: String,
      required: true
    },
    calendarYear: {
      type: String,
      required: true
    },
    onUpdateValue: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const triggerRef = ref(null);
    const monthPanelRef = ref(null);
    const showRef = ref(false);
    function toggleShow() {
      showRef.value = !showRef.value;
    }
    function handleSelectYear() {
      if (props.fastYearSelect) toggleShow();
    }
    function handleSelectMonth() {
      if (props.fastMonthSelect) toggleShow();
    }
    function handleClickOutside(e) {
      if (showRef.value && !triggerRef.value?.contains(getPreciseEventTarget(e))) showRef.value = false;
    }
    function handleHeaderClick() {
      toggleShow();
    }
    return {
      show: showRef,
      triggerRef,
      monthPanelRef,
      handleSelectYear,
      handleSelectMonth,
      handleHeaderClick,
      handleClickOutside
    };
  },
  render() {
    const {
      handleClickOutside,
      mergedClsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-date-panel-month__month-year`),
      ref: "triggerRef"
    }, [createVNode(VBinder, null, {
      default: () => [(openBlock(), createBlock(VTarget, null, {
        default: () => (openBlock(), createElementBlock("div", {
          class: normalizeClass$1([`${mergedClsPrefix}-date-panel-month__text`, this.show && `${mergedClsPrefix}-date-panel-month__text--active`]),
          onClick: this.handleHeaderClick
        }, [this.monthBeforeYear ? (openBlock(), createElementBlock(Fragment, {
          key: 0
        }, [normalizeVNode(() => [this.calendarMonth, this.monthYearSeparator, this.calendarYear])], 64)) : (openBlock(), createElementBlock(Fragment, {
          key: 1
        }, [normalizeVNode(() => [this.calendarYear, this.monthYearSeparator, this.calendarMonth])], 64))], 10, _hoisted_1))
      }, 1024)), (openBlock(), createBlock(VFollower, {
        show: this.show,
        teleportDisabled: true
      }, {
        default: () => (openBlock(), createBlock(Transition, {
          name: "fade-in-scale-up-transition",
          appear: true
        }, {
          default: () => this.show ? withDirectives((openBlock(), createBlock(month_default, {
            ref: "monthPanelRef",
            onUpdateValue: this.onUpdateValue,
            onSelectYear: this.handleSelectYear,
            onSelectMonth: this.handleSelectMonth,
            actions: [],
            calendarHeaderMonthYearSeparator: this.monthYearSeparator,
            type: "month",
            key: "month",
            useAsQuickJump: true,
            value: this.value
          }, null, 8, ["onUpdateValue", "onSelectYear", "onSelectMonth", "calendarHeaderMonthYearSeparator", "value"])), [[clickoutside, handleClickOutside, void 0, {
            capture: true
          }]]) : null
        }, 1024))
      }, 1032, ["show"]))]
    }, 1024)], 2);
  }
});
//#endregion
export { panelHeader_default as default };