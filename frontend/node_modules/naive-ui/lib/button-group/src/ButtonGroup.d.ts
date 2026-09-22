import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { ButtonSize } from "../../button/src/public-types.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { PropType } from "vue";
//#region src/button-group/src/ButtonGroup.d.ts
interface ButtonGroupInjection {
  size?: ButtonSize | undefined;
}
declare const buttonGroupProps: {
  readonly size: PropType<ButtonSize | undefined>;
  readonly vertical: BooleanConstructor;
};
type ButtonGroupProps = ExtractPublicPropTypes<typeof buttonGroupProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly size: PropType<ButtonSize | undefined>;
  readonly vertical: BooleanConstructor;
}>, {
  rtlEnabled: import("vue").Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedClsPrefix: import("vue").Ref<string, string>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly size: PropType<ButtonSize | undefined>;
  readonly vertical: BooleanConstructor;
}>> & Readonly<{}>, {
  readonly vertical: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { ButtonGroupInjection, ButtonGroupProps, buttonGroupProps, _default as default };