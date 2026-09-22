Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_css_format_length = require("../../_utils/css/format-length.js");
const require_data_table_src_utils = require("./utils.js");
let seemly = require("seemly");
let vue = require("vue");
//#region src/data-table/src/use-scroll.ts
function useScroll(props, { mainTableInstRef, mergedCurrentPageRef, bodyWidthRef, maxHeightRef, mergedTableLayoutRef, mergedEmptyRef }) {
	const explicitlyScrollableRef = (0, vue.computed)(() => props.scrollX !== void 0 || maxHeightRef.value !== void 0 || props.flexHeight);
	const xScrollableRef = (0, vue.computed)(() => {
		const isBasicAutoLayout = !explicitlyScrollableRef.value && mergedTableLayoutRef.value === "auto";
		return props.scrollX !== void 0 || isBasicAutoLayout;
	});
	let lastScrollLeft = 0;
	const scrollPartRef = (0, vue.ref)();
	const leftActiveFixedColKeyRef = (0, vue.ref)(null);
	const leftActiveFixedChildrenColKeysRef = (0, vue.ref)([]);
	const rightActiveFixedColKeyRef = (0, vue.ref)(null);
	const rightActiveFixedChildrenColKeysRef = (0, vue.ref)([]);
	const styleScrollXRef = (0, vue.computed)(() => {
		return require__utils_css_format_length.formatLength(props.scrollX);
	});
	const leftFixedColumnsRef = (0, vue.computed)(() => {
		return props.columns.filter((column) => column.fixed === "left");
	});
	const rightFixedColumnsRef = (0, vue.computed)(() => {
		return props.columns.filter((column) => column.fixed === "right");
	});
	const fixedColumnLeftMapRef = (0, vue.computed)(() => {
		const columns = {};
		let left = 0;
		function traverse(cols) {
			cols.forEach((col) => {
				const positionInfo = {
					start: left,
					end: 0
				};
				columns[require_data_table_src_utils.getColKey(col)] = positionInfo;
				if ("children" in col) {
					traverse(col.children);
					positionInfo.end = left;
				} else {
					left += require_data_table_src_utils.getNumberColWidth(col) || 0;
					positionInfo.end = left;
				}
			});
		}
		traverse(leftFixedColumnsRef.value);
		return columns;
	});
	const fixedColumnRightMapRef = (0, vue.computed)(() => {
		const columns = {};
		let right = 0;
		function traverse(cols) {
			for (let i = cols.length - 1; i >= 0; --i) {
				const col = cols[i];
				const positionInfo = {
					start: right,
					end: 0
				};
				columns[require_data_table_src_utils.getColKey(col)] = positionInfo;
				if ("children" in col) {
					traverse(col.children);
					positionInfo.end = right;
				} else {
					right += require_data_table_src_utils.getNumberColWidth(col) || 0;
					positionInfo.end = right;
				}
			}
		}
		traverse(rightFixedColumnsRef.value);
		return columns;
	});
	function deriveActiveLeftFixedColumn() {
		const { value: leftFixedColumns } = leftFixedColumnsRef;
		let leftWidth = 0;
		const { value: fixedColumnLeftMap } = fixedColumnLeftMapRef;
		let leftActiveFixedColKey = null;
		for (let i = 0; i < leftFixedColumns.length; ++i) {
			const key = require_data_table_src_utils.getColKey(leftFixedColumns[i]);
			if (lastScrollLeft > (fixedColumnLeftMap[key]?.start || 0) - leftWidth) {
				leftActiveFixedColKey = key;
				leftWidth = fixedColumnLeftMap[key]?.end || 0;
			} else break;
		}
		leftActiveFixedColKeyRef.value = leftActiveFixedColKey;
	}
	function deriveActiveLeftFixedChildrenColumns() {
		leftActiveFixedChildrenColKeysRef.value = [];
		let activeLeftFixedColumn = props.columns.find((col) => require_data_table_src_utils.getColKey(col) === leftActiveFixedColKeyRef.value);
		while (activeLeftFixedColumn && "children" in activeLeftFixedColumn) {
			const length = activeLeftFixedColumn.children.length;
			if (length === 0) break;
			const nextActiveLeftFixedColumn = activeLeftFixedColumn.children[length - 1];
			leftActiveFixedChildrenColKeysRef.value.push(require_data_table_src_utils.getColKey(nextActiveLeftFixedColumn));
			activeLeftFixedColumn = nextActiveLeftFixedColumn;
		}
	}
	function deriveActiveRightFixedColumn() {
		const { value: rightFixedColumns } = rightFixedColumnsRef;
		const scrollWidth = Number(props.scrollX);
		const { value: tableWidth } = bodyWidthRef;
		if (tableWidth === null) return;
		let rightWidth = 0;
		let rightActiveFixedColKey = null;
		const { value: fixedColumnRightMap } = fixedColumnRightMapRef;
		for (let i = rightFixedColumns.length - 1; i >= 0; --i) {
			const key = require_data_table_src_utils.getColKey(rightFixedColumns[i]);
			if (Math.round(lastScrollLeft + (fixedColumnRightMap[key]?.start || 0) + tableWidth - rightWidth) < scrollWidth) {
				rightActiveFixedColKey = key;
				rightWidth = fixedColumnRightMap[key]?.end || 0;
			} else break;
		}
		rightActiveFixedColKeyRef.value = rightActiveFixedColKey;
	}
	function deriveActiveRightFixedChildrenColumns() {
		rightActiveFixedChildrenColKeysRef.value = [];
		let activeRightFixedColumn = props.columns.find((col) => require_data_table_src_utils.getColKey(col) === rightActiveFixedColKeyRef.value);
		while (activeRightFixedColumn && "children" in activeRightFixedColumn && activeRightFixedColumn.children.length) {
			const nextActiveRightFixedColumn = activeRightFixedColumn.children[0];
			rightActiveFixedChildrenColKeysRef.value.push(require_data_table_src_utils.getColKey(nextActiveRightFixedColumn));
			activeRightFixedColumn = nextActiveRightFixedColumn;
		}
	}
	function getScrollElements() {
		return {
			header: mainTableInstRef.value ? mainTableInstRef.value.getHeaderElement() : null,
			body: mainTableInstRef.value ? mainTableInstRef.value.getBodyElement() : null
		};
	}
	function scrollMainTableBodyToTop() {
		const { body } = getScrollElements();
		if (body) body.scrollTop = 0;
	}
	function handleTableHeaderScroll() {
		if (scrollPartRef.value !== "body") (0, seemly.beforeNextFrameOnce)(syncScrollState, "head");
		else scrollPartRef.value = void 0;
	}
	function handleTableBodyScroll(e) {
		props.onScroll?.(e);
		if (scrollPartRef.value !== "head") (0, seemly.beforeNextFrameOnce)(syncScrollState, "body");
		else scrollPartRef.value = void 0;
	}
	function syncScrollState(source) {
		const { header, body } = getScrollElements();
		if (!body) return;
		if (source === "layout") {
			if (header) header.scrollLeft = lastScrollLeft;
			body.scrollLeft = lastScrollLeft;
		} else if (header) {
			if (source === "head") {
				lastScrollLeft = header.scrollLeft;
				body.scrollLeft = lastScrollLeft;
				scrollPartRef.value = "head";
			} else if (source === "body") {
				lastScrollLeft = body.scrollLeft;
				header.scrollLeft = lastScrollLeft;
				scrollPartRef.value = "body";
			} else {
				const directionHead = lastScrollLeft - header.scrollLeft;
				scrollPartRef.value = directionHead !== 0 ? "head" : "body";
				if (scrollPartRef.value === "head") {
					lastScrollLeft = header.scrollLeft;
					body.scrollLeft = lastScrollLeft;
				} else {
					lastScrollLeft = body.scrollLeft;
					header.scrollLeft = lastScrollLeft;
				}
			}
		} else if (source !== "head") lastScrollLeft = body.scrollLeft;
		const { value: tableWidth } = bodyWidthRef;
		if (tableWidth === null) return;
		deriveActiveLeftFixedColumn();
		deriveActiveLeftFixedChildrenColumns();
		deriveActiveRightFixedColumn();
		deriveActiveRightFixedChildrenColumns();
	}
	function setHeaderScrollLeft(left) {
		const { header } = getScrollElements();
		if (!header) return;
		header.scrollLeft = left;
		lastScrollLeft = left;
		syncScrollState("head");
	}
	(0, vue.watch)(mergedCurrentPageRef, () => {
		scrollMainTableBodyToTop();
	});
	(0, vue.watch)([() => props.virtualScroll, mergedEmptyRef], () => {
		(0, vue.nextTick)(() => {
			syncScrollState("layout");
		});
	});
	return {
		styleScrollXRef,
		fixedColumnLeftMapRef,
		fixedColumnRightMapRef,
		leftFixedColumnsRef,
		rightFixedColumnsRef,
		leftActiveFixedColKeyRef,
		leftActiveFixedChildrenColKeysRef,
		rightActiveFixedColKeyRef,
		rightActiveFixedChildrenColKeysRef,
		syncScrollState,
		handleTableBodyScroll,
		handleTableHeaderScroll,
		setHeaderScrollLeft,
		explicitlyScrollableRef,
		xScrollableRef
	};
}
//#endregion
exports.useScroll = useScroll;
