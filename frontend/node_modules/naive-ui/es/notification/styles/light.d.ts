import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
//#region src/notification/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  borderRadius: string;
  lineHeight: string;
  fontSize: string;
  headerFontWeight: string;
  iconColor: string;
  iconColorSuccess: string;
  iconColorInfo: string;
  iconColorWarning: string;
  iconColorError: string;
  color: string;
  textColor: string;
  closeIconColor: string;
  closeIconColorHover: string;
  closeIconColorPressed: string;
  closeBorderRadius: string;
  closeColorHover: string;
  closeColorPressed: string;
  headerTextColor: string;
  descriptionTextColor: string;
  actionTextColor: string;
  boxShadow: string;
  closeMargin: string;
  closeSize: string;
  closeIconSize: string;
  width: string;
  padding: string;
  titleFontSize: string;
  metaFontSize: string;
  descriptionFontSize: string;
};
interface NotificationThemeVars extends ReturnType<typeof self> {}
declare const notificationLight: NotificationTheme;
interface NotificationTheme extends Theme<'Notification', NotificationThemeVars, {
  Scrollbar: ScrollbarTheme;
}> {}
interface NotificationThemeOverrides extends ExtractThemeOverrides<NotificationTheme> {}
//#endregion
export { NotificationTheme, NotificationThemeOverrides, NotificationThemeVars, notificationLight as default, self };