import { createKey } from "../../_utils/cssr/index.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useLocale from "../../_mixins/use-locale.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Empty_default$1 from "../../_internal/icons/Empty.mjs";
import emptyLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { Fragment, computed, createBlock, createElementBlock, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/empty/src/Empty.tsx
const emptyProps = {
  ...useTheme.props,
  description: String,
  showDescription: {
    type: Boolean,
    default: true
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: "medium"
  },
  renderIcon: Function
};
var Empty_default = defineComponent({
  name: "Empty",
  props: emptyProps,
  slots: Object,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedComponentPropsRef
    } = useConfig(props);
    const themeRef = useTheme("Empty", "-empty", index_cssr_default, emptyLight, props, mergedClsPrefixRef);
    const {
      localeRef
    } = useLocale("Empty");
    const mergedDescriptionRef = computed(() => {
      return props.description ?? mergedComponentPropsRef?.value?.Empty?.description;
    });
    const mergedRenderIconRef = computed(() => mergedComponentPropsRef?.value?.Empty?.renderIcon || (() => (openBlock(), createBlock(Empty_default$1))));
    const cssVarsRef = computed(() => {
      const {
        size
      } = props;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          [createKey("iconSize", size)]: iconSize,
          [createKey("fontSize", size)]: fontSize,
          textColor,
          iconColor,
          extraTextColor
        }
      } = themeRef.value;
      return {
        "--n-icon-size": iconSize,
        "--n-font-size": fontSize,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-text-color": textColor,
        "--n-icon-color": iconColor,
        "--n-extra-text-color": extraTextColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("empty", computed(() => {
      let hash = "";
      const {
        size
      } = props;
      hash += size[0];
      return hash;
    }), cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      mergedRenderIcon: mergedRenderIconRef,
      localizedDescription: computed(() => {
        return mergedDescriptionRef.value || localeRef.value.description;
      }),
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      $slots,
      mergedClsPrefix,
      onRender
    } = this;
    onRender?.();
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-empty`, this.themeClass]),
      style: normalizeStyle(this.cssVars)
    }, [this.showIcon ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-empty__icon`)
    }, [$slots.icon ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => $slots.icon())], 64)) : (openBlock(), createBlock(Icon_default, {
      key: 1,
      clsPrefix: mergedClsPrefix
    }, {
      default: this.mergedRenderIcon
    }, 1032, ["clsPrefix"]))], 2)) : normalizeVNode(() => null), this.showDescription ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1(`${mergedClsPrefix}-empty__description`)
    }, [$slots.default ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => $slots.default())], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => this.localizedDescription)], 64))], 2)) : normalizeVNode(() => null), $slots.extra ? (openBlock(), createElementBlock("div", {
      key: 4,
      class: normalizeClass$1(`${mergedClsPrefix}-empty__extra`)
    }, [normalizeVNode(() => $slots.extra())], 2)) : normalizeVNode(() => null)], 6);
  }
});
//#endregion
export { Empty_default as default, emptyProps };