import derived from "../_styles/common/light.mjs";
import scrollbarLight from "../_internal/scrollbar/styles/light.mjs";
import emptyLight from "../empty/styles/light.mjs";
import popoverLight from "../popover/styles/light.mjs";
import tagLight from "../tag/styles/light.mjs";
import alertLight from "../alert/styles/light.mjs";
import anchorLight from "../anchor/styles/light.mjs";
import inputLight from "../input/styles/light.mjs";
import autoCompleteLight from "../auto-complete/styles/light.mjs";
import avatarLight from "../avatar/styles/light.mjs";
import avatarGroupLight from "../avatar-group/styles/light.mjs";
import backTopLight from "../back-top/styles/light.mjs";
import badgeLight from "../badge/styles/light.mjs";
import breadcrumbLight from "../breadcrumb/styles/light.mjs";
import buttonLight from "../button/styles/light.mjs";
import calendarLight from "../calendar/styles/light.mjs";
import cardLight from "../card/styles/light.mjs";
import carouselLight from "../carousel/styles/light.mjs";
import checkboxLight from "../checkbox/styles/light.mjs";
import cascaderLight from "../cascader/styles/light.mjs";
import codeLight from "../code/styles/light.mjs";
import collapseLight from "../collapse/styles/light.mjs";
import collapseTransitionLight from "../collapse-transition/styles/light.mjs";
import colorPickerLight from "../color-picker/styles/light.mjs";
import popselectLight from "../popselect/styles/light.mjs";
import selectLight from "../select/styles/light.mjs";
import paginationLight from "../pagination/styles/light.mjs";
import dropdownLight from "../dropdown/styles/light.mjs";
import tooltipLight from "../tooltip/styles/light.mjs";
import ellipsisLight from "../ellipsis/styles/light.mjs";
import radioLight from "../radio/styles/light.mjs";
import dataTableLight from "../data-table/styles/light.mjs";
import iconLight from "../icon/styles/light.mjs";
import timePickerLight from "../time-picker/styles/light.mjs";
import datePickerLight from "../date-picker/styles/light.mjs";
import descriptionsLight from "../descriptions/styles/light.mjs";
import dialogLight from "../dialog/styles/light.mjs";
import modalLight from "../modal/styles/light.mjs";
import loadingBarLight from "../loading-bar/styles/light.mjs";
import messageLight from "../message/styles/light.mjs";
import notificationLight from "../notification/styles/light.mjs";
import dividerLight from "../divider/styles/light.mjs";
import drawerLight from "../drawer/styles/light.mjs";
import dynamicInputLight from "../dynamic-input/styles/light.mjs";
import spaceLight from "../space/styles/light.mjs";
import dynamicTagsLight from "../dynamic-tags/styles/light.mjs";
import elementLight from "../element/styles/light.mjs";
import flexLight from "../flex/styles/light.mjs";
import buttonGroupLight from "../button-group/styles/light.mjs";
import formLight from "../form/styles/light.mjs";
import gradientTextLight from "../gradient-text/styles/light.mjs";
import inputNumberLight from "../input-number/styles/light.mjs";
import inputOtpLight from "../input-otp/styles/light.mjs";
import layoutLight from "../layout/styles/light.mjs";
import rowLight from "../legacy-grid/styles/light.mjs";
import listLight from "../list/styles/light.mjs";
import logLight from "../log/styles/light.mjs";
import mentionLight from "../mention/styles/light.mjs";
import menuLight from "../menu/styles/light.mjs";
import { pageHeaderLight } from "../page-header/styles/light.mjs";
import popconfirmLight from "../popconfirm/styles/light.mjs";
import progressLight from "../progress/styles/light.mjs";
import themeLight from "../rate/styles/light.mjs";
import resultLight from "../result/styles/light.mjs";
import sliderLight from "../slider/styles/light.mjs";
import spinLight from "../spin/styles/light.mjs";
import statisticLight from "../statistic/styles/light.mjs";
import stepsLight from "../steps/styles/light.mjs";
import switchLight from "../switch/styles/light.mjs";
import tableLight from "../table/styles/light.mjs";
import tabsLight from "../tabs/styles/light.mjs";
import thingLight from "../thing/styles/light.mjs";
import timelineLight from "../timeline/styles/light.mjs";
import transferLight from "../transfer/styles/light.mjs";
import treeLight from "../tree/styles/light.mjs";
import treeSelectLight from "../tree-select/styles/light.mjs";
import typographyLight from "../typography/styles/light.mjs";
import uploadLight from "../upload/styles/light.mjs";
import watermarkLight from "../watermark/styles/light.mjs";
import themeLight$1 from "../float-button-group/styles/light.mjs";
import themeLight$2 from "../float-button/styles/light.mjs";
import heatmapLight from "../heatmap/styles/light.mjs";
import iconWrapperLight from "../icon-wrapper/styles/light.mjs";
import { imageLight } from "../image/styles/light.mjs";
import transferLight$1 from "../legacy-transfer/styles/light.mjs";
import marqueeLight from "../marquee/styles/light.mjs";
import themeLight$3 from "../qr-code/styles/light.mjs";
import { skeletonLight } from "../skeleton/styles/light.mjs";
import themeLight$4 from "../split/styles/light.mjs";
import equationLight from "../equation/styles/light.mjs";
//#region src/themes/light.ts
const lightTheme = {
  name: "light",
  common: derived,
  Alert: alertLight,
  Anchor: anchorLight,
  AutoComplete: autoCompleteLight,
  Avatar: avatarLight,
  AvatarGroup: avatarGroupLight,
  BackTop: backTopLight,
  Badge: badgeLight,
  Breadcrumb: breadcrumbLight,
  Button: buttonLight,
  ButtonGroup: buttonGroupLight,
  Calendar: calendarLight,
  Card: cardLight,
  Carousel: carouselLight,
  Cascader: cascaderLight,
  Checkbox: checkboxLight,
  Code: codeLight,
  Collapse: collapseLight,
  CollapseTransition: collapseTransitionLight,
  ColorPicker: colorPickerLight,
  DataTable: dataTableLight,
  DatePicker: datePickerLight,
  Descriptions: descriptionsLight,
  Dialog: dialogLight,
  Divider: dividerLight,
  Drawer: drawerLight,
  Dropdown: dropdownLight,
  DynamicInput: dynamicInputLight,
  DynamicTags: dynamicTagsLight,
  Element: elementLight,
  Empty: emptyLight,
  Equation: equationLight,
  Ellipsis: ellipsisLight,
  Flex: flexLight,
  Form: formLight,
  GradientText: gradientTextLight,
  Heatmap: heatmapLight,
  Icon: iconLight,
  IconWrapper: iconWrapperLight,
  Image: imageLight,
  Input: inputLight,
  InputNumber: inputNumberLight,
  InputOtp: inputOtpLight,
  Layout: layoutLight,
  LegacyTransfer: transferLight$1,
  List: listLight,
  LoadingBar: loadingBarLight,
  Log: logLight,
  Menu: menuLight,
  Mention: mentionLight,
  Message: messageLight,
  Modal: modalLight,
  Notification: notificationLight,
  PageHeader: pageHeaderLight,
  Pagination: paginationLight,
  Popconfirm: popconfirmLight,
  Popover: popoverLight,
  Popselect: popselectLight,
  Progress: progressLight,
  QrCode: themeLight$3,
  Radio: radioLight,
  Rate: themeLight,
  Row: rowLight,
  Result: resultLight,
  Scrollbar: scrollbarLight,
  Skeleton: skeletonLight,
  Select: selectLight,
  Slider: sliderLight,
  Space: spaceLight,
  Spin: spinLight,
  Statistic: statisticLight,
  Steps: stepsLight,
  Switch: switchLight,
  Table: tableLight,
  Tabs: tabsLight,
  Tag: tagLight,
  Thing: thingLight,
  TimePicker: timePickerLight,
  Timeline: timelineLight,
  Tooltip: tooltipLight,
  Transfer: transferLight,
  Tree: treeLight,
  TreeSelect: treeSelectLight,
  Typography: typographyLight,
  Upload: uploadLight,
  Watermark: watermarkLight,
  Split: themeLight$4,
  FloatButton: themeLight$2,
  FloatButtonGroup: themeLight$1,
  Marquee: marqueeLight
};
//#endregion
export { lightTheme };