import { ExtractPublicPropTypes } from "../../../_utils/naive/extract-public-props.js";
import "../../../_utils/index.js";
//#region src/_internal/loading/src/Loading.d.ts
declare const exposedLoadingProps: {
  strokeWidth: {
    type: NumberConstructor;
    default: number;
  };
  stroke: {
    type: StringConstructor;
    default: undefined;
  };
  scale: {
    type: NumberConstructor;
    default: number;
  };
  radius: {
    type: NumberConstructor;
    default: number;
  };
};
type SharedSpinProps = ExtractPublicPropTypes<typeof exposedLoadingProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  strokeWidth: {
    type: NumberConstructor;
    default: number;
  };
  stroke: {
    type: StringConstructor;
    default: undefined;
  };
  scale: {
    type: NumberConstructor;
    default: number;
  };
  radius: {
    type: NumberConstructor;
    default: number;
  };
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  show: {
    type: BooleanConstructor;
    default: boolean;
  };
}>, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  strokeWidth: {
    type: NumberConstructor;
    default: number;
  };
  stroke: {
    type: StringConstructor;
    default: undefined;
  };
  scale: {
    type: NumberConstructor;
    default: number;
  };
  radius: {
    type: NumberConstructor;
    default: number;
  };
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  show: {
    type: BooleanConstructor;
    default: boolean;
  };
}>> & Readonly<{}>, {
  show: boolean;
  strokeWidth: number;
  stroke: string;
  scale: number;
  radius: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { SharedSpinProps, _default as default, exposedLoadingProps };