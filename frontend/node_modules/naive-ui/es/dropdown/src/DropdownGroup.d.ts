import { DropdownGroupOption, DropdownIgnoredOption, DropdownOption } from "./interface.js";
import { PropType } from "vue";
import { TreeNode } from "treemate";
//#region src/dropdown/src/DropdownGroup.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  tmNode: {
    type: PropType<TreeNode<DropdownOption, DropdownGroupOption, DropdownIgnoredOption>>;
    required: true;
  };
  parentKey: {
    type: PropType<string | number | null>;
    default: null;
  };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  clsPrefix: {
    type: StringConstructor;
    required: true;
  };
  tmNode: {
    type: PropType<TreeNode<DropdownOption, DropdownGroupOption, DropdownIgnoredOption>>;
    required: true;
  };
  parentKey: {
    type: PropType<string | number | null>;
    default: null;
  };
}>> & Readonly<{}>, {
  parentKey: string | number | null;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };