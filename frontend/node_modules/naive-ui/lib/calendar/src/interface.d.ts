//#region src/calendar/src/interface.d.ts
type OnUpdateValue = (value: number, time: DateItem) => void;
interface DateItem {
  year: number;
  month: number;
  date: number;
}
type OnPanelChange = (info: {
  year: number;
  month: number;
}) => void;
interface CalendarDefaultSlotProps {
  year: number;
  month: number;
  date: number;
}
interface CalendarHeaderSlotProps {
  year: number;
  month: number;
}
//#endregion
export { CalendarDefaultSlotProps, CalendarHeaderSlotProps, DateItem, OnPanelChange, OnUpdateValue };