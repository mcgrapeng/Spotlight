Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_create_data_key = require("../../_utils/vue/create-data-key.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
const require_empty_src_Empty = require("../../empty/src/Empty.js");
const require_tree_styles_light = require("../styles/light.js");
const require_tree_select_src_interface = require("../../tree-select/src/interface.js");
const require_tree_src_dnd = require("./dnd.js");
const require_tree_src_interface = require("./interface.js");
const require_tree_src_keyboard = require("./keyboard.js");
const require_tree_src_utils = require("./utils.js");
const require_tree_src_TreeNode = require("./TreeNode.js");
const require_tree_src_MotionWrapper = require("./MotionWrapper.js");
const require_tree_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
let vueuc = require("vueuc");
let treemate = require("treemate");
//#region src/tree/src/Tree.tsx
const _hoisted_1 = ["onDragleave"];
const _hoisted_2 = [
	"tabindex",
	"onKeydown",
	"onFocusout",
	"onDragleave"
];
function createTreeMateOptions(keyField, childrenField, disabledField, getChildren) {
	return {
		getIsGroup() {
			return false;
		},
		getKey(node) {
			return node[keyField];
		},
		getChildren: getChildren || ((node) => {
			return node[childrenField];
		}),
		getDisabled(node) {
			return !!(node[disabledField] || node.checkboxDisabled);
		}
	};
}
const treeSharedProps = {
	allowCheckingNotLoaded: Boolean,
	filter: Function,
	defaultExpandAll: Boolean,
	expandedKeys: Array,
	keyField: {
		type: String,
		default: "key"
	},
	labelField: {
		type: String,
		default: "label"
	},
	childrenField: {
		type: String,
		default: "children"
	},
	disabledField: {
		type: String,
		default: "disabled"
	},
	defaultExpandedKeys: {
		type: Array,
		default: () => []
	},
	indent: {
		type: Number,
		default: 24
	},
	indeterminateKeys: Array,
	renderSwitcherIcon: Function,
	onUpdateIndeterminateKeys: [Function, Array],
	"onUpdate:indeterminateKeys": [Function, Array],
	onUpdateExpandedKeys: [Function, Array],
	"onUpdate:expandedKeys": [Function, Array],
	overrideDefaultNodeClickBehavior: Function
};
const treeProps = {
	...require__mixins_use_theme.default.props,
	accordion: Boolean,
	showIrrelevantNodes: {
		type: Boolean,
		default: true
	},
	data: {
		type: Array,
		default: () => []
	},
	expandOnDragenter: {
		type: Boolean,
		default: true
	},
	expandOnClick: Boolean,
	checkOnClick: {
		type: [Boolean, Function],
		default: false
	},
	cancelable: {
		type: Boolean,
		default: true
	},
	checkable: Boolean,
	draggable: Boolean,
	blockNode: Boolean,
	blockLine: Boolean,
	showLine: Boolean,
	disabled: Boolean,
	checkedKeys: Array,
	defaultCheckedKeys: {
		type: Array,
		default: () => []
	},
	selectedKeys: Array,
	defaultSelectedKeys: {
		type: Array,
		default: () => []
	},
	multiple: Boolean,
	pattern: {
		type: String,
		default: ""
	},
	onLoad: Function,
	cascade: Boolean,
	selectable: {
		type: Boolean,
		default: true
	},
	scrollbarProps: Object,
	allowDrop: {
		type: Function,
		default: require_tree_src_dnd.defaultAllowDrop
	},
	animated: {
		type: Boolean,
		default: true
	},
	ellipsis: Boolean,
	checkboxPlacement: {
		type: String,
		default: "left"
	},
	virtualScroll: Boolean,
	watchProps: Array,
	renderLabel: Function,
	renderPrefix: Function,
	renderSuffix: Function,
	nodeProps: Function,
	keyboard: {
		type: Boolean,
		default: true
	},
	getChildren: Function,
	onDragenter: [Function, Array],
	onDragleave: [Function, Array],
	onDragend: [Function, Array],
	onDragstart: [Function, Array],
	onDragover: [Function, Array],
	onDrop: [Function, Array],
	onUpdateCheckedKeys: [Function, Array],
	"onUpdate:checkedKeys": [Function, Array],
	onUpdateSelectedKeys: [Function, Array],
	"onUpdate:selectedKeys": [Function, Array],
	...treeSharedProps,
	internalTreeSelect: Boolean,
	internalScrollable: Boolean,
	internalScrollablePadding: String,
	internalRenderEmpty: Function,
	internalHighlightKeySet: Object,
	internalUnifySelectCheck: Boolean,
	internalCheckboxFocusable: {
		type: Boolean,
		default: true
	},
	internalFocusable: {
		type: Boolean,
		default: true
	},
	checkStrategy: {
		type: String,
		default: "all"
	},
	spinProps: Object,
	/**
	* @deprecated
	*/
	leafOnly: Boolean
};
var Tree_default = (0, vue.defineComponent)({
	name: "Tree",
	props: treeProps,
	slots: Object,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.leafOnly) require__utils_naive_warn.warnOnce("tree", "`leaf-only` is deprecated, please use `check-strategy=\"child\"` instead");
		});
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Tree", mergedRtlRef, mergedClsPrefixRef);
		const themeRef = require__mixins_use_theme.default("Tree", "-tree", require_tree_src_styles_index_cssr, require_tree_styles_light.default, props, mergedClsPrefixRef);
		const mergedRenderEmptyRef = (0, vue.computed)(() => {
			return mergedComponentPropsRef?.value?.Tree?.renderEmpty;
		});
		const selfElRef = (0, vue.ref)(null);
		const scrollbarInstRef = (0, vue.ref)(null);
		const virtualListInstRef = (0, vue.ref)(null);
		function getScrollContainer() {
			return virtualListInstRef.value?.listElRef;
		}
		function getScrollContent() {
			return virtualListInstRef.value?.itemsElRef;
		}
		const mergedFilterRef = (0, vue.computed)(() => {
			const { filter } = props;
			if (filter) return filter;
			const { labelField } = props;
			return (pattern, node) => {
				if (!pattern.length) return true;
				const label = node[labelField];
				if (typeof label === "string") return label.toLowerCase().includes(pattern.toLowerCase());
				return false;
			};
		});
		const filteredTreeInfoRef = (0, vue.computed)(() => {
			const { pattern } = props;
			if (!pattern) return {
				filteredTree: props.data,
				highlightKeySet: null,
				expandedKeys: void 0
			};
			if (!pattern.length || !mergedFilterRef.value) return {
				filteredTree: props.data,
				highlightKeySet: null,
				expandedKeys: void 0
			};
			return require_tree_src_utils.filterTree(props.data, mergedFilterRef.value, pattern, props.keyField, props.childrenField);
		});
		const displayTreeMateRef = (0, vue.computed)(() => (0, treemate.createTreeMate)(props.showIrrelevantNodes ? props.data : filteredTreeInfoRef.value.filteredTree, createTreeMateOptions(props.keyField, props.childrenField, props.disabledField, props.getChildren)));
		const treeSelectInjection = (0, vue.inject)(require_tree_select_src_interface.treeSelectInjectionKey, null);
		const dataTreeMateRef = props.internalTreeSelect ? treeSelectInjection.dataTreeMate : (0, vue.computed)(() => props.showIrrelevantNodes ? displayTreeMateRef.value : (0, treemate.createTreeMate)(props.data, createTreeMateOptions(props.keyField, props.childrenField, props.disabledField, props.getChildren)));
		const { watchProps } = props;
		const uncontrolledCheckedKeysRef = (0, vue.ref)([]);
		if (watchProps?.includes("defaultCheckedKeys")) (0, vue.watchEffect)(() => {
			uncontrolledCheckedKeysRef.value = props.defaultCheckedKeys;
		});
		else uncontrolledCheckedKeysRef.value = props.defaultCheckedKeys;
		const controlledCheckedKeysRef = (0, vue.toRef)(props, "checkedKeys");
		const mergedCheckedKeysRef = (0, vooks.useMergedState)(controlledCheckedKeysRef, uncontrolledCheckedKeysRef);
		const checkedStatusRef = (0, vue.computed)(() => {
			return dataTreeMateRef.value.getCheckedKeys(mergedCheckedKeysRef.value, {
				cascade: props.cascade,
				allowNotLoaded: props.allowCheckingNotLoaded
			});
		});
		const mergedCheckStrategyRef = require_tree_src_utils.useMergedCheckStrategy(props);
		const displayedCheckedKeysRef = (0, vue.computed)(() => {
			return checkedStatusRef.value.checkedKeys;
		});
		const displayedIndeterminateKeysRef = (0, vue.computed)(() => {
			const { indeterminateKeys } = props;
			if (indeterminateKeys !== void 0) return indeterminateKeys;
			return checkedStatusRef.value.indeterminateKeys;
		});
		const uncontrolledSelectedKeysRef = (0, vue.ref)([]);
		if (watchProps?.includes("defaultSelectedKeys")) (0, vue.watchEffect)(() => {
			uncontrolledSelectedKeysRef.value = props.defaultSelectedKeys;
		});
		else uncontrolledSelectedKeysRef.value = props.defaultSelectedKeys;
		const controlledSelectedKeysRef = (0, vue.toRef)(props, "selectedKeys");
		const mergedSelectedKeysRef = (0, vooks.useMergedState)(controlledSelectedKeysRef, uncontrolledSelectedKeysRef);
		const uncontrolledExpandedKeysRef = (0, vue.ref)([]);
		const initUncontrolledExpandedKeys = (keys) => {
			uncontrolledExpandedKeysRef.value = props.defaultExpandAll ? dataTreeMateRef.value.getNonLeafKeys() : keys === void 0 ? props.defaultExpandedKeys : keys;
		};
		if (watchProps?.includes("defaultExpandedKeys")) (0, vue.watchEffect)(() => {
			initUncontrolledExpandedKeys(void 0);
		});
		else (0, vue.watchEffect)(() => {
			initUncontrolledExpandedKeys(props.defaultExpandedKeys);
		});
		const controlledExpandedKeysRef = (0, vue.toRef)(props, "expandedKeys");
		const mergedExpandedKeysRef = (0, vooks.useMergedState)(controlledExpandedKeysRef, uncontrolledExpandedKeysRef);
		const fNodesRef = (0, vue.computed)(() => displayTreeMateRef.value.getFlattenedNodes(mergedExpandedKeysRef.value));
		const { pendingNodeKeyRef, handleKeydown } = require_tree_src_keyboard.useKeyboard({
			props,
			mergedCheckedKeysRef,
			mergedSelectedKeysRef,
			fNodesRef,
			mergedExpandedKeysRef,
			handleCheck,
			handleSelect,
			handleSwitcherClick
		});
		let expandTimerId = null;
		let nodeKeyToBeExpanded = null;
		const uncontrolledHighlightKeySetRef = (0, vue.ref)(/* @__PURE__ */ new Set());
		const controlledHighlightKeySetRef = (0, vue.computed)(() => {
			return props.internalHighlightKeySet || filteredTreeInfoRef.value.highlightKeySet;
		});
		const mergedHighlightKeySetRef = (0, vooks.useMergedState)(controlledHighlightKeySetRef, uncontrolledHighlightKeySetRef);
		const loadingKeysRef = (0, vue.ref)(/* @__PURE__ */ new Set());
		const expandedNonLoadingKeysRef = (0, vue.computed)(() => {
			return mergedExpandedKeysRef.value.filter((key) => !loadingKeysRef.value.has(key));
		});
		let dragStartX = 0;
		const draggingNodeRef = (0, vue.ref)(null);
		const droppingNodeRef = (0, vue.ref)(null);
		const droppingMouseNodeRef = (0, vue.ref)(null);
		const droppingPositionRef = (0, vue.ref)(null);
		const droppingOffsetLevelRef = (0, vue.ref)(0);
		const droppingNodeParentRef = (0, vue.computed)(() => {
			const { value: droppingNode } = droppingNodeRef;
			if (!droppingNode) return null;
			return droppingNode.parent;
		});
		let isDataReset = false;
		(0, vue.watch)((0, vue.toRef)(props, "data"), () => {
			isDataReset = true;
			(0, vue.nextTick)(() => {
				isDataReset = false;
			});
			loadingKeysRef.value.clear();
			pendingNodeKeyRef.value = null;
			resetDndState();
		}, { deep: false });
		let expandAnimationDisabled = false;
		const disableExpandAnimationForOneTick = () => {
			expandAnimationDisabled = true;
			(0, vue.nextTick)(() => {
				expandAnimationDisabled = false;
			});
		};
		let memoizedExpandedKeys;
		(0, vue.watch)((0, vue.toRef)(props, "pattern"), (value, oldValue) => {
			if (props.showIrrelevantNodes) {
				memoizedExpandedKeys = void 0;
				if (value) {
					const { expandedKeys: expandedKeysAfterChange, highlightKeySet } = require_tree_src_utils.keysWithFilter(props.data, props.pattern, props.keyField, props.childrenField, mergedFilterRef.value);
					uncontrolledHighlightKeySetRef.value = highlightKeySet;
					disableExpandAnimationForOneTick();
					doUpdateExpandedKeys(expandedKeysAfterChange, getOptionsByKeys(expandedKeysAfterChange), {
						node: null,
						action: "filter"
					});
				} else uncontrolledHighlightKeySetRef.value = /* @__PURE__ */ new Set();
			} else if (!value.length) {
				if (memoizedExpandedKeys !== void 0) {
					disableExpandAnimationForOneTick();
					doUpdateExpandedKeys(memoizedExpandedKeys, getOptionsByKeys(memoizedExpandedKeys), {
						node: null,
						action: "filter"
					});
				}
			} else {
				if (!oldValue.length) memoizedExpandedKeys = mergedExpandedKeysRef.value;
				const { expandedKeys } = filteredTreeInfoRef.value;
				if (expandedKeys !== void 0) {
					disableExpandAnimationForOneTick();
					doUpdateExpandedKeys(expandedKeys, getOptionsByKeys(expandedKeys), {
						node: null,
						action: "filter"
					});
				}
			}
		});
		async function triggerLoading(node) {
			const { onLoad } = props;
			if (!onLoad) {
				if (process.env.NODE_ENV !== "production") require__utils_naive_warn.warn("tree", "There is unloaded node in data but props.onLoad is not specified.");
				await Promise.resolve();
				return;
			}
			const { value: loadingKeys } = loadingKeysRef;
			if (!loadingKeys.has(node.key)) {
				loadingKeys.add(node.key);
				try {
					if (await onLoad(node.rawNode) === false) resetDragExpandState();
				} catch (loadError) {
					console.error(loadError);
					resetDragExpandState();
				}
				loadingKeys.delete(node.key);
			}
		}
		(0, vue.watchEffect)(() => {
			const { value: displayTreeMate } = displayTreeMateRef;
			if (!displayTreeMate) return;
			const { getNode } = displayTreeMate;
			mergedExpandedKeysRef.value?.forEach((key) => {
				const node = getNode(key);
				if (node && !node.shallowLoaded) triggerLoading(node);
			});
		});
		const aipRef = (0, vue.ref)(false);
		const afNodesRef = (0, vue.ref)([]);
		(0, vue.watch)(expandedNonLoadingKeysRef, (value, prevValue) => {
			if (!props.animated || expandAnimationDisabled) {
				(0, vue.nextTick)(syncScrollbar);
				return;
			}
			if (isDataReset) return;
			const nodeHeight = (0, seemly.depx)(themeRef.value.self.nodeHeight);
			const prevVSet = new Set(prevValue);
			let addedKey = null;
			let removedKey = null;
			for (const expandedKey of value) if (!prevVSet.has(expandedKey)) {
				if (addedKey !== null) return;
				addedKey = expandedKey;
			}
			const currentVSet = new Set(value);
			for (const expandedKey of prevValue) if (!currentVSet.has(expandedKey)) {
				if (removedKey !== null) return;
				removedKey = expandedKey;
			}
			if (addedKey === null && removedKey === null) return;
			const { virtualScroll } = props;
			const viewportHeight = (virtualScroll ? virtualListInstRef.value.listElRef : selfElRef.value).offsetHeight;
			const viewportItemCount = Math.ceil(viewportHeight / nodeHeight) + 1;
			let baseExpandedKeys;
			if (addedKey !== null) baseExpandedKeys = prevValue;
			if (removedKey !== null) {
				if (baseExpandedKeys === void 0) baseExpandedKeys = value;
				else baseExpandedKeys = baseExpandedKeys.filter((key) => key !== removedKey);
			}
			aipRef.value = true;
			afNodesRef.value = displayTreeMateRef.value.getFlattenedNodes(baseExpandedKeys);
			if (addedKey !== null) {
				const expandedNodeIndex = afNodesRef.value.findIndex((node) => node.key === addedKey);
				if (~expandedNodeIndex) {
					const children = afNodesRef.value[expandedNodeIndex].children;
					if (children) {
						const expandedChildren = (0, treemate.flatten)(children, value);
						afNodesRef.value.splice(expandedNodeIndex + 1, 0, {
							__motion: true,
							mode: "expand",
							height: virtualScroll ? expandedChildren.length * nodeHeight : void 0,
							nodes: virtualScroll ? expandedChildren.slice(0, viewportItemCount) : expandedChildren
						});
					}
				}
			}
			if (removedKey !== null) {
				const collapsedNodeIndex = afNodesRef.value.findIndex((node) => node.key === removedKey);
				if (~collapsedNodeIndex) {
					const collapsedNodeChildren = afNodesRef.value[collapsedNodeIndex].children;
					if (!collapsedNodeChildren) return;
					aipRef.value = true;
					const collapsedChildren = (0, treemate.flatten)(collapsedNodeChildren, value);
					afNodesRef.value.splice(collapsedNodeIndex + 1, 0, {
						__motion: true,
						mode: "collapse",
						height: virtualScroll ? collapsedChildren.length * nodeHeight : void 0,
						nodes: virtualScroll ? collapsedChildren.slice(0, viewportItemCount) : collapsedChildren
					});
				}
			}
		});
		const getFIndexRef = (0, vue.computed)(() => {
			return (0, treemate.createIndexGetter)(fNodesRef.value);
		});
		const mergedFNodesRef = (0, vue.computed)(() => {
			if (aipRef.value) return afNodesRef.value;
			else return fNodesRef.value;
		});
		function syncScrollbar() {
			const { value: scrollbarInst } = scrollbarInstRef;
			if (scrollbarInst) scrollbarInst.sync();
		}
		function handleAfterEnter() {
			aipRef.value = false;
			if (props.virtualScroll) (0, vue.nextTick)(syncScrollbar);
		}
		function getOptionsByKeys(keys) {
			const { getNode } = dataTreeMateRef.value;
			return keys.map((key) => getNode(key)?.rawNode || null);
		}
		function doUpdateExpandedKeys(value, option, meta) {
			const { "onUpdate:expandedKeys": _onUpdateExpandedKeys, onUpdateExpandedKeys } = props;
			uncontrolledExpandedKeysRef.value = value;
			if (_onUpdateExpandedKeys) require__utils_vue_call.call(_onUpdateExpandedKeys, value, option, meta);
			if (onUpdateExpandedKeys) require__utils_vue_call.call(onUpdateExpandedKeys, value, option, meta);
		}
		function doUpdateCheckedKeys(value, option, meta) {
			const { "onUpdate:checkedKeys": _onUpdateCheckedKeys, onUpdateCheckedKeys } = props;
			uncontrolledCheckedKeysRef.value = value;
			if (onUpdateCheckedKeys) require__utils_vue_call.call(onUpdateCheckedKeys, value, option, meta);
			if (_onUpdateCheckedKeys) require__utils_vue_call.call(_onUpdateCheckedKeys, value, option, meta);
		}
		function doUpdateIndeterminateKeys(value, option) {
			const { "onUpdate:indeterminateKeys": _onUpdateIndeterminateKeys, onUpdateIndeterminateKeys } = props;
			if (_onUpdateIndeterminateKeys) require__utils_vue_call.call(_onUpdateIndeterminateKeys, value, option);
			if (onUpdateIndeterminateKeys) require__utils_vue_call.call(onUpdateIndeterminateKeys, value, option);
		}
		function doUpdateSelectedKeys(value, option, meta) {
			const { "onUpdate:selectedKeys": _onUpdateSelectedKeys, onUpdateSelectedKeys } = props;
			uncontrolledSelectedKeysRef.value = value;
			if (onUpdateSelectedKeys) require__utils_vue_call.call(onUpdateSelectedKeys, value, option, meta);
			if (_onUpdateSelectedKeys) require__utils_vue_call.call(_onUpdateSelectedKeys, value, option, meta);
		}
		function doDragEnter(info) {
			const { onDragenter } = props;
			if (onDragenter) require__utils_vue_call.call(onDragenter, info);
		}
		function doDragLeave(info) {
			const { onDragleave } = props;
			if (onDragleave) require__utils_vue_call.call(onDragleave, info);
		}
		function doDragEnd(info) {
			const { onDragend } = props;
			if (onDragend) require__utils_vue_call.call(onDragend, info);
		}
		function doDragStart(info) {
			const { onDragstart } = props;
			if (onDragstart) require__utils_vue_call.call(onDragstart, info);
		}
		function doDragOver(info) {
			const { onDragover } = props;
			if (onDragover) require__utils_vue_call.call(onDragover, info);
		}
		function doDrop(info) {
			const { onDrop } = props;
			if (onDrop) require__utils_vue_call.call(onDrop, info);
		}
		function resetDndState() {
			resetDragState();
			resetDropState();
		}
		function resetDragState() {
			draggingNodeRef.value = null;
		}
		function resetDropState() {
			droppingOffsetLevelRef.value = 0;
			droppingNodeRef.value = null;
			droppingMouseNodeRef.value = null;
			droppingPositionRef.value = null;
			resetDragExpandState();
		}
		function resetDragExpandState() {
			if (expandTimerId) {
				window.clearTimeout(expandTimerId);
				expandTimerId = null;
			}
			nodeKeyToBeExpanded = null;
		}
		function handleCheck(node, checked) {
			if (props.disabled || require_tree_src_utils.isNodeDisabled(node, props.disabledField)) return;
			if (props.internalUnifySelectCheck && !props.multiple) {
				handleSelect(node);
				return;
			}
			const checkedAction = checked ? "check" : "uncheck";
			const { checkedKeys, indeterminateKeys } = dataTreeMateRef.value[checkedAction](node.key, displayedCheckedKeysRef.value, {
				cascade: props.cascade,
				checkStrategy: mergedCheckStrategyRef.value,
				allowNotLoaded: props.allowCheckingNotLoaded
			});
			doUpdateCheckedKeys(checkedKeys, getOptionsByKeys(checkedKeys), {
				node: node.rawNode,
				action: checkedAction
			});
			doUpdateIndeterminateKeys(indeterminateKeys, getOptionsByKeys(indeterminateKeys));
		}
		function toggleExpand(node) {
			if (props.disabled) return;
			const { key } = node;
			const { value: mergedExpandedKeys } = mergedExpandedKeysRef;
			const index = mergedExpandedKeys.findIndex((expandNodeId) => expandNodeId === key);
			if (~index) {
				const expandedKeysAfterChange = Array.from(mergedExpandedKeys);
				expandedKeysAfterChange.splice(index, 1);
				doUpdateExpandedKeys(expandedKeysAfterChange, getOptionsByKeys(expandedKeysAfterChange), {
					node: node.rawNode,
					action: "collapse"
				});
			} else {
				const nodeToBeExpanded = displayTreeMateRef.value.getNode(key);
				if (!nodeToBeExpanded || nodeToBeExpanded.isLeaf) return;
				let nextKeys;
				if (props.accordion) {
					const siblingKeySet = new Set(node.siblings.map(({ key }) => key));
					nextKeys = mergedExpandedKeys.filter((expandedKey) => {
						return !siblingKeySet.has(expandedKey);
					});
					nextKeys.push(key);
				} else nextKeys = mergedExpandedKeys.concat(key);
				doUpdateExpandedKeys(nextKeys, getOptionsByKeys(nextKeys), {
					node: node.rawNode,
					action: "expand"
				});
			}
		}
		function handleSwitcherClick(node) {
			if (props.disabled || aipRef.value) return;
			toggleExpand(node);
		}
		function handleSelect(node) {
			if (props.disabled || !props.selectable) return;
			pendingNodeKeyRef.value = node.key;
			if (props.internalUnifySelectCheck) {
				const { value: { checkedKeys, indeterminateKeys } } = checkedStatusRef;
				if (props.multiple) handleCheck(node, !(checkedKeys.includes(node.key) || indeterminateKeys.includes(node.key)));
				else doUpdateCheckedKeys([node.key], getOptionsByKeys([node.key]), {
					node: node.rawNode,
					action: "check"
				});
			}
			if (props.multiple) {
				const selectedKeys = Array.from(mergedSelectedKeysRef.value);
				const index = selectedKeys.findIndex((key) => key === node.key);
				if (~index) {
					if (props.cancelable) selectedKeys.splice(index, 1);
				} else if (!~index) selectedKeys.push(node.key);
				doUpdateSelectedKeys(selectedKeys, getOptionsByKeys(selectedKeys), {
					node: node.rawNode,
					action: ~index ? "unselect" : "select"
				});
			} else if (mergedSelectedKeysRef.value.includes(node.key)) {
				if (props.cancelable) doUpdateSelectedKeys([], [], {
					node: node.rawNode,
					action: "unselect"
				});
			} else doUpdateSelectedKeys([node.key], getOptionsByKeys([node.key]), {
				node: node.rawNode,
				action: "select"
			});
		}
		function expandDragEnterNode(node) {
			if (expandTimerId) {
				window.clearTimeout(expandTimerId);
				expandTimerId = null;
			}
			if (node.isLeaf) return;
			nodeKeyToBeExpanded = node.key;
			const expand = () => {
				if (nodeKeyToBeExpanded !== node.key) return;
				const { value: droppingMouseNode } = droppingMouseNodeRef;
				if (droppingMouseNode && droppingMouseNode.key === node.key && !mergedExpandedKeysRef.value.includes(node.key)) {
					const nextKeys = mergedExpandedKeysRef.value.concat(node.key);
					doUpdateExpandedKeys(nextKeys, getOptionsByKeys(nextKeys), {
						node: node.rawNode,
						action: "expand"
					});
				}
				expandTimerId = null;
				nodeKeyToBeExpanded = null;
			};
			if (!node.shallowLoaded) expandTimerId = window.setTimeout(() => {
				triggerLoading(node).then(() => {
					expand();
				});
			}, 1e3);
			else expandTimerId = window.setTimeout(() => {
				expand();
			}, 1e3);
		}
		function handleDragEnter({ event, node }) {
			if (!props.draggable || props.disabled || require_tree_src_utils.isNodeDisabled(node, props.disabledField)) return;
			handleDragOver({
				event,
				node
			}, false);
			doDragEnter({
				event,
				node: node.rawNode
			});
		}
		function handleDragLeave({ event, node }) {
			if (!props.draggable || props.disabled || require_tree_src_utils.isNodeDisabled(node, props.disabledField)) return;
			doDragLeave({
				event,
				node: node.rawNode
			});
		}
		function handleDragLeaveTree(e) {
			if (e.target !== e.currentTarget) return;
			resetDropState();
		}
		function handleDragEnd({ event, node }) {
			resetDndState();
			if (!props.draggable || props.disabled || require_tree_src_utils.isNodeDisabled(node, props.disabledField)) return;
			doDragEnd({
				event,
				node: node.rawNode
			});
		}
		function handleDragStart({ event, node }) {
			if (!props.draggable || props.disabled || require_tree_src_utils.isNodeDisabled(node, props.disabledField)) return;
			dragStartX = event.clientX;
			draggingNodeRef.value = node;
			doDragStart({
				event,
				node: node.rawNode
			});
		}
		function handleDragOver({ event, node }, emit = true) {
			if (!props.draggable || props.disabled || require_tree_src_utils.isNodeDisabled(node, props.disabledField)) return;
			const { value: draggingNode } = draggingNodeRef;
			if (!draggingNode) return;
			const { allowDrop, indent } = props;
			if (emit) doDragOver({
				event,
				node: node.rawNode
			});
			const { height: elOffsetHeight, top: elClientTop } = event.currentTarget.getBoundingClientRect();
			const eventOffsetY = event.clientY - elClientTop;
			let mousePosition;
			if (allowDrop({
				node: node.rawNode,
				dropPosition: "inside",
				phase: "drag"
			})) {
				if (eventOffsetY <= 8) mousePosition = "before";
				else if (eventOffsetY >= elOffsetHeight - 8) mousePosition = "after";
				else mousePosition = "inside";
			} else if (eventOffsetY <= elOffsetHeight / 2) mousePosition = "before";
			else mousePosition = "after";
			const { value: getFindex } = getFIndexRef;
			/** determine the drop position and drop node */
			/** the dropping node needn't to be the mouse hovering node! */
			/**
			* if there is something i've learned from implementing a complex
			* drag & drop. that is never write unit test before you really figure
			* out what behavior is exactly you want.
			*/
			let finalDropNode;
			let finalDropPosition;
			const hoverNodeFIndex = getFindex(node.key);
			if (hoverNodeFIndex === null) {
				resetDropState();
				return;
			}
			let mouseAtExpandedNonLeafNode = false;
			if (mousePosition === "inside") {
				finalDropNode = node;
				finalDropPosition = "inside";
			} else if (mousePosition === "before") {
				if (node.isFirstChild) {
					finalDropNode = node;
					finalDropPosition = "before";
				} else {
					finalDropNode = fNodesRef.value[hoverNodeFIndex - 1];
					finalDropPosition = "after";
				}
			} else {
				finalDropNode = node;
				finalDropPosition = "after";
			}
			if (!finalDropNode.isLeaf && mergedExpandedKeysRef.value.includes(finalDropNode.key)) {
				mouseAtExpandedNonLeafNode = true;
				if (finalDropPosition === "after") {
					finalDropNode = fNodesRef.value[hoverNodeFIndex + 1];
					if (!finalDropNode) {
						finalDropNode = node;
						finalDropPosition = "inside";
					} else finalDropPosition = "before";
				}
			}
			const droppingMouseNode = finalDropNode;
			droppingMouseNodeRef.value = droppingMouseNode;
			if (!mouseAtExpandedNonLeafNode && draggingNode.isLastChild && draggingNode.key === finalDropNode.key) finalDropPosition = "after";
			if (finalDropPosition === "after") {
				let offset = dragStartX - event.clientX;
				let offsetLevel = 0;
				while (offset >= indent / 2 && finalDropNode.parent !== null && finalDropNode.isLastChild && offsetLevel < 1) {
					offset -= indent;
					offsetLevel += 1;
					finalDropNode = finalDropNode.parent;
				}
				droppingOffsetLevelRef.value = offsetLevel;
			} else droppingOffsetLevelRef.value = 0;
			if (draggingNode.contains(finalDropNode) || finalDropPosition === "inside" && draggingNode.parent?.key === finalDropNode.key) {
				if (draggingNode.key === droppingMouseNode.key && draggingNode.key === finalDropNode.key) {} else {
					resetDropState();
					return;
				}
			}
			if (!allowDrop({
				node: finalDropNode.rawNode,
				dropPosition: finalDropPosition,
				phase: "drag"
			})) {
				resetDropState();
				return;
			}
			if (draggingNode.key === finalDropNode.key) resetDragExpandState();
			else if (nodeKeyToBeExpanded !== finalDropNode.key) {
				if (finalDropPosition === "inside") {
					if (props.expandOnDragenter) {
						expandDragEnterNode(finalDropNode);
						if (!finalDropNode.shallowLoaded && nodeKeyToBeExpanded !== finalDropNode.key) {
							resetDndState();
							return;
						}
					} else if (!finalDropNode.shallowLoaded) {
						resetDndState();
						return;
					}
				} else resetDragExpandState();
			} else if (finalDropPosition !== "inside") resetDragExpandState();
			droppingPositionRef.value = finalDropPosition;
			droppingNodeRef.value = finalDropNode;
		}
		function handleDrop({ event, node, dropPosition }) {
			if (!props.draggable || props.disabled || require_tree_src_utils.isNodeDisabled(node, props.disabledField)) return;
			const { value: draggingNode } = draggingNodeRef;
			const { value: droppingNode } = droppingNodeRef;
			const { value: droppingPosition } = droppingPositionRef;
			if (!draggingNode || !droppingNode || !droppingPosition) return;
			if (!props.allowDrop({
				node: droppingNode.rawNode,
				dropPosition: droppingPosition,
				phase: "drag"
			})) return;
			if (draggingNode.key === droppingNode.key) return;
			if (droppingPosition === "before") {
				const nextNode = draggingNode.getNext({ includeDisabled: true });
				if (nextNode) {
					if (nextNode.key === droppingNode.key) {
						resetDropState();
						return;
					}
				}
			}
			if (droppingPosition === "after") {
				const prevNode = draggingNode.getPrev({ includeDisabled: true });
				if (prevNode) {
					if (prevNode.key === droppingNode.key) {
						resetDropState();
						return;
					}
				}
			}
			doDrop({
				event,
				node: droppingNode.rawNode,
				dragNode: draggingNode.rawNode,
				dropPosition
			});
			resetDndState();
		}
		function handleScroll() {
			syncScrollbar();
		}
		function handleResize() {
			syncScrollbar();
		}
		function handleFocusout(e) {
			if (props.virtualScroll || props.internalScrollable) {
				const { value: scrollbarInst } = scrollbarInstRef;
				if (scrollbarInst?.containerRef?.contains(e.relatedTarget)) return;
				pendingNodeKeyRef.value = null;
			} else {
				const { value: selfEl } = selfElRef;
				if (selfEl?.contains(e.relatedTarget)) return;
				pendingNodeKeyRef.value = null;
			}
		}
		(0, vue.watch)(pendingNodeKeyRef, (value) => {
			if (value === null) return;
			if (props.virtualScroll) virtualListInstRef.value?.scrollTo({ key: value });
			else if (props.internalScrollable) {
				const { value: scrollbarInst } = scrollbarInstRef;
				if (scrollbarInst === null) return;
				const targetEl = scrollbarInst.contentRef?.querySelector(`[data-key="${require__utils_vue_create_data_key.createDataKey(value)}"]`);
				if (!targetEl) return;
				scrollbarInst.scrollTo({ el: targetEl });
			}
		});
		(0, vue.provide)(require_tree_src_interface.treeInjectionKey, {
			loadingKeysRef,
			highlightKeySetRef: mergedHighlightKeySetRef,
			displayedCheckedKeysRef,
			displayedIndeterminateKeysRef,
			mergedSelectedKeysRef,
			mergedExpandedKeysRef,
			mergedThemeRef: themeRef,
			mergedCheckStrategyRef,
			nodePropsRef: (0, vue.toRef)(props, "nodeProps"),
			disabledRef: (0, vue.toRef)(props, "disabled"),
			checkableRef: (0, vue.toRef)(props, "checkable"),
			selectableRef: (0, vue.toRef)(props, "selectable"),
			expandOnClickRef: (0, vue.toRef)(props, "expandOnClick"),
			onLoadRef: (0, vue.toRef)(props, "onLoad"),
			draggableRef: (0, vue.toRef)(props, "draggable"),
			blockLineRef: (0, vue.toRef)(props, "blockLine"),
			indentRef: (0, vue.toRef)(props, "indent"),
			cascadeRef: (0, vue.toRef)(props, "cascade"),
			checkOnClickRef: (0, vue.toRef)(props, "checkOnClick"),
			checkboxPlacementRef: props.checkboxPlacement,
			droppingMouseNodeRef,
			droppingNodeParentRef,
			draggingNodeRef,
			droppingPositionRef,
			droppingOffsetLevelRef,
			fNodesRef,
			pendingNodeKeyRef,
			showLineRef: (0, vue.toRef)(props, "showLine"),
			disabledFieldRef: (0, vue.toRef)(props, "disabledField"),
			internalScrollableRef: (0, vue.toRef)(props, "internalScrollable"),
			internalCheckboxFocusableRef: (0, vue.toRef)(props, "internalCheckboxFocusable"),
			internalTreeSelect: props.internalTreeSelect,
			renderLabelRef: (0, vue.toRef)(props, "renderLabel"),
			renderPrefixRef: (0, vue.toRef)(props, "renderPrefix"),
			renderSuffixRef: (0, vue.toRef)(props, "renderSuffix"),
			renderSwitcherIconRef: (0, vue.toRef)(props, "renderSwitcherIcon"),
			labelFieldRef: (0, vue.toRef)(props, "labelField"),
			multipleRef: (0, vue.toRef)(props, "multiple"),
			overrideDefaultNodeClickBehaviorRef: (0, vue.toRef)(props, "overrideDefaultNodeClickBehavior"),
			spinPropsRef: (0, vue.toRef)(props, "spinProps"),
			handleSwitcherClick,
			handleDragEnd,
			handleDragEnter,
			handleDragLeave,
			handleDragStart,
			handleDrop,
			handleDragOver,
			handleSelect,
			handleCheck
		});
		function scrollTo(options, y) {
			if (typeof options === "number") virtualListInstRef.value?.scrollTo(options, y || 0);
			else virtualListInstRef.value?.scrollTo(options);
		}
		const exposedMethods = {
			handleKeydown,
			scrollTo,
			getCheckedData: () => {
				if (!props.checkable) return {
					keys: [],
					options: []
				};
				const { checkedKeys } = checkedStatusRef.value;
				return {
					keys: checkedKeys,
					options: getOptionsByKeys(checkedKeys)
				};
			},
			getIndeterminateData: () => {
				if (!props.checkable) return {
					keys: [],
					options: []
				};
				const { indeterminateKeys } = checkedStatusRef.value;
				return {
					keys: indeterminateKeys,
					options: getOptionsByKeys(indeterminateKeys)
				};
			}
		};
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self: { fontSize, nodeBorderRadius, nodeColorHover, nodeColorPressed, nodeColorActive, arrowColor, loadingColor, nodeTextColor, nodeTextColorDisabled, dropMarkColor, nodeWrapperPadding, nodeHeight, lineHeight, lineColor } } = themeRef.value;
			const lineOffsetTop = (0, seemly.getPadding)(nodeWrapperPadding, "top");
			const lineOffsetBottom = (0, seemly.getPadding)(nodeWrapperPadding, "bottom");
			const nodeContentHeight = (0, seemly.pxfy)((0, seemly.depx)(nodeHeight) - (0, seemly.depx)(lineOffsetTop) - (0, seemly.depx)(lineOffsetBottom));
			return {
				"--n-arrow-color": arrowColor,
				"--n-loading-color": loadingColor,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-font-size": fontSize,
				"--n-node-border-radius": nodeBorderRadius,
				"--n-node-color-active": nodeColorActive,
				"--n-node-color-hover": nodeColorHover,
				"--n-node-color-pressed": nodeColorPressed,
				"--n-node-text-color": nodeTextColor,
				"--n-node-text-color-disabled": nodeTextColorDisabled,
				"--n-drop-mark-color": dropMarkColor,
				"--n-node-wrapper-padding": nodeWrapperPadding,
				"--n-line-offset-top": `-${lineOffsetTop}`,
				"--n-line-offset-bottom": `-${lineOffsetBottom}`,
				"--n-node-content-height": nodeContentHeight,
				"--n-line-height": lineHeight,
				"--n-line-color": lineColor
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("tree", void 0, cssVarsRef, props) : void 0;
		return {
			...exposedMethods,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedTheme: themeRef,
			mergedRenderEmpty: mergedRenderEmptyRef,
			rtlEnabled: rtlEnabledRef,
			fNodes: mergedFNodesRef,
			aip: aipRef,
			selfElRef,
			virtualListInstRef,
			scrollbarInstRef,
			handleFocusout,
			handleDragLeaveTree,
			handleScroll,
			getScrollContainer,
			getScrollContent,
			handleAfterEnter,
			handleResize,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { fNodes, internalRenderEmpty } = this;
		if (!fNodes.length && internalRenderEmpty) return internalRenderEmpty();
		const { mergedClsPrefix, blockNode, blockLine, draggable, disabled, ellipsis, internalFocusable, checkable, handleKeydown, rtlEnabled, handleFocusout, scrollbarProps } = this;
		const mergedFocusable = internalFocusable && !disabled;
		const tabindex = mergedFocusable ? "0" : void 0;
		const treeClass = [
			`${mergedClsPrefix}-tree`,
			rtlEnabled && `${mergedClsPrefix}-tree--rtl`,
			checkable && `${mergedClsPrefix}-tree--checkable`,
			(blockLine || blockNode) && `${mergedClsPrefix}-tree--block-node`,
			blockLine && `${mergedClsPrefix}-tree--block-line`,
			ellipsis && `${mergedClsPrefix}-tree--ellipsis`
		];
		const createNode = (tmNode) => {
			return "__motion" in tmNode ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_tree_src_MotionWrapper, {
				key: 1,
				height: tmNode.height,
				nodes: tmNode.nodes,
				clsPrefix: mergedClsPrefix,
				mode: tmNode.mode,
				onAfterEnter: this.handleAfterEnter
			}, null, 8, [
				"height",
				"nodes",
				"clsPrefix",
				"mode",
				"onAfterEnter"
			])) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_tree_src_TreeNode, {
				key: tmNode.key,
				tmNode,
				clsPrefix: mergedClsPrefix
			}, null, 8, ["tmNode", "clsPrefix"]));
		};
		if (this.virtualScroll) {
			const { mergedTheme, internalScrollablePadding } = this;
			const padding = (0, seemly.getPadding)(internalScrollablePadding || "0");
			return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.XScrollbar, (0, vue.mergeProps)({ key: 3 }, scrollbarProps, {
				ref: "scrollbarInstRef",
				onDragleave: draggable ? this.handleDragLeaveTree : void 0,
				container: this.getScrollContainer,
				content: this.getScrollContent,
				class: treeClass,
				theme: mergedTheme.peers.Scrollbar,
				themeOverrides: mergedTheme.peerOverrides.Scrollbar,
				tabindex,
				onKeydown: mergedFocusable ? handleKeydown : void 0,
				onFocusout: mergedFocusable ? handleFocusout : void 0
			}), { default: () => {
				this.onRender?.();
				return !fNodes.length ? require__utils_vue_resolve_slot.resolveSlot(this.$slots.empty, () => {
					return [this.mergedRenderEmpty?.() || ((0, vue.openBlock)(), (0, vue.createBlock)(require_empty_src_Empty.default, {
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-tree__empty`),
						theme: this.mergedTheme.peers.Empty,
						themeOverrides: this.mergedTheme.peerOverrides.Empty
					}, null, 8, [
						"class",
						"theme",
						"themeOverrides"
					]))];
				}) : ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VVirtualList, {
					key: 4,
					ref: "virtualListInstRef",
					items: this.fNodes,
					itemSize: (0, seemly.depx)(mergedTheme.self.nodeHeight),
					ignoreItemResize: this.aip,
					paddingTop: padding.top,
					paddingBottom: padding.bottom,
					class: require_vdom.normalizeClass(this.themeClass),
					style: (0, vue.normalizeStyle)([this.cssVars, {
						paddingLeft: padding.left,
						paddingRight: padding.right
					}]),
					onScroll: this.handleScroll,
					onResize: this.handleResize,
					showScrollbar: false,
					itemResizable: true
				}, { default: ({ item }) => createNode(item) }, 1032, [
					"items",
					"itemSize",
					"ignoreItemResize",
					"paddingTop",
					"paddingBottom",
					"class",
					"style",
					"onScroll",
					"onResize"
				]));
			} }, 1040, [
				"onDragleave",
				"container",
				"content",
				"class",
				"theme",
				"themeOverrides",
				"tabindex",
				"onKeydown",
				"onFocusout"
			]);
		}
		const { internalScrollable } = this;
		treeClass.push(this.themeClass);
		this.onRender?.();
		if (internalScrollable) return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.XScrollbar, (0, vue.mergeProps)({ key: 5 }, scrollbarProps, {
			class: treeClass,
			tabindex,
			onKeydown: mergedFocusable ? handleKeydown : void 0,
			onFocusout: mergedFocusable ? handleFocusout : void 0,
			style: this.cssVars,
			contentStyle: { padding: this.internalScrollablePadding }
		}), { default: () => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			onDragleave: draggable ? this.handleDragLeaveTree : void 0,
			ref: "selfElRef"
		}, [require_vdom.normalizeVNode(() => this.fNodes.map(createNode))], 40, _hoisted_1)) }, 1040, [
			"class",
			"tabindex",
			"onKeydown",
			"onFocusout",
			"style",
			"contentStyle"
		]);
		else return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 6,
			class: require_vdom.normalizeClass(treeClass),
			tabindex,
			ref: "selfElRef",
			style: (0, vue.normalizeStyle)(this.cssVars),
			onKeydown: mergedFocusable ? handleKeydown : void 0,
			onFocusout: mergedFocusable ? handleFocusout : void 0,
			onDragleave: draggable ? this.handleDragLeaveTree : void 0
		}, [!fNodes.length ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(this.$slots.empty, () => {
			return [this.mergedRenderEmpty?.() || ((0, vue.openBlock)(), (0, vue.createBlock)(require_empty_src_Empty.default, {
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-tree__empty`),
				theme: this.mergedTheme.peers.Empty,
				themeOverrides: this.mergedTheme.peerOverrides.Empty
			}, null, 8, [
				"class",
				"theme",
				"themeOverrides"
			]))];
		}))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => fNodes.map(createNode))], 64))], 46, _hoisted_2);
	}
});
//#endregion
exports.createTreeMateOptions = createTreeMateOptions;
exports.default = Tree_default;
exports.treeProps = treeProps;
exports.treeSharedProps = treeSharedProps;
