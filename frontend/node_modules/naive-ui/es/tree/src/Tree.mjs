import { warn, warnOnce } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { createDataKey } from "../../_utils/vue/create-data-key.mjs";
import { resolveSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { XScrollbar } from "../../_internal/scrollbar/src/Scrollbar.mjs";
import Empty_default from "../../empty/src/Empty.mjs";
import treeLight from "../styles/light.mjs";
import { treeSelectInjectionKey } from "../../tree-select/src/interface.mjs";
import { defaultAllowDrop } from "./dnd.mjs";
import { treeInjectionKey } from "./interface.mjs";
import { useKeyboard as useKeyboard$1 } from "./keyboard.mjs";
import { filterTree, isNodeDisabled, keysWithFilter, useMergedCheckStrategy } from "./utils.mjs";
import TreeNode$1 from "./TreeNode.mjs";
import MotionWrapper_default from "./MotionWrapper.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { depx, getPadding, pxfy } from "seemly";
import { Fragment, computed, createBlock, createElementBlock, defineComponent, inject, mergeProps, nextTick, normalizeStyle, openBlock, provide, ref, toRef, watch, watchEffect } from "vue";
import { useMergedState } from "vooks";
import { VVirtualList } from "vueuc";
import { createIndexGetter, createTreeMate, flatten } from "treemate";
//#region src/tree/src/Tree.tsx
const _hoisted_1 = ["onDragleave"];
const _hoisted_2 = ["tabindex", "onKeydown", "onFocusout", "onDragleave"];
function createTreeMateOptions(keyField, childrenField, disabledField, getChildren) {
  return {
    getIsGroup() {
      return false;
    },
    getKey(node) {
      return node[keyField];
    },
    getChildren: getChildren || (node => {
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
  ...useTheme.props,
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
    default: defaultAllowDrop
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
var Tree_default = defineComponent({
  name: "Tree",
  props: treeProps,
  slots: Object,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.leafOnly) warnOnce("tree", "`leaf-only` is deprecated, please use `check-strategy=\"child\"` instead");
    });
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef,
      mergedComponentPropsRef
    } = useConfig(props);
    const rtlEnabledRef = useRtl("Tree", mergedRtlRef, mergedClsPrefixRef);
    const themeRef = useTheme("Tree", "-tree", index_cssr_default, treeLight, props, mergedClsPrefixRef);
    const mergedRenderEmptyRef = computed(() => {
      return mergedComponentPropsRef?.value?.Tree?.renderEmpty;
    });
    const selfElRef = ref(null);
    const scrollbarInstRef = ref(null);
    const virtualListInstRef = ref(null);
    function getScrollContainer() {
      return virtualListInstRef.value?.listElRef;
    }
    function getScrollContent() {
      return virtualListInstRef.value?.itemsElRef;
    }
    const mergedFilterRef = computed(() => {
      const {
        filter
      } = props;
      if (filter) return filter;
      const {
        labelField
      } = props;
      return (pattern, node) => {
        if (!pattern.length) return true;
        const label = node[labelField];
        if (typeof label === "string") return label.toLowerCase().includes(pattern.toLowerCase());
        return false;
      };
    });
    const filteredTreeInfoRef = computed(() => {
      const {
        pattern
      } = props;
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
      return filterTree(props.data, mergedFilterRef.value, pattern, props.keyField, props.childrenField);
    });
    const displayTreeMateRef = computed(() => createTreeMate(props.showIrrelevantNodes ? props.data : filteredTreeInfoRef.value.filteredTree, createTreeMateOptions(props.keyField, props.childrenField, props.disabledField, props.getChildren)));
    const treeSelectInjection = inject(treeSelectInjectionKey, null);
    const dataTreeMateRef = props.internalTreeSelect ? treeSelectInjection.dataTreeMate : computed(() => props.showIrrelevantNodes ? displayTreeMateRef.value : createTreeMate(props.data, createTreeMateOptions(props.keyField, props.childrenField, props.disabledField, props.getChildren)));
    const {
      watchProps
    } = props;
    const uncontrolledCheckedKeysRef = ref([]);
    if (watchProps?.includes("defaultCheckedKeys")) watchEffect(() => {
      uncontrolledCheckedKeysRef.value = props.defaultCheckedKeys;
    });else uncontrolledCheckedKeysRef.value = props.defaultCheckedKeys;
    const controlledCheckedKeysRef = toRef(props, "checkedKeys");
    const mergedCheckedKeysRef = useMergedState(controlledCheckedKeysRef, uncontrolledCheckedKeysRef);
    const checkedStatusRef = computed(() => {
      return dataTreeMateRef.value.getCheckedKeys(mergedCheckedKeysRef.value, {
        cascade: props.cascade,
        allowNotLoaded: props.allowCheckingNotLoaded
      });
    });
    const mergedCheckStrategyRef = useMergedCheckStrategy(props);
    const displayedCheckedKeysRef = computed(() => {
      return checkedStatusRef.value.checkedKeys;
    });
    const displayedIndeterminateKeysRef = computed(() => {
      const {
        indeterminateKeys
      } = props;
      if (indeterminateKeys !== void 0) return indeterminateKeys;
      return checkedStatusRef.value.indeterminateKeys;
    });
    const uncontrolledSelectedKeysRef = ref([]);
    if (watchProps?.includes("defaultSelectedKeys")) watchEffect(() => {
      uncontrolledSelectedKeysRef.value = props.defaultSelectedKeys;
    });else uncontrolledSelectedKeysRef.value = props.defaultSelectedKeys;
    const controlledSelectedKeysRef = toRef(props, "selectedKeys");
    const mergedSelectedKeysRef = useMergedState(controlledSelectedKeysRef, uncontrolledSelectedKeysRef);
    const uncontrolledExpandedKeysRef = ref([]);
    const initUncontrolledExpandedKeys = keys => {
      uncontrolledExpandedKeysRef.value = props.defaultExpandAll ? dataTreeMateRef.value.getNonLeafKeys() : keys === void 0 ? props.defaultExpandedKeys : keys;
    };
    if (watchProps?.includes("defaultExpandedKeys")) watchEffect(() => {
      initUncontrolledExpandedKeys(void 0);
    });else watchEffect(() => {
      initUncontrolledExpandedKeys(props.defaultExpandedKeys);
    });
    const controlledExpandedKeysRef = toRef(props, "expandedKeys");
    const mergedExpandedKeysRef = useMergedState(controlledExpandedKeysRef, uncontrolledExpandedKeysRef);
    const fNodesRef = computed(() => displayTreeMateRef.value.getFlattenedNodes(mergedExpandedKeysRef.value));
    const {
      pendingNodeKeyRef,
      handleKeydown
    } = useKeyboard$1({
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
    const uncontrolledHighlightKeySetRef = ref(/* @__PURE__ */new Set());
    const controlledHighlightKeySetRef = computed(() => {
      return props.internalHighlightKeySet || filteredTreeInfoRef.value.highlightKeySet;
    });
    const mergedHighlightKeySetRef = useMergedState(controlledHighlightKeySetRef, uncontrolledHighlightKeySetRef);
    const loadingKeysRef = ref(/* @__PURE__ */new Set());
    const expandedNonLoadingKeysRef = computed(() => {
      return mergedExpandedKeysRef.value.filter(key => !loadingKeysRef.value.has(key));
    });
    let dragStartX = 0;
    const draggingNodeRef = ref(null);
    const droppingNodeRef = ref(null);
    const droppingMouseNodeRef = ref(null);
    const droppingPositionRef = ref(null);
    const droppingOffsetLevelRef = ref(0);
    const droppingNodeParentRef = computed(() => {
      const {
        value: droppingNode
      } = droppingNodeRef;
      if (!droppingNode) return null;
      return droppingNode.parent;
    });
    let isDataReset = false;
    watch(toRef(props, "data"), () => {
      isDataReset = true;
      nextTick(() => {
        isDataReset = false;
      });
      loadingKeysRef.value.clear();
      pendingNodeKeyRef.value = null;
      resetDndState();
    }, {
      deep: false
    });
    let expandAnimationDisabled = false;
    const disableExpandAnimationForOneTick = () => {
      expandAnimationDisabled = true;
      nextTick(() => {
        expandAnimationDisabled = false;
      });
    };
    let memoizedExpandedKeys;
    watch(toRef(props, "pattern"), (value, oldValue) => {
      if (props.showIrrelevantNodes) {
        memoizedExpandedKeys = void 0;
        if (value) {
          const {
            expandedKeys: expandedKeysAfterChange,
            highlightKeySet
          } = keysWithFilter(props.data, props.pattern, props.keyField, props.childrenField, mergedFilterRef.value);
          uncontrolledHighlightKeySetRef.value = highlightKeySet;
          disableExpandAnimationForOneTick();
          doUpdateExpandedKeys(expandedKeysAfterChange, getOptionsByKeys(expandedKeysAfterChange), {
            node: null,
            action: "filter"
          });
        } else uncontrolledHighlightKeySetRef.value = /* @__PURE__ */new Set();
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
        const {
          expandedKeys
        } = filteredTreeInfoRef.value;
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
      const {
        onLoad
      } = props;
      if (!onLoad) {
        if (process.env.NODE_ENV !== "production") warn("tree", "There is unloaded node in data but props.onLoad is not specified.");
        await Promise.resolve();
        return;
      }
      const {
        value: loadingKeys
      } = loadingKeysRef;
      if (!loadingKeys.has(node.key)) {
        loadingKeys.add(node.key);
        try {
          if ((await onLoad(node.rawNode)) === false) resetDragExpandState();
        } catch (loadError) {
          console.error(loadError);
          resetDragExpandState();
        }
        loadingKeys.delete(node.key);
      }
    }
    watchEffect(() => {
      const {
        value: displayTreeMate
      } = displayTreeMateRef;
      if (!displayTreeMate) return;
      const {
        getNode
      } = displayTreeMate;
      mergedExpandedKeysRef.value?.forEach(key => {
        const node = getNode(key);
        if (node && !node.shallowLoaded) triggerLoading(node);
      });
    });
    const aipRef = ref(false);
    const afNodesRef = ref([]);
    watch(expandedNonLoadingKeysRef, (value, prevValue) => {
      if (!props.animated || expandAnimationDisabled) {
        nextTick(syncScrollbar);
        return;
      }
      if (isDataReset) return;
      const nodeHeight = depx(themeRef.value.self.nodeHeight);
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
      const {
        virtualScroll
      } = props;
      const viewportHeight = (virtualScroll ? virtualListInstRef.value.listElRef : selfElRef.value).offsetHeight;
      const viewportItemCount = Math.ceil(viewportHeight / nodeHeight) + 1;
      let baseExpandedKeys;
      if (addedKey !== null) baseExpandedKeys = prevValue;
      if (removedKey !== null) {
        if (baseExpandedKeys === void 0) baseExpandedKeys = value;else baseExpandedKeys = baseExpandedKeys.filter(key => key !== removedKey);
      }
      aipRef.value = true;
      afNodesRef.value = displayTreeMateRef.value.getFlattenedNodes(baseExpandedKeys);
      if (addedKey !== null) {
        const expandedNodeIndex = afNodesRef.value.findIndex(node => node.key === addedKey);
        if (~expandedNodeIndex) {
          const children = afNodesRef.value[expandedNodeIndex].children;
          if (children) {
            const expandedChildren = flatten(children, value);
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
        const collapsedNodeIndex = afNodesRef.value.findIndex(node => node.key === removedKey);
        if (~collapsedNodeIndex) {
          const collapsedNodeChildren = afNodesRef.value[collapsedNodeIndex].children;
          if (!collapsedNodeChildren) return;
          aipRef.value = true;
          const collapsedChildren = flatten(collapsedNodeChildren, value);
          afNodesRef.value.splice(collapsedNodeIndex + 1, 0, {
            __motion: true,
            mode: "collapse",
            height: virtualScroll ? collapsedChildren.length * nodeHeight : void 0,
            nodes: virtualScroll ? collapsedChildren.slice(0, viewportItemCount) : collapsedChildren
          });
        }
      }
    });
    const getFIndexRef = computed(() => {
      return createIndexGetter(fNodesRef.value);
    });
    const mergedFNodesRef = computed(() => {
      if (aipRef.value) return afNodesRef.value;else return fNodesRef.value;
    });
    function syncScrollbar() {
      const {
        value: scrollbarInst
      } = scrollbarInstRef;
      if (scrollbarInst) scrollbarInst.sync();
    }
    function handleAfterEnter() {
      aipRef.value = false;
      if (props.virtualScroll) nextTick(syncScrollbar);
    }
    function getOptionsByKeys(keys) {
      const {
        getNode
      } = dataTreeMateRef.value;
      return keys.map(key => getNode(key)?.rawNode || null);
    }
    function doUpdateExpandedKeys(value, option, meta) {
      const {
        "onUpdate:expandedKeys": _onUpdateExpandedKeys,
        onUpdateExpandedKeys
      } = props;
      uncontrolledExpandedKeysRef.value = value;
      if (_onUpdateExpandedKeys) call(_onUpdateExpandedKeys, value, option, meta);
      if (onUpdateExpandedKeys) call(onUpdateExpandedKeys, value, option, meta);
    }
    function doUpdateCheckedKeys(value, option, meta) {
      const {
        "onUpdate:checkedKeys": _onUpdateCheckedKeys,
        onUpdateCheckedKeys
      } = props;
      uncontrolledCheckedKeysRef.value = value;
      if (onUpdateCheckedKeys) call(onUpdateCheckedKeys, value, option, meta);
      if (_onUpdateCheckedKeys) call(_onUpdateCheckedKeys, value, option, meta);
    }
    function doUpdateIndeterminateKeys(value, option) {
      const {
        "onUpdate:indeterminateKeys": _onUpdateIndeterminateKeys,
        onUpdateIndeterminateKeys
      } = props;
      if (_onUpdateIndeterminateKeys) call(_onUpdateIndeterminateKeys, value, option);
      if (onUpdateIndeterminateKeys) call(onUpdateIndeterminateKeys, value, option);
    }
    function doUpdateSelectedKeys(value, option, meta) {
      const {
        "onUpdate:selectedKeys": _onUpdateSelectedKeys,
        onUpdateSelectedKeys
      } = props;
      uncontrolledSelectedKeysRef.value = value;
      if (onUpdateSelectedKeys) call(onUpdateSelectedKeys, value, option, meta);
      if (_onUpdateSelectedKeys) call(_onUpdateSelectedKeys, value, option, meta);
    }
    function doDragEnter(info) {
      const {
        onDragenter
      } = props;
      if (onDragenter) call(onDragenter, info);
    }
    function doDragLeave(info) {
      const {
        onDragleave
      } = props;
      if (onDragleave) call(onDragleave, info);
    }
    function doDragEnd(info) {
      const {
        onDragend
      } = props;
      if (onDragend) call(onDragend, info);
    }
    function doDragStart(info) {
      const {
        onDragstart
      } = props;
      if (onDragstart) call(onDragstart, info);
    }
    function doDragOver(info) {
      const {
        onDragover
      } = props;
      if (onDragover) call(onDragover, info);
    }
    function doDrop(info) {
      const {
        onDrop
      } = props;
      if (onDrop) call(onDrop, info);
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
      if (props.disabled || isNodeDisabled(node, props.disabledField)) return;
      if (props.internalUnifySelectCheck && !props.multiple) {
        handleSelect(node);
        return;
      }
      const checkedAction = checked ? "check" : "uncheck";
      const {
        checkedKeys,
        indeterminateKeys
      } = dataTreeMateRef.value[checkedAction](node.key, displayedCheckedKeysRef.value, {
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
      const {
        key
      } = node;
      const {
        value: mergedExpandedKeys
      } = mergedExpandedKeysRef;
      const index = mergedExpandedKeys.findIndex(expandNodeId => expandNodeId === key);
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
          const siblingKeySet = new Set(node.siblings.map(({
            key
          }) => key));
          nextKeys = mergedExpandedKeys.filter(expandedKey => {
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
        const {
          value: {
            checkedKeys,
            indeterminateKeys
          }
        } = checkedStatusRef;
        if (props.multiple) handleCheck(node, !(checkedKeys.includes(node.key) || indeterminateKeys.includes(node.key)));else doUpdateCheckedKeys([node.key], getOptionsByKeys([node.key]), {
          node: node.rawNode,
          action: "check"
        });
      }
      if (props.multiple) {
        const selectedKeys = Array.from(mergedSelectedKeysRef.value);
        const index = selectedKeys.findIndex(key => key === node.key);
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
        const {
          value: droppingMouseNode
        } = droppingMouseNodeRef;
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
      }, 1e3);else expandTimerId = window.setTimeout(() => {
        expand();
      }, 1e3);
    }
    function handleDragEnter({
      event,
      node
    }) {
      if (!props.draggable || props.disabled || isNodeDisabled(node, props.disabledField)) return;
      handleDragOver({
        event,
        node
      }, false);
      doDragEnter({
        event,
        node: node.rawNode
      });
    }
    function handleDragLeave({
      event,
      node
    }) {
      if (!props.draggable || props.disabled || isNodeDisabled(node, props.disabledField)) return;
      doDragLeave({
        event,
        node: node.rawNode
      });
    }
    function handleDragLeaveTree(e) {
      if (e.target !== e.currentTarget) return;
      resetDropState();
    }
    function handleDragEnd({
      event,
      node
    }) {
      resetDndState();
      if (!props.draggable || props.disabled || isNodeDisabled(node, props.disabledField)) return;
      doDragEnd({
        event,
        node: node.rawNode
      });
    }
    function handleDragStart({
      event,
      node
    }) {
      if (!props.draggable || props.disabled || isNodeDisabled(node, props.disabledField)) return;
      dragStartX = event.clientX;
      draggingNodeRef.value = node;
      doDragStart({
        event,
        node: node.rawNode
      });
    }
    function handleDragOver({
      event,
      node
    }, emit = true) {
      if (!props.draggable || props.disabled || isNodeDisabled(node, props.disabledField)) return;
      const {
        value: draggingNode
      } = draggingNodeRef;
      if (!draggingNode) return;
      const {
        allowDrop,
        indent
      } = props;
      if (emit) doDragOver({
        event,
        node: node.rawNode
      });
      const {
        height: elOffsetHeight,
        top: elClientTop
      } = event.currentTarget.getBoundingClientRect();
      const eventOffsetY = event.clientY - elClientTop;
      let mousePosition;
      if (allowDrop({
        node: node.rawNode,
        dropPosition: "inside",
        phase: "drag"
      })) {
        if (eventOffsetY <= 8) mousePosition = "before";else if (eventOffsetY >= elOffsetHeight - 8) mousePosition = "after";else mousePosition = "inside";
      } else if (eventOffsetY <= elOffsetHeight / 2) mousePosition = "before";else mousePosition = "after";
      const {
        value: getFindex
      } = getFIndexRef;
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
      if (draggingNode.key === finalDropNode.key) resetDragExpandState();else if (nodeKeyToBeExpanded !== finalDropNode.key) {
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
    function handleDrop({
      event,
      node,
      dropPosition
    }) {
      if (!props.draggable || props.disabled || isNodeDisabled(node, props.disabledField)) return;
      const {
        value: draggingNode
      } = draggingNodeRef;
      const {
        value: droppingNode
      } = droppingNodeRef;
      const {
        value: droppingPosition
      } = droppingPositionRef;
      if (!draggingNode || !droppingNode || !droppingPosition) return;
      if (!props.allowDrop({
        node: droppingNode.rawNode,
        dropPosition: droppingPosition,
        phase: "drag"
      })) return;
      if (draggingNode.key === droppingNode.key) return;
      if (droppingPosition === "before") {
        const nextNode = draggingNode.getNext({
          includeDisabled: true
        });
        if (nextNode) {
          if (nextNode.key === droppingNode.key) {
            resetDropState();
            return;
          }
        }
      }
      if (droppingPosition === "after") {
        const prevNode = draggingNode.getPrev({
          includeDisabled: true
        });
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
        const {
          value: scrollbarInst
        } = scrollbarInstRef;
        if (scrollbarInst?.containerRef?.contains(e.relatedTarget)) return;
        pendingNodeKeyRef.value = null;
      } else {
        const {
          value: selfEl
        } = selfElRef;
        if (selfEl?.contains(e.relatedTarget)) return;
        pendingNodeKeyRef.value = null;
      }
    }
    watch(pendingNodeKeyRef, value => {
      if (value === null) return;
      if (props.virtualScroll) virtualListInstRef.value?.scrollTo({
        key: value
      });else if (props.internalScrollable) {
        const {
          value: scrollbarInst
        } = scrollbarInstRef;
        if (scrollbarInst === null) return;
        const targetEl = scrollbarInst.contentRef?.querySelector(`[data-key="${createDataKey(value)}"]`);
        if (!targetEl) return;
        scrollbarInst.scrollTo({
          el: targetEl
        });
      }
    });
    provide(treeInjectionKey, {
      loadingKeysRef,
      highlightKeySetRef: mergedHighlightKeySetRef,
      displayedCheckedKeysRef,
      displayedIndeterminateKeysRef,
      mergedSelectedKeysRef,
      mergedExpandedKeysRef,
      mergedThemeRef: themeRef,
      mergedCheckStrategyRef,
      nodePropsRef: toRef(props, "nodeProps"),
      disabledRef: toRef(props, "disabled"),
      checkableRef: toRef(props, "checkable"),
      selectableRef: toRef(props, "selectable"),
      expandOnClickRef: toRef(props, "expandOnClick"),
      onLoadRef: toRef(props, "onLoad"),
      draggableRef: toRef(props, "draggable"),
      blockLineRef: toRef(props, "blockLine"),
      indentRef: toRef(props, "indent"),
      cascadeRef: toRef(props, "cascade"),
      checkOnClickRef: toRef(props, "checkOnClick"),
      checkboxPlacementRef: props.checkboxPlacement,
      droppingMouseNodeRef,
      droppingNodeParentRef,
      draggingNodeRef,
      droppingPositionRef,
      droppingOffsetLevelRef,
      fNodesRef,
      pendingNodeKeyRef,
      showLineRef: toRef(props, "showLine"),
      disabledFieldRef: toRef(props, "disabledField"),
      internalScrollableRef: toRef(props, "internalScrollable"),
      internalCheckboxFocusableRef: toRef(props, "internalCheckboxFocusable"),
      internalTreeSelect: props.internalTreeSelect,
      renderLabelRef: toRef(props, "renderLabel"),
      renderPrefixRef: toRef(props, "renderPrefix"),
      renderSuffixRef: toRef(props, "renderSuffix"),
      renderSwitcherIconRef: toRef(props, "renderSwitcherIcon"),
      labelFieldRef: toRef(props, "labelField"),
      multipleRef: toRef(props, "multiple"),
      overrideDefaultNodeClickBehaviorRef: toRef(props, "overrideDefaultNodeClickBehavior"),
      spinPropsRef: toRef(props, "spinProps"),
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
      if (typeof options === "number") virtualListInstRef.value?.scrollTo(options, y || 0);else virtualListInstRef.value?.scrollTo(options);
    }
    const exposedMethods = {
      handleKeydown,
      scrollTo,
      getCheckedData: () => {
        if (!props.checkable) return {
          keys: [],
          options: []
        };
        const {
          checkedKeys
        } = checkedStatusRef.value;
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
        const {
          indeterminateKeys
        } = checkedStatusRef.value;
        return {
          keys: indeterminateKeys,
          options: getOptionsByKeys(indeterminateKeys)
        };
      }
    };
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          fontSize,
          nodeBorderRadius,
          nodeColorHover,
          nodeColorPressed,
          nodeColorActive,
          arrowColor,
          loadingColor,
          nodeTextColor,
          nodeTextColorDisabled,
          dropMarkColor,
          nodeWrapperPadding,
          nodeHeight,
          lineHeight,
          lineColor
        }
      } = themeRef.value;
      const lineOffsetTop = getPadding(nodeWrapperPadding, "top");
      const lineOffsetBottom = getPadding(nodeWrapperPadding, "bottom");
      const nodeContentHeight = pxfy(depx(nodeHeight) - depx(lineOffsetTop) - depx(lineOffsetBottom));
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
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("tree", void 0, cssVarsRef, props) : void 0;
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
    const {
      fNodes,
      internalRenderEmpty
    } = this;
    if (!fNodes.length && internalRenderEmpty) return internalRenderEmpty();
    const {
      mergedClsPrefix,
      blockNode,
      blockLine,
      draggable,
      disabled,
      ellipsis,
      internalFocusable,
      checkable,
      handleKeydown,
      rtlEnabled,
      handleFocusout,
      scrollbarProps
    } = this;
    const mergedFocusable = internalFocusable && !disabled;
    const tabindex = mergedFocusable ? "0" : void 0;
    const treeClass = [`${mergedClsPrefix}-tree`, rtlEnabled && `${mergedClsPrefix}-tree--rtl`, checkable && `${mergedClsPrefix}-tree--checkable`, (blockLine || blockNode) && `${mergedClsPrefix}-tree--block-node`, blockLine && `${mergedClsPrefix}-tree--block-line`, ellipsis && `${mergedClsPrefix}-tree--ellipsis`];
    const createNode = tmNode => {
      return "__motion" in tmNode ? (openBlock(), createBlock(MotionWrapper_default, {
        key: 1,
        height: tmNode.height,
        nodes: tmNode.nodes,
        clsPrefix: mergedClsPrefix,
        mode: tmNode.mode,
        onAfterEnter: this.handleAfterEnter
      }, null, 8, ["height", "nodes", "clsPrefix", "mode", "onAfterEnter"])) : (openBlock(), createBlock(TreeNode$1, {
        key: tmNode.key,
        tmNode,
        clsPrefix: mergedClsPrefix
      }, null, 8, ["tmNode", "clsPrefix"]));
    };
    if (this.virtualScroll) {
      const {
        mergedTheme,
        internalScrollablePadding
      } = this;
      const padding = getPadding(internalScrollablePadding || "0");
      return openBlock(), createBlock(XScrollbar, mergeProps({
        key: 3
      }, scrollbarProps, {
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
      }), {
        default: () => {
          this.onRender?.();
          return !fNodes.length ? resolveSlot(this.$slots.empty, () => {
            return [this.mergedRenderEmpty?.() || (openBlock(), createBlock(Empty_default, {
              class: normalizeClass$1(`${mergedClsPrefix}-tree__empty`),
              theme: this.mergedTheme.peers.Empty,
              themeOverrides: this.mergedTheme.peerOverrides.Empty
            }, null, 8, ["class", "theme", "themeOverrides"]))];
          }) : (openBlock(), createBlock(VVirtualList, {
            key: 4,
            ref: "virtualListInstRef",
            items: this.fNodes,
            itemSize: depx(mergedTheme.self.nodeHeight),
            ignoreItemResize: this.aip,
            paddingTop: padding.top,
            paddingBottom: padding.bottom,
            class: normalizeClass$1(this.themeClass),
            style: normalizeStyle([this.cssVars, {
              paddingLeft: padding.left,
              paddingRight: padding.right
            }]),
            onScroll: this.handleScroll,
            onResize: this.handleResize,
            showScrollbar: false,
            itemResizable: true
          }, {
            default: ({
              item
            }) => createNode(item)
          }, 1032, ["items", "itemSize", "ignoreItemResize", "paddingTop", "paddingBottom", "class", "style", "onScroll", "onResize"]));
        }
      }, 1040, ["onDragleave", "container", "content", "class", "theme", "themeOverrides", "tabindex", "onKeydown", "onFocusout"]);
    }
    const {
      internalScrollable
    } = this;
    treeClass.push(this.themeClass);
    this.onRender?.();
    if (internalScrollable) return openBlock(), createBlock(XScrollbar, mergeProps({
      key: 5
    }, scrollbarProps, {
      class: treeClass,
      tabindex,
      onKeydown: mergedFocusable ? handleKeydown : void 0,
      onFocusout: mergedFocusable ? handleFocusout : void 0,
      style: this.cssVars,
      contentStyle: {
        padding: this.internalScrollablePadding
      }
    }), {
      default: () => (openBlock(), createElementBlock("div", {
        onDragleave: draggable ? this.handleDragLeaveTree : void 0,
        ref: "selfElRef"
      }, [normalizeVNode(() => this.fNodes.map(createNode))], 40, _hoisted_1))
    }, 1040, ["class", "tabindex", "onKeydown", "onFocusout", "style", "contentStyle"]);else return openBlock(), createElementBlock("div", {
      key: 6,
      class: normalizeClass$1(treeClass),
      tabindex,
      ref: "selfElRef",
      style: normalizeStyle(this.cssVars),
      onKeydown: mergedFocusable ? handleKeydown : void 0,
      onFocusout: mergedFocusable ? handleFocusout : void 0,
      onDragleave: draggable ? this.handleDragLeaveTree : void 0
    }, [!fNodes.length ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => resolveSlot(this.$slots.empty, () => {
      return [this.mergedRenderEmpty?.() || (openBlock(), createBlock(Empty_default, {
        class: normalizeClass$1(`${mergedClsPrefix}-tree__empty`),
        theme: this.mergedTheme.peers.Empty,
        themeOverrides: this.mergedTheme.peerOverrides.Empty
      }, null, 8, ["class", "theme", "themeOverrides"]))];
    }))], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => fNodes.map(createNode))], 64))], 46, _hoisted_2);
  }
});
//#endregion
export { createTreeMateOptions, Tree_default as default, treeProps, treeSharedProps };