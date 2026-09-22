import { drawerBodyInjectionKey } from "../../drawer/src/interface.mjs";
import { modalBodyInjectionKey, modalInjectionKey } from "./interface.mjs";
import { popoverBodyInjectionKey } from "../../popover/src/interface.mjs";
import { useLockHtmlScroll } from "../../_utils/composable/use-lock-html-scroll.mjs";
import { warn } from "../../_utils/naive/warn.mjs";
import { getFirstSlotVNodeWithTypedProps } from "../../_utils/vue/get-first-slot-vnode.mjs";
import { keep } from "../../_utils/vue/keep.mjs";
import { normalizeClass as normalizeClass$1, normalizeSlots } from "../../vue-jsx-vapor/vdom.mjs";
import Scrollbar from "../../_internal/scrollbar/src/Scrollbar.mjs";
import Card_default, { cardBasePropKeys } from "../../card/src/Card.mjs";
import { dialogPropKeys } from "../../dialog/src/dialogProps.mjs";
import { NDialog } from "../../dialog/src/Dialog.mjs";
import { useDragModal } from "./composables.mjs";
import { presetProps } from "./presetProps.mjs";
import { Transition, cloneVNode, computed, createBlock, createElementBlock, defineComponent, inject, mergeProps, nextTick, normalizeClass, normalizeStyle, openBlock, provide, ref, toRef, vShow, watch, withDirectives } from "vue";
import { VFocusTrap } from "vueuc";
import { clickoutside } from "vdirs";
//#region src/modal/src/BodyWrapper.tsx
var BodyWrapper_default = defineComponent({
  name: "ModalBody",
  inheritAttrs: false,
  slots: Object,
  props: {
    show: {
      type: Boolean,
      required: true
    },
    preset: String,
    displayDirective: {
      type: String,
      required: true
    },
    trapFocus: {
      type: Boolean,
      default: true
    },
    autoFocus: {
      type: Boolean,
      default: true
    },
    blockScroll: Boolean,
    draggable: {
      type: [Boolean, Object],
      default: false
    },
    maskHidden: Boolean,
    ...presetProps,
    onClickoutside: {
      type: Function,
      required: true
    },
    onBeforeLeave: {
      type: Function,
      required: true
    },
    onAfterLeave: {
      type: Function,
      required: true
    },
    onPositiveClick: {
      type: Function,
      required: true
    },
    onNegativeClick: {
      type: Function,
      required: true
    },
    onClose: {
      type: Function,
      required: true
    },
    onAfterEnter: Function,
    onEsc: Function
  },
  setup(props) {
    const bodyRef = ref(null);
    const scrollbarRef = ref(null);
    const displayedRef = ref(props.show);
    const transformOriginXRef = ref(null);
    const transformOriginYRef = ref(null);
    const NModal = inject(modalInjectionKey);
    let mousePosition = null;
    watch(toRef(props, "show"), value => {
      if (value) mousePosition = NModal.getMousePosition();
    }, {
      immediate: true
    });
    const {
      stopDrag,
      startDrag,
      draggableRef,
      draggableClassRef,
      dragX,
      dragY
    } = useDragModal(toRef(props, "draggable"), {
      onEnd: el => {
        syncTransformOrigin(el);
      }
    });
    const dialogTitleClassRef = computed(() => {
      return normalizeClass([props.titleClass, draggableClassRef.value]);
    });
    const cardHeaderClassRef = computed(() => {
      return normalizeClass([props.headerClass, draggableClassRef.value]);
    });
    watch(toRef(props, "show"), value => {
      if (value) displayedRef.value = true;
    });
    useLockHtmlScroll(computed(() => props.blockScroll && displayedRef.value));
    function styleTransformOrigin() {
      if (NModal.transformOriginRef.value === "center") return "";
      const {
        value: transformOriginX
      } = transformOriginXRef;
      const {
        value: transformOriginY
      } = transformOriginYRef;
      if (transformOriginX === null || transformOriginY === null) return "";else if (scrollbarRef.value) return `${transformOriginX}px ${transformOriginY + scrollbarRef.value.containerScrollTop}px`;
      return "";
    }
    function syncTransformOrigin(el) {
      if (NModal.transformOriginRef.value === "center") return;
      if (!mousePosition) return;
      if (!scrollbarRef.value) return;
      const scrollTop = scrollbarRef.value.containerScrollTop;
      const {
        offsetLeft,
        offsetTop
      } = el;
      const top = mousePosition.y;
      const left = mousePosition.x;
      transformOriginXRef.value = -(offsetLeft - left);
      transformOriginYRef.value = -(offsetTop - top - scrollTop);
      el.style.transformOrigin = styleTransformOrigin();
    }
    function handleEnter(el) {
      nextTick(() => {
        syncTransformOrigin(el);
      });
    }
    function handleBeforeLeave(el) {
      el.style.transformOrigin = styleTransformOrigin();
      props.onBeforeLeave();
    }
    function handleAfterEnter(el) {
      const element = el;
      draggableRef.value && startDrag(element);
      props.onAfterEnter && props.onAfterEnter(element);
    }
    function handleAfterLeave() {
      displayedRef.value = false;
      transformOriginXRef.value = null;
      transformOriginYRef.value = null;
      stopDrag();
      props.onAfterLeave();
    }
    function handleCloseClick() {
      const {
        onClose
      } = props;
      if (onClose) onClose();
    }
    function handleNegativeClick() {
      props.onNegativeClick();
    }
    function handlePositiveClick() {
      props.onPositiveClick();
    }
    const childNodeRef = ref(null);
    watch(childNodeRef, node => {
      if (node) nextTick(() => {
        const el = node.el;
        if (el && bodyRef.value !== el) bodyRef.value = el;
      });
    });
    provide(modalBodyInjectionKey, bodyRef);
    provide(drawerBodyInjectionKey, null);
    provide(popoverBodyInjectionKey, null);
    return {
      mergedTheme: NModal.mergedThemeRef,
      appear: NModal.appearRef,
      isMounted: NModal.isMountedRef,
      mergedClsPrefix: NModal.mergedClsPrefixRef,
      bodyRef,
      scrollbarRef,
      draggableClass: draggableClassRef,
      displayed: displayedRef,
      childNodeRef,
      cardHeaderClass: cardHeaderClassRef,
      dialogTitleClass: dialogTitleClassRef,
      handlePositiveClick,
      handleNegativeClick,
      handleCloseClick,
      handleAfterEnter,
      handleAfterLeave,
      handleBeforeLeave,
      handleEnter,
      dragX,
      dragY
    };
  },
  render() {
    const {
      $slots,
      $attrs,
      handleEnter,
      handleAfterEnter,
      handleAfterLeave,
      handleBeforeLeave,
      preset,
      mergedClsPrefix,
      dragX,
      dragY
    } = this;
    const effectiveAttrs = {
      ...$attrs
    };
    if (dragX !== null && dragY !== null) effectiveAttrs.style = normalizeStyle([effectiveAttrs.style, {
      left: `${dragX}px`,
      top: `${dragY}px`
    }]);
    let childNode = null;
    if (!preset) {
      childNode = getFirstSlotVNodeWithTypedProps("default", $slots.default, {
        draggableClass: this.draggableClass
      });
      if (!childNode) {
        warn("modal", "default slot is empty");
        return;
      }
      childNode = cloneVNode(childNode);
      childNode.props = mergeProps({
        class: `${mergedClsPrefix}-modal`
      }, effectiveAttrs, childNode.props || {});
    }
    return this.displayDirective === "show" || this.displayed || this.show ? withDirectives((openBlock(), createElementBlock("div", {
      key: 1,
      role: "none",
      class: normalizeClass$1([`${mergedClsPrefix}-modal-body-wrapper`, this.maskHidden && `${mergedClsPrefix}-modal-body-wrapper--mask-hidden`])
    }, [(openBlock(), createBlock(Scrollbar, {
      ref: "scrollbarRef",
      theme: this.mergedTheme.peers.Scrollbar,
      themeOverrides: this.mergedTheme.peerOverrides.Scrollbar,
      contentClass: `${mergedClsPrefix}-modal-scroll-content`
    }, {
      default: () => (openBlock(), createBlock(VFocusTrap, {
        disabled: !this.trapFocus || this.maskHidden,
        active: this.show,
        onEsc: this.onEsc,
        autoFocus: this.autoFocus
      }, {
        default: () => (openBlock(), createBlock(Transition, {
          name: "fade-in-scale-up-transition",
          appear: this.appear ?? this.isMounted,
          onEnter: handleEnter,
          onAfterEnter: handleAfterEnter,
          onAfterLeave: handleAfterLeave,
          onBeforeLeave: handleBeforeLeave
        }, {
          default: () => {
            const dirs = [[vShow, this.show]];
            dirs.push([clickoutside, this.onClickoutside, void 0, {
              capture: true
            }]);
            return withDirectives(this.preset === "confirm" || this.preset === "dialog" ? (openBlock(), createBlock(NDialog, mergeProps({
              key: 2
            }, effectiveAttrs, {
              class: [`${mergedClsPrefix}-modal`, effectiveAttrs.class],
              ref: "bodyRef",
              theme: this.mergedTheme.peers.Dialog,
              themeOverrides: this.mergedTheme.peerOverrides.Dialog
            }, keep(this.$props, dialogPropKeys), {
              titleClass: this.dialogTitleClass,
              "aria-modal": "true"
            }), normalizeSlots($slots), 1040, ["class", "theme", "themeOverrides", "titleClass"])) : this.preset === "card" ? (openBlock(), createBlock(Card_default, mergeProps({
              key: 3
            }, effectiveAttrs, {
              ref: "bodyRef",
              class: [`${mergedClsPrefix}-modal`, effectiveAttrs.class],
              theme: this.mergedTheme.peers.Card,
              themeOverrides: this.mergedTheme.peerOverrides.Card
            }, keep(this.$props, cardBasePropKeys), {
              headerClass: this.cardHeaderClass,
              "aria-modal": "true",
              role: "dialog"
            }), normalizeSlots($slots), 1040, ["class", "theme", "themeOverrides", "headerClass"])) : this.childNodeRef = childNode, dirs);
          }
        }, 1032, ["appear", "onEnter", "onAfterEnter", "onAfterLeave", "onBeforeLeave"]))
      }, 1032, ["disabled", "active", "onEsc", "autoFocus"]))
    }, 1032, ["theme", "themeOverrides", "contentClass"]))], 2)), [[vShow, this.displayDirective === "if" || this.displayed || this.show]]) : null;
  }
});
//#endregion
export { BodyWrapper_default as default };