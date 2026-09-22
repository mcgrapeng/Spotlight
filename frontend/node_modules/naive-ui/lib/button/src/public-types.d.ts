import { SharedSpinProps } from "../../_internal/loading/src/Loading.js";
import "../../_internal/index.js";
//#region src/button/src/public-types.d.ts
type ButtonSize = 'tiny' | 'small' | 'medium' | 'large';
type ButtonSpinProps = SharedSpinProps;
type ButtonType = 'default' | 'tertiary' | 'primary' | 'info' | 'success' | 'warning' | 'error';
//#endregion
export { ButtonSize, ButtonSpinProps, ButtonType };