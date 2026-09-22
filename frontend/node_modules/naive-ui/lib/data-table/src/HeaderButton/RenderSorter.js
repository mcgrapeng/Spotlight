//#region src/data-table/src/HeaderButton/RenderSorter.ts
var RenderSorter_default = (0, require("vue").defineComponent)({
	name: "DataTableRenderSorter",
	props: {
		render: {
			type: Function,
			required: true
		},
		order: {
			type: [String, Boolean],
			default: false
		}
	},
	render() {
		const { render, order } = this;
		return render({ order });
	}
});
//#endregion
module.exports = RenderSorter_default;
