import { createDataKey } from "../../_utils/vue/create-data-key.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { renderDropMark } from "./dnd.mjs";
import { treeInjectionKey } from "./interface.mjs";
import TreeNodeCheckbox_default from "./TreeNodeCheckbox.mjs";
import TreeNodeContent_default from "./TreeNodeContent.mjs";
import TreeNodeSwitcher_default from "./TreeNodeSwitcher.mjs";
import { isNodeDisabled } from "./utils.mjs";
import { happensIn, repeat } from "seemly";
import { Fragment, computed, createBlock, createElementBlock, createElementVNode, defineComponent, inject, mergeProps, normalizeStyle, onMounted, openBlock, ref } from "vue";
import { useMemo } from "vooks";
//#region src/tree/src/TreeNode.tsx
const _hoisted_1 = ["data-key", "draggable", "onClick", "onDragstart"];
const TreeNode = defineComponent({
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
    const NTree = inject(treeInjectionKey);
    const {
      droppingNodeParentRef,
      droppingMouseNodeRef,
      draggingNodeRef,
      droppingPositionRef,
      droppingOffsetLevelRef,
      nodePropsRef,
      indentRef,
      blockLineRef,
      checkboxPlacementRef,
      checkOnClickRef,
      disabledFieldRef,
      showLineRef,
      renderSwitcherIconRef,
      overrideDefaultNodeClickBehaviorRef
    } = NTree;
    const checkboxDisabledRef = useMemo(() => !!props.tmNode.rawNode.checkboxDisabled);
    const nodeIsDisabledRef = useMemo(() => {
      return isNodeDisabled(props.tmNode, disabledFieldRef.value);
    });
    const disabledRef = useMemo(() => NTree.disabledRef.value || nodeIsDisabledRef.value);
    const resolvedNodePropsRef = computed(() => {
      const {
        value: nodeProps
      } = nodePropsRef;
      if (!nodeProps) return void 0;
      return nodeProps({
        option: props.tmNode.rawNode
      });
    });
    const contentInstRef = ref(null);
    const contentElRef = {
      value: null
    };
    onMounted(() => {
      contentElRef.value = contentInstRef.value.$el;
    });
    function handleSwitcherClick() {
      const callback = () => {
        const {
          tmNode
        } = props;
        if (!tmNode.isLeaf && !tmNode.shallowLoaded) {
          if (!NTree.loadingKeysRef.value.has(tmNode.key)) NTree.loadingKeysRef.value.add(tmNode.key);else return;
          const {
            onLoadRef: {
              value: onLoad
            }
          } = NTree;
          if (onLoad) onLoad(tmNode.rawNode).then(value => {
            if (value !== false) NTree.handleSwitcherClick(tmNode);
          }).finally(() => {
            NTree.loadingKeysRef.value.delete(tmNode.key);
          });
        } else NTree.handleSwitcherClick(tmNode);
      };
      if (renderSwitcherIconRef.value) setTimeout(callback, 0);else callback();
    }
    const selectableRef = useMemo(() => !nodeIsDisabledRef.value && NTree.selectableRef.value && (NTree.internalTreeSelect ? NTree.mergedCheckStrategyRef.value !== "child" || NTree.multipleRef.value && NTree.cascadeRef.value || props.tmNode.isLeaf : true));
    const checkableRef = useMemo(() => NTree.checkableRef.value && (NTree.cascadeRef.value || NTree.mergedCheckStrategyRef.value !== "child" || props.tmNode.isLeaf));
    const checkedRef = useMemo(() => NTree.displayedCheckedKeysRef.value.includes(props.tmNode.key));
    const mergedCheckOnClickRef = useMemo(() => {
      const {
        value: checkable
      } = checkableRef;
      if (!checkable) return false;
      const {
        value: checkOnClick
      } = checkOnClickRef;
      const {
        tmNode
      } = props;
      if (typeof checkOnClick === "boolean") return !tmNode.disabled && checkOnClick;
      return checkOnClick(props.tmNode.rawNode);
    });
    function _handleClick(e) {
      const {
        value: expandOnClick
      } = NTree.expandOnClickRef;
      const {
        value: selectable
      } = selectableRef;
      const {
        value: mergedCheckOnClick
      } = mergedCheckOnClickRef;
      if (!selectable && !expandOnClick && !mergedCheckOnClick) return;
      if (happensIn(e, "checkbox") || happensIn(e, "switcher")) return;
      const {
        tmNode
      } = props;
      if (selectable) NTree.handleSelect(tmNode);
      if (expandOnClick && !tmNode.isLeaf) handleSwitcherClick();
      if (mergedCheckOnClick) handleCheck(!checkedRef.value);
    }
    function handleNodeClick(e) {
      if (happensIn(e, "checkbox") || happensIn(e, "switcher")) return;
      if (!disabledRef.value) {
        const overrideDefaultNodeClickBehavior = overrideDefaultNodeClickBehaviorRef.value;
        let shouldOverride = false;
        if (overrideDefaultNodeClickBehavior) switch (overrideDefaultNodeClickBehavior({
          option: props.tmNode.rawNode
        })) {
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
    const indentNodes = computed(() => {
      const {
        clsPrefix
      } = props;
      const {
        value: indent
      } = indentRef;
      if (showLineRef.value) {
        const indentNodes = [];
        let cursor = props.tmNode.parent;
        while (cursor) {
          if (cursor.isLastChild) indentNodes.push((openBlock(), createElementBlock("div", {
            key: 1,
            class: normalizeClass$1(`${clsPrefix}-tree-node-indent`)
          }, [createElementVNode("div", {
            style: normalizeStyle({
              width: `${indent}px`
            })
          }, null, 4)], 2)));else indentNodes.push((openBlock(), createElementBlock("div", {
            key: 2,
            class: normalizeClass$1([`${clsPrefix}-tree-node-indent`, `${clsPrefix}-tree-node-indent--show-line`])
          }, [createElementVNode("div", {
            style: normalizeStyle({
              width: `${indent}px`
            })
          }, null, 4)], 2)));
          cursor = cursor.parent;
        }
        return indentNodes.reverse();
      } else return repeat(props.tmNode.level, (openBlock(), createElementBlock("div", {
        key: 3,
        class: normalizeClass$1(`${props.clsPrefix}-tree-node-indent`)
      }, [createElementVNode("div", {
        style: normalizeStyle({
          width: `${indent}px`
        })
      }, null, 4)], 2)));
    });
    return {
      showDropMark: useMemo(() => {
        const {
          value: draggingNode
        } = draggingNodeRef;
        if (!draggingNode) return;
        const {
          value: droppingPosition
        } = droppingPositionRef;
        if (!droppingPosition) return;
        const {
          value: droppingMouseNode
        } = droppingMouseNodeRef;
        if (!droppingMouseNode) return;
        const {
          tmNode
        } = props;
        if (tmNode.key === droppingMouseNode.key) return true;
        return false;
      }),
      showDropMarkAsParent: useMemo(() => {
        const {
          value: droppingNodeParent
        } = droppingNodeParentRef;
        if (!droppingNodeParent) return false;
        const {
          tmNode
        } = props;
        const {
          value: droppingPosition
        } = droppingPositionRef;
        if (droppingPosition === "before" || droppingPosition === "after") return droppingNodeParent.key === tmNode.key;
        return false;
      }),
      pending: useMemo(() => NTree.pendingNodeKeyRef.value === props.tmNode.key),
      loading: useMemo(() => NTree.loadingKeysRef.value.has(props.tmNode.key)),
      highlight: useMemo(() => {
        return NTree.highlightKeySetRef.value?.has(props.tmNode.key);
      }),
      checked: checkedRef,
      indeterminate: useMemo(() => NTree.displayedIndeterminateKeysRef.value.includes(props.tmNode.key)),
      selected: useMemo(() => NTree.mergedSelectedKeysRef.value.includes(props.tmNode.key)),
      expanded: useMemo(() => NTree.mergedExpandedKeysRef.value.includes(props.tmNode.key)),
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
    const {
      tmNode,
      clsPrefix,
      checkable,
      expandOnClick,
      selectable,
      selected,
      checked,
      highlight,
      draggable,
      blockLine,
      indent,
      indentNodes,
      disabled,
      pending,
      internalScrollable,
      nodeProps,
      checkboxPlacement
    } = this;
    const dragEventHandlers = draggable && !disabled ? {
      onDragenter: this.handleDragEnter,
      onDragleave: this.handleDragLeave,
      onDragend: this.handleDragEnd,
      onDrop: this.handleDrop,
      onDragover: this.handleDragOver
    } : void 0;
    const dataKey = internalScrollable ? createDataKey(tmNode.key) : void 0;
    const checkboxOnRight = checkboxPlacement === "right";
    const checkboxNode = checkable ? (openBlock(), createBlock(TreeNodeCheckbox_default, {
      key: 4,
      indent,
      right: checkboxOnRight,
      focusable: this.checkboxFocusable,
      disabled: disabled || this.checkboxDisabled,
      clsPrefix,
      checked: this.checked,
      indeterminate: this.indeterminate,
      onCheck: this.handleCheck
    }, null, 8, ["indent", "right", "focusable", "disabled", "clsPrefix", "checked", "indeterminate", "onCheck"])) : null;
    return openBlock(), createElementBlock("div", mergeProps({
      class: `${clsPrefix}-tree-node-wrapper`
    }, dragEventHandlers), [createElementVNode("div", mergeProps(blockLine ? nodeProps : void 0, {
      class: [`${clsPrefix}-tree-node`, {
        [`${clsPrefix}-tree-node--selected`]: selected,
        [`${clsPrefix}-tree-node--checkable`]: checkable,
        [`${clsPrefix}-tree-node--highlight`]: highlight,
        [`${clsPrefix}-tree-node--pending`]: pending,
        [`${clsPrefix}-tree-node--disabled`]: disabled,
        [`${clsPrefix}-tree-node--selectable`]: selectable,
        [`${clsPrefix}-tree-node--clickable`]: selectable || expandOnClick || this.mergedCheckOnClick
      }, nodeProps?.class],
      "data-key": dataKey,
      draggable: draggable && blockLine,
      onClick: this.handleLineClick,
      onDragstart: draggable && blockLine && !disabled ? this.handleDragStart : void 0
    }), [normalizeVNode(() => indentNodes), tmNode.isLeaf && this.showLine ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1([`${clsPrefix}-tree-node-indent`, `${clsPrefix}-tree-node-indent--show-line`, tmNode.isLeaf && `${clsPrefix}-tree-node-indent--is-leaf`, tmNode.isLastChild && `${clsPrefix}-tree-node-indent--last-child`])
    }, [createElementVNode("div", {
      style: normalizeStyle({
        width: `${indent}px`
      })
    }, null, 4)], 2)) : (openBlock(), createBlock(TreeNodeSwitcher_default, {
      key: 1,
      clsPrefix,
      expanded: this.expanded,
      selected,
      loading: this.loading,
      hide: tmNode.isLeaf,
      tmNode: this.tmNode,
      indent,
      onClick: this.handleSwitcherClick
    }, null, 8, ["clsPrefix", "expanded", "selected", "loading", "hide", "tmNode", "indent", "onClick"])), !checkboxOnRight ? (openBlock(), createElementBlock(Fragment, {
      key: 2
    }, [normalizeVNode(() => checkboxNode)], 64)) : normalizeVNode(() => null), (openBlock(), createBlock(TreeNodeContent_default, {
      ref: "contentInstRef",
      clsPrefix,
      checked,
      selected,
      onClick: this.handleContentClick,
      nodeProps: blockLine ? void 0 : nodeProps,
      onDragstart: draggable && !blockLine && !disabled ? this.handleDragStart : void 0,
      tmNode
    }, null, 8, ["clsPrefix", "checked", "selected", "onClick", "nodeProps", "onDragstart", "tmNode"])), draggable ? (openBlock(), createElementBlock(Fragment, {
      key: 4
    }, [this.showDropMark ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => renderDropMark({
      el: this.contentElRef.value,
      position: this.droppingPosition,
      offsetLevel: this.droppingOffsetLevel,
      indent
    }))], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [this.showDropMarkAsParent ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => renderDropMark({
      el: this.contentElRef.value,
      position: "inside",
      offsetLevel: this.droppingOffsetLevel,
      indent
    }))], 64)) : normalizeVNode(() => null)], 64))], 64)) : normalizeVNode(() => null), checkboxOnRight ? (openBlock(), createElementBlock(Fragment, {
      key: 6
    }, [normalizeVNode(() => checkboxNode)], 64)) : normalizeVNode(() => null)], 16, _hoisted_1)], 16);
  }
});
//#endregion
export { TreeNode as default };