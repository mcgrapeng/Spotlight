import { formatLength } from "../../_utils/css/format-length.mjs";
import { getColKey, getNumberColWidth } from "./utils.mjs";
import { beforeNextFrameOnce } from "seemly";
import { computed, nextTick, ref, watch } from "vue";
//#region src/data-table/src/use-scroll.ts
function useScroll(props, {
  mainTableInstRef,
  mergedCurrentPageRef,
  bodyWidthRef,
  maxHeightRef,
  mergedTableLayoutRef,
  mergedEmptyRef
}) {
  const explicitlyScrollableRef = computed(() => props.scrollX !== void 0 || maxHeightRef.value !== void 0 || props.flexHeight);
  const xScrollableRef = computed(() => {
    const isBasicAutoLayout = !explicitlyScrollableRef.value && mergedTableLayoutRef.value === "auto";
    return props.scrollX !== void 0 || isBasicAutoLayout;
  });
  let lastScrollLeft = 0;
  const scrollPartRef = ref();
  const leftActiveFixedColKeyRef = ref(null);
  const leftActiveFixedChildrenColKeysRef = ref([]);
  const rightActiveFixedColKeyRef = ref(null);
  const rightActiveFixedChildrenColKeysRef = ref([]);
  const styleScrollXRef = computed(() => {
    return formatLength(props.scrollX);
  });
  const leftFixedColumnsRef = computed(() => {
    return props.columns.filter(column => column.fixed === "left");
  });
  const rightFixedColumnsRef = computed(() => {
    return props.columns.filter(column => column.fixed === "right");
  });
  const fixedColumnLeftMapRef = computed(() => {
    const columns = {};
    let left = 0;
    function traverse(cols) {
      cols.forEach(col => {
        const positionInfo = {
          start: left,
          end: 0
        };
        columns[getColKey(col)] = positionInfo;
        if ("children" in col) {
          traverse(col.children);
          positionInfo.end = left;
        } else {
          left += getNumberColWidth(col) || 0;
          positionInfo.end = left;
        }
      });
    }
    traverse(leftFixedColumnsRef.value);
    return columns;
  });
  const fixedColumnRightMapRef = computed(() => {
    const columns = {};
    let right = 0;
    function traverse(cols) {
      for (let i = cols.length - 1; i >= 0; --i) {
        const col = cols[i];
        const positionInfo = {
          start: right,
          end: 0
        };
        columns[getColKey(col)] = positionInfo;
        if ("children" in col) {
          traverse(col.children);
          positionInfo.end = right;
        } else {
          right += getNumberColWidth(col) || 0;
          positionInfo.end = right;
        }
      }
    }
    traverse(rightFixedColumnsRef.value);
    return columns;
  });
  function deriveActiveLeftFixedColumn() {
    const {
      value: leftFixedColumns
    } = leftFixedColumnsRef;
    let leftWidth = 0;
    const {
      value: fixedColumnLeftMap
    } = fixedColumnLeftMapRef;
    let leftActiveFixedColKey = null;
    for (let i = 0; i < leftFixedColumns.length; ++i) {
      const key = getColKey(leftFixedColumns[i]);
      if (lastScrollLeft > (fixedColumnLeftMap[key]?.start || 0) - leftWidth) {
        leftActiveFixedColKey = key;
        leftWidth = fixedColumnLeftMap[key]?.end || 0;
      } else break;
    }
    leftActiveFixedColKeyRef.value = leftActiveFixedColKey;
  }
  function deriveActiveLeftFixedChildrenColumns() {
    leftActiveFixedChildrenColKeysRef.value = [];
    let activeLeftFixedColumn = props.columns.find(col => getColKey(col) === leftActiveFixedColKeyRef.value);
    while (activeLeftFixedColumn && "children" in activeLeftFixedColumn) {
      const length = activeLeftFixedColumn.children.length;
      if (length === 0) break;
      const nextActiveLeftFixedColumn = activeLeftFixedColumn.children[length - 1];
      leftActiveFixedChildrenColKeysRef.value.push(getColKey(nextActiveLeftFixedColumn));
      activeLeftFixedColumn = nextActiveLeftFixedColumn;
    }
  }
  function deriveActiveRightFixedColumn() {
    const {
      value: rightFixedColumns
    } = rightFixedColumnsRef;
    const scrollWidth = Number(props.scrollX);
    const {
      value: tableWidth
    } = bodyWidthRef;
    if (tableWidth === null) return;
    let rightWidth = 0;
    let rightActiveFixedColKey = null;
    const {
      value: fixedColumnRightMap
    } = fixedColumnRightMapRef;
    for (let i = rightFixedColumns.length - 1; i >= 0; --i) {
      const key = getColKey(rightFixedColumns[i]);
      if (Math.round(lastScrollLeft + (fixedColumnRightMap[key]?.start || 0) + tableWidth - rightWidth) < scrollWidth) {
        rightActiveFixedColKey = key;
        rightWidth = fixedColumnRightMap[key]?.end || 0;
      } else break;
    }
    rightActiveFixedColKeyRef.value = rightActiveFixedColKey;
  }
  function deriveActiveRightFixedChildrenColumns() {
    rightActiveFixedChildrenColKeysRef.value = [];
    let activeRightFixedColumn = props.columns.find(col => getColKey(col) === rightActiveFixedColKeyRef.value);
    while (activeRightFixedColumn && "children" in activeRightFixedColumn && activeRightFixedColumn.children.length) {
      const nextActiveRightFixedColumn = activeRightFixedColumn.children[0];
      rightActiveFixedChildrenColKeysRef.value.push(getColKey(nextActiveRightFixedColumn));
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
    const {
      body
    } = getScrollElements();
    if (body) body.scrollTop = 0;
  }
  function handleTableHeaderScroll() {
    if (scrollPartRef.value !== "body") beforeNextFrameOnce(syncScrollState, "head");else scrollPartRef.value = void 0;
  }
  function handleTableBodyScroll(e) {
    props.onScroll?.(e);
    if (scrollPartRef.value !== "head") beforeNextFrameOnce(syncScrollState, "body");else scrollPartRef.value = void 0;
  }
  function syncScrollState(source) {
    const {
      header,
      body
    } = getScrollElements();
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
    const {
      value: tableWidth
    } = bodyWidthRef;
    if (tableWidth === null) return;
    deriveActiveLeftFixedColumn();
    deriveActiveLeftFixedChildrenColumns();
    deriveActiveRightFixedColumn();
    deriveActiveRightFixedChildrenColumns();
  }
  function setHeaderScrollLeft(left) {
    const {
      header
    } = getScrollElements();
    if (!header) return;
    header.scrollLeft = left;
    lastScrollLeft = left;
    syncScrollState("head");
  }
  watch(mergedCurrentPageRef, () => {
    scrollMainTableBodyToTop();
  });
  watch([() => props.virtualScroll, mergedEmptyRef], () => {
    nextTick(() => {
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
export { useScroll };