import { resolveSlot } from "../../_utils/vue/resolve-slot.mjs";
import { normalizeClass as normalizeClass$1 } from "../../vue-jsx-vapor/vdom.mjs";
import SelectMenu_default from "../../_internal/select-menu/src/SelectMenu.mjs";
import { createTmOptions } from "../../select/src/utils.mjs";
import { cascaderInjectionKey } from "./interface.mjs";
import { createSelectOptions } from "./utils.mjs";
import { Transition, computed, createBlock, defineComponent, inject, openBlock, ref, withDirectives } from "vue";
import { createTreeMate } from "treemate";
import { clickoutside } from "vdirs";
//#region src/cascader/src/CascaderSelectMenu.tsx
var CascaderSelectMenu_default = defineComponent({
  name: "NCascaderSelectMenu",
  props: {
    value: {
      type: [String, Number, Array],
      default: null
    },
    show: Boolean,
    pattern: {
      type: String,
      default: ""
    },
    multiple: Boolean,
    tmNodes: {
      type: Array,
      default: () => []
    },
    filter: Function,
    labelField: {
      type: String,
      required: true
    },
    separator: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const {
      isMountedRef,
      mergedValueRef,
      mergedClsPrefixRef,
      mergedThemeRef,
      mergedCheckStrategyRef,
      slots: cascaderSlots,
      syncSelectMenuPosition,
      closeMenu,
      handleSelectMenuClickOutside,
      doUncheck: cascaderDoUncheck,
      doCheck: cascaderDoCheck,
      scrollbarPropsRef,
      clearPattern
    } = inject(cascaderInjectionKey);
    const menuInstRef = ref(null);
    const selectOptionsRef = computed(() => {
      return createSelectOptions(props.tmNodes, mergedCheckStrategyRef.value === "child", props.labelField, props.separator);
    });
    const mergedFilterRef = computed(() => {
      const {
        filter
      } = props;
      if (filter) return filter;
      const {
        labelField
      } = props;
      return (pattern, _, path) => path.some(option => option[labelField] && ~option[labelField].toLowerCase().indexOf(pattern.toLowerCase()));
    });
    const filteredSelectOptionsRef = computed(() => {
      const {
        pattern
      } = props;
      const {
        value: mergedFilter
      } = mergedFilterRef;
      return (pattern ? selectOptionsRef.value.filter(option => {
        return mergedFilter(pattern, option.rawNode, option.path);
      }) : selectOptionsRef.value).map(option => ({
        value: option.value,
        label: option.label
      }));
    });
    const selectTreeMateRef = computed(() => {
      return createTreeMate(filteredSelectOptionsRef.value, createTmOptions("value", "children"));
    });
    function handleResize() {
      syncSelectMenuPosition();
    }
    function handleToggle(tmNode) {
      doCheck(tmNode);
    }
    function doCheck(tmNode) {
      if (props.multiple) {
        const {
          value: mergedValue
        } = mergedValueRef;
        if (Array.isArray(mergedValue)) {
          if (!mergedValue.includes(tmNode.key)) cascaderDoCheck(tmNode.key);else cascaderDoUncheck(tmNode.key);
        } else if (mergedValue === null) cascaderDoCheck(tmNode.key);
        clearPattern();
      } else {
        cascaderDoCheck(tmNode.key);
        closeMenu(true);
      }
    }
    function prev() {
      menuInstRef.value?.prev();
    }
    function next() {
      menuInstRef.value?.next();
    }
    function enter() {
      if (menuInstRef) {
        const pendingOptionTmNode = menuInstRef.value?.getPendingTmNode();
        if (pendingOptionTmNode) doCheck(pendingOptionTmNode);
        return true;
      }
      return false;
    }
    function handleClickOutside(e) {
      handleSelectMenuClickOutside(e);
    }
    return {
      isMounted: isMountedRef,
      mergedTheme: mergedThemeRef,
      mergedClsPrefix: mergedClsPrefixRef,
      menuInstRef,
      selectTreeMate: selectTreeMateRef,
      handleResize,
      handleToggle,
      handleClickOutside,
      cascaderSlots,
      scrollbarProps: scrollbarPropsRef,
      prev,
      next,
      enter
    };
  },
  render() {
    const {
      mergedClsPrefix,
      isMounted,
      mergedTheme,
      cascaderSlots
    } = this;
    return openBlock(), createBlock(Transition, {
      name: "fade-in-scale-up-transition",
      appear: isMounted
    }, {
      default: () => this.show ? withDirectives((openBlock(), createBlock(SelectMenu_default, {
        key: 1,
        ref: "menuInstRef",
        onResize: this.handleResize,
        clsPrefix: mergedClsPrefix,
        class: normalizeClass$1(`${mergedClsPrefix}-cascader-menu`),
        autoPending: true,
        themeOverrides: mergedTheme.peerOverrides.InternalSelectMenu,
        theme: mergedTheme.peers.InternalSelectMenu,
        treeMate: this.selectTreeMate,
        multiple: this.multiple,
        value: this.value,
        onToggle: this.handleToggle,
        scrollbarProps: this.scrollbarProps
      }, {
        empty: () => resolveSlot(cascaderSlots["not-found"], () => [])
      }, 1032, ["onResize", "clsPrefix", "class", "themeOverrides", "theme", "treeMate", "multiple", "value", "onToggle", "scrollbarProps"])), [[clickoutside, this.handleClickOutside, void 0, {
        capture: true
      }]]) : null
    }, 1032, ["appear"]);
  }
});
//#endregion
export { CascaderSelectMenu_default as default };