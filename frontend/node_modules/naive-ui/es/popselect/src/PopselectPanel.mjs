import { warn } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { keysOf } from "../../_utils/vue/keysOf.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeSlot } from "../../vue-jsx-vapor/vdom.mjs";
import SelectMenu_default from "../../_internal/select-menu/src/SelectMenu.mjs";
import { createTmOptions } from "../../select/src/utils.mjs";
import popselectLight from "../styles/light.mjs";
import { popselectInjectionKey } from "./interface.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { happensIn } from "seemly";
import { computed, createBlock, defineComponent, inject, nextTick, normalizeStyle, openBlock, toRef, watch, watchEffect } from "vue";
import { createTreeMate } from "treemate";
//#region src/popselect/src/PopselectPanel.tsx
const panelProps = {
  multiple: Boolean,
  value: {
    type: [String, Number, Array],
    default: null
  },
  cancelable: Boolean,
  options: {
    type: Array,
    default: () => []
  },
  size: String,
  scrollable: Boolean,
  "onUpdate:value": [Function, Array],
  onUpdateValue: [Function, Array],
  onMouseenter: Function,
  onMouseleave: Function,
  renderLabel: Function,
  showCheckmark: {
    type: Boolean,
    default: void 0
  },
  nodeProps: Function,
  virtualScroll: Boolean,
  onChange: [Function, Array]
};
const panelPropKeys = keysOf(panelProps);
var PopselectPanel_default = defineComponent({
  name: "PopselectPanel",
  props: panelProps,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.onChange !== void 0) warn("popselect", "`on-change` is deprecated, please use `on-update:value` instead.");
    });
    const NPopselect = inject(popselectInjectionKey);
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedComponentPropsRef
    } = useConfig(props);
    const mergedSizeRef = computed(() => {
      return props.size || mergedComponentPropsRef?.value?.Popselect?.size || "medium";
    });
    const themeRef = useTheme("Popselect", "-pop-select", index_cssr_default, popselectLight, NPopselect.props, mergedClsPrefixRef);
    const treeMateRef = computed(() => {
      return createTreeMate(props.options, createTmOptions("value", "children"));
    });
    function doUpdateValue(value, option) {
      const {
        onUpdateValue,
        "onUpdate:value": _onUpdateValue,
        onChange
      } = props;
      if (onUpdateValue) call(onUpdateValue, value, option);
      if (_onUpdateValue) call(_onUpdateValue, value, option);
      if (onChange) call(onChange, value, option);
    }
    function handleToggle(tmNode) {
      toggle(tmNode.key);
    }
    function handleMenuMousedown(e) {
      if (!happensIn(e, "action") && !happensIn(e, "empty") && !happensIn(e, "header")) e.preventDefault();
    }
    function toggle(value) {
      const {
        value: {
          getNode
        }
      } = treeMateRef;
      if (props.multiple) {
        if (Array.isArray(props.value)) {
          const newValue = [];
          const newOptions = [];
          let shouldAddValue = true;
          props.value.forEach(v => {
            if (v === value) {
              shouldAddValue = false;
              return;
            }
            const tmNode = getNode(v);
            if (tmNode) {
              newValue.push(tmNode.key);
              newOptions.push(tmNode.rawNode);
            }
          });
          if (shouldAddValue) {
            newValue.push(value);
            newOptions.push(getNode(value).rawNode);
          }
          doUpdateValue(newValue, newOptions);
        } else {
          const tmNode = getNode(value);
          if (tmNode) doUpdateValue([value], [tmNode.rawNode]);
        }
      } else if (props.value === value && props.cancelable) doUpdateValue(null, null);else {
        const tmNode = getNode(value);
        if (tmNode) doUpdateValue(value, tmNode.rawNode);
        const {
          "onUpdate:show": _onUpdateShow,
          onUpdateShow
        } = NPopselect.props;
        if (_onUpdateShow) call(_onUpdateShow, false);
        if (onUpdateShow) call(onUpdateShow, false);
        NPopselect.setShow(false);
      }
      nextTick(() => {
        NPopselect.syncPosition();
      });
    }
    watch(toRef(props, "options"), () => {
      nextTick(() => {
        NPopselect.syncPosition();
      });
    });
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
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("select", void 0, cssVarsRef, NPopselect.props) : void 0;
    return {
      mergedTheme: NPopselect.mergedThemeRef,
      mergedClsPrefix: mergedClsPrefixRef,
      treeMate: treeMateRef,
      handleToggle,
      handleMenuMousedown,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender,
      mergedSize: mergedSizeRef,
      scrollbarProps: NPopselect.props.scrollbarProps
    };
  },
  render() {
    this.onRender?.();
    return openBlock(), createBlock(SelectMenu_default, {
      clsPrefix: this.mergedClsPrefix,
      focusable: true,
      nodeProps: this.nodeProps,
      class: normalizeClass$1([`${this.mergedClsPrefix}-popselect-menu`, this.themeClass]),
      style: normalizeStyle(this.cssVars),
      theme: this.mergedTheme.peers.InternalSelectMenu,
      themeOverrides: this.mergedTheme.peerOverrides.InternalSelectMenu,
      multiple: this.multiple,
      treeMate: this.treeMate,
      size: this.mergedSize,
      value: this.value,
      virtualScroll: this.virtualScroll,
      scrollable: this.scrollable,
      scrollbarProps: this.scrollbarProps,
      renderLabel: this.renderLabel,
      onToggle: this.handleToggle,
      onMouseenter: this.onMouseenter,
      onMouseleave: this.onMouseenter,
      onMousedown: this.handleMenuMousedown,
      showCheckmark: this.showCheckmark
    }, {
      _: 1,
      header: normalizeSlot(() => this.$slots.header?.() || []),
      action: normalizeSlot(() => this.$slots.action?.() || []),
      empty: normalizeSlot(() => this.$slots.empty?.() || [])
    }, 8, ["clsPrefix", "nodeProps", "class", "style", "theme", "themeOverrides", "multiple", "treeMate", "size", "value", "virtualScroll", "scrollable", "scrollbarProps", "renderLabel", "onToggle", "onMouseenter", "onMouseleave", "onMousedown", "showCheckmark"]);
  }
});
//#endregion
export { PopselectPanel_default as default, panelPropKeys, panelProps };