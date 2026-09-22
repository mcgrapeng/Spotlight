import { warn } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { ref, toRef } from "vue";
import { useMemo, useMergedState } from "vooks";
//#region src/data-table/src/use-expand.ts
function useExpand(props, treeMateRef) {
  const renderExpandRef = useMemo(() => {
    for (const col of props.columns) if (col.type === "expand") {
      if (process.env.NODE_ENV !== "production" && !col.renderExpand) warn("data-table", "column with type `expand` has no `renderExpand` prop.");
      return col.renderExpand;
    }
  });
  const expandableRef = useMemo(() => {
    let expandable;
    for (const col of props.columns) if (col.type === "expand") {
      expandable = col.expandable;
      break;
    }
    return expandable;
  });
  const uncontrolledExpandedRowKeysRef = ref(props.defaultExpandAll ? renderExpandRef?.value ? (() => {
    const expandedKeys = [];
    treeMateRef.value.treeNodes.forEach(tmNode => {
      if (expandableRef.value?.(tmNode.rawNode)) expandedKeys.push(tmNode.key);
    });
    return expandedKeys;
  })() : treeMateRef.value.getNonLeafKeys() : props.defaultExpandedRowKeys);
  const controlledExpandedRowKeysRef = toRef(props, "expandedRowKeys");
  const stickyExpandedRowsRef = toRef(props, "stickyExpandedRows");
  const mergedExpandedRowKeysRef = useMergedState(controlledExpandedRowKeysRef, uncontrolledExpandedRowKeysRef);
  function doUpdateExpandedRowKeys(expandedKeys) {
    const {
      onUpdateExpandedRowKeys,
      "onUpdate:expandedRowKeys": _onUpdateExpandedRowKeys
    } = props;
    if (onUpdateExpandedRowKeys) call(onUpdateExpandedRowKeys, expandedKeys);
    if (_onUpdateExpandedRowKeys) call(_onUpdateExpandedRowKeys, expandedKeys);
    uncontrolledExpandedRowKeysRef.value = expandedKeys;
  }
  return {
    stickyExpandedRowsRef,
    mergedExpandedRowKeysRef,
    renderExpandRef,
    expandableRef,
    doUpdateExpandedRowKeys
  };
}
//#endregion
export { useExpand };