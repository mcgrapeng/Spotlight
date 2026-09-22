import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/timeline/src/TimelineItem.d.ts
declare const timelineItemProps: {
  time: PropType<string | number>;
  title: StringConstructor;
  content: StringConstructor;
  color: StringConstructor;
  lineType: {
    type: PropType<"default" | "dashed">;
    default: string;
  };
  type: {
    type: PropType<"default" | "success" | "error" | "warning" | "info">;
    default: string;
  };
};
type TimelineItemProps = ExtractPublicPropTypes<typeof timelineItemProps>;
interface TimelineItemSlots {
  default?: () => VNode[];
  icon?: () => VNode[];
  footer?: () => VNode[];
  header?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  time: PropType<string | number>;
  title: StringConstructor;
  content: StringConstructor;
  color: StringConstructor;
  lineType: {
    type: PropType<"default" | "dashed">;
    default: string;
  };
  type: {
    type: PropType<"default" | "success" | "error" | "warning" | "info">;
    default: string;
  };
}>, {
  mergedClsPrefix: Ref<string, string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  time: PropType<string | number>;
  title: StringConstructor;
  content: StringConstructor;
  color: StringConstructor;
  lineType: {
    type: PropType<"default" | "dashed">;
    default: string;
  };
  type: {
    type: PropType<"default" | "success" | "error" | "warning" | "info">;
    default: string;
  };
}>> & Readonly<{}>, {
  type: "error" | "info" | "success" | "warning" | "default";
  lineType: "default" | "dashed";
}, SlotsType<TimelineItemSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { TimelineItemProps, TimelineItemSlots, _default as default, timelineItemProps };