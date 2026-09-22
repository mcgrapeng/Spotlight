import { MenuNodeProps } from "../../menu/src/interface.js";
import { RenderLabelImpl, RenderOptionImpl } from "./interface.js";
import "../../index.js";
//#region src/dropdown/src/DropdownGroupHeader.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  tmNode: {
    type: ObjectConstructor;
    required: true;
  };
}>, {
  labelField: import("vue").Ref<string, string>;
  showIcon: import("vue").Ref<boolean, boolean>;
  hasSubmenu: import("vue").Ref<boolean, boolean>;
  renderLabel: import("vue").Ref<RenderLabelImpl | undefined, RenderLabelImpl | undefined>;
  nodeProps: import("vue").Ref<MenuNodeProps | undefined, MenuNodeProps | undefined>;
  renderOption: import("vue").Ref<RenderOptionImpl | undefined, RenderOptionImpl | undefined>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  tmNode: {
    type: ObjectConstructor;
    required: true;
  };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };