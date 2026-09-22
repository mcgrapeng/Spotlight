import { ThemeCommonVars } from "../../_styles/common/light.js";
import { NotificationThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { NotificationPlacement } from "./NotificationProvider.js";
import "../../index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { PropType } from "vue";
//#region src/notification/src/NotificationContainer.d.ts
declare const NotificationContainer: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  scrollable: {
    type: BooleanConstructor;
    required: true;
  };
  placement: {
    type: PropType<NotificationPlacement>;
    required: true;
  };
}>, {
  selfRef: import("vue").Ref<HTMLElement | null, HTMLElement | null>;
  mergedTheme: import("vue").Ref<{
    common: ThemeCommonVars;
    self: NotificationThemeVars;
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
    self: NotificationThemeVars;
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
  transitioning: import("vue").Ref<number, number>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  scrollable: {
    type: BooleanConstructor;
    required: true;
  };
  placement: {
    type: PropType<NotificationPlacement>;
    required: true;
  };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { NotificationContainer };