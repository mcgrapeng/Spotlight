import { createKey } from "../../_utils/cssr/index.mjs";
import { throwError } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { resolveSlot, resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import IconSwitchTransition_default from "../../_internal/icon-switch-transition/src/IconSwitchTransition.mjs";
import Checkmark_default from "../../_internal/icons/Checkmark.mjs";
import Close_default from "../../_internal/icons/Close.mjs";
import { stepsInjectionKey } from "./Steps.mjs";
import { Fragment, computed, createBlock, createElementBlock, createElementVNode, createVNode, defineComponent, inject, normalizeStyle, openBlock, toRef } from "vue";
//#region src/steps/src/Step.tsx
const _hoisted_1 = ["onClick"];
const stepProps = {
  status: String,
  title: String,
  description: String,
  disabled: Boolean,
  internalIndex: {
    type: Number,
    default: 0
  }
};
var Step_default = defineComponent({
  name: "Step",
  props: stepProps,
  slots: Object,
  setup(props) {
    const NSteps = inject(stepsInjectionKey, null);
    if (!NSteps) throwError("step", "`n-step` must be placed inside `n-steps`.");
    const {
      inlineThemeDisabled
    } = useConfig();
    const {
      props: stepsProps,
      mergedThemeRef,
      mergedClsPrefixRef,
      stepsSlots
    } = NSteps;
    const verticalRef = toRef(stepsProps, "vertical");
    const contentPlacementRef = toRef(stepsProps, "contentPlacement");
    const mergedStatusRef = computed(() => {
      const {
        status
      } = props;
      if (status) return status;else {
        const {
          internalIndex
        } = props;
        const {
          current
        } = stepsProps;
        if (current === void 0) return "process";
        if (internalIndex < current) return "finish";else if (internalIndex === current) return stepsProps.status || "process";else if (internalIndex > current) return "wait";
      }
      return "process";
    });
    const cssVarsRef = computed(() => {
      const {
        value: status
      } = mergedStatusRef;
      const {
        size
      } = stepsProps;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          stepHeaderFontWeight,
          [createKey("stepHeaderFontSize", size)]: stepHeaderFontSize,
          [createKey("indicatorIndexFontSize", size)]: indicatorIndexFontSize,
          [createKey("indicatorSize", size)]: indicatorSize,
          [createKey("indicatorIconSize", size)]: indicatorIconSize,
          [createKey("indicatorTextColor", status)]: indicatorTextColor,
          [createKey("indicatorBorderColor", status)]: indicatorBorderColor,
          [createKey("headerTextColor", status)]: headerTextColor,
          [createKey("splitorColor", status)]: splitorColor,
          [createKey("indicatorColor", status)]: indicatorColor,
          [createKey("descriptionTextColor", status)]: descriptionTextColor
        }
      } = mergedThemeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-description-text-color": descriptionTextColor,
        "--n-header-text-color": headerTextColor,
        "--n-indicator-border-color": indicatorBorderColor,
        "--n-indicator-color": indicatorColor,
        "--n-indicator-icon-size": indicatorIconSize,
        "--n-indicator-index-font-size": indicatorIndexFontSize,
        "--n-indicator-size": indicatorSize,
        "--n-indicator-text-color": indicatorTextColor,
        "--n-splitor-color": splitorColor,
        "--n-step-header-font-size": stepHeaderFontSize,
        "--n-step-header-font-weight": stepHeaderFontWeight
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("step", computed(() => {
      const {
        value: status
      } = mergedStatusRef;
      const {
        size
      } = stepsProps;
      return `${status[0]}${size[0]}`;
    }), cssVarsRef, stepsProps) : void 0;
    return {
      stepsSlots,
      mergedClsPrefix: mergedClsPrefixRef,
      vertical: verticalRef,
      mergedStatus: mergedStatusRef,
      handleStepClick: computed(() => {
        if (props.disabled) return void 0;
        const {
          onUpdateCurrent,
          "onUpdate:current": _onUpdateCurrent
        } = stepsProps;
        return onUpdateCurrent || _onUpdateCurrent ? () => {
          if (onUpdateCurrent) call(onUpdateCurrent, props.internalIndex);
          if (_onUpdateCurrent) call(_onUpdateCurrent, props.internalIndex);
        } : void 0;
      }),
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender,
      contentPlacement: contentPlacementRef
    };
  },
  render() {
    const {
      mergedClsPrefix,
      onRender,
      handleStepClick,
      disabled,
      contentPlacement,
      vertical
    } = this;
    const descriptionNode = resolveWrappedSlot(this.$slots.default, children => {
      const mergedDescription = children || this.description;
      if (mergedDescription) return openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass$1(`${mergedClsPrefix}-step-content__description`)
      }, [normalizeVNode(() => mergedDescription)], 2);
      return null;
    });
    const splitorNode = (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-step-splitor`)
    }, null, 2));
    const indicatorNode = (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-step-indicator`),
      key: contentPlacement
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-step-indicator-slot`)
    }, [createVNode(IconSwitchTransition_default, null, {
      default: () => {
        return resolveWrappedSlot(this.$slots.icon, icon => {
          const {
            mergedStatus,
            stepsSlots
          } = this;
          return !(mergedStatus === "finish" || mergedStatus === "error") ? icon || (openBlock(), createElementBlock("div", {
            key: this.internalIndex,
            class: normalizeClass$1(`${mergedClsPrefix}-step-indicator-slot__index`)
          }, [normalizeVNode(() => this.internalIndex)], 2)) : mergedStatus === "finish" ? (openBlock(), createBlock(Icon_default, {
            clsPrefix: mergedClsPrefix,
            key: "finish"
          }, {
            default: () => resolveSlot(stepsSlots["finish-icon"], () => [(openBlock(), createBlock(Checkmark_default))])
          }, 1032, ["clsPrefix"])) : mergedStatus === "error" ? (openBlock(), createBlock(Icon_default, {
            clsPrefix: mergedClsPrefix,
            key: "error"
          }, {
            default: () => resolveSlot(stepsSlots["error-icon"], () => [(openBlock(), createBlock(Close_default))])
          }, 1032, ["clsPrefix"])) : null;
        });
      }
    }, 1024)], 2), vertical ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => splitorNode)], 64)) : normalizeVNode(() => null)], 2));
    const contentNode = (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-step-content`)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-step-content-header`)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-step-content-header__title`)
    }, [normalizeVNode(() => resolveSlot(this.$slots.title, () => [this.title]))], 2), !vertical && contentPlacement === "right" ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => splitorNode)], 64)) : normalizeVNode(() => null)], 2), normalizeVNode(() => descriptionNode)], 2));
    let stepNode;
    if (!vertical && contentPlacement === "bottom") stepNode = (stepNode => {
      return openBlock(), createElementBlock(Fragment, {
        key: 5
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-step-line`)
      }, [normalizeVNode(() => indicatorNode), normalizeVNode(() => splitorNode)], 2), normalizeVNode(() => contentNode)], 64);
    })(stepNode);else stepNode = (stepNode => {
      return openBlock(), createElementBlock(Fragment, {
        key: 6
      }, [normalizeVNode(() => indicatorNode), normalizeVNode(() => contentNode)], 64);
    })(stepNode);
    onRender?.();
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-step`, disabled && `${mergedClsPrefix}-step--disabled`, !disabled && handleStepClick && `${mergedClsPrefix}-step--clickable`, this.themeClass, descriptionNode && `${mergedClsPrefix}-step--show-description`, `${mergedClsPrefix}-step--${this.mergedStatus}-status`]),
      style: normalizeStyle(this.cssVars),
      onClick: handleStepClick
    }, [normalizeVNode(() => stepNode)], 14, _hoisted_1);
  }
});
//#endregion
export { Step_default as default, stepProps };