import { createKey } from "../../_utils/cssr/index.mjs";
import { resolveSlot, resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useLocale from "../../_mixins/use-locale.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { transformNaiveFirstDayOfWeekToDateFns } from "../../date-picker/src/utils.mjs";
import heatmapLight from "../styles/light.mjs";
import { useLoadingStyleClass } from "./animationStyle.mjs";
import ColorIndicator_default from "./ColorIndicator.mjs";
import Rect_default from "./Rect.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { heatmapColorThemes } from "./theme.mjs";
import { completeDataGaps, createDayRect, createLoadingMatrix, createSparseMatrix } from "./utils/index.mjs";
import { pxfy } from "seemly";
import { Fragment, computed, createBlock, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock } from "vue";
import { groupBy, mapValues, maxBy } from "lodash-es";
import { addDays, format, parseISO, startOfWeek } from "date-fns";
//#region src/heatmap/src/Heatmap.tsx
const _hoisted_1 = ["colspan"];
const heatmapProps = {
  ...useTheme.props,
  activeColors: Array,
  colorTheme: String,
  data: Array,
  loadingData: Object,
  fillCalendarLeading: Boolean,
  firstDayOfWeek: {
    type: Number,
    default: 0
  },
  loading: Boolean,
  minimumColor: String,
  showColorIndicator: {
    type: Boolean,
    default: true
  },
  showWeekLabels: {
    type: Boolean,
    default: true
  },
  showMonthLabels: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: "medium"
  },
  tooltip: {
    type: [Boolean, Object],
    default: false
  },
  xGap: [Number, String],
  yGap: [Number, String]
};
var Heatmap_default = defineComponent({
  name: "Heatmap",
  slots: Object,
  props: heatmapProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      mergedRtlRef,
      inlineThemeDisabled
    } = useConfig(props);
    const {
      localeRef,
      dateLocaleRef
    } = useLocale("Heatmap");
    const themeRef = useTheme("Heatmap", "-heatmap", index_cssr_default, heatmapLight, props, mergedClsPrefixRef);
    const rtlEnabledRef = useRtl("Heatmap", mergedRtlRef, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        xGap,
        yGap,
        size
      } = props;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          fontWeight,
          textColor,
          borderColor,
          loadingColorStart,
          [createKey("rectSize", size)]: rectSize,
          [createKey("borderRadius", size)]: sizeBorderRadius,
          [createKey("xGap", size)]: defaultXGap,
          [createKey("yGap", size)]: defaultYGap,
          [createKey("fontSize", size)]: fontSize
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-font-size": fontSize,
        "--n-font-weight": fontWeight,
        "--n-text-color": textColor,
        "--n-border-radius": sizeBorderRadius,
        "--n-border-color": borderColor,
        "--n-loading-color-start": loadingColorStart,
        "--n-rect-size": rectSize,
        "--n-x-gap": xGap !== void 0 ? typeof xGap === "number" ? pxfy(xGap) : xGap : defaultXGap,
        "--n-y-gap": yGap !== void 0 ? typeof yGap === "number" ? pxfy(yGap) : yGap : defaultYGap
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("heatmap", computed(() => {
      const {
        size
      } = props;
      return size[0];
    }), cssVarsRef, props) : void 0;
    const mergedColorsRef = computed(() => {
      const {
        mininumColor: builtInMinimumColor,
        activeColors: builtInActiveColors
      } = themeRef.value.self;
      const mergedMininumColor = props.minimumColor || builtInMinimumColor;
      const theme = props.colorTheme && heatmapColorThemes[props.colorTheme];
      return [mergedMininumColor, ...(props.activeColors || theme || builtInActiveColors)];
    });
    const normalizedDataRef = computed(() => {
      if (!props.data || props.data.length === 0) return [];
      return completeDataGaps(props.data, transformNaiveFirstDayOfWeekToDateFns(props.firstDayOfWeek), props.fillCalendarLeading);
    });
    const normalizedLoadingDataRef = computed(() => {
      if (!props.loadingData || props.loadingData.length === 0) return [];
      return completeDataGaps(props.loadingData, transformNaiveFirstDayOfWeekToDateFns(props.firstDayOfWeek), props.fillCalendarLeading);
    });
    const maxValueRef = computed(() => {
      const validData = normalizedDataRef.value.filter(d => d.value !== null);
      return maxBy(validData, d => d.value)?.value ?? 0;
    });
    const heatmapMatrixRef = computed(() => {
      const data = normalizedDataRef.value;
      const loadingData = normalizedLoadingDataRef.value;
      if (props.loading && !loadingData.length) return createLoadingMatrix(transformNaiveFirstDayOfWeekToDateFns(props.firstDayOfWeek));
      const finalData = props.loading ? loadingData : data;
      if (!finalData.length) return [];
      const maxValue = maxValueRef.value;
      const colors = mergedColorsRef.value;
      const calendarStartDate = finalData[0].timestamp;
      const dayRects = finalData.map(item => createDayRect(item, calendarStartDate, transformNaiveFirstDayOfWeekToDateFns(props.firstDayOfWeek), colors, maxValue));
      return createSparseMatrix(7, dayRects, dayRect => dayRect.rowIndex, dayRect => dayRect.colIndex);
    });
    const weekLabelsRef = computed(() => {
      const {
        weekdayFormat
      } = localeRef.value;
      const {
        locale
      } = dateLocaleRef.value;
      const baseDate = startOfWeek(/* @__PURE__ */new Date(), {
        weekStartsOn: transformNaiveFirstDayOfWeekToDateFns(props.firstDayOfWeek)
      });
      return Array.from({
        length: 7
      }, (_, i) => {
        return {
          label: format(addDays(baseDate, i), weekdayFormat, {
            locale
          }),
          visible: i % 2 !== 0
        };
      });
    });
    const loadingMonthLabelsRef = computed(() => {
      const {
        monthFormat
      } = localeRef.value;
      const {
        locale
      } = dateLocaleRef.value;
      const currentYear = (/* @__PURE__ */new Date()).getFullYear();
      const colSpans = [5, 4, 5, 4, 5, 4, 5, 4, 4, 5, 4, 4];
      return Array.from({
        length: 12
      }, (_, i) => {
        const monthDate = new Date(currentYear, i, 1);
        return {
          name: format(monthDate, monthFormat, {
            locale
          }),
          colSpan: colSpans[i]
        };
      });
    });
    function getColsMonth(matrix) {
      const cols = matrix[0].length;
      const res = [];
      for (let col = 0; col < cols; col++) for (let row = 0; row < matrix.length; row++) {
        const cell = matrix[row][col];
        if (cell?.value !== null) {
          res.push({
            week: col,
            month: format(cell.timestamp, "yyyy-MM")
          });
          break;
        }
      }
      return res;
    }
    const dataMonthLabelsRef = computed(() => {
      const {
        monthFormat
      } = localeRef.value;
      const {
        locale
      } = dateLocaleRef.value;
      const matrix = heatmapMatrixRef.value;
      if (!matrix || matrix.length === 0 || !matrix[0]) return [];
      const colsWithMonth = getColsMonth(matrix);
      const monthStats = mapValues(groupBy(colsWithMonth, "month"), entries => {
        const weekNumbers = entries.map(e => e.week);
        return {
          weekCount: entries.length,
          start: Math.min(...weekNumbers),
          end: Math.max(...weekNumbers)
        };
      });
      return Object.entries(monthStats).filter(([, stats]) => stats.weekCount >= 3).sort(([a], [b]) => a.localeCompare(b)).map(([month, stats]) => {
        const monthDate = new Date(parseISO(`${month}-01`));
        return {
          name: format(monthDate, monthFormat, {
            locale
          }),
          colSpan: stats.end - stats.start + 1
        };
      });
    });
    const monthLabelsRef = computed(() => {
      return props.loading && !props.loadingData ? loadingMonthLabelsRef.value : dataMonthLabelsRef.value;
    });
    const loadingClassRef = useLoadingStyleClass(props, themeRef);
    return {
      weekLabels: weekLabelsRef,
      monthLabels: monthLabelsRef,
      mergedColors: mergedColorsRef,
      mergedClsPrefix: mergedClsPrefixRef,
      rtlEnabled: rtlEnabledRef,
      locale: localeRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender,
      heatmapMatrix: heatmapMatrixRef,
      loadingClass: loadingClassRef
    };
  },
  render() {
    const {
      loading,
      showWeekLabels,
      showMonthLabels,
      showColorIndicator,
      mergedClsPrefix,
      themeClass,
      cssVars,
      rtlEnabled,
      locale,
      weekLabels,
      monthLabels,
      mergedColors,
      $slots,
      heatmapMatrix,
      loadingClass,
      onRender
    } = this;
    onRender?.();
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([themeClass, `${mergedClsPrefix}-heatmap`, rtlEnabled && `${mergedClsPrefix}-heatmap--rtl`]),
      style: normalizeStyle(cssVars)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-heatmap__content`)
    }, [createElementVNode("table", {
      class: normalizeClass$1(`${mergedClsPrefix}-heatmap__calendar-table`)
    }, [normalizeVNode(() => showMonthLabels && (openBlock(), createElementBlock("thead", null, [createElementVNode("tr", null, [normalizeVNode(() => showWeekLabels && (openBlock(), createElementBlock("th", {
      class: normalizeClass$1(`${mergedClsPrefix}-heatmap__week-header-cell`)
    }, null, 2))), normalizeVNode(() => monthLabels.map((monthLabel, index) => (openBlock(), createElementBlock("th", {
      key: `month-${index}`,
      colspan: monthLabel.colSpan,
      class: normalizeClass$1(`${mergedClsPrefix}-heatmap__month-label-cell`)
    }, [normalizeVNode(() => monthLabel.name)], 10, _hoisted_1))))])]))), createElementVNode("tbody", null, [normalizeVNode(() => weekLabels.map((weekLabel, rowIdx) => {
      return openBlock(), createElementBlock("tr", {
        key: `row-${rowIdx}`
      }, [normalizeVNode(() => showWeekLabels && (openBlock(), createElementBlock("td", {
        class: normalizeClass$1(`${mergedClsPrefix}-heatmap__week-label-cell`)
      }, [weekLabel.visible ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => weekLabel.label)], 64)) : normalizeVNode(() => null)], 2))), normalizeVNode(() => (heatmapMatrix[rowIdx] || []).map((day, weekIdx) => {
        return day.value !== null ? (openBlock(), createElementBlock("td", {
          key: `day-${rowIdx}-${weekIdx}`,
          class: normalizeClass$1(`${mergedClsPrefix}-heatmap__day-cell`)
        }, [(openBlock(), createBlock(Rect_default, {
          mergedClsPrefix,
          data: day,
          color: day.color,
          tooltip: this.tooltip,
          loading,
          loadingClass
        }, {
          tooltip: () => $slots.tooltip?.(day)
        }, 1032, ["mergedClsPrefix", "data", "color", "tooltip", "loading", "loadingClass"]))], 2)) : (openBlock(), createElementBlock("td", {
          key: `empty-${rowIdx}-${weekIdx}`,
          class: normalizeClass$1(`${mergedClsPrefix}-heatmap__day-cell`)
        }, [createElementVNode("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-heatmap__empty-cell`)
        }, null, 2)], 2));
      }))]);
    }))])], 2)], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-heatmap__footer`)
    }, [normalizeVNode(() => resolveWrappedSlot($slots.footer, children => children && (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-heatmap__footer`)
    }, [normalizeVNode(() => children)], 2)))), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-heatmap__indicator`)
    }, [normalizeVNode(() => resolveSlot($slots.indicator, () => [showColorIndicator && (openBlock(), createBlock(ColorIndicator_default, {
      colors: mergedColors,
      clsPrefix: mergedClsPrefix
    }, {
      "leading-text": () => resolveSlot($slots["indicator-leading-text"], () => [locale.less]),
      "trailing-text": () => resolveSlot($slots["indicator-trailing-text"], () => [locale.more])
    }, 1032, ["colors", "clsPrefix"]))]))], 2)], 2)], 6);
  }
});
//#endregion
export { Heatmap_default as default, heatmapProps };