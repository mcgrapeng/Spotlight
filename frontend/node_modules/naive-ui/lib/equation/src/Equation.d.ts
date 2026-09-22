import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { Katex, KatexOptions } from "../../config-provider/src/katex.js";
import { PropType } from "vue";
//#region src/equation/src/Equation.d.ts
declare const equationProps: {
  readonly value: StringConstructor;
  readonly katex: PropType<Katex>;
  readonly katexOptions: PropType<KatexOptions>;
};
type EquationProps = ExtractPublicPropTypes<typeof equationProps>;
declare const Equation: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly value: StringConstructor;
  readonly katex: PropType<Katex>;
  readonly katexOptions: PropType<KatexOptions>;
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
  [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly value: StringConstructor;
  readonly katex: PropType<Katex>;
  readonly katexOptions: PropType<KatexOptions>;
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { Equation, EquationProps, equationProps };