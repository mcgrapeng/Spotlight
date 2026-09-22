import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { CollapseItemArrowSlotProps, CollapseItemHeaderExtraSlotProps, CollapseItemHeaderSlotProps } from "./interface.js";
import { CollapseSlots } from "./Collapse.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { PropType, VNode } from "vue";
//#region src/collapse/src/CollapseItem.d.ts
declare const collapseItemProps: {
  readonly title: StringConstructor;
  readonly name: PropType<string | number>;
  readonly disabled: BooleanConstructor;
  readonly displayDirective: PropType<"if" | "show">;
};
type CollapseItemProps = ExtractPublicPropTypes<typeof collapseItemProps>;
interface CollapseItemSlots {
  default?: () => VNode[];
  header?: (props: CollapseItemHeaderSlotProps) => VNode[];
  'header-extra'?: (props: CollapseItemHeaderExtraSlotProps) => VNode[];
  arrow?: (props: CollapseItemArrowSlotProps) => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly title: StringConstructor;
  readonly name: PropType<string | number>;
  readonly disabled: BooleanConstructor;
  readonly displayDirective: PropType<"if" | "show">;
}>, {
  rtlEnabled: import("vue").Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  collapseSlots: CollapseSlots;
  randomName: string;
  mergedClsPrefix: import("vue").Ref<string, string>;
  collapsed: import("vue").ComputedRef<boolean>;
  triggerAreas: import("vue").Ref<("main" | "extra" | "arrow")[], ("main" | "extra" | "arrow")[]>;
  mergedDisplayDirective: import("vue").ComputedRef<"show" | "if">;
  arrowPlacement: import("vue").ComputedRef<"left" | "right">;
  handleClick(e: MouseEvent): void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly title: StringConstructor;
  readonly name: PropType<string | number>;
  readonly disabled: BooleanConstructor;
  readonly displayDirective: PropType<"if" | "show">;
}>> & Readonly<{}>, {
  readonly disabled: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { CollapseItemProps, CollapseItemSlots, collapseItemProps, _default as default };