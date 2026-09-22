const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_select_menu_src_SelectMenu = require("../../_internal/select-menu/src/SelectMenu.js");
const require_select_src_utils = require("../../select/src/utils.js");
const require_cascader_src_interface = require("./interface.js");
const require_cascader_src_utils = require("./utils.js");
let vue = require("vue");
let treemate = require("treemate");
let vdirs = require("vdirs");
//#region src/cascader/src/CascaderSelectMenu.tsx
var CascaderSelectMenu_default = (0, vue.defineComponent)({
	name: "NCascaderSelectMenu",
	props: {
		value: {
			type: [
				String,
				Number,
				Array
			],
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
		const { isMountedRef, mergedValueRef, mergedClsPrefixRef, mergedThemeRef, mergedCheckStrategyRef, slots: cascaderSlots, syncSelectMenuPosition, closeMenu, handleSelectMenuClickOutside, doUncheck: cascaderDoUncheck, doCheck: cascaderDoCheck, scrollbarPropsRef, clearPattern } = (0, vue.inject)(require_cascader_src_interface.cascaderInjectionKey);
		const menuInstRef = (0, vue.ref)(null);
		const selectOptionsRef = (0, vue.computed)(() => {
			return require_cascader_src_utils.createSelectOptions(props.tmNodes, mergedCheckStrategyRef.value === "child", props.labelField, props.separator);
		});
		const mergedFilterRef = (0, vue.computed)(() => {
			const { filter } = props;
			if (filter) return filter;
			const { labelField } = props;
			return (pattern, _, path) => path.some((option) => option[labelField] && ~option[labelField].toLowerCase().indexOf(pattern.toLowerCase()));
		});
		const filteredSelectOptionsRef = (0, vue.computed)(() => {
			const { pattern } = props;
			const { value: mergedFilter } = mergedFilterRef;
			return (pattern ? selectOptionsRef.value.filter((option) => {
				return mergedFilter(pattern, option.rawNode, option.path);
			}) : selectOptionsRef.value).map((option) => ({
				value: option.value,
				label: option.label
			}));
		});
		const selectTreeMateRef = (0, vue.computed)(() => {
			return (0, treemate.createTreeMate)(filteredSelectOptionsRef.value, require_select_src_utils.createTmOptions("value", "children"));
		});
		function handleResize() {
			syncSelectMenuPosition();
		}
		function handleToggle(tmNode) {
			doCheck(tmNode);
		}
		function doCheck(tmNode) {
			if (props.multiple) {
				const { value: mergedValue } = mergedValueRef;
				if (Array.isArray(mergedValue)) {
					if (!mergedValue.includes(tmNode.key)) cascaderDoCheck(tmNode.key);
					else cascaderDoUncheck(tmNode.key);
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
		const { mergedClsPrefix, isMounted, mergedTheme, cascaderSlots } = this;
		return (0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
			name: "fade-in-scale-up-transition",
			appear: isMounted
		}, { default: () => this.show ? (0, vue.withDirectives)(((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_select_menu_src_SelectMenu, {
			key: 1,
			ref: "menuInstRef",
			onResize: this.handleResize,
			clsPrefix: mergedClsPrefix,
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-cascader-menu`),
			autoPending: true,
			themeOverrides: mergedTheme.peerOverrides.InternalSelectMenu,
			theme: mergedTheme.peers.InternalSelectMenu,
			treeMate: this.selectTreeMate,
			multiple: this.multiple,
			value: this.value,
			onToggle: this.handleToggle,
			scrollbarProps: this.scrollbarProps
		}, { empty: () => require__utils_vue_resolve_slot.resolveSlot(cascaderSlots["not-found"], () => []) }, 1032, [
			"onResize",
			"clsPrefix",
			"class",
			"themeOverrides",
			"theme",
			"treeMate",
			"multiple",
			"value",
			"onToggle",
			"scrollbarProps"
		])), [[
			vdirs.clickoutside,
			this.handleClickOutside,
			void 0,
			{ capture: true }
		]]) : null }, 1032, ["appear"]);
	}
});
//#endregion
module.exports = CascaderSelectMenu_default;
