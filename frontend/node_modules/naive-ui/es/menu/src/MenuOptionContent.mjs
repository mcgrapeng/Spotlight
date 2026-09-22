import { render } from "../../_utils/vue/render.mjs";
import { createVNodeCache, normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import ChevronDownFilled_default from "../../_internal/icons/ChevronDownFilled.mjs";
import { menuInjectionKey } from "./context.mjs";
import { Fragment, computed, createBlock, createElementBlock, createElementVNode, defineComponent, inject, normalizeStyle, openBlock } from "vue";
//#region src/menu/src/MenuOptionContent.tsx
const _hoisted_1 = ["onClick"];
var MenuOptionContent_default = defineComponent({
  name: "MenuOptionContent",
  props: {
    collapsed: Boolean,
    disabled: Boolean,
    title: [String, Function],
    icon: Function,
    extra: [String, Function],
    showArrow: Boolean,
    childActive: Boolean,
    hover: Boolean,
    paddingLeft: Number,
    selected: Boolean,
    maxIconSize: {
      type: Number,
      required: true
    },
    activeIconSize: {
      type: Number,
      required: true
    },
    iconMarginRight: {
      type: Number,
      required: true
    },
    clsPrefix: {
      type: String,
      required: true
    },
    onClick: Function,
    tmNode: {
      type: Object,
      required: true
    },
    isEllipsisPlaceholder: Boolean
  },
  setup(props) {
    const {
      props: menuProps
    } = inject(menuInjectionKey);
    return {
      menuProps,
      style: computed(() => {
        const {
          paddingLeft
        } = props;
        return {
          paddingLeft: paddingLeft && `${paddingLeft}px`
        };
      }),
      iconStyle: computed(() => {
        const {
          maxIconSize,
          activeIconSize,
          iconMarginRight
        } = props;
        return {
          width: `${maxIconSize}px`,
          height: `${maxIconSize}px`,
          fontSize: `${activeIconSize}px`,
          marginRight: `${iconMarginRight}px`
        };
      })
    };
  },
  render() {
    const {
      clsPrefix,
      tmNode,
      menuProps: {
        renderIcon,
        renderLabel,
        renderExtra,
        expandIcon
      }
    } = this;
    const icon = renderIcon ? renderIcon(tmNode.rawNode) : render(this.icon);
    return (() => {
      const _cache = createVNodeCache("7bb10afc6caf8fa4");
      return openBlock(), createElementBlock("div", {
        onClick: e => {
          this.onClick?.(e);
        },
        role: "none",
        class: normalizeClass$1([`${clsPrefix}-menu-item-content`, {
          [`${clsPrefix}-menu-item-content--selected`]: this.selected,
          [`${clsPrefix}-menu-item-content--collapsed`]: this.collapsed,
          [`${clsPrefix}-menu-item-content--child-active`]: this.childActive,
          [`${clsPrefix}-menu-item-content--disabled`]: this.disabled,
          [`${clsPrefix}-menu-item-content--hover`]: this.hover
        }]),
        style: normalizeStyle(this.style)
      }, [normalizeVNode(() => icon && (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${clsPrefix}-menu-item-content__icon`),
        style: normalizeStyle(this.iconStyle),
        role: "none"
      }, [normalizeVNode(() => [icon])], 6))), createElementVNode("div", {
        class: normalizeClass$1(`${clsPrefix}-menu-item-content-header`),
        role: "none"
      }, [this.isEllipsisPlaceholder ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => this.title)], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [renderLabel ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => renderLabel(tmNode.rawNode))], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => render(this.title))], 64))], 64)), this.extra || renderExtra ? (openBlock(), createElementBlock("span", {
        key: 2,
        class: normalizeClass$1(`${clsPrefix}-menu-item-content-header__extra`)
      }, [_cache[0] || (_cache[0] = normalizeVNode(" ", -1)), renderExtra ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => renderExtra(tmNode.rawNode))], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => render(this.extra))], 64))], 2)) : normalizeVNode(() => null)], 2), this.showArrow ? (openBlock(), createBlock(Icon_default, {
        key: 0,
        ariaHidden: true,
        class: normalizeClass$1(`${clsPrefix}-menu-item-content__arrow`),
        clsPrefix
      }, {
        default: () => expandIcon ? expandIcon(tmNode.rawNode) : (openBlock(), createBlock(ChevronDownFilled_default, {
          key: 1
        }))
      }, 1032, ["class", "clsPrefix"])) : normalizeVNode(() => null)], 14, _hoisted_1);
    })();
  }
});
//#endregion
export { MenuOptionContent_default as default };