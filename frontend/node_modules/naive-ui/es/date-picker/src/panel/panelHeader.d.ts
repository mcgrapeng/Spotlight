import { PropType } from "vue";
//#region src/date-picker/src/panel/panelHeader.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  mergedClsPrefix: {
    type: StringConstructor;
    required: true;
  };
  value: NumberConstructor;
  monthBeforeYear: {
    type: BooleanConstructor;
    required: true;
  };
  monthYearSeparator: {
    type: StringConstructor;
    required: true;
  };
  fastYearSelect: BooleanConstructor;
  fastMonthSelect: BooleanConstructor;
  calendarMonth: {
    type: StringConstructor;
    required: true;
  };
  calendarYear: {
    type: StringConstructor;
    required: true;
  };
  onUpdateValue: {
    type: PropType<(value: number) => void>;
    required: true;
  };
}>, {
  show: import("vue").Ref<boolean, boolean>;
  triggerRef: import("vue").Ref<HTMLElement | null, HTMLElement | null>;
  monthPanelRef: unknown;
  handleSelectYear: () => void;
  handleSelectMonth: () => void;
  handleHeaderClick: () => void;
  handleClickOutside: (e: MouseEvent) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  mergedClsPrefix: {
    type: StringConstructor;
    required: true;
  };
  value: NumberConstructor;
  monthBeforeYear: {
    type: BooleanConstructor;
    required: true;
  };
  monthYearSeparator: {
    type: StringConstructor;
    required: true;
  };
  fastYearSelect: BooleanConstructor;
  fastMonthSelect: BooleanConstructor;
  calendarMonth: {
    type: StringConstructor;
    required: true;
  };
  calendarYear: {
    type: StringConstructor;
    required: true;
  };
  onUpdateValue: {
    type: PropType<(value: number) => void>;
    required: true;
  };
}>> & Readonly<{}>, {
  fastYearSelect: boolean;
  fastMonthSelect: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };