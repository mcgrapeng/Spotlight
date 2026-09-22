import { InputInst } from "../../input/src/public-types.js";
import { InputProps } from "../../input/src/Input.js";
import "../../components.js";
import { VNode } from "vue";
//#region src/input-otp/src/public-types.d.ts
type InputOtpAllowInput = (char: string, index: number, currentValue: string[]) => boolean;
type InputOtpSize = 'small' | 'medium' | 'large';
type InputOtpOnUpdateValue = (value: string[], meta: InputOtpOnUpdateValueMeta) => void;
type InputOtpOnFocus = (e: FocusEvent, index: number) => void;
type InputOtpOnBlur = (e: FocusEvent, index: number) => void;
interface InputOtpSlots {
  default?: InputOtpDefaultSlot;
}
type InputOtpDefaultSlot = (props: InputProps & {
  index: number;
  ref: (inst: InputInst) => void;
}) => VNode[];
type InputOtpOnFinish = (value: string[]) => void;
interface InputOtpOnUpdateValueMeta {
  diff: string;
  index: number;
  source: InputOtpOnUpdateValueMetaSource;
}
type InputOtpOnUpdateValueMetaSource = 'paste' | 'input' | 'delete';
interface InputOtpInst {
  focusOnChar: (charIndex: number) => void;
}
//#endregion
export { InputOtpAllowInput, InputOtpDefaultSlot, InputOtpInst, InputOtpOnBlur, InputOtpOnFinish, InputOtpOnFocus, InputOtpOnUpdateValue, InputOtpOnUpdateValueMeta, InputOtpOnUpdateValueMetaSource, InputOtpSize, InputOtpSlots };