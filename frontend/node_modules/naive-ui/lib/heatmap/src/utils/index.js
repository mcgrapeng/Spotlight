Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let lodash_es = require("lodash");
let date_fns = require("date-fns");
//#region src/heatmap/src/utils/index.ts
/** get color by value/maxValue */
function calcColorByValue(colors, value, maxValue) {
	if (maxValue === 0 || value === null || value === void 0 || value <= 0) return colors[0];
	const ratio = Math.min(value / maxValue, 1);
	const maxLevel = colors.length - 1;
	return colors[Math.min(Math.ceil(ratio * maxLevel), maxLevel)];
}
/**
* fill gaps for the given data
*
* fill gaps `[firstDate,lastDate]` with value `0`
*
* fill `[firstCalendarDate,firstDate]` and `[lastDate,lastCalendarDate]` with value `null` by default
*
* fill `[firstCalendarDate,firstDate]` with value `0` when `fillCalendarLeading` is `true`
*/
function completeDataGaps(data, firstDayOfWeek, fillCalendarLeading) {
	const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
	const firstDate = sortedData[0].timestamp;
	const lastDate = sortedData[sortedData.length - 1].timestamp;
	const firstCalendarDate = (0, date_fns.startOfWeek)(firstDate, { weekStartsOn: firstDayOfWeek });
	const lastCalendarEndDate = (0, date_fns.endOfWeek)(lastDate, { weekStartsOn: firstDayOfWeek });
	const dataMap = new Map(sortedData.map((d) => [(0, date_fns.startOfDay)(d.timestamp).getTime(), d]));
	const allCalendarDates = (0, date_fns.eachDayOfInterval)({
		start: firstCalendarDate,
		end: lastCalendarEndDate
	});
	const startDate = fillCalendarLeading ? firstCalendarDate : firstDate;
	return allCalendarDates.map((date) => {
		const key = (0, date_fns.startOfDay)(date).getTime();
		const dateValue = dataMap.get(key);
		if (dateValue) return dateValue;
		const value = (0, date_fns.isWithinInterval)(date, {
			start: startDate,
			end: lastDate
		}) ? 0 : null;
		return {
			timestamp: date.getTime(),
			value
		};
	});
}
/**
* Create a DayRect object with position information
*/
function createDayRect(item, calendarStartDate, weekStartOn, colors, maxValue) {
	const daysFromGridStart = (0, date_fns.differenceInCalendarDays)(item.timestamp, calendarStartDate);
	const colIndex = Math.floor(daysFromGridStart / 7);
	const dayOfWeek = (0, date_fns.getDay)(item.timestamp);
	const rowIndex = (dayOfWeek - weekStartOn + 7) % 7;
	return {
		timestamp: item.timestamp,
		value: item.value,
		color: calcColorByValue(colors, item.value, maxValue),
		dayOfWeek,
		rowIndex,
		colIndex
	};
}
/**
* Create a sparse matrix from items with position information
*/
function createSparseMatrix(rows, items, getRowIndex, getColIndex) {
	const groupedByRow = (0, lodash_es.groupBy)(items, getRowIndex);
	return Array.from({ length: rows }, (_, rowIndex) => {
		const rowData = groupedByRow[rowIndex] || [];
		const row = [];
		rowData.forEach((item) => {
			row[getColIndex(item)] = item;
		});
		return row;
	});
}
/**
* This creates a 7x53 matrix (typical year layout) filled with loading cells
*/
function createLoadingMatrix(firstDayOfWeek) {
	const rows = 7;
	const cols = 53;
	const currentTimestamp = Date.now();
	return Array.from({ length: rows }, (_, row) => Array.from({ length: cols }, (_, col) => ({
		timestamp: currentTimestamp,
		value: 0,
		color: "#000000",
		dayOfWeek: (firstDayOfWeek + row) % 7,
		rowIndex: row,
		colIndex: col
	})));
}
/**
* Generate heatmap data for mock purposes.
* This function generates random data and the result is not stable.
* @param range - 'recent' for last year, or a specific year number
*/
function heatmapMockData(year) {
	let start;
	let end;
	if (year === void 0 || year === "recent") {
		end = /* @__PURE__ */ new Date();
		start = (0, date_fns.subYears)(end, 1);
	} else {
		const _year = Number(year);
		start = (0, date_fns.startOfYear)(new Date(_year, 0, 1));
		end = (0, date_fns.endOfYear)(new Date(_year, 11, 31));
	}
	return (0, date_fns.eachDayOfInterval)({
		start,
		end
	}).map((day) => {
		const dayOfWeek = day.getDay();
		const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
		if (isWeekend && Math.random() < .7) return {
			timestamp: day.getTime(),
			value: 0
		};
		if (!isWeekend && Math.random() < .15) return {
			timestamp: day.getTime(),
			value: 0
		};
		const value = Math.floor(Math.random() ** 2 * 40) + 1;
		return {
			timestamp: day.getTime(),
			value
		};
	});
}
//#endregion
exports.calcColorByValue = calcColorByValue;
exports.completeDataGaps = completeDataGaps;
exports.createDayRect = createDayRect;
exports.createLoadingMatrix = createLoadingMatrix;
exports.createSparseMatrix = createSparseMatrix;
exports.heatmapMockData = heatmapMockData;
