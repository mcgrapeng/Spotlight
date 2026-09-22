import { createKey } from "../../_utils/cssr/index.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { createRefSetter } from "../../_utils/vue/create-ref-setter.mjs";
import { keep } from "../../_utils/vue/keep.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeSlot } from "../../vue-jsx-vapor/vdom.mjs";
import Popover_default, { popoverBaseProps } from "../../popover/src/Popover.mjs";
import dropdownLight from "../styles/light.mjs";
import { dropdownInjectionKey } from "./context.mjs";
import DropdownMenu_default from "./DropdownMenu.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { computed, createBlock, defineComponent, h, mergeProps, openBlock, provide, ref, toRef, watch } from "vue";
import { useKeyboard, useMemo, useMergedState } from "vooks";
import { createTreeMate } from "treemate";
//#region src/dropdown/src/Dropdown.tsx
const dropdownBaseProps = {
  animated: {
    type: Boolean,
    default: true
  },
  keyboard: {
    type: Boolean,
    default: true
  },
  size: String,
  inverted: Boolean,
  placement: {
    type: String,
    default: "bottom"
  },
  onSelect: [Function, Array],
  options: {
    type: Array,
    default: () => []
  },
  menuProps: Function,
  showArrow: Boolean,
  renderLabel: Function,
  renderIcon: Function,
  renderOption: Function,
  nodeProps: Function,
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
  value: [String, Number]
};
const popoverPropKeys = Object.keys(popoverBaseProps);
const dropdownProps = {
  ...popoverBaseProps,
  ...dropdownBaseProps,
  ...useTheme.props
};
var Dropdown_default = defineComponent({
  name: "Dropdown",
  inheritAttrs: false,
  props: dropdownProps,
  setup(props) {
    const uncontrolledShowRef = ref(false);
    const mergedShowRef = useMergedState(toRef(props, "show"), uncontrolledShowRef);
    const treemateRef = computed(() => {
      const {
        keyField,
        childrenField
      } = props;
      return createTreeMate(props.options, {
        getKey(node) {
          return node[keyField];
        },
        getDisabled(node) {
          return node.disabled === true;
        },
        getIgnored(node) {
          return node.type === "divider" || node.type === "render";
        },
        getChildren(node) {
          return node[childrenField];
        }
      });
    });
    const tmNodesRef = computed(() => {
      return treemateRef.value.treeNodes;
    });
    const hoverKeyRef = ref(null);
    const keyboardKeyRef = ref(null);
    const lastToggledSubmenuKeyRef = ref(null);
    const pendingKeyRef = computed(() => {
      return hoverKeyRef.value ?? keyboardKeyRef.value ?? lastToggledSubmenuKeyRef.value ?? null;
    });
    const pendingKeyPathRef = computed(() => treemateRef.value.getPath(pendingKeyRef.value).keyPath);
    const activeKeyPathRef = computed(() => treemateRef.value.getPath(props.value).keyPath);
    const keyboardEnabledRef = useMemo(() => {
      return props.keyboard && mergedShowRef.value;
    });
    useKeyboard({
      keydown: {
        ArrowUp: {
          prevent: true,
          handler: handleKeydownUp
        },
        ArrowRight: {
          prevent: true,
          handler: handleKeydownRight
        },
        ArrowDown: {
          prevent: true,
          handler: handleKeydownDown
        },
        ArrowLeft: {
          prevent: true,
          handler: handleKeydownLeft
        },
        Enter: {
          prevent: true,
          handler: handleKeydownEnter
        },
        Escape: handleKeydownEsc
      }
    }, keyboardEnabledRef);
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedComponentPropsRef
    } = useConfig(props);
    const mergedSizeRef = computed(() => {
      return props.size || mergedComponentPropsRef?.value?.Dropdown?.size || "medium";
    });
    const themeRef = useTheme("Dropdown", "-dropdown", index_cssr_default, dropdownLight, props, mergedClsPrefixRef);
    provide(dropdownInjectionKey, {
      labelFieldRef: toRef(props, "labelField"),
      childrenFieldRef: toRef(props, "childrenField"),
      renderLabelRef: toRef(props, "renderLabel"),
      renderIconRef: toRef(props, "renderIcon"),
      hoverKeyRef,
      keyboardKeyRef,
      lastToggledSubmenuKeyRef,
      pendingKeyPathRef,
      activeKeyPathRef,
      animatedRef: toRef(props, "animated"),
      mergedShowRef,
      nodePropsRef: toRef(props, "nodeProps"),
      renderOptionRef: toRef(props, "renderOption"),
      menuPropsRef: toRef(props, "menuProps"),
      doSelect,
      doUpdateShow
    });
    watch(mergedShowRef, value => {
      if (!props.animated && !value) clearPendingState();
    });
    function doSelect(key, node) {
      const {
        onSelect
      } = props;
      if (onSelect) call(onSelect, key, node);
    }
    function doUpdateShow(value) {
      const {
        "onUpdate:show": _onUpdateShow,
        onUpdateShow
      } = props;
      if (_onUpdateShow) call(_onUpdateShow, value);
      if (onUpdateShow) call(onUpdateShow, value);
      uncontrolledShowRef.value = value;
    }
    function clearPendingState() {
      hoverKeyRef.value = null;
      keyboardKeyRef.value = null;
      lastToggledSubmenuKeyRef.value = null;
    }
    function handleKeydownEsc() {
      doUpdateShow(false);
    }
    function handleKeydownLeft() {
      handleKeydown("left");
    }
    function handleKeydownRight() {
      handleKeydown("right");
    }
    function handleKeydownUp() {
      handleKeydown("up");
    }
    function handleKeydownDown() {
      handleKeydown("down");
    }
    function handleKeydownEnter() {
      const pendingNode = getPendingNode();
      if (pendingNode?.isLeaf && mergedShowRef.value) {
        doSelect(pendingNode.key, pendingNode.rawNode);
        doUpdateShow(false);
      }
    }
    function getPendingNode() {
      const {
        value: treeMate
      } = treemateRef;
      const {
        value: pendingKey
      } = pendingKeyRef;
      if (!treeMate || pendingKey === null) return null;
      return treeMate.getNode(pendingKey) ?? null;
    }
    function handleKeydown(direction) {
      const {
        value: pendingKey
      } = pendingKeyRef;
      const {
        value: {
          getFirstAvailableNode
        }
      } = treemateRef;
      let nextKeyboardKey = null;
      if (pendingKey === null) {
        const firstNode = getFirstAvailableNode();
        if (firstNode !== null) nextKeyboardKey = firstNode.key;
      } else {
        const currentNode = getPendingNode();
        if (currentNode) {
          let nextNode;
          switch (direction) {
            case "down":
              nextNode = currentNode.getNext();
              break;
            case "up":
              nextNode = currentNode.getPrev();
              break;
            case "right":
              nextNode = currentNode.getChild();
              break;
            case "left":
              nextNode = currentNode.getParent();
          }
          if (nextNode) nextKeyboardKey = nextNode.key;
        }
      }
      if (nextKeyboardKey !== null) {
        hoverKeyRef.value = null;
        keyboardKeyRef.value = nextKeyboardKey;
      }
    }
    const cssVarsRef = computed(() => {
      const {
        inverted
      } = props;
      const size = mergedSizeRef.value;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self
      } = themeRef.value;
      const {
        padding,
        dividerColor,
        borderRadius,
        optionOpacityDisabled,
        [createKey("optionIconSuffixWidth", size)]: optionIconSuffixWidth,
        [createKey("optionSuffixWidth", size)]: optionSuffixWidth,
        [createKey("optionIconPrefixWidth", size)]: optionIconPrefixWidth,
        [createKey("optionPrefixWidth", size)]: optionPrefixWidth,
        [createKey("fontSize", size)]: fontSize,
        [createKey("optionHeight", size)]: optionHeight,
        [createKey("optionIconSize", size)]: optionIconSize
      } = self;
      const vars = {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-font-size": fontSize,
        "--n-padding": padding,
        "--n-border-radius": borderRadius,
        "--n-option-height": optionHeight,
        "--n-option-prefix-width": optionPrefixWidth,
        "--n-option-icon-prefix-width": optionIconPrefixWidth,
        "--n-option-suffix-width": optionSuffixWidth,
        "--n-option-icon-suffix-width": optionIconSuffixWidth,
        "--n-option-icon-size": optionIconSize,
        "--n-divider-color": dividerColor,
        "--n-option-opacity-disabled": optionOpacityDisabled
      };
      if (inverted) {
        vars["--n-color"] = self.colorInverted;
        vars["--n-option-color-hover"] = self.optionColorHoverInverted;
        vars["--n-option-color-active"] = self.optionColorActiveInverted;
        vars["--n-option-text-color"] = self.optionTextColorInverted;
        vars["--n-option-text-color-hover"] = self.optionTextColorHoverInverted;
        vars["--n-option-text-color-active"] = self.optionTextColorActiveInverted;
        vars["--n-option-text-color-child-active"] = self.optionTextColorChildActiveInverted;
        vars["--n-prefix-color"] = self.prefixColorInverted;
        vars["--n-suffix-color"] = self.suffixColorInverted;
        vars["--n-group-header-text-color"] = self.groupHeaderTextColorInverted;
      } else {
        vars["--n-color"] = self.color;
        vars["--n-option-color-hover"] = self.optionColorHover;
        vars["--n-option-color-active"] = self.optionColorActive;
        vars["--n-option-text-color"] = self.optionTextColor;
        vars["--n-option-text-color-hover"] = self.optionTextColorHover;
        vars["--n-option-text-color-active"] = self.optionTextColorActive;
        vars["--n-option-text-color-child-active"] = self.optionTextColorChildActive;
        vars["--n-prefix-color"] = self.prefixColor;
        vars["--n-suffix-color"] = self.suffixColor;
        vars["--n-group-header-text-color"] = self.groupHeaderTextColor;
      }
      return vars;
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("dropdown", computed(() => `${mergedSizeRef.value[0]}${props.inverted ? "i" : ""}`), cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      mergedTheme: themeRef,
      mergedSize: mergedSizeRef,
      tmNodes: tmNodesRef,
      mergedShow: mergedShowRef,
      handleAfterLeave: () => {
        if (!props.animated) return;
        clearPendingState();
      },
      doUpdateShow,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const renderPopoverBody = (className, ref, style, onMouseenter, onMouseleave) => {
      const {
        mergedClsPrefix,
        menuProps
      } = this;
      this.onRender?.();
      const menuNodeProps = menuProps?.(void 0, this.tmNodes.map(v => v.rawNode)) || {};
      const dropdownProps = {
        ref: createRefSetter(ref),
        class: [className, `${mergedClsPrefix}-dropdown`, `${mergedClsPrefix}-dropdown--${this.mergedSize}-size`, this.themeClass],
        clsPrefix: mergedClsPrefix,
        tmNodes: this.tmNodes,
        style: [...style, this.cssVars],
        showArrow: this.showArrow,
        arrowStyle: this.arrowStyle,
        scrollable: this.scrollable,
        onMouseenter,
        onMouseleave
      };
      return h(DropdownMenu_default, mergeProps(this.$attrs, dropdownProps, menuNodeProps));
    };
    const {
      mergedTheme
    } = this;
    const popoverProps = {
      show: this.mergedShow,
      theme: mergedTheme.peers.Popover,
      themeOverrides: mergedTheme.peerOverrides.Popover,
      internalOnAfterLeave: this.handleAfterLeave,
      internalRenderBody: renderPopoverBody,
      onUpdateShow: this.doUpdateShow,
      "onUpdate:show": void 0
    };
    return openBlock(), createBlock(Popover_default, keep(this.$props, popoverPropKeys, popoverProps), {
      _: 1,
      trigger: normalizeSlot(() => this.$slots.default?.())
    }, 16);
  }
});
//#endregion
export { Dropdown_default as default, dropdownProps };