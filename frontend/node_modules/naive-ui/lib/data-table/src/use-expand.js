Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/data-table/src/use-expand.ts
function useExpand(props, treeMateRef) {
	const renderExpandRef = (0, vooks.useMemo)(() => {
		for (const col of props.columns) if (col.type === "expand") {
			if (process.env.NODE_ENV !== "production" && !col.renderExpand) require__utils_naive_warn.warn("data-table", "column with type `expand` has no `renderExpand` prop.");
			return col.renderExpand;
		}
	});
	const expandableRef = (0, vooks.useMemo)(() => {
		let expandable;
		for (const col of props.columns) if (col.type === "expand") {
			expandable = col.expandable;
			break;
		}
		return expandable;
	});
	const uncontrolledExpandedRowKeysRef = (0, vue.ref)(props.defaultExpandAll ? renderExpandRef?.value ? (() => {
		const expandedKeys = [];
		treeMateRef.value.treeNodes.forEach((tmNode) => {
			if (expandableRef.value?.(tmNode.rawNode)) expandedKeys.push(tmNode.key);
		});
		return expandedKeys;
	})() : treeMateRef.value.getNonLeafKeys() : props.defaultExpandedRowKeys);
	const controlledExpandedRowKeysRef = (0, vue.toRef)(props, "expandedRowKeys");
	const stickyExpandedRowsRef = (0, vue.toRef)(props, "stickyExpandedRows");
	const mergedExpandedRowKeysRef = (0, vooks.useMergedState)(controlledExpandedRowKeysRef, uncontrolledExpandedRowKeysRef);
	function doUpdateExpandedRowKeys(expandedKeys) {
		const { onUpdateExpandedRowKeys, "onUpdate:expandedRowKeys": _onUpdateExpandedRowKeys } = props;
		if (onUpdateExpandedRowKeys) require__utils_vue_call.call(onUpdateExpandedRowKeys, expandedKeys);
		if (_onUpdateExpandedRowKeys) require__utils_vue_call.call(_onUpdateExpandedRowKeys, expandedKeys);
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
exports.useExpand = useExpand;
