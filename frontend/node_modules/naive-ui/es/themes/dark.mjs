import derived from "../_styles/common/dark.mjs";
import scrollbarDark from "../_internal/scrollbar/styles/dark.mjs";
import emptyDark from "../empty/styles/dark.mjs";
import popoverDark from "../popover/styles/dark.mjs";
import tagDark from "../tag/styles/dark.mjs";
import alertDark from "../alert/styles/dark.mjs";
import anchorDark from "../anchor/styles/dark.mjs";
import inputDark from "../input/styles/dark.mjs";
import autoCompleteDark from "../auto-complete/styles/dark.mjs";
import avatarDark from "../avatar/styles/dark.mjs";
import avatarGroupDark from "../avatar-group/styles/dark.mjs";
import backTopDark from "../back-top/styles/dark.mjs";
import badgeDark from "../badge/styles/dark.mjs";
import breadcrumbDark from "../breadcrumb/styles/dark.mjs";
import buttonDark from "../button/styles/dark.mjs";
import calendarDark from "../calendar/styles/dark.mjs";
import cardDark from "../card/styles/dark.mjs";
import carouselDark from "../carousel/styles/dark.mjs";
import checkboxDark from "../checkbox/styles/dark.mjs";
import cascaderDark from "../cascader/styles/dark.mjs";
import codeDark from "../code/styles/dark.mjs";
import collapseDark from "../collapse/styles/dark.mjs";
import collapseTransitionDark from "../collapse-transition/styles/dark.mjs";
import colorPickerDark from "../color-picker/styles/dark.mjs";
import popselect from "../popselect/styles/dark.mjs";
import selectDark from "../select/styles/dark.mjs";
import paginationDark from "../pagination/styles/dark.mjs";
import dropdownDark from "../dropdown/styles/dark.mjs";
import tooltipDark from "../tooltip/styles/dark.mjs";
import ellipsisDark from "../ellipsis/styles/dark.mjs";
import radioDark from "../radio/styles/dark.mjs";
import dataTableDark from "../data-table/styles/dark.mjs";
import iconDark from "../icon/styles/dark.mjs";
import timePickerDark from "../time-picker/styles/dark.mjs";
import datePickerDark from "../date-picker/styles/dark.mjs";
import descriptionsDark from "../descriptions/styles/dark.mjs";
import dialogDark from "../dialog/styles/dark.mjs";
import modalDark from "../modal/styles/dark.mjs";
import loadingBarDark from "../loading-bar/styles/dark.mjs";
import messageDark from "../message/styles/dark.mjs";
import notificationDark from "../notification/styles/dark.mjs";
import dividerDark from "../divider/styles/dark.mjs";
import drawerDark from "../drawer/styles/dark.mjs";
import dynamicInputDark from "../dynamic-input/styles/dark.mjs";
import spaceDark from "../space/styles/dark.mjs";
import dynamicTagsDark from "../dynamic-tags/styles/dark.mjs";
import elementDark from "../element/styles/dark.mjs";
import flexDark from "../flex/styles/dark.mjs";
import buttonGroupDark from "../button-group/styles/dark.mjs";
import formItemDark from "../form/styles/dark.mjs";
import gradientTextDark from "../gradient-text/styles/dark.mjs";
import inputNumberDark from "../input-number/styles/dark.mjs";
import inputOtpDark from "../input-otp/styles/dark.mjs";
import layoutDark from "../layout/styles/dark.mjs";
import rowDark from "../legacy-grid/styles/dark.mjs";
import listDark from "../list/styles/dark.mjs";
import logDark from "../log/styles/dark.mjs";
import listDark$1 from "../mention/styles/dark.mjs";
import menuDark from "../menu/styles/dark.mjs";
import { pageHeaderDark } from "../page-header/styles/dark.mjs";
import popconfirmDark from "../popconfirm/styles/dark.mjs";
import progressDark from "../progress/styles/dark.mjs";
import rateDark from "../rate/styles/dark.mjs";
import resultDark from "../result/styles/dark.mjs";
import sliderDark from "../slider/styles/dark.mjs";
import spinDark from "../spin/styles/dark.mjs";
import statisticDark from "../statistic/styles/dark.mjs";
import stepsDark from "../steps/styles/dark.mjs";
import switchDark from "../switch/styles/dark.mjs";
import tableDark from "../table/styles/dark.mjs";
import tabsDark from "../tabs/styles/dark.mjs";
import thingDark from "../thing/styles/dark.mjs";
import timelineDark from "../timeline/styles/dark.mjs";
import transferDark from "../transfer/styles/dark.mjs";
import treeDark from "../tree/styles/dark.mjs";
import treeSelectDark from "../tree-select/styles/dark.mjs";
import typographyDark from "../typography/styles/dark.mjs";
import uploadDark from "../upload/styles/dark.mjs";
import watermarkDark from "../watermark/styles/dark.mjs";
import floatButtonDark from "../float-button/styles/dark.mjs";
import iconDark$1 from "../icon-wrapper/styles/dark.mjs";
import { imageDark } from "../image/styles/dark.mjs";
import transferDark$1 from "../legacy-transfer/styles/dark.mjs";
import marqueeDark from "../marquee/styles/dark.mjs";
import qrcodeDark from "../qr-code/styles/dark.mjs";
import { skeletonDark } from "../skeleton/styles/dark.mjs";
import splitDark from "../split/styles/dark.mjs";
import equationDark from "../equation/styles/dark.mjs";
import floatButtonGroupDark from "../float-button-group/styles/dark.mjs";
import HeatmapDark from "../heatmap/styles/dark.mjs";
//#region src/themes/dark.ts
const darkTheme = {
  name: "dark",
  common: derived,
  Alert: alertDark,
  Anchor: anchorDark,
  AutoComplete: autoCompleteDark,
  Avatar: avatarDark,
  AvatarGroup: avatarGroupDark,
  BackTop: backTopDark,
  Badge: badgeDark,
  Breadcrumb: breadcrumbDark,
  Button: buttonDark,
  ButtonGroup: buttonGroupDark,
  Calendar: calendarDark,
  Card: cardDark,
  Carousel: carouselDark,
  Cascader: cascaderDark,
  Checkbox: checkboxDark,
  Code: codeDark,
  Collapse: collapseDark,
  CollapseTransition: collapseTransitionDark,
  ColorPicker: colorPickerDark,
  DataTable: dataTableDark,
  DatePicker: datePickerDark,
  Descriptions: descriptionsDark,
  Dialog: dialogDark,
  Divider: dividerDark,
  Drawer: drawerDark,
  Dropdown: dropdownDark,
  DynamicInput: dynamicInputDark,
  DynamicTags: dynamicTagsDark,
  Element: elementDark,
  Empty: emptyDark,
  Ellipsis: ellipsisDark,
  Equation: equationDark,
  Flex: flexDark,
  Form: formItemDark,
  GradientText: gradientTextDark,
  Heatmap: HeatmapDark,
  Icon: iconDark,
  IconWrapper: iconDark$1,
  Image: imageDark,
  Input: inputDark,
  InputNumber: inputNumberDark,
  InputOtp: inputOtpDark,
  LegacyTransfer: transferDark$1,
  Layout: layoutDark,
  List: listDark,
  LoadingBar: loadingBarDark,
  Log: logDark,
  Menu: menuDark,
  Mention: listDark$1,
  Message: messageDark,
  Modal: modalDark,
  Notification: notificationDark,
  PageHeader: pageHeaderDark,
  Pagination: paginationDark,
  Popconfirm: popconfirmDark,
  Popover: popoverDark,
  Popselect: popselect,
  Progress: progressDark,
  QrCode: qrcodeDark,
  Radio: radioDark,
  Rate: rateDark,
  Result: resultDark,
  Row: rowDark,
  Scrollbar: scrollbarDark,
  Select: selectDark,
  Skeleton: skeletonDark,
  Slider: sliderDark,
  Space: spaceDark,
  Spin: spinDark,
  Statistic: statisticDark,
  Steps: stepsDark,
  Switch: switchDark,
  Table: tableDark,
  Tabs: tabsDark,
  Tag: tagDark,
  Thing: thingDark,
  TimePicker: timePickerDark,
  Timeline: timelineDark,
  Tooltip: tooltipDark,
  Transfer: transferDark,
  Tree: treeDark,
  TreeSelect: treeSelectDark,
  Typography: typographyDark,
  Upload: uploadDark,
  Watermark: watermarkDark,
  Split: splitDark,
  FloatButton: floatButtonDark,
  FloatButtonGroup: floatButtonGroupDark,
  Marquee: marqueeDark
};
//#endregion
export { darkTheme };