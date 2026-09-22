const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_checkbox_src_Checkbox = require("../../checkbox/src/Checkbox.js");
const require_tree_src_interface = require("./interface.js");
let vue = require("vue");
//#region src/tree/src/TreeNodeCheckbox.tsx
var TreeNodeCheckbox_default = (0, vue.defineComponent)({
	name: "NTreeNodeCheckbox",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		indent: {
			type: Number,
			required: true
		},
		right: Boolean,
		focusable: Boolean,
		disabled: Boolean,
		checked: Boolean,
		indeterminate: Boolean,
		onCheck: Function
	},
	setup(props) {
		const NTree = (0, vue.inject)(require_tree_src_interface.treeInjectionKey);
		function doCheck(value) {
			const { onCheck } = props;
			if (onCheck) onCheck(value);
		}
		function handleUpdateValue(value) {
			doCheck(value);
		}
		return {
			handleUpdateValue,
			mergedTheme: NTree.mergedThemeRef
		};
	},
	render() {
		const { clsPrefix, mergedTheme, checked, indeterminate, disabled, focusable, indent, handleUpdateValue } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
			class: require_vdom.normalizeClass([`${clsPrefix}-tree-node-checkbox`, this.right && `${clsPrefix}-tree-node-checkbox--right`]),
			style: (0, vue.normalizeStyle)({ width: `${indent}px` }),
			"data-checkbox": true
		}, [((0, vue.openBlock)(), (0, vue.createBlock)(require_checkbox_src_Checkbox.default, {
			focusable,
			disabled,
			theme: mergedTheme.peers.Checkbox,
			themeOverrides: mergedTheme.peerOverrides.Checkbox,
			checked,
			indeterminate,
			onUpdateChecked: handleUpdateValue
		}, null, 8, [
			"focusable",
			"disabled",
			"theme",
			"themeOverrides",
			"checked",
			"indeterminate",
			"onUpdateChecked"
		]))], 6);
	}
});
//#endregion
module.exports = TreeNodeCheckbox_default;
