import { modalInjectionKey, modalProviderInjectionKey } from "./interface.mjs";
import { useIsComposing } from "../../_utils/composable/use-is-composing.mjs";
import { eventEffectNotPerformed } from "../../_utils/event/index.mjs";
import { warnOnce } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { keep } from "../../_utils/vue/keep.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeSlots, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { dialogProviderInjectionKey } from "../../dialog/src/context.mjs";
import modalLight from "../styles/light.mjs";
import { forwardedPresetPropsKeys, presetProps } from "./presetProps.mjs";
import BodyWrapper_default from "./BodyWrapper.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { getPreciseEventTarget } from "seemly";
import { Transition, computed, createBlock, createElementBlock, defineComponent, inject, mergeProps, normalizeStyle, openBlock, provide, ref, toRef, withDirectives } from "vue";
import { useClickPosition, useClicked, useIsMounted } from "vooks";
import { VLazyTeleport } from "vueuc";
import { zindexable } from "vdirs";
//#region src/modal/src/Modal.tsx
const modalProps = {
  ...useTheme.props,
  show: Boolean,
  showMask: {
    type: Boolean,
    default: true
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  preset: String,
  to: [String, Object],
  displayDirective: {
    type: String,
    default: "if"
  },
  transformOrigin: {
    type: String,
    default: "mouse"
  },
  zIndex: Number,
  autoFocus: {
    type: Boolean,
    default: true
  },
  trapFocus: {
    type: Boolean,
    default: true
  },
  closeOnEsc: {
    type: Boolean,
    default: true
  },
  blockScroll: {
    type: Boolean,
    default: true
  },
  ...presetProps,
  draggable: [Boolean, Object],
  onEsc: Function,
  "onUpdate:show": [Function, Array],
  onUpdateShow: [Function, Array],
  onAfterEnter: Function,
  onBeforeLeave: Function,
  onAfterLeave: Function,
  onClose: Function,
  onPositiveClick: Function,
  onNegativeClick: Function,
  onMaskClick: Function,
  internalDialog: Boolean,
  internalModal: Boolean,
  internalAppear: {
    type: Boolean,
    default: void 0
  },
  overlayStyle: [String, Object],
  onBeforeHide: Function,
  onAfterHide: Function,
  onHide: Function,
  unstableShowMask: {
    type: Boolean,
    default: void 0
  }
};
var Modal_default = defineComponent({
  name: "Modal",
  inheritAttrs: false,
  props: modalProps,
  slots: Object,
  setup(props) {
    if (process.env.NODE_ENV !== "production") {
      if (props.onHide) warnOnce("modal", "`on-hide` is deprecated.");
      if (props.onAfterHide) warnOnce("modal", "`on-after-hide` is deprecated, please use `on-after-leave` instead.");
      if (props.onBeforeHide) warnOnce("modal", "`on-before-hide` is deprecated, please use `on-before-leave` instead.");
      if (props.overlayStyle) warnOnce("modal", "`overlay-style` is deprecated, please use `style` instead.");
      if (props.unstableShowMask) warnOnce("modal", "`unstable-show-mask` has been removed, please use `show-mask` instead.");
    }
    const containerRef = ref(null);
    const {
      mergedClsPrefixRef,
      namespaceRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Modal", "-modal", index_cssr_default, modalLight, props, mergedClsPrefixRef);
    const clickedRef = useClicked(64);
    const clickedPositionRef = useClickPosition();
    const isMountedRef = useIsMounted();
    const NDialogProvider = props.internalDialog ? inject(dialogProviderInjectionKey, null) : null;
    const NModalProvider = props.internalModal ? inject(modalProviderInjectionKey, null) : null;
    const isComposingRef = useIsComposing();
    function doUpdateShow(show) {
      const {
        onUpdateShow,
        "onUpdate:show": _onUpdateShow,
        onHide
      } = props;
      if (onUpdateShow) call(onUpdateShow, show);
      if (_onUpdateShow) call(_onUpdateShow, show);
      if (onHide && !show) onHide(show);
    }
    function handleCloseClick() {
      const {
        onClose
      } = props;
      if (onClose) Promise.resolve(onClose()).then(value => {
        if (value === false) return;
        doUpdateShow(false);
      });else doUpdateShow(false);
    }
    function handlePositiveClick() {
      const {
        onPositiveClick
      } = props;
      if (onPositiveClick) Promise.resolve(onPositiveClick()).then(value => {
        if (value === false) return;
        doUpdateShow(false);
      });else doUpdateShow(false);
    }
    function handleNegativeClick() {
      const {
        onNegativeClick
      } = props;
      if (onNegativeClick) Promise.resolve(onNegativeClick()).then(value => {
        if (value === false) return;
        doUpdateShow(false);
      });else doUpdateShow(false);
    }
    function handleBeforeLeave() {
      const {
        onBeforeLeave,
        onBeforeHide
      } = props;
      if (onBeforeLeave) call(onBeforeLeave);
      if (onBeforeHide) onBeforeHide();
    }
    function handleAfterLeave() {
      const {
        onAfterLeave,
        onAfterHide
      } = props;
      if (onAfterLeave) call(onAfterLeave);
      if (onAfterHide) onAfterHide();
    }
    function handleClickoutside(e) {
      const {
        onMaskClick
      } = props;
      if (onMaskClick) onMaskClick(e);
      if (props.maskClosable) {
        if (containerRef.value?.contains(getPreciseEventTarget(e))) doUpdateShow(false);
      }
    }
    function handleEsc(e) {
      props.onEsc?.();
      if (props.show && props.closeOnEsc && eventEffectNotPerformed(e)) {
        if (!isComposingRef.value) doUpdateShow(false);
      }
    }
    provide(modalInjectionKey, {
      getMousePosition: () => {
        const mergedProvider = NDialogProvider || NModalProvider;
        if (mergedProvider) {
          const {
            clickedRef,
            clickedPositionRef
          } = mergedProvider;
          if (clickedRef.value && clickedPositionRef.value) return clickedPositionRef.value;
        }
        if (clickedRef.value) return clickedPositionRef.value;
        return null;
      },
      mergedClsPrefixRef,
      mergedThemeRef: themeRef,
      isMountedRef,
      appearRef: toRef(props, "internalAppear"),
      transformOriginRef: toRef(props, "transformOrigin")
    });
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseOut
        },
        self: {
          boxShadow,
          color,
          textColor
        }
      } = themeRef.value;
      return {
        "--n-bezier-ease-out": cubicBezierEaseOut,
        "--n-box-shadow": boxShadow,
        "--n-color": color,
        "--n-text-color": textColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("theme-class", void 0, cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      namespace: namespaceRef,
      isMounted: isMountedRef,
      containerRef,
      presetProps: computed(() => {
        return keep(props, forwardedPresetPropsKeys);
      }),
      handleEsc,
      handleAfterLeave,
      handleClickoutside,
      handleBeforeLeave,
      doUpdateShow,
      handleNegativeClick,
      handlePositiveClick,
      handleCloseClick,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedClsPrefix
    } = this;
    return openBlock(), createBlock(VLazyTeleport, {
      to: this.to,
      show: this.show
    }, {
      default: () => {
        this.onRender?.();
        const {
          showMask
        } = this;
        return withDirectives((openBlock(), createElementBlock("div", {
          role: "none",
          ref: "containerRef",
          class: normalizeClass$1([`${mergedClsPrefix}-modal-container`, this.themeClass, this.namespace]),
          style: normalizeStyle(this.cssVars)
        }, [showMask ? (openBlock(), createBlock(Transition, {
          name: "fade-in-transition",
          key: "mask",
          appear: this.internalAppear ?? this.isMounted
        }, {
          default: () => {
            return this.show ? (openBlock(), createElementBlock("div", {
              key: 1,
              "aria-hidden": true,
              class: normalizeClass$1(`${mergedClsPrefix}-modal-mask`)
            }, null, 2)) : null;
          }
        }, 1032, ["appear"])) : normalizeVNode(() => null), (openBlock(), createBlock(BodyWrapper_default, mergeProps({
          style: this.overlayStyle
        }, this.$attrs, {
          ref: "bodyWrapper",
          displayDirective: this.displayDirective,
          show: this.show,
          preset: this.preset,
          autoFocus: this.autoFocus,
          trapFocus: this.trapFocus,
          draggable: this.draggable,
          blockScroll: this.blockScroll,
          maskHidden: !showMask
        }, this.presetProps, {
          onEsc: this.handleEsc,
          onClose: this.handleCloseClick,
          onNegativeClick: this.handleNegativeClick,
          onPositiveClick: this.handlePositiveClick,
          onBeforeLeave: this.handleBeforeLeave,
          onAfterEnter: this.onAfterEnter,
          onAfterLeave: this.handleAfterLeave,
          onClickoutside: this.handleClickoutside
        }), normalizeSlots(this.$slots), 1040, ["style", "displayDirective", "show", "preset", "autoFocus", "trapFocus", "draggable", "blockScroll", "maskHidden", "onEsc", "onClose", "onNegativeClick", "onPositiveClick", "onBeforeLeave", "onAfterEnter", "onAfterLeave", "onClickoutside"]))], 6)), [[zindexable, {
          zIndex: this.zIndex,
          enabled: this.show
        }]]);
      }
    }, 1032, ["to", "show"]);
  }
});
//#endregion
export { Modal_default as default, modalProps };