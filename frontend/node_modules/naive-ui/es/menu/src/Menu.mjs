import { call } from "../../_utils/vue/call.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import menuLight from "../styles/light.mjs";
import { layoutSiderInjectionKey } from "../../layout/src/interface.mjs";
import { menuInjectionKey } from "./context.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { isIgnoredNode, itemRenderer } from "./utils.mjs";
import { NSubmenu } from "./Submenu.mjs";
import { useCheckDeprecated } from "./useCheckDeprecated.mjs";
import { createId } from "seemly";
import { computed, createBlock, defineComponent, h, inject, mergeProps, openBlock, provide, ref, toRef, watchEffect } from "vue";
import { useCompitable, useMergedState } from "vooks";
import { VOverflow, VResizeObserver } from "vueuc";
import { createTreeMate } from "treemate";
//#region src/menu/src/Menu.tsx
const menuProps = {
  ...useTheme.props,
  options: {
    type: Array,
    default: () => []
  },
  collapsed: {
    type: Boolean,
    default: void 0
  },
  collapsedWidth: {
    type: Number,
    default: 48
  },
  iconSize: {
    type: Number,
    default: 20
  },
  collapsedIconSize: {
    type: Number,
    default: 24
  },
  rootIndent: Number,
  indent: {
    type: Number,
    default: 32
  },
  labelField: {
    type: String,
    default: "label"
  },
  keyField: {
    type: String,
    default: "key"
  },
  childrenField: {
    type: String,
    default: "children"
  },
  disabledField: {
    type: String,
    default: "disabled"
  },
  defaultExpandAll: Boolean,
  defaultExpandedKeys: Array,
  expandedKeys: Array,
  value: [String, Number],
  defaultValue: {
    type: [String, Number],
    default: null
  },
  mode: {
    type: String,
    default: "vertical"
  },
  watchProps: {
    type: Array,
    default: void 0
  },
  disabled: Boolean,
  show: {
    type: Boolean,
    default: true
  },
  inverted: Boolean,
  "onUpdate:expandedKeys": [Function, Array],
  onUpdateExpandedKeys: [Function, Array],
  onUpdateValue: [Function, Array],
  "onUpdate:value": [Function, Array],
  expandIcon: Function,
  renderIcon: Function,
  renderLabel: Function,
  renderExtra: Function,
  dropdownProps: Object,
  accordion: Boolean,
  nodeProps: Function,
  dropdownPlacement: {
    type: String,
    default: "bottom"
  },
  responsive: Boolean,
  items: Array,
  onOpenNamesChange: [Function, Array],
  onSelect: [Function, Array],
  onExpandedNamesChange: [Function, Array],
  expandedNames: Array,
  defaultExpandedNames: Array
};
var Menu_default = defineComponent({
  name: "Menu",
  inheritAttrs: false,
  props: menuProps,
  setup(props) {
    if (process.env.NODE_ENV !== "production") useCheckDeprecated(props);
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Menu", "-menu", index_cssr_default, menuLight, props, mergedClsPrefixRef);
    const layoutSider = inject(layoutSiderInjectionKey, null);
    const mergedCollapsedRef = computed(() => {
      const {
        collapsed
      } = props;
      if (collapsed !== void 0) return collapsed;
      if (layoutSider) {
        const {
          collapseModeRef,
          collapsedRef
        } = layoutSider;
        if (collapseModeRef.value === "width") return collapsedRef.value ?? false;
      }
      return false;
    });
    const treeMateRef = computed(() => {
      const {
        keyField,
        childrenField,
        disabledField
      } = props;
      return createTreeMate(props.items || props.options, {
        getIgnored(node) {
          return isIgnoredNode(node);
        },
        getChildren(node) {
          return node[childrenField];
        },
        getDisabled(node) {
          return node[disabledField];
        },
        getKey(node) {
          return node[keyField] ?? node.name;
        }
      });
    });
    const treeKeysLevelOneRef = computed(() => new Set(treeMateRef.value.treeNodes.map(e => e.key)));
    const {
      watchProps
    } = props;
    const uncontrolledValueRef = ref(null);
    if (watchProps?.includes("defaultValue")) watchEffect(() => {
      uncontrolledValueRef.value = props.defaultValue;
    });else uncontrolledValueRef.value = props.defaultValue;
    const controlledValueRef = toRef(props, "value");
    const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
    const uncontrolledExpandedKeysRef = ref([]);
    const initUncontrolledExpandedKeys = () => {
      uncontrolledExpandedKeysRef.value = props.defaultExpandAll ? treeMateRef.value.getNonLeafKeys() : props.defaultExpandedNames || props.defaultExpandedKeys || treeMateRef.value.getPath(mergedValueRef.value, {
        includeSelf: false
      }).keyPath;
    };
    if (watchProps?.includes("defaultExpandedKeys")) watchEffect(initUncontrolledExpandedKeys);else initUncontrolledExpandedKeys();
    const controlledExpandedKeysRef = useCompitable(props, ["expandedNames", "expandedKeys"]);
    const mergedExpandedKeysRef = useMergedState(controlledExpandedKeysRef, uncontrolledExpandedKeysRef);
    const tmNodesRef = computed(() => treeMateRef.value.treeNodes);
    const activePathRef = computed(() => {
      return treeMateRef.value.getPath(mergedValueRef.value).keyPath;
    });
    provide(menuInjectionKey, {
      props,
      mergedCollapsedRef,
      mergedThemeRef: themeRef,
      mergedValueRef,
      mergedExpandedKeysRef,
      activePathRef,
      mergedClsPrefixRef,
      isHorizontalRef: computed(() => props.mode === "horizontal"),
      invertedRef: toRef(props, "inverted"),
      doSelect,
      toggleExpand
    });
    function doSelect(value, item) {
      const {
        "onUpdate:value": _onUpdateValue,
        onUpdateValue,
        onSelect
      } = props;
      if (onUpdateValue) call(onUpdateValue, value, item);
      if (_onUpdateValue) call(_onUpdateValue, value, item);
      if (onSelect) call(onSelect, value, item);
      uncontrolledValueRef.value = value;
    }
    function doUpdateExpandedKeys(value) {
      const {
        "onUpdate:expandedKeys": _onUpdateExpandedKeys,
        onUpdateExpandedKeys,
        onExpandedNamesChange,
        onOpenNamesChange
      } = props;
      if (_onUpdateExpandedKeys) call(_onUpdateExpandedKeys, value);
      if (onUpdateExpandedKeys) call(onUpdateExpandedKeys, value);
      if (onExpandedNamesChange) call(onExpandedNamesChange, value);
      if (onOpenNamesChange) call(onOpenNamesChange, value);
      uncontrolledExpandedKeysRef.value = value;
    }
    function toggleExpand(key) {
      const currentExpandedKeys = Array.from(mergedExpandedKeysRef.value);
      const index = currentExpandedKeys.findIndex(expanededKey => expanededKey === key);
      if (~index) currentExpandedKeys.splice(index, 1);else {
        if (props.accordion) {
          if (treeKeysLevelOneRef.value.has(key)) {
            const closeKeyIndex = currentExpandedKeys.findIndex(e => treeKeysLevelOneRef.value.has(e));
            if (closeKeyIndex > -1) currentExpandedKeys.splice(closeKeyIndex, 1);
          }
        }
        currentExpandedKeys.push(key);
      }
      doUpdateExpandedKeys(currentExpandedKeys);
    }
    const showOption = key => {
      const selectedKeyPath = treeMateRef.value.getPath(key ?? mergedValueRef.value, {
        includeSelf: false
      }).keyPath;
      if (!selectedKeyPath.length) return;
      const currentExpandedKeys = Array.from(mergedExpandedKeysRef.value);
      const nextExpandedKeys = /* @__PURE__ */new Set([...currentExpandedKeys, ...selectedKeyPath]);
      if (props.accordion) treeKeysLevelOneRef.value.forEach(firstLevelKey => {
        if (nextExpandedKeys.has(firstLevelKey) && !selectedKeyPath.includes(firstLevelKey)) nextExpandedKeys.delete(firstLevelKey);
      });
      doUpdateExpandedKeys(Array.from(nextExpandedKeys));
    };
    const cssVarsRef = computed(() => {
      const {
        inverted
      } = props;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self
      } = themeRef.value;
      const {
        borderRadius,
        borderColorHorizontal,
        fontSize,
        itemHeight,
        dividerColor
      } = self;
      const vars = {
        "--n-divider-color": dividerColor,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-font-size": fontSize,
        "--n-border-color-horizontal": borderColorHorizontal,
        "--n-border-radius": borderRadius,
        "--n-item-height": itemHeight
      };
      if (inverted) {
        vars["--n-group-text-color"] = self.groupTextColorInverted;
        vars["--n-color"] = self.colorInverted;
        vars["--n-item-text-color"] = self.itemTextColorInverted;
        vars["--n-item-text-color-hover"] = self.itemTextColorHoverInverted;
        vars["--n-item-text-color-active"] = self.itemTextColorActiveInverted;
        vars["--n-item-text-color-child-active"] = self.itemTextColorChildActiveInverted;
        vars["--n-item-text-color-child-active-hover"] = self.itemTextColorChildActiveInverted;
        vars["--n-item-text-color-active-hover"] = self.itemTextColorActiveHoverInverted;
        vars["--n-item-icon-color"] = self.itemIconColorInverted;
        vars["--n-item-icon-color-hover"] = self.itemIconColorHoverInverted;
        vars["--n-item-icon-color-active"] = self.itemIconColorActiveInverted;
        vars["--n-item-icon-color-active-hover"] = self.itemIconColorActiveHoverInverted;
        vars["--n-item-icon-color-child-active"] = self.itemIconColorChildActiveInverted;
        vars["--n-item-icon-color-child-active-hover"] = self.itemIconColorChildActiveHoverInverted;
        vars["--n-item-icon-color-collapsed"] = self.itemIconColorCollapsedInverted;
        vars["--n-item-text-color-horizontal"] = self.itemTextColorHorizontalInverted;
        vars["--n-item-text-color-hover-horizontal"] = self.itemTextColorHoverHorizontalInverted;
        vars["--n-item-text-color-active-horizontal"] = self.itemTextColorActiveHorizontalInverted;
        vars["--n-item-text-color-child-active-horizontal"] = self.itemTextColorChildActiveHorizontalInverted;
        vars["--n-item-text-color-child-active-hover-horizontal"] = self.itemTextColorChildActiveHoverHorizontalInverted;
        vars["--n-item-text-color-active-hover-horizontal"] = self.itemTextColorActiveHoverHorizontalInverted;
        vars["--n-item-icon-color-horizontal"] = self.itemIconColorHorizontalInverted;
        vars["--n-item-icon-color-hover-horizontal"] = self.itemIconColorHoverHorizontalInverted;
        vars["--n-item-icon-color-active-horizontal"] = self.itemIconColorActiveHorizontalInverted;
        vars["--n-item-icon-color-active-hover-horizontal"] = self.itemIconColorActiveHoverHorizontalInverted;
        vars["--n-item-icon-color-child-active-horizontal"] = self.itemIconColorChildActiveHorizontalInverted;
        vars["--n-item-icon-color-child-active-hover-horizontal"] = self.itemIconColorChildActiveHoverHorizontalInverted;
        vars["--n-arrow-color"] = self.arrowColorInverted;
        vars["--n-arrow-color-hover"] = self.arrowColorHoverInverted;
        vars["--n-arrow-color-active"] = self.arrowColorActiveInverted;
        vars["--n-arrow-color-active-hover"] = self.arrowColorActiveHoverInverted;
        vars["--n-arrow-color-child-active"] = self.arrowColorChildActiveInverted;
        vars["--n-arrow-color-child-active-hover"] = self.arrowColorChildActiveHoverInverted;
        vars["--n-item-color-hover"] = self.itemColorHoverInverted;
        vars["--n-item-color-active"] = self.itemColorActiveInverted;
        vars["--n-item-color-active-hover"] = self.itemColorActiveHoverInverted;
        vars["--n-item-color-active-collapsed"] = self.itemColorActiveCollapsedInverted;
      } else {
        vars["--n-group-text-color"] = self.groupTextColor;
        vars["--n-color"] = self.color;
        vars["--n-item-text-color"] = self.itemTextColor;
        vars["--n-item-text-color-hover"] = self.itemTextColorHover;
        vars["--n-item-text-color-active"] = self.itemTextColorActive;
        vars["--n-item-text-color-child-active"] = self.itemTextColorChildActive;
        vars["--n-item-text-color-child-active-hover"] = self.itemTextColorChildActiveHover;
        vars["--n-item-text-color-active-hover"] = self.itemTextColorActiveHover;
        vars["--n-item-icon-color"] = self.itemIconColor;
        vars["--n-item-icon-color-hover"] = self.itemIconColorHover;
        vars["--n-item-icon-color-active"] = self.itemIconColorActive;
        vars["--n-item-icon-color-active-hover"] = self.itemIconColorActiveHover;
        vars["--n-item-icon-color-child-active"] = self.itemIconColorChildActive;
        vars["--n-item-icon-color-child-active-hover"] = self.itemIconColorChildActiveHover;
        vars["--n-item-icon-color-collapsed"] = self.itemIconColorCollapsed;
        vars["--n-item-text-color-horizontal"] = self.itemTextColorHorizontal;
        vars["--n-item-text-color-hover-horizontal"] = self.itemTextColorHoverHorizontal;
        vars["--n-item-text-color-active-horizontal"] = self.itemTextColorActiveHorizontal;
        vars["--n-item-text-color-child-active-horizontal"] = self.itemTextColorChildActiveHorizontal;
        vars["--n-item-text-color-child-active-hover-horizontal"] = self.itemTextColorChildActiveHoverHorizontal;
        vars["--n-item-text-color-active-hover-horizontal"] = self.itemTextColorActiveHoverHorizontal;
        vars["--n-item-icon-color-horizontal"] = self.itemIconColorHorizontal;
        vars["--n-item-icon-color-hover-horizontal"] = self.itemIconColorHoverHorizontal;
        vars["--n-item-icon-color-active-horizontal"] = self.itemIconColorActiveHorizontal;
        vars["--n-item-icon-color-active-hover-horizontal"] = self.itemIconColorActiveHoverHorizontal;
        vars["--n-item-icon-color-child-active-horizontal"] = self.itemIconColorChildActiveHorizontal;
        vars["--n-item-icon-color-child-active-hover-horizontal"] = self.itemIconColorChildActiveHoverHorizontal;
        vars["--n-arrow-color"] = self.arrowColor;
        vars["--n-arrow-color-hover"] = self.arrowColorHover;
        vars["--n-arrow-color-active"] = self.arrowColorActive;
        vars["--n-arrow-color-active-hover"] = self.arrowColorActiveHover;
        vars["--n-arrow-color-child-active"] = self.arrowColorChildActive;
        vars["--n-arrow-color-child-active-hover"] = self.arrowColorChildActiveHover;
        vars["--n-item-color-hover"] = self.itemColorHover;
        vars["--n-item-color-active"] = self.itemColorActive;
        vars["--n-item-color-active-hover"] = self.itemColorActiveHover;
        vars["--n-item-color-active-collapsed"] = self.itemColorActiveCollapsed;
      }
      return vars;
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("menu", computed(() => props.inverted ? "a" : "b"), cssVarsRef, props) : void 0;
    const ellipsisNodeId = createId();
    const overflowRef = ref(null);
    const counterRef = ref(null);
    let isFirstResize = true;
    const onResize = () => {
      if (isFirstResize) isFirstResize = false;else overflowRef.value?.sync({
        showAllItemsBeforeCalculate: true
      });
    };
    function getCounter() {
      return document.getElementById(ellipsisNodeId);
    }
    const ellipsisFromIndexRef = ref(-1);
    function onUpdateCount(count) {
      ellipsisFromIndexRef.value = props.options.length - count;
    }
    function onUpdateOverflow(overflow) {
      if (!overflow) ellipsisFromIndexRef.value = -1;
    }
    const ellipsisOptionRef = computed(() => {
      const ellipsisFromIndex = ellipsisFromIndexRef.value;
      return {
        children: ellipsisFromIndex === -1 ? [] : props.options.slice(ellipsisFromIndex)
      };
    });
    const ellipsisTreeMateRef = computed(() => {
      const {
        childrenField,
        disabledField,
        keyField
      } = props;
      return createTreeMate([ellipsisOptionRef.value], {
        getIgnored(node) {
          return isIgnoredNode(node);
        },
        getChildren(node) {
          return node[childrenField];
        },
        getDisabled(node) {
          return node[disabledField];
        },
        getKey(node) {
          return node[keyField] ?? node.name;
        }
      });
    });
    const emptyTmNodeRef = computed(() => {
      return createTreeMate([{}]).treeNodes[0];
    });
    function renderCounter() {
      if (ellipsisFromIndexRef.value === -1) return openBlock(), createBlock(NSubmenu, {
        root: true,
        level: 0,
        key: "__ellpisisGroupPlaceholder__",
        internalKey: "__ellpisisGroupPlaceholder__",
        title: "···",
        tmNode: emptyTmNodeRef.value,
        domId: ellipsisNodeId,
        isEllipsisPlaceholder: true
      }, null, 8, ["tmNode", "domId"]);
      const tmNode = ellipsisTreeMateRef.value.treeNodes[0];
      const activePath = activePathRef.value;
      const childActive = !!tmNode.children?.some(tmNode => {
        return activePath.includes(tmNode.key);
      });
      return openBlock(), createBlock(NSubmenu, {
        level: 0,
        root: true,
        key: "__ellpisisGroup__",
        internalKey: "__ellpisisGroup__",
        title: "···",
        virtualChildActive: childActive,
        tmNode,
        domId: ellipsisNodeId,
        rawNodes: tmNode.rawNode.children || [],
        tmNodes: tmNode.children || [],
        isEllipsisPlaceholder: true
      }, null, 8, ["virtualChildActive", "tmNode", "domId", "rawNodes", "tmNodes"]);
    }
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      controlledExpandedKeys: controlledExpandedKeysRef,
      uncontrolledExpanededKeys: uncontrolledExpandedKeysRef,
      mergedExpandedKeys: mergedExpandedKeysRef,
      uncontrolledValue: uncontrolledValueRef,
      mergedValue: mergedValueRef,
      activePath: activePathRef,
      tmNodes: tmNodesRef,
      mergedTheme: themeRef,
      mergedCollapsed: mergedCollapsedRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      overflowRef,
      counterRef,
      updateCounter: () => {},
      onResize,
      onUpdateOverflow,
      onUpdateCount,
      renderCounter,
      getCounter,
      onRender: themeClassHandle?.onRender,
      showOption,
      deriveResponsiveState: onResize
    };
  },
  render() {
    const {
      mergedClsPrefix,
      mode,
      themeClass,
      onRender
    } = this;
    onRender?.();
    const renderMenuItemNodes = () => this.tmNodes.map(tmNode => itemRenderer(tmNode, this.$props));
    const finalResponsive = mode === "horizontal" && this.responsive;
    const renderMainNode = () => h("div", mergeProps(this.$attrs, {
      role: mode === "horizontal" ? "menubar" : "menu",
      class: [`${mergedClsPrefix}-menu`, themeClass, `${mergedClsPrefix}-menu--${mode}`, finalResponsive && `${mergedClsPrefix}-menu--responsive`, this.mergedCollapsed && `${mergedClsPrefix}-menu--collapsed`],
      style: this.cssVars
    }), finalResponsive ? (openBlock(), createBlock(VOverflow, {
      key: 2,
      ref: "overflowRef",
      onUpdateOverflow: this.onUpdateOverflow,
      getCounter: this.getCounter,
      onUpdateCount: this.onUpdateCount,
      updateCounter: this.updateCounter,
      style: {
        width: "100%",
        display: "flex",
        overflow: "hidden"
      }
    }, {
      default: renderMenuItemNodes,
      counter: this.renderCounter
    }, 1032, ["onUpdateOverflow", "getCounter", "onUpdateCount", "updateCounter"])) : renderMenuItemNodes());
    return finalResponsive ? (openBlock(), createBlock(VResizeObserver, {
      key: 3,
      onResize: this.onResize
    }, {
      default: renderMainNode
    }, 1032, ["onResize"])) : renderMainNode();
  }
});
//#endregion
export { Menu_default as default, menuProps };