import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
//#region src/input/src/InputGroup.d.ts
declare const inputGroupProps: { [key in any]: never; };
type InputGroupProps = ExtractPublicPropTypes<typeof inputGroupProps>;
declare const _default: import("vue").DefineComponent<{}, {
  mergedClsPrefix: import("vue").Ref<string, string>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { InputGroupProps, _default as default, inputGroupProps };