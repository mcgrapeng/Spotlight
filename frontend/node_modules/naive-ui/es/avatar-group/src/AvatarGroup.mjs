import useConfig from "../../_mixins/use-config.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { avatarGroupInjectionKey } from "../../avatar/src/context.mjs";
import Avatar_default from "../../avatar/src/Avatar.mjs";
import avatarGroupLight from "../styles/light.mjs";
import avatar_group_cssr_default from "./styles/avatar-group.cssr.mjs";
import { computed, createBlock, createElementBlock, defineComponent, normalizeStyle, openBlock, provide } from "vue";
//#region src/avatar-group/src/AvatarGroup.tsx
const avatarGroupProps = {
  ...useTheme.props,
  max: Number,
  maxStyle: [Object, String],
  options: {
    type: Array,
    default: () => []
  },
  vertical: Boolean,
  expandOnHover: Boolean,
  size: [String, Number]
};
var AvatarGroup_default = defineComponent({
  name: "AvatarGroup",
  props: avatarGroupProps,
  slots: Object,
  setup(props) {
    const {
      mergedClsPrefixRef,
      mergedRtlRef
    } = useConfig(props);
    const mergedThemeRef = useTheme("AvatarGroup", "-avatar-group", avatar_group_cssr_default, avatarGroupLight, props, mergedClsPrefixRef);
    provide(avatarGroupInjectionKey, props);
    return {
      mergedTheme: mergedThemeRef,
      rtlEnabled: useRtl("AvatarGroup", mergedRtlRef, mergedClsPrefixRef),
      mergedClsPrefix: mergedClsPrefixRef,
      restOptions: computed(() => {
        const {
          max
        } = props;
        if (max === void 0) return void 0;
        const {
          options
        } = props;
        if (options.length > max) return options.slice(max - 1, options.length);
        return [];
      }),
      displayedOptions: computed(() => {
        const {
          options,
          max
        } = props;
        if (max === void 0) return options;
        if (options.length > max) return options.slice(0, max - 1);
        if (options.length === max) return options.slice(0, max);
        return options;
      }),
      cssVars: computed(() => {
        return {
          "--n-gap": mergedThemeRef.value.self.gap
        };
      })
    };
  },
  render() {
    const {
      mergedClsPrefix,
      displayedOptions,
      restOptions,
      mergedTheme,
      $slots
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-avatar-group`, this.rtlEnabled && `${mergedClsPrefix}-avatar-group--rtl`, this.vertical && `${mergedClsPrefix}-avatar-group--vertical`, this.expandOnHover && `${mergedClsPrefix}-avatar-group--expand-on-hover`]),
      style: normalizeStyle(this.cssVars),
      role: "group"
    }, [normalizeVNode(() => displayedOptions.map(option => {
      return $slots.avatar ? $slots.avatar({
        option
      }) : (openBlock(), createBlock(Avatar_default, {
        key: 1,
        src: option.src,
        theme: mergedTheme.peers.Avatar,
        themeOverrides: mergedTheme.peerOverrides.Avatar
      }, null, 8, ["src", "theme", "themeOverrides"]));
    })), normalizeVNode(() => restOptions !== void 0 && restOptions.length > 0 && ($slots.rest ? $slots.rest({
      options: restOptions,
      rest: restOptions.length
    }) : (openBlock(), createBlock(Avatar_default, {
      key: 2,
      style: normalizeStyle(this.maxStyle),
      theme: mergedTheme.peers.Avatar,
      themeOverrides: mergedTheme.peerOverrides.Avatar
    }, {
      default: () => `+${restOptions.length}`
    }, 1032, ["style", "theme", "themeOverrides"]))))], 6);
  }
});
//#endregion
export { avatarGroupProps, AvatarGroup_default as default };