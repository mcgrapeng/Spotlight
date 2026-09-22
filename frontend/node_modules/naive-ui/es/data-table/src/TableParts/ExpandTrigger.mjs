import { createVNodeCache, normalizeClass as normalizeClass$1 } from "../../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../../_internal/icon/src/Icon.mjs";
import IconSwitchTransition_default from "../../../_internal/icon-switch-transition/src/IconSwitchTransition.mjs";
import ChevronRight_default from "../../../_internal/icons/ChevronRight.mjs";
import Loading_default from "../../../_internal/loading/src/Loading.mjs";
import { createBlock, createElementBlock, createVNode, defineComponent, openBlock } from "vue";
//#region src/data-table/src/TableParts/ExpandTrigger.tsx
const _hoisted_1 = ["onClick"];
var ExpandTrigger_default = defineComponent({
  name: "DataTableExpandTrigger",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    expanded: Boolean,
    loading: Boolean,
    onClick: {
      type: Function,
      required: true
    },
    renderExpandIcon: {
      type: Function
    },
    rowData: {
      type: Object,
      required: true
    }
  },
  render() {
    const {
      clsPrefix
    } = this;
    return (() => {
      const _cache = createVNodeCache("82f30e69bbec5134");
      return openBlock(), createElementBlock("div", {
        class: normalizeClass$1([`${clsPrefix}-data-table-expand-trigger`, this.expanded && `${clsPrefix}-data-table-expand-trigger--expanded`]),
        onClick: this.onClick,
        onMousedown: _cache[0] || (_cache[0] = e => {
          e.preventDefault();
        })
      }, [createVNode(IconSwitchTransition_default, null, {
        default: () => {
          return this.loading ? (openBlock(), createBlock(Loading_default, {
            key: "loading",
            clsPrefix: this.clsPrefix,
            radius: 85,
            strokeWidth: 15,
            scale: .88
          }, null, 8, ["clsPrefix"])) : this.renderExpandIcon ? this.renderExpandIcon({
            expanded: this.expanded,
            rowData: this.rowData
          }) : (openBlock(), createBlock(Icon_default, {
            clsPrefix,
            key: "base-icon"
          }, {
            default: () => (openBlock(), createBlock(ChevronRight_default))
          }, 1032, ["clsPrefix"]));
        }
      }, 1024)], 42, _hoisted_1);
    })();
  }
});
//#endregion
export { ExpandTrigger_default as default };