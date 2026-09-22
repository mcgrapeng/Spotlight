import { normalizeClass as normalizeClass$1 } from "../../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../../_internal/icon/src/Icon.mjs";
import ChevronDown_default from "../../../_internal/icons/ChevronDown.mjs";
import { dataTableInjectionKey } from "../interface.mjs";
import Dropdown_default from "../../../dropdown/src/Dropdown.mjs";
import { computed, createBlock, defineComponent, inject, openBlock } from "vue";
//#region src/data-table/src/TableParts/SelectionMenu.tsx
const allKey = "_n_all__";
const noneKey = "_n_none__";
function createSelectHandler(options, rawPaginatedDataRef, doCheckAll, doUncheckAll) {
  if (!options) return () => {};
  return key => {
    for (const option of options) switch (key) {
      case allKey:
        doCheckAll(true);
        return;
      case noneKey:
        doUncheckAll(true);
        return;
      default:
        if (typeof option === "object" && option.key === key) {
          option.onSelect(rawPaginatedDataRef.value);
          return;
        }
    }
  };
}
function createDropdownOptions(options, localeRef) {
  if (!options) return [];
  return options.map(option => {
    switch (option) {
      case "all":
        return {
          label: localeRef.checkTableAll,
          key: allKey
        };
      case "none":
        return {
          label: localeRef.uncheckTableAll,
          key: noneKey
        };
      default:
        return option;
    }
  });
}
var SelectionMenu_default = defineComponent({
  name: "DataTableSelectionMenu",
  props: {
    clsPrefix: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const {
      props: dataTableProps,
      localeRef,
      checkOptionsRef,
      rawPaginatedDataRef,
      doCheckAll,
      doUncheckAll
    } = inject(dataTableInjectionKey);
    const handleSelectRef = computed(() => createSelectHandler(checkOptionsRef.value, rawPaginatedDataRef, doCheckAll, doUncheckAll));
    const optionsRef = computed(() => createDropdownOptions(checkOptionsRef.value, localeRef.value));
    return () => {
      const {
        clsPrefix
      } = props;
      return openBlock(), createBlock(Dropdown_default, {
        theme: dataTableProps.theme?.peers?.Dropdown,
        themeOverrides: dataTableProps.themeOverrides?.peers?.Dropdown,
        options: optionsRef.value,
        onSelect: handleSelectRef.value
      }, {
        default: () => (openBlock(), createBlock(Icon_default, {
          clsPrefix,
          class: normalizeClass$1(`${clsPrefix}-data-table-check-extra`)
        }, {
          default: () => (openBlock(), createBlock(ChevronDown_default))
        }, 1032, ["clsPrefix", "class"]))
      }, 1032, ["theme", "themeOverrides", "options", "onSelect"]);
    };
  }
});
//#endregion
export { SelectionMenu_default as default };