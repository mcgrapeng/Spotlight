import { ScrollbarInst } from "../../_internal/scrollbar/src/Scrollbar.js";
import "../../_internal/index.js";
import { TimePickerTheme } from "../styles/light.js";
import "../styles/index.js";
import { MergedTheme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { Ref } from "vue";
//#region src/time-picker/src/interface.d.ts
type ItemValue = number | 'am' | 'pm';
interface Item {
  label: string;
  value: ItemValue;
  disabled: boolean;
}
interface TimePickerInjection {
  mergedThemeRef: Ref<MergedTheme<TimePickerTheme>>;
  mergedClsPrefixRef: Ref<string>;
}
declare const timePickerInjectionKey: import("vue").InjectionKey<TimePickerInjection>;
interface PanelRef {
  $el: HTMLElement;
  hourScrollRef?: ScrollbarInst;
  minuteScrollRef?: ScrollbarInst;
  secondScrollRef?: ScrollbarInst;
  amPmScrollRef?: ScrollbarInst;
}
type OnUpdateValue = ((value: number, formattedValue: string) => void) & ((value: number | null, formattedValue: string | null) => void);
type OnUpdateValueImpl = (value: number | null, formattedValue: string | null) => void;
type OnUpdateFormattedValue = ((value: string, timestampValue: number) => void) & ((value: string | null, timestampValue: number | null) => void);
type OnUpdateFormattedValueImpl = (value: string | null, timestampValue: number | null) => void;
type IsHourDisabled = (hour: number) => boolean;
type IsMinuteDisabled = (minute: number, hour: number | null) => boolean;
type IsSecondDisabled = (second: number, minute: number | null, hour: number | null) => boolean;
interface TimePickerInst {
  focus: () => void;
  blur: () => void;
}
//#endregion
export { IsHourDisabled, IsMinuteDisabled, IsSecondDisabled, Item, ItemValue, OnUpdateFormattedValue, OnUpdateFormattedValueImpl, OnUpdateValue, OnUpdateValueImpl, PanelRef, TimePickerInjection, TimePickerInst, timePickerInjectionKey };