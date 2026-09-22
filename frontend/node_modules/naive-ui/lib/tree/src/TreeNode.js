const require__utils_vue_create_data_key = require("../../_utils/vue/create-data-key.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_tree_src_dnd = require("./dnd.js");
const require_tree_src_interface = require("./interface.js");
const require_tree_src_TreeNodeCheckbox = require("./TreeNodeCheckbox.js");
const require_tree_src_TreeNodeContent = require("./TreeNodeContent.js");
const require_tree_src_TreeNodeSwitcher = require("./TreeNodeSwitcher.js");
const require_tree_src_utils = require("./utils.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
//#region src/tree/src/TreeNode.tsx
const _hoisted_1 = [
	"data-key",
	"draggable",
	"onClick",
	"onDragstart"
];
const TreeNode = (0, vue.defineComponent)({
	name: "TreeNode",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		tmNode: {
			type: Object,
			required: true
		}
	},
	setup(props) {
		const NTree = (0, vue.inject)(require_tree_src_interface.treeInjectionKey);
		const { droppingNodeParentRef, droppingMouseNodeRef, draggingNodeRef, droppingPositionRef, droppingOffsetLevelRef, nodePropsRef, indentRef, blockLineRef, checkboxPlacementRef, checkOnClickRef, disabledFieldRef, showLineRef, renderSwitcherIconRef, overrideDefaultNodeClickBehaviorRef } = NTree;
		const checkboxDisabledRef = (0, vooks.useMemo)(() => !!props.tmNode.rawNode.checkboxDisabled);
		const nodeIsDisabledRef = (0, vooks.useMemo)(() => {
			return require_tree_src_utils.isNodeDisabled(props.tmNode, disabledFieldRef.value);
		});
		const disabledRef = (0, vooks.useMemo)(() => NTree.disabledRef.value || nodeIsDisabledRef.value);
		const resolvedNodePropsRef = (0, vue.computed)(() => {
			const { value: nodeProps } = nodePropsRef;
			if (!nodeProps) return void 0;
			return nodeProps({ option: props.tmNode.rawNode });
		});
		const contentInstRef = (0, vue.ref)(null);
		const contentElRef = { value: null };
		(0, vue.onMounted)(() => {
			contentElRef.value = contentInstRef.value.$el;
		});
		function handleSwitcherClick() {
			const callback = () => {
				const { tmNode } = props;
				if (!tmNode.isLeaf && !tmNode.shallowLoaded) {
					if (!NTree.loadingKeysRef.value.has(tmNode.key)) NTree.loadingKeysRef.value.add(tmNode.key);
					else return;
					const { onLoadRef: { value: onLoad } } = NTree;
					if (onLoad) onLoad(tmNode.rawNode).then((value) => {
						if (value !== false) NTree.handleSwitcherClick(tmNode);
					}).finally(() => {
						NTree.loadingKeysRef.value.delete(tmNode.key);
					});
				} else NTree.handleSwitcherClick(tmNode);
			};
			if (renderSwitcherIconRef.value) setTimeout(callback, 0);
			else callback();
		}
		const selectableRef = (0, vooks.useMemo)(() => !nodeIsDisabledRef.value && NTree.selectableRef.value && (NTree.internalTreeSelect ? NTree.mergedCheckStrategyRef.value !== "child" || NTree.multipleRef.value && NTree.cascadeRef.value || props.tmNode.isLeaf : true));
		const checkableRef = (0, vooks.useMemo)(() => NTree.checkableRef.value && (NTree.cascadeRef.value || NTree.mergedCheckStrategyRef.value !== "child" || props.tmNode.isLeaf));
		const checkedRef = (0, vooks.useMemo)(() => NTree.displayedCheckedKeysRef.value.includes(props.tmNode.key));
		const mergedCheckOnClickRef = (0, vooks.useMemo)(() => {
			const { value: checkable } = checkableRef;
			if (!checkable) return false;
			const { value: checkOnClick } = checkOnClickRef;
			const { tmNode } = props;
			if (typeof checkOnClick === "boolean") return !tmNode.disabled && checkOnClick;
			return checkOnClick(props.tmNode.rawNode);
		});
		function _handleClick(e) {
			const { value: expandOnClick } = NTree.expandOnClickRef;
			const { value: selectable } = selectableRef;
			const { value: mergedCheckOnClick } = mergedCheckOnClickRef;
			if (!selectable && !expandOnClick && !mergedCheckOnClick) return;
			if ((0, seemly.happensIn)(e, "checkbox") || (0, seemly.happensIn)(e, "switcher")) return;
			const { tmNode } = props;
			if (selectable) NTree.handleSelect(tmNode);
			if (expandOnClick && !tmNode.isLeaf) handleSwitcherClick();
			if (mergedCheckOnClick) handleCheck(!checkedRef.value);
		}
		function handleNodeClick(e) {
			if ((0, seemly.happensIn)(e, "checkbox") || (0, seemly.happensIn)(e, "switcher")) return;
			if (!disabledRef.value) {
				const overrideDefaultNodeClickBehavior = overrideDefaultNodeClickBehaviorRef.value;
				let shouldOverride = false;
				if (overrideDefaultNodeClickBehavior) switch (overrideDefaultNodeClickBehavior({ option: props.tmNode.rawNode })) {
					case "toggleCheck":
						shouldOverride = true;
						handleCheck(!checkedRef.value);
						break;
					case "toggleSelect":
						shouldOverride = true;
						NTree.handleSelect(props.tmNode);
						break;
					case "toggleExpand":
						shouldOverride = true;
						handleSwitcherClick();
						shouldOverride = true;
						break;
					case "none":
						shouldOverride = true;
						shouldOverride = true;
						return;
				}
				if (!shouldOverride) _handleClick(e);
			}
			resolvedNodePropsRef.value?.onClick?.(e);
		}
		function handleContentClick(e) {
			if (blockLineRef.value) return;
			handleNodeClick(e);
		}
		function handleLineClick(e) {
			if (!blockLineRef.value) return;
			handleNodeClick(e);
		}
		function handleCheck(checked) {
			NTree.handleCheck(props.tmNode, checked);
		}
		function handleDragStart(e) {
			NTree.handleDragStart({
				event: e,
				node: props.tmNode
			});
		}
		function handleDragEnter(e) {
			if (e.currentTarget !== e.target) return;
			NTree.handleDragEnter({
				event: e,
				node: props.tmNode
			});
		}
		function handleDragOver(e) {
			e.preventDefault();
			NTree.handleDragOver({
				event: e,
				node: props.tmNode
			});
		}
		function handleDragEnd(e) {
			NTree.handleDragEnd({
				event: e,
				node: props.tmNode
			});
		}
		function handleDragLeave(e) {
			if (e.currentTarget !== e.target) return;
			NTree.handleDragLeave({
				event: e,
				node: props.tmNode
			});
		}
		function handleDrop(e) {
			e.preventDefault();
			if (droppingPositionRef.value !== null) NTree.handleDrop({
				event: e,
				node: props.tmNode,
				dropPosition: droppingPositionRef.value
			});
		}
		const indentNodes = (0, vue.computed)(() => {
			const { clsPrefix } = props;
			const { value: indent } = indentRef;
			if (showLineRef.value) {
				const indentNodes = [];
				let cursor = props.tmNode.parent;
				while (cursor) {
					if (cursor.isLastChild) indentNodes.push(((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 1,
						class: require_vdom.normalizeClass(`${clsPrefix}-tree-node-indent`)
					}, [(0, vue.createElementVNode)("div", { style: (0, vue.normalizeStyle)({ width: `${indent}px` }) }, null, 4)], 2)));
					else indentNodes.push(((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 2,
						class: require_vdom.normalizeClass([`${clsPrefix}-tree-node-indent`, `${clsPrefix}-tree-node-indent--show-line`])
					}, [(0, vue.createElementVNode)("div", { style: (0, vue.normalizeStyle)({ width: `${indent}px` }) }, null, 4)], 2)));
					cursor = cursor.parent;
				}
				return indentNodes.reverse();
			} else return (0, seemly.repeat)(props.tmNode.level, ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 3,
				class: require_vdom.normalizeClass(`${props.clsPrefix}-tree-node-indent`)
			}, [(0, vue.createElementVNode)("div", { style: (0, vue.normalizeStyle)({ width: `${indent}px` }) }, null, 4)], 2)));
		});
		return {
			showDropMark: (0, vooks.useMemo)(() => {
				const { value: draggingNode } = draggingNodeRef;
				if (!draggingNode) return;
				const { value: droppingPosition } = droppingPositionRef;
				if (!droppingPosition) return;
				const { value: droppingMouseNode } = droppingMouseNodeRef;
				if (!droppingMouseNode) return;
				const { tmNode } = props;
				if (tmNode.key === droppingMouseNode.key) return true;
				return false;
			}),
			showDropMarkAsParent: (0, vooks.useMemo)(() => {
				const { value: droppingNodeParent } = droppingNodeParentRef;
				if (!droppingNodeParent) return false;
				const { tmNode } = props;
				const { value: droppingPosition } = droppingPositionRef;
				if (droppingPosition === "before" || droppingPosition === "after") return droppingNodeParent.key === tmNode.key;
				return false;
			}),
			pending: (0, vooks.useMemo)(() => NTree.pendingNodeKeyRef.value === props.tmNode.key),
			loading: (0, vooks.useMemo)(() => NTree.loadingKeysRef.value.has(props.tmNode.key)),
			highlight: (0, vooks.useMemo)(() => {
				return NTree.highlightKeySetRef.value?.has(props.tmNode.key);
			}),
			checked: checkedRef,
			indeterminate: (0, vooks.useMemo)(() => NTree.displayedIndeterminateKeysRef.value.includes(props.tmNode.key)),
			selected: (0, vooks.useMemo)(() => NTree.mergedSelectedKeysRef.value.includes(props.tmNode.key)),
			expanded: (0, vooks.useMemo)(() => NTree.mergedExpandedKeysRef.value.includes(props.tmNode.key)),
			disabled: disabledRef,
			checkable: checkableRef,
			mergedCheckOnClick: mergedCheckOnClickRef,
			checkboxDisabled: checkboxDisabledRef,
			selectable: selectableRef,
			expandOnClick: NTree.expandOnClickRef,
			internalScrollable: NTree.internalScrollableRef,
			draggable: NTree.draggableRef,
			blockLine: blockLineRef,
			nodeProps: resolvedNodePropsRef,
			checkboxFocusable: NTree.internalCheckboxFocusableRef,
			droppingPosition: droppingPositionRef,
			droppingOffsetLevel: droppingOffsetLevelRef,
			indent: indentRef,
			checkboxPlacement: checkboxPlacementRef,
			showLine: showLineRef,
			contentInstRef,
			contentElRef,
			indentNodes,
			handleCheck,
			handleDrop,
			handleDragStart,
			handleDragEnter,
			handleDragOver,
			handleDragEnd,
			handleDragLeave,
			handleLineClick,
			handleContentClick,
			handleSwitcherClick
		};
	},
	render() {
		const { tmNode, clsPrefix, checkable, expandOnClick, selectable, selected, checked, highlight, draggable, blockLine, indent, indentNodes, disabled, pending, internalScrollable, nodeProps, checkboxPlacement } = this;
		const dragEventHandlers = draggable && !disabled ? {
			onDragenter: this.handleDragEnter,
			onDragleave: this.handleDragLeave,
			onDragend: this.handleDragEnd,
			onDrop: this.handleDrop,
			onDragover: this.handleDragOver
		} : void 0;
		const dataKey = internalScrollable ? require__utils_vue_create_data_key.createDataKey(tmNode.key) : void 0;
		const checkboxOnRight = checkboxPlacement === "right";
		const checkboxNode = checkable ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_tree_src_TreeNodeCheckbox, {
			key: 4,
			indent,
			right: checkboxOnRight,
			focusable: this.checkboxFocusable,
			disabled: disabled || this.checkboxDisabled,
			clsPrefix,
			checked: this.checked,
			indeterminate: this.indeterminate,
			onCheck: this.handleCheck
		}, null, 8, [
			"indent",
			"right",
			"focusable",
			"disabled",
			"clsPrefix",
			"checked",
			"indeterminate",
			"onCheck"
		])) : null;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", (0, vue.mergeProps)({ class: `${clsPrefix}-tree-node-wrapper` }, dragEventHandlers), [(0, vue.createElementVNode)("div", (0, vue.mergeProps)(blockLine ? nodeProps : void 0, {
			class: [
				`${clsPrefix}-tree-node`,
				{
					[`${clsPrefix}-tree-node--selected`]: selected,
					[`${clsPrefix}-tree-node--checkable`]: checkable,
					[`${clsPrefix}-tree-node--highlight`]: highlight,
					[`${clsPrefix}-tree-node--pending`]: pending,
					[`${clsPrefix}-tree-node--disabled`]: disabled,
					[`${clsPrefix}-tree-node--selectable`]: selectable,
					[`${clsPrefix}-tree-node--clickable`]: selectable || expandOnClick || this.mergedCheckOnClick
				},
				nodeProps?.class
			],
			"data-key": dataKey,
			draggable: draggable && blockLine,
			onClick: this.handleLineClick,
			onDragstart: draggable && blockLine && !disabled ? this.handleDragStart : void 0
		}), [
			require_vdom.normalizeVNode(() => indentNodes),
			tmNode.isLeaf && this.showLine ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass([
					`${clsPrefix}-tree-node-indent`,
					`${clsPrefix}-tree-node-indent--show-line`,
					tmNode.isLeaf && `${clsPrefix}-tree-node-indent--is-leaf`,
					tmNode.isLastChild && `${clsPrefix}-tree-node-indent--last-child`
				])
			}, [(0, vue.createElementVNode)("div", { style: (0, vue.normalizeStyle)({ width: `${indent}px` }) }, null, 4)], 2)) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_tree_src_TreeNodeSwitcher, {
				key: 1,
				clsPrefix,
				expanded: this.expanded,
				selected,
				loading: this.loading,
				hide: tmNode.isLeaf,
				tmNode: this.tmNode,
				indent,
				onClick: this.handleSwitcherClick
			}, null, 8, [
				"clsPrefix",
				"expanded",
				"selected",
				"loading",
				"hide",
				"tmNode",
				"indent",
				"onClick"
			])),
			!checkboxOnRight ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 2 }, [require_vdom.normalizeVNode(() => checkboxNode)], 64)) : require_vdom.normalizeVNode(() => null),
			((0, vue.openBlock)(), (0, vue.createBlock)(require_tree_src_TreeNodeContent, {
				ref: "contentInstRef",
				clsPrefix,
				checked,
				selected,
				onClick: this.handleContentClick,
				nodeProps: blockLine ? void 0 : nodeProps,
				onDragstart: draggable && !blockLine && !disabled ? this.handleDragStart : void 0,
				tmNode
			}, null, 8, [
				"clsPrefix",
				"checked",
				"selected",
				"onClick",
				"nodeProps",
				"onDragstart",
				"tmNode"
			])),
			draggable ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 4 }, [this.showDropMark ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => require_tree_src_dnd.renderDropMark({
				el: this.contentElRef.value,
				position: this.droppingPosition,
				offsetLevel: this.droppingOffsetLevel,
				indent
			}))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [this.showDropMarkAsParent ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => require_tree_src_dnd.renderDropMark({
				el: this.contentElRef.value,
				position: "inside",
				offsetLevel: this.droppingOffsetLevel,
				indent
			}))], 64)) : require_vdom.normalizeVNode(() => null)], 64))], 64)) : require_vdom.normalizeVNode(() => null),
			checkboxOnRight ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 6 }, [require_vdom.normalizeVNode(() => checkboxNode)], 64)) : require_vdom.normalizeVNode(() => null)
		], 16, _hoisted_1)], 16);
	}
});
//#endregion
module.exports = TreeNode;
