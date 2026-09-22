import { formatLength } from "../../_utils/css/format-length.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { resolveSlot, resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { createVNodeCache, normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Close_default from "../../_internal/icons/Close.mjs";
import { floatButtonGroupInjectionKey } from "../../float-button-group/src/FloatButtonGroup.mjs";
import themeLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { computed, createBlock, createElementBlock, createElementVNode, defineComponent, inject, normalizeStyle, onBeforeUnmount, onMounted, openBlock, ref, toRef } from "vue";
import { off, on } from "evtd";
import { useMergedState } from "vooks";
//#region src/float-button/src/FloatButton.tsx
const _hoisted_1 = ["onMouseenter", "onMouseleave", "onClick"];
const floatButtonProps = {
  ...useTheme.props,
  width: {
    type: [Number, String],
    default: 40
  },
  height: {
    type: [Number, String],
    default: 40
  },
  left: [Number, String],
  right: [Number, String],
  top: [Number, String],
  bottom: [Number, String],
  shape: {
    type: String,
    default: "circle"
  },
  position: {
    type: String,
    default: "fixed"
  },
  type: {
    type: String,
    default: "default"
  },
  menuTrigger: String,
  showMenu: {
    type: Boolean,
    default: void 0
  },
  onUpdateShowMenu: {
    type: [Function, Array],
    default: void 0
  },
  "onUpdate:showMenu": {
    type: [Function, Array],
    default: void 0
  }
};
var FloatButton_default = defineComponent({
  name: "FloatButton",
  props: floatButtonProps,
  slots: Object,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const selfElRef = ref(null);
    const themeRef = useTheme("FloatButton", "-float-button", index_cssr_default, themeLight, props, mergedClsPrefixRef);
    const floatButtonGroupInjection = inject(floatButtonGroupInjectionKey, null);
    const uncontrolledShowMenuRef = ref(false);
    const controlledShoeMenuRef = toRef(props, "showMenu");
    const mergedShowMenuRef = useMergedState(controlledShoeMenuRef, uncontrolledShowMenuRef);
    function doUpdateShowMenu(value) {
      const {
        onUpdateShowMenu,
        "onUpdate:showMenu": _onUpdateShowMenu
      } = props;
      uncontrolledShowMenuRef.value = value;
      if (onUpdateShowMenu) call(onUpdateShowMenu, value);
      if (_onUpdateShowMenu) call(_onUpdateShowMenu, value);
    }
    const cssVarsRef = computed(() => {
      const {
        self: {
          color,
          textColor,
          boxShadow,
          boxShadowHover,
          boxShadowPressed,
          colorHover,
          colorPrimary,
          colorPrimaryHover,
          textColorPrimary,
          borderRadiusSquare,
          colorPressed,
          colorPrimaryPressed
        },
        common: {
          cubicBezierEaseInOut
        }
      } = themeRef.value;
      const {
        type
      } = props;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-box-shadow": boxShadow,
        "--n-box-shadow-hover": boxShadowHover,
        "--n-box-shadow-pressed": boxShadowPressed,
        "--n-color": type === "primary" ? colorPrimary : color,
        "--n-text-color": type === "primary" ? textColorPrimary : textColor,
        "--n-color-hover": type === "primary" ? colorPrimaryHover : colorHover,
        "--n-color-pressed": type === "primary" ? colorPrimaryPressed : colorPressed,
        "--n-border-radius-square": borderRadiusSquare
      };
    });
    const inlineStyle = computed(() => {
      const {
        width,
        height
      } = props;
      return {
        position: floatButtonGroupInjection ? void 0 : props.position,
        width: formatLength(width),
        minHeight: formatLength(height),
        ...(floatButtonGroupInjection ? null : {
          left: formatLength(props.left),
          right: formatLength(props.right),
          top: formatLength(props.top),
          bottom: formatLength(props.bottom)
        })
      };
    });
    const mergedShapeRef = computed(() => {
      return floatButtonGroupInjection ? floatButtonGroupInjection.shapeRef.value : props.shape;
    });
    const Mouseenter = () => {
      if (props.menuTrigger === "hover") doUpdateShowMenu(true);
    };
    const handleMouseleave = () => {
      if (props.menuTrigger === "hover" && mergedShowMenuRef.value) doUpdateShowMenu(false);
    };
    const handleClick = () => {
      if (props.menuTrigger === "click") doUpdateShowMenu(!mergedShowMenuRef.value);
    };
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("float-button", computed(() => props.type[0]), cssVarsRef, props) : void 0;
    onMounted(() => {
      const selfEl = selfElRef.value;
      if (selfEl) on("mousemoveoutside", selfEl, handleMouseleave);
    });
    onBeforeUnmount(() => {
      const selfEl = selfElRef.value;
      if (selfEl) off("mousemoveoutside", selfEl, handleMouseleave);
    });
    return {
      inlineStyle,
      selfElRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedShape: mergedShapeRef,
      mergedShowMenu: mergedShowMenuRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender,
      Mouseenter,
      handleMouseleave,
      handleClick
    };
  },
  render() {
    const {
      mergedClsPrefix,
      cssVars,
      mergedShape,
      type,
      menuTrigger,
      mergedShowMenu,
      themeClass,
      $slots,
      inlineStyle,
      onRender
    } = this;
    onRender?.();
    return (() => {
      const _cache = createVNodeCache("6bc55e1ae00d3b9b");
      return openBlock(), createElementBlock("div", {
        ref: "selfElRef",
        class: normalizeClass$1([`${mergedClsPrefix}-float-button`, `${mergedClsPrefix}-float-button--${mergedShape}-shape`, `${mergedClsPrefix}-float-button--${type}-type`, mergedShowMenu && `${mergedClsPrefix}-float-button--show-menu`, themeClass]),
        style: normalizeStyle([cssVars, inlineStyle]),
        onMouseenter: this.Mouseenter,
        onMouseleave: this.handleMouseleave,
        onClick: this.handleClick,
        role: "button"
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-float-button__fill`),
        "aria-hidden": true
      }, null, 2), createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-float-button__body`)
      }, [normalizeVNode(() => $slots.default?.()), normalizeVNode(() => resolveWrappedSlot($slots.description, children => {
        if (children) return openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass$1(`${mergedClsPrefix}-float-button__description`)
        }, [normalizeVNode(() => children)], 2);
        return null;
      }))], 2), menuTrigger ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass$1(`${mergedClsPrefix}-float-button__close`)
      }, [(openBlock(), createBlock(Icon_default, {
        clsPrefix: mergedClsPrefix
      }, {
        default: () => (openBlock(), createBlock(Close_default))
      }, 1032, ["clsPrefix"]))], 2)) : normalizeVNode(() => null), menuTrigger ? (openBlock(), createElementBlock("div", {
        key: 2,
        onClick: _cache[0] || (_cache[0] = e => {
          e.stopPropagation();
        }),
        "data-float-button-menu": true,
        class: normalizeClass$1(`${mergedClsPrefix}-float-button__menu`)
      }, [normalizeVNode(() => resolveSlot($slots.menu, () => []))], 2)) : normalizeVNode(() => null)], 46, _hoisted_1);
    })();
  }
});
//#endregion
export { FloatButton_default as default, floatButtonProps };