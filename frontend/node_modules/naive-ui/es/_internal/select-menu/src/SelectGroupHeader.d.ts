import { SelectGroupOption } from "../../../select/src/interface.js";
import { NodeProps, RenderLabelImpl, RenderOptionImpl } from "./interface.js";
import { PropType, Ref } from "vue";
import { TreeNode } from "treemate";
//#region src/_internal/select-menu/src/SelectGroupHeader.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  tmNode: {
    type: PropType<TreeNode<SelectGroupOption>>;
    required: true;
  };
}>, {
  labelField: Ref<string, string>;
  nodeProps: Ref<NodeProps | undefined, NodeProps | undefined>;
  renderLabel: Ref<RenderLabelImpl | undefined>;
  renderOption: Ref<RenderOptionImpl | undefined>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  tmNode: {
    type: PropType<TreeNode<SelectGroupOption>>;
    required: true;
  };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };