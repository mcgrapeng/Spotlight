import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { datePickerProps } from "./props.js";
//#region src/date-picker/src/public-types.d.ts
type DatePickerSize = 'small' | 'medium' | 'large';
interface DatePickerInst {
  focus: () => void;
  blur: () => void;
}
type DatePickerProps = ExtractPublicPropTypes<typeof datePickerProps>;
type DatePickerClearSlotOnClear = () => void;
interface DatePickerClearSlotProps {
  onClear: DatePickerClearSlotOnClear;
  text: string;
}
type DatePickerNowSlotOnNow = () => void;
interface DatePickerNowSlotProps {
  onNow: DatePickerNowSlotOnNow;
  text: string;
}
type DatePickerConfirmSlotOnConfirm = () => void;
interface DatePickerConfirmSlotProps {
  onConfirm: DatePickerConfirmSlotOnConfirm;
  disabled: boolean;
  text: string;
}
//#endregion
export { DatePickerClearSlotOnClear, DatePickerClearSlotProps, DatePickerConfirmSlotOnConfirm, DatePickerConfirmSlotProps, DatePickerInst, DatePickerNowSlotOnNow, DatePickerNowSlotProps, DatePickerProps, DatePickerSize };