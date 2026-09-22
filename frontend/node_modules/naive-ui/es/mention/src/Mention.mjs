import { useAdjustedTo } from "../../_utils/composable/use-adjusted-to.mjs";
import { warn } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeSlot, normalizeSlots } from "../../vue-jsx-vapor/vdom.mjs";
import SelectMenu_default from "../../_internal/select-menu/src/SelectMenu.mjs";
import Input_default from "../../input/src/Input.mjs";
import mentionLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { getRelativePosition } from "./utils.mjs";
import { Transition, computed, createBlock, createElementBlock, createVNode, defineComponent, nextTick, normalizeStyle, openBlock, ref, toRef } from "vue";
import { useIsMounted, useMergedState } from "vooks";
import { VBinder, VFollower, VTarget } from "vueuc";
import { createTreeMate } from "treemate";
//#region src/mention/src/Mention.tsx
const mentionProps = {
  ...useTheme.props,
  to: useAdjustedTo.propTo,
  autosize: [Boolean, Object],
  options: {
    type: Array,
    default: []
  },
  filter: {
    type: Function,
    default: (pattern, option) => {
      if (!pattern) return true;
      if (typeof option.label === "string") return option.label.startsWith(pattern);
      if (typeof option.value === "string") return option.value.startsWith(pattern);
      return false;
    }
  },
  type: {
    type: String,
    default: "text"
  },
  separator: {
    type: String,
    validator: separator => {
      if (separator.length !== 1) {
        warn("mention", "`separator`'s length must be 1.");
        return false;
      }
      return true;
    },
    default: " "
  },
  bordered: {
    type: Boolean,
    default: void 0
  },
  disabled: Boolean,
  value: String,
  defaultValue: {
    type: String,
    default: ""
  },
  loading: Boolean,
  prefix: {
    type: [String, Array],
    default: "@"
  },
  placeholder: {
    type: String,
    default: ""
  },
  placement: {
    type: String,
    default: "bottom-start"
  },
  size: String,
  renderLabel: Function,
  status: String,
  "onUpdate:show": [Array, Function],
  onUpdateShow: [Array, Function],
  "onUpdate:value": [Array, Function],
  onUpdateValue: [Array, Function],
  onSearch: Function,
  onSelect: Function,
  onFocus: Function,
  onBlur: Function,
  scrollbarProps: Object,
  internalDebug: Boolean
};
var Mention_default = defineComponent({
  name: "Mention",
  props: mentionProps,
  slots: Object,
  setup(props) {
    const {
      namespaceRef,
      mergedClsPrefixRef,
      mergedBorderedRef,
      inlineThemeDisabled,
      mergedComponentPropsRef
    } = useConfig(props);
    const themeRef = useTheme("Mention", "-mention", index_cssr_default, mentionLight, props, mergedClsPrefixRef);
    const formItem = useFormItem(props, {
      mergedSize: NFormItem => {
        const {
          size
        } = props;
        if (size) return size;
        const {
          mergedSize: formItemSize
        } = NFormItem || {};
        if (formItemSize?.value) return formItemSize.value;
        const configSize = mergedComponentPropsRef?.value?.Mention?.size;
        if (configSize) return configSize;
        return "medium";
      }
    });
    const inputInstRef = ref(null);
    const cursorRef = ref(null);
    const followerRef = ref(null);
    const wrapperElRef = ref(null);
    const partialPatternRef = ref("");
    let cachedPrefix = null;
    let cachedPartialPatternStart = null;
    let cachedPartialPatternEnd = null;
    const filteredOptionsRef = computed(() => {
      const {
        value: pattern
      } = partialPatternRef;
      return props.options.filter(option => props.filter(pattern, option));
    });
    const treeMateRef = computed(() => {
      return createTreeMate(filteredOptionsRef.value, {
        getKey: v => {
          return v.value;
        }
      });
    });
    const selectMenuInstRef = ref(null);
    const showMenuRef = ref(false);
    const uncontrolledValueRef = ref(props.defaultValue);
    const controlledValueRef = toRef(props, "value");
    const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
    const cssVarsRef = computed(() => {
      const {
        self: {
          menuBoxShadow
        }
      } = themeRef.value;
      return {
        "--n-menu-box-shadow": menuBoxShadow
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("mention", void 0, cssVarsRef, props) : void 0;
    function doUpdateShowMenu(show) {
      if (props.disabled) return;
      const {
        onUpdateShow,
        "onUpdate:show": _onUpdateShow
      } = props;
      if (onUpdateShow) call(onUpdateShow, show);
      if (_onUpdateShow) call(_onUpdateShow, show);
      if (!show) {
        cachedPrefix = null;
        cachedPartialPatternStart = null;
        cachedPartialPatternEnd = null;
      }
      showMenuRef.value = show;
    }
    function doUpdateValue(value) {
      const {
        onUpdateValue,
        "onUpdate:value": _onUpdateValue
      } = props;
      const {
        nTriggerFormChange,
        nTriggerFormInput
      } = formItem;
      if (_onUpdateValue) call(_onUpdateValue, value);
      if (onUpdateValue) call(onUpdateValue, value);
      nTriggerFormInput();
      nTriggerFormChange();
      uncontrolledValueRef.value = value;
    }
    function getInputEl() {
      return props.type === "text" ? inputInstRef.value.inputElRef : inputInstRef.value.textareaElRef;
    }
    function deriveShowMenu() {
      const inputEl = getInputEl();
      if (document.activeElement !== inputEl) {
        doUpdateShowMenu(false);
        return;
      }
      const {
        selectionEnd
      } = inputEl;
      if (selectionEnd === null) {
        doUpdateShowMenu(false);
        return;
      }
      const inputValue = inputEl.value;
      const {
        separator
      } = props;
      const {
        prefix
      } = props;
      const prefixArray = typeof prefix === "string" ? [prefix] : prefix;
      for (let i = selectionEnd - 1; i >= 0; --i) {
        const char = inputValue[i];
        if (char === separator || char === "\n" || char === "\r") {
          doUpdateShowMenu(false);
          return;
        }
        if (prefixArray.includes(char)) {
          const partialPattern = inputValue.slice(i + 1, selectionEnd);
          doUpdateShowMenu(true);
          props.onSearch?.(partialPattern, char);
          partialPatternRef.value = partialPattern;
          cachedPrefix = char;
          cachedPartialPatternStart = i + 1;
          cachedPartialPatternEnd = selectionEnd;
          return;
        }
      }
      doUpdateShowMenu(false);
    }
    function syncCursor() {
      const {
        value: cursorAnchor
      } = cursorRef;
      if (!cursorAnchor) return;
      const inputEl = getInputEl();
      const cursorPos = getRelativePosition(inputEl);
      const inputRect = inputEl.getBoundingClientRect();
      const wrapperRect = wrapperElRef.value.getBoundingClientRect();
      cursorAnchor.style.left = `${cursorPos.left + inputRect.left - wrapperRect.left}px`;
      cursorAnchor.style.top = `${cursorPos.top + inputRect.top - wrapperRect.top}px`;
      cursorAnchor.style.height = `${cursorPos.height}px`;
    }
    function syncPosition() {
      if (!showMenuRef.value) return;
      followerRef.value?.syncPosition();
    }
    function handleInputUpdateValue(value) {
      doUpdateValue(value);
      syncAfterCursorMove();
    }
    function syncAfterCursorMove() {
      setTimeout(() => {
        syncCursor();
        deriveShowMenu();
        nextTick().then(syncPosition);
      }, 0);
    }
    function handleInputKeyDown(e) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        if (inputInstRef.value?.isCompositing) return;
        syncAfterCursorMove();
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Enter") {
        if (inputInstRef.value?.isCompositing) return;
        const {
          value: selectMenuInst
        } = selectMenuInstRef;
        if (showMenuRef.value) {
          if (selectMenuInst) {
            e.preventDefault();
            if (e.key === "ArrowUp") selectMenuInst.prev();else if (e.key === "ArrowDown") selectMenuInst.next();else {
              const pendingOptionTmNode = selectMenuInst.getPendingTmNode();
              if (pendingOptionTmNode) handleSelect(pendingOptionTmNode);else doUpdateShowMenu(false);
            }
          }
        } else syncAfterCursorMove();
      }
    }
    function handleInputFocus(e) {
      const {
        onFocus
      } = props;
      onFocus?.(e);
      const {
        nTriggerFormFocus
      } = formItem;
      nTriggerFormFocus();
      syncAfterCursorMove();
    }
    function focus() {
      inputInstRef.value?.focus();
    }
    function blur() {
      inputInstRef.value?.blur();
    }
    function handleInputBlur(e) {
      const {
        onBlur
      } = props;
      onBlur?.(e);
      const {
        nTriggerFormBlur
      } = formItem;
      nTriggerFormBlur();
      doUpdateShowMenu(false);
    }
    function handleSelect(tmNode) {
      if (cachedPrefix === null || cachedPartialPatternStart === null || cachedPartialPatternEnd === null) {
        if (process.env.NODE_ENV !== "production") warn("mention", "Cache works unexpectly, this is probably a bug. Please create an issue.");
        return;
      }
      const {
        rawNode: {
          value = ""
        }
      } = tmNode;
      const inputEl = getInputEl();
      const inputValue = inputEl.value;
      const {
        separator
      } = props;
      const nextEndPart = inputValue.slice(cachedPartialPatternEnd);
      const alreadySeparated = nextEndPart.startsWith(separator);
      const nextMiddlePart = `${value}${alreadySeparated ? "" : separator}`;
      doUpdateValue(inputValue.slice(0, cachedPartialPatternStart) + nextMiddlePart + nextEndPart);
      props.onSelect?.(tmNode.rawNode, cachedPrefix);
      const nextSelectionEnd = cachedPartialPatternStart + nextMiddlePart.length + (alreadySeparated ? 1 : 0);
      nextTick().then(() => {
        inputEl.selectionStart = nextSelectionEnd;
        inputEl.selectionEnd = nextSelectionEnd;
        deriveShowMenu();
      });
    }
    function handleInputMouseDown() {
      if (!props.disabled) syncAfterCursorMove();
    }
    return {
      namespace: namespaceRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedBordered: mergedBorderedRef,
      mergedSize: formItem.mergedSizeRef,
      mergedStatus: formItem.mergedStatusRef,
      mergedTheme: themeRef,
      treeMate: treeMateRef,
      selectMenuInstRef,
      inputInstRef,
      cursorRef,
      followerRef,
      wrapperElRef,
      showMenu: showMenuRef,
      adjustedTo: useAdjustedTo(props),
      isMounted: useIsMounted(),
      mergedValue: mergedValueRef,
      handleInputFocus,
      handleInputBlur,
      handleInputUpdateValue,
      handleInputKeyDown,
      handleSelect,
      handleInputMouseDown,
      focus,
      blur,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedTheme,
      mergedClsPrefix,
      $slots
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-mention`),
      ref: "wrapperElRef"
    }, [(openBlock(), createBlock(Input_default, {
      status: this.mergedStatus,
      themeOverrides: mergedTheme.peerOverrides.Input,
      theme: mergedTheme.peers.Input,
      size: this.mergedSize,
      autosize: this.autosize,
      type: this.type,
      ref: "inputInstRef",
      placeholder: this.placeholder,
      onMousedown: this.handleInputMouseDown,
      onUpdateValue: this.handleInputUpdateValue,
      onKeydown: this.handleInputKeyDown,
      onFocus: this.handleInputFocus,
      onBlur: this.handleInputBlur,
      bordered: this.mergedBordered,
      disabled: this.disabled,
      value: this.mergedValue
    }, null, 8, ["status", "themeOverrides", "theme", "size", "autosize", "type", "placeholder", "onMousedown", "onUpdateValue", "onKeydown", "onFocus", "onBlur", "bordered", "disabled", "value"])), createVNode(VBinder, null, {
      default: () => [(openBlock(), createBlock(VTarget, null, {
        _: 1,
        default: normalizeSlot(() => {
          const style = {
            position: "absolute",
            width: 0
          };
          if (process.env.NODE_ENV !== "production" && this.internalDebug) {
            style.width = "1px";
            style.background = "red";
          }
          return openBlock(), createElementBlock("div", {
            style: normalizeStyle(style),
            ref: "cursorRef"
          }, null, 4);
        })
      })), (openBlock(), createBlock(VFollower, {
        ref: "followerRef",
        placement: this.placement,
        show: this.showMenu,
        containerClass: this.namespace,
        to: this.adjustedTo,
        teleportDisabled: this.adjustedTo === useAdjustedTo.tdkey
      }, {
        default: () => (openBlock(), createBlock(Transition, {
          name: "fade-in-scale-up-transition",
          appear: this.isMounted
        }, {
          default: () => {
            const {
              mergedTheme,
              onRender
            } = this;
            onRender?.();
            return this.showMenu ? (openBlock(), createBlock(SelectMenu_default, {
              key: 1,
              clsPrefix: mergedClsPrefix,
              theme: mergedTheme.peers.InternalSelectMenu,
              themeOverrides: mergedTheme.peerOverrides.InternalSelectMenu,
              autoPending: true,
              ref: "selectMenuInstRef",
              class: normalizeClass$1([`${mergedClsPrefix}-mention-menu`, this.themeClass]),
              loading: this.loading,
              treeMate: this.treeMate,
              virtualScroll: false,
              style: normalizeStyle(this.cssVars),
              onToggle: this.handleSelect,
              renderLabel: this.renderLabel,
              scrollbarProps: this.scrollbarProps
            }, normalizeSlots($slots), 1032, ["clsPrefix", "theme", "themeOverrides", "class", "loading", "treeMate", "style", "onToggle", "renderLabel", "scrollbarProps"])) : null;
          }
        }, 1032, ["appear"]))
      }, 1032, ["placement", "show", "containerClass", "to", "teleportDisabled"]))]
    }, 1024)], 2);
  }
});
//#endregion
export { Mention_default as default, mentionProps };