import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import Ellipsis_default from "../../../ellipsis/src/Ellipsis.mjs";
import { NPerformantEllipsis } from "../../../ellipsis/src/PerformantEllipsis.mjs";
import { createBlock, createElementBlock, defineComponent, mergeProps, openBlock } from "vue";
import { get } from "lodash-es";
//#region src/data-table/src/TableParts/Cell.tsx
var Cell_default = defineComponent({
  name: "DataTableCell",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    row: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    column: {
      type: Object,
      required: true
    },
    isSummary: Boolean,
    mergedTheme: {
      type: Object,
      required: true
    },
    renderCell: Function
  },
  render() {
    const {
      isSummary,
      column,
      row,
      renderCell
    } = this;
    let cell;
    const {
      render,
      key,
      ellipsis
    } = column;
    if (render && !isSummary) cell = render(row, this.index);else if (isSummary) cell = row[key]?.value;else cell = renderCell ? renderCell(get(row, key), row, column) : get(row, key);
    if (ellipsis) {
      if (typeof ellipsis === "object") {
        const {
          mergedTheme
        } = this;
        if (column.ellipsisComponent === "performant-ellipsis") return openBlock(), createBlock(NPerformantEllipsis, mergeProps({
          key: 1
        }, ellipsis, {
          theme: mergedTheme.peers.Ellipsis,
          themeOverrides: mergedTheme.peerOverrides.Ellipsis
        }), {
          default: () => cell
        }, 1040, ["theme", "themeOverrides"]);
        return openBlock(), createBlock(Ellipsis_default, mergeProps({
          key: 2
        }, ellipsis, {
          theme: mergedTheme.peers.Ellipsis,
          themeOverrides: mergedTheme.peerOverrides.Ellipsis
        }), {
          default: () => cell
        }, 1040, ["theme", "themeOverrides"]);
      } else return openBlock(), createElementBlock("span", {
        key: 3,
        class: normalizeClass$1(`${this.clsPrefix}-data-table-td__ellipsis`)
      }, [normalizeVNode(() => cell)], 2);
    }
    return cell;
  }
});
//#endregion
export { Cell_default as default };