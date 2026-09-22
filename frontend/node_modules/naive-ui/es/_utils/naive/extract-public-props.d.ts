import useTheme from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ExtractPropTypes } from "vue";
//#region src/_utils/naive/extract-public-props.d.ts
type themePropKeys = keyof typeof useTheme.props;
type RemoveReadonly<T> = { -readonly [key in keyof T]: T[key]; };
type ExtractPublicPropTypes<T> = Omit<Partial<RemoveReadonly<ExtractPropTypes<T>>>, Exclude<themePropKeys, 'themeOverrides'> | Extract<keyof T, `internal${string}`>>;
type ExtractInternalPropTypes<T> = Partial<ExtractPropTypes<T>>;
//#endregion
export { ExtractInternalPropTypes, ExtractPublicPropTypes };