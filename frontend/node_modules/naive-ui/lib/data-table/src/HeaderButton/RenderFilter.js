//#region src/data-table/src/HeaderButton/RenderFilter.ts
var RenderFilter_default = (0, require("vue").defineComponent)({
	name: "DataTableRenderFilter",
	props: {
		render: {
			type: Function,
			required: true
		},
		active: Boolean,
		show: Boolean
	},
	render() {
		const { render, active, show } = this;
		return render({
			active,
			show
		});
	}
});
//#endregion
module.exports = RenderFilter_default;
