Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_date_picker_src_utils = require("../../date-picker/src/utils.js");
const require_heatmap_styles_light = require("../styles/light.js");
const require_heatmap_src_animationStyle = require("./animationStyle.js");
const require_heatmap_src_ColorIndicator = require("./ColorIndicator.js");
const require_heatmap_src_Rect = require("./Rect.js");
const require_heatmap_src_styles_index_cssr = require("./styles/index.cssr.js");
const require_heatmap_src_theme = require("./theme.js");
const require_heatmap_src_utils_index = require("./utils/index.js");
let seemly = require("seemly");
let vue = require("vue");
let lodash_es = require("lodash");
let date_fns = require("date-fns");
//#region src/heatmap/src/Heatmap.tsx
const _hoisted_1 = ["colspan"];
const heatmapProps = {
	...require__mixins_use_theme.default.props,
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
var Heatmap_default = (0, vue.defineComponent)({
	name: "Heatmap",
	slots: Object,
	props: heatmapProps,
	setup(props) {
		const { mergedClsPrefixRef, mergedRtlRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const { localeRef, dateLocaleRef } = require__mixins_use_locale("Heatmap");
		const themeRef = require__mixins_use_theme.default("Heatmap", "-heatmap", require_heatmap_src_styles_index_cssr, require_heatmap_styles_light.default, props, mergedClsPrefixRef);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Heatmap", mergedRtlRef, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { xGap, yGap, size } = props;
			const { common: { cubicBezierEaseInOut }, self: { fontWeight, textColor, borderColor, loadingColorStart, [require__utils_cssr_index.createKey("rectSize", size)]: rectSize, [require__utils_cssr_index.createKey("borderRadius", size)]: sizeBorderRadius, [require__utils_cssr_index.createKey("xGap", size)]: defaultXGap, [require__utils_cssr_index.createKey("yGap", size)]: defaultYGap, [require__utils_cssr_index.createKey("fontSize", size)]: fontSize } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-font-size": fontSize,
				"--n-font-weight": fontWeight,
				"--n-text-color": textColor,
				"--n-border-radius": sizeBorderRadius,
				"--n-border-color": borderColor,
				"--n-loading-color-start": loadingColorStart,
				"--n-rect-size": rectSize,
				"--n-x-gap": xGap !== void 0 ? typeof xGap === "number" ? (0, seemly.pxfy)(xGap) : xGap : defaultXGap,
				"--n-y-gap": yGap !== void 0 ? typeof yGap === "number" ? (0, seemly.pxfy)(yGap) : yGap : defaultYGap
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("heatmap", (0, vue.computed)(() => {
			const { size } = props;
			return size[0];
		}), cssVarsRef, props) : void 0;
		const mergedColorsRef = (0, vue.computed)(() => {
			const { mininumColor: builtInMinimumColor, activeColors: builtInActiveColors } = themeRef.value.self;
			const mergedMininumColor = props.minimumColor || builtInMinimumColor;
			const theme = props.colorTheme && require_heatmap_src_theme.heatmapColorThemes[props.colorTheme];
			return [mergedMininumColor, ...props.activeColors || theme || builtInActiveColors];
		});
		const normalizedDataRef = (0, vue.computed)(() => {
			if (!props.data || props.data.length === 0) return [];
			return require_heatmap_src_utils_index.completeDataGaps(props.data, require_date_picker_src_utils.transformNaiveFirstDayOfWeekToDateFns(props.firstDayOfWeek), props.fillCalendarLeading);
		});
		const normalizedLoadingDataRef = (0, vue.computed)(() => {
			if (!props.loadingData || props.loadingData.length === 0) return [];
			return require_heatmap_src_utils_index.completeDataGaps(props.loadingData, require_date_picker_src_utils.transformNaiveFirstDayOfWeekToDateFns(props.firstDayOfWeek), props.fillCalendarLeading);
		});
		const maxValueRef = (0, vue.computed)(() => {
			const validData = normalizedDataRef.value.filter((d) => d.value !== null);
			return (0, lodash_es.maxBy)(validData, (d) => d.value)?.value ?? 0;
		});
		const heatmapMatrixRef = (0, vue.computed)(() => {
			const data = normalizedDataRef.value;
			const loadingData = normalizedLoadingDataRef.value;
			if (props.loading && !loadingData.length) return require_heatmap_src_utils_index.createLoadingMatrix(require_date_picker_src_utils.transformNaiveFirstDayOfWeekToDateFns(props.firstDayOfWeek));
			const finalData = props.loading ? loadingData : data;
			if (!finalData.length) return [];
			const maxValue = maxValueRef.value;
			const colors = mergedColorsRef.value;
			const calendarStartDate = finalData[0].timestamp;
			const dayRects = finalData.map((item) => require_heatmap_src_utils_index.createDayRect(item, calendarStartDate, require_date_picker_src_utils.transformNaiveFirstDayOfWeekToDateFns(props.firstDayOfWeek), colors, maxValue));
			return require_heatmap_src_utils_index.createSparseMatrix(7, dayRects, (dayRect) => dayRect.rowIndex, (dayRect) => dayRect.colIndex);
		});
		const weekLabelsRef = (0, vue.computed)(() => {
			const { weekdayFormat } = localeRef.value;
			const { locale } = dateLocaleRef.value;
			const baseDate = (0, date_fns.startOfWeek)(/* @__PURE__ */ new Date(), { weekStartsOn: require_date_picker_src_utils.transformNaiveFirstDayOfWeekToDateFns(props.firstDayOfWeek) });
			return Array.from({ length: 7 }, (_, i) => {
				return {
					label: (0, date_fns.format)((0, date_fns.addDays)(baseDate, i), weekdayFormat, { locale }),
					visible: i % 2 !== 0
				};
			});
		});
		const loadingMonthLabelsRef = (0, vue.computed)(() => {
			const { monthFormat } = localeRef.value;
			const { locale } = dateLocaleRef.value;
			const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
			const colSpans = [
				5,
				4,
				5,
				4,
				5,
				4,
				5,
				4,
				4,
				5,
				4,
				4
			];
			return Array.from({ length: 12 }, (_, i) => {
				const monthDate = new Date(currentYear, i, 1);
				return {
					name: (0, date_fns.format)(monthDate, monthFormat, { locale }),
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
						month: (0, date_fns.format)(cell.timestamp, "yyyy-MM")
					});
					break;
				}
			}
			return res;
		}
		const dataMonthLabelsRef = (0, vue.computed)(() => {
			const { monthFormat } = localeRef.value;
			const { locale } = dateLocaleRef.value;
			const matrix = heatmapMatrixRef.value;
			if (!matrix || matrix.length === 0 || !matrix[0]) return [];
			const colsWithMonth = getColsMonth(matrix);
			const monthStats = (0, lodash_es.mapValues)((0, lodash_es.groupBy)(colsWithMonth, "month"), (entries) => {
				const weekNumbers = entries.map((e) => e.week);
				return {
					weekCount: entries.length,
					start: Math.min(...weekNumbers),
					end: Math.max(...weekNumbers)
				};
			});
			return Object.entries(monthStats).filter(([, stats]) => stats.weekCount >= 3).sort(([a], [b]) => a.localeCompare(b)).map(([month, stats]) => {
				const monthDate = new Date((0, date_fns.parseISO)(`${month}-01`));
				return {
					name: (0, date_fns.format)(monthDate, monthFormat, { locale }),
					colSpan: stats.end - stats.start + 1
				};
			});
		});
		const monthLabelsRef = (0, vue.computed)(() => {
			return props.loading && !props.loadingData ? loadingMonthLabelsRef.value : dataMonthLabelsRef.value;
		});
		const loadingClassRef = require_heatmap_src_animationStyle.useLoadingStyleClass(props, themeRef);
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
		const { loading, showWeekLabels, showMonthLabels, showColorIndicator, mergedClsPrefix, themeClass, cssVars, rtlEnabled, locale, weekLabels, monthLabels, mergedColors, $slots, heatmapMatrix, loadingClass, onRender } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				themeClass,
				`${mergedClsPrefix}-heatmap`,
				rtlEnabled && `${mergedClsPrefix}-heatmap--rtl`
			]),
			style: (0, vue.normalizeStyle)(cssVars)
		}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-heatmap__content`) }, [(0, vue.createElementVNode)("table", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-heatmap__calendar-table`) }, [require_vdom.normalizeVNode(() => showMonthLabels && ((0, vue.openBlock)(), (0, vue.createElementBlock)("thead", null, [(0, vue.createElementVNode)("tr", null, [require_vdom.normalizeVNode(() => showWeekLabels && ((0, vue.openBlock)(), (0, vue.createElementBlock)("th", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-heatmap__week-header-cell`) }, null, 2))), require_vdom.normalizeVNode(() => monthLabels.map((monthLabel, index) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("th", {
			key: `month-${index}`,
			colspan: monthLabel.colSpan,
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-heatmap__month-label-cell`)
		}, [require_vdom.normalizeVNode(() => monthLabel.name)], 10, _hoisted_1))))])]))), (0, vue.createElementVNode)("tbody", null, [require_vdom.normalizeVNode(() => weekLabels.map((weekLabel, rowIdx) => {
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("tr", { key: `row-${rowIdx}` }, [require_vdom.normalizeVNode(() => showWeekLabels && ((0, vue.openBlock)(), (0, vue.createElementBlock)("td", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-heatmap__week-label-cell`) }, [weekLabel.visible ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => weekLabel.label)], 64)) : require_vdom.normalizeVNode(() => null)], 2))), require_vdom.normalizeVNode(() => (heatmapMatrix[rowIdx] || []).map((day, weekIdx) => {
				return day.value !== null ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("td", {
					key: `day-${rowIdx}-${weekIdx}`,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-heatmap__day-cell`)
				}, [((0, vue.openBlock)(), (0, vue.createBlock)(require_heatmap_src_Rect, {
					mergedClsPrefix,
					data: day,
					color: day.color,
					tooltip: this.tooltip,
					loading,
					loadingClass
				}, { tooltip: () => $slots.tooltip?.(day) }, 1032, [
					"mergedClsPrefix",
					"data",
					"color",
					"tooltip",
					"loading",
					"loadingClass"
				]))], 2)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("td", {
					key: `empty-${rowIdx}-${weekIdx}`,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-heatmap__day-cell`)
				}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-heatmap__empty-cell`) }, null, 2)], 2));
			}))]);
		}))])], 2)], 2), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-heatmap__footer`) }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot($slots.footer, (children) => children && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-heatmap__footer`) }, [require_vdom.normalizeVNode(() => children)], 2)))), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-heatmap__indicator`) }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot($slots.indicator, () => [showColorIndicator && ((0, vue.openBlock)(), (0, vue.createBlock)(require_heatmap_src_ColorIndicator, {
			colors: mergedColors,
			clsPrefix: mergedClsPrefix
		}, {
			"leading-text": () => require__utils_vue_resolve_slot.resolveSlot($slots["indicator-leading-text"], () => [locale.less]),
			"trailing-text": () => require__utils_vue_resolve_slot.resolveSlot($slots["indicator-trailing-text"], () => [locale.more])
		}, 1032, ["colors", "clsPrefix"]))]))], 2)], 2)], 6);
	}
});
//#endregion
exports.default = Heatmap_default;
exports.heatmapProps = heatmapProps;
