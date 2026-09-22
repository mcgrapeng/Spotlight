import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { ScrollbarProps } from "../../_internal/scrollbar/src/Scrollbar.js";
import "../../_internal/index.js";
import { DrawerThemeVars } from "../styles/light.js";
import "../styles/index.js";
import "../../index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { CSSProperties, PropType, SlotsType, VNode } from "vue";
//#region src/drawer/src/DrawerContent.d.ts
declare const drawerContentProps: {
  title: StringConstructor;
  headerClass: StringConstructor;
  headerStyle: PropType<string | CSSProperties>;
  footerClass: StringConstructor;
  footerStyle: PropType<string | CSSProperties>;
  bodyClass: StringConstructor;
  bodyStyle: PropType<string | CSSProperties>;
  bodyContentClass: StringConstructor;
  bodyContentStyle: PropType<string | CSSProperties>;
  nativeScrollbar: {
    type: BooleanConstructor;
    default: boolean;
  };
  scrollbarProps: PropType<ScrollbarProps>;
  closable: BooleanConstructor;
};
type DrawerContentProps = ExtractPublicPropTypes<typeof drawerContentProps>;
interface DrawerContentSlots {
  default?: () => VNode[];
  header?: () => VNode[];
  footer?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  title: StringConstructor;
  headerClass: StringConstructor;
  headerStyle: PropType<string | CSSProperties>;
  footerClass: StringConstructor;
  footerStyle: PropType<string | CSSProperties>;
  bodyClass: StringConstructor;
  bodyStyle: PropType<string | CSSProperties>;
  bodyContentClass: StringConstructor;
  bodyContentStyle: PropType<string | CSSProperties>;
  nativeScrollbar: {
    type: BooleanConstructor;
    default: boolean;
  };
  scrollbarProps: PropType<ScrollbarProps>;
  closable: BooleanConstructor;
}>, {
  handleCloseClick: () => void;
  mergedTheme: import("vue").Ref<{
    common: ThemeCommonVars;
    self: DrawerThemeVars;
    peers: {
      Scrollbar: ScrollbarTheme;
    };
    peerOverrides: {
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }, {
    common: ThemeCommonVars;
    self: DrawerThemeVars;
    peers: {
      Scrollbar: ScrollbarTheme;
    };
    peerOverrides: {
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
  mergedClsPrefix: import("vue").Ref<string, string>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  title: StringConstructor;
  headerClass: StringConstructor;
  headerStyle: PropType<string | CSSProperties>;
  footerClass: StringConstructor;
  footerStyle: PropType<string | CSSProperties>;
  bodyClass: StringConstructor;
  bodyStyle: PropType<string | CSSProperties>;
  bodyContentClass: StringConstructor;
  bodyContentStyle: PropType<string | CSSProperties>;
  nativeScrollbar: {
    type: BooleanConstructor;
    default: boolean;
  };
  scrollbarProps: PropType<ScrollbarProps>;
  closable: BooleanConstructor;
}>> & Readonly<{}>, {
  closable: boolean;
  nativeScrollbar: boolean;
}, SlotsType<DrawerContentSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { DrawerContentProps, DrawerContentSlots, _default as default, drawerContentProps };