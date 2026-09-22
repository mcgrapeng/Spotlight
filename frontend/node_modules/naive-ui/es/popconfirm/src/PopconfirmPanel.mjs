import { keysOf } from "../../_utils/vue/keysOf.mjs";
import { resolveSlot, resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useLocale from "../../_mixins/use-locale.mjs";
import { normalizeClass as normalizeClass$1, normalizeSlot, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Warning_default from "../../_internal/icons/Warning.mjs";
import Button from "../../button/src/Button.mjs";
import { popconfirmInjectionKey } from "./interface.mjs";
import { computed, createBlock, createElementBlock, defineComponent, inject, mergeProps, normalizeStyle, openBlock, toRef } from "vue";
//#region src/popconfirm/src/PopconfirmPanel.tsx
const panelProps = {
  positiveText: String,
  negativeText: String,
  showIcon: {
    type: Boolean,
    default: true
  },
  onPositiveClick: {
    type: Function,
    required: true
  },
  onNegativeClick: {
    type: Function,
    required: true
  }
};
const panelPropKeys = keysOf(panelProps);
var PopconfirmPanel_default = defineComponent({
  name: "NPopconfirmPanel",
  props: panelProps,
  setup(props) {
    const {
      localeRef
    } = useLocale("Popconfirm");
    const {
      inlineThemeDisabled
    } = useConfig();
    const {
      mergedClsPrefixRef,
      mergedThemeRef,
      props: popconfirmProps
    } = inject(popconfirmInjectionKey);
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          fontSize,
          iconSize,
          iconColor
        }
      } = mergedThemeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-font-size": fontSize,
        "--n-icon-size": iconSize,
        "--n-icon-color": iconColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("popconfirm-panel", void 0, cssVarsRef, popconfirmProps) : void 0;
    return {
      ...useLocale("Popconfirm"),
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      localizedPositiveText: computed(() => {
        return props.positiveText || localeRef.value.positiveText;
      }),
      localizedNegativeText: computed(() => {
        return props.negativeText || localeRef.value.negativeText;
      }),
      positiveButtonProps: toRef(popconfirmProps, "positiveButtonProps"),
      negativeButtonProps: toRef(popconfirmProps, "negativeButtonProps"),
      handlePositiveClick(e) {
        props.onPositiveClick(e);
      },
      handleNegativeClick(e) {
        props.onNegativeClick(e);
      },
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedClsPrefix,
      showIcon,
      $slots
    } = this;
    const actionContentNode = resolveSlot($slots.action, () => this.negativeText === null && this.positiveText === null ? [] : [this.negativeText !== null && (openBlock(), createBlock(Button, mergeProps({
      key: 1,
      size: "small",
      onClick: this.handleNegativeClick
    }, this.negativeButtonProps), {
      _: 1,
      default: normalizeSlot(() => this.localizedNegativeText)
    }, 16, ["onClick"])), this.positiveText !== null && (openBlock(), createBlock(Button, mergeProps({
      key: 2,
      size: "small",
      type: "primary",
      onClick: this.handlePositiveClick
    }, this.positiveButtonProps), {
      _: 1,
      default: normalizeSlot(() => this.localizedPositiveText)
    }, 16, ["onClick"]))]);
    this.onRender?.();
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-popconfirm__panel`, this.themeClass]),
      style: normalizeStyle(this.cssVars)
    }, [normalizeVNode(() => resolveWrappedSlot($slots.default, children => showIcon || children ? (openBlock(), createElementBlock("div", {
      key: 3,
      class: normalizeClass$1(`${mergedClsPrefix}-popconfirm__body`)
    }, [showIcon ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-popconfirm__icon`)
    }, [normalizeVNode(() => resolveSlot($slots.icon, () => [(openBlock(), createBlock(Icon_default, {
      clsPrefix: mergedClsPrefix
    }, {
      default: () => (openBlock(), createBlock(Warning_default))
    }, 1032, ["clsPrefix"]))]))], 2)) : normalizeVNode(() => null), normalizeVNode(() => children)], 2)) : null)), actionContentNode ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1([`${mergedClsPrefix}-popconfirm__action`])
    }, [normalizeVNode(() => actionContentNode)], 2)) : normalizeVNode(() => null)], 6);
  }
});
//#endregion
export { PopconfirmPanel_default as default, panelPropKeys, panelProps };