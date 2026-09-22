const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Checkmark = require("../../_internal/icons/Checkmark.js");
const require__internal_icons_ChevronRight = require("../../_internal/icons/ChevronRight.js");
const require__internal_loading_src_Loading = require("../../_internal/loading/src/Loading.js");
const require_checkbox_src_Checkbox = require("../../checkbox/src/Checkbox.js");
const require_cascader_src_interface = require("./interface.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
//#region src/cascader/src/CascaderOption.tsx
const _hoisted_1 = [
	"onMouseenter",
	"onMousemove",
	"onClick"
];
var CascaderOption_default = (0, vue.defineComponent)({
	name: "NCascaderOption",
	props: { tmNode: {
		type: Object,
		required: true
	} },
	setup(props) {
		const { expandTriggerRef, remoteRef, multipleRef, mergedValueRef, checkedKeysRef, indeterminateKeysRef, hoverKeyPathRef, keyboardKeyRef, loadingKeySetRef, cascadeRef, mergedCheckStrategyRef, onLoadRef, mergedClsPrefixRef, mergedThemeRef, labelFieldRef, showCheckboxRef, renderPrefixRef, renderSuffixRef, spinPropsRef, updateHoverKey, updateKeyboardKey, addLoadingKey, deleteLoadingKey, closeMenu, doCheck, doUncheck, renderLabelRef } = (0, vue.inject)(require_cascader_src_interface.cascaderInjectionKey);
		const valueRef = (0, vue.computed)(() => props.tmNode.key);
		const useHoverTriggerRef = (0, vue.computed)(() => {
			const { value: expandTrigger } = expandTriggerRef;
			const { value: remote } = remoteRef;
			return !remote && expandTrigger === "hover";
		});
		const mergedHandleMouseEnterRef = (0, vue.computed)(() => {
			if (useHoverTriggerRef.value) return handleMouseEnter;
		});
		const mergedHandleMouseMoveRef = (0, vue.computed)(() => {
			if (useHoverTriggerRef.value) return handleMouseMove;
		});
		const checkedRef = (0, vooks.useMemo)(() => {
			const { value: multiple } = multipleRef;
			if (!multiple) return mergedValueRef.value === valueRef.value;
			return checkedKeysRef.value.includes(valueRef.value);
		});
		const indeterminateRef = (0, vooks.useMemo)(() => {
			if (!multipleRef.value) return false;
			return indeterminateKeysRef.value.includes(valueRef.value);
		});
		const hoverPendingRef = (0, vooks.useMemo)(() => {
			return hoverKeyPathRef.value.includes(valueRef.value);
		});
		const keyboardPendingRef = (0, vooks.useMemo)(() => {
			const { value: keyboardKey } = keyboardKeyRef;
			if (keyboardKey === null) return false;
			return keyboardKey === valueRef.value;
		});
		const isLoadingRef = (0, vooks.useMemo)(() => {
			if (remoteRef.value) return loadingKeySetRef.value.has(valueRef.value);
			return false;
		});
		const isLeafRef = (0, vue.computed)(() => props.tmNode.isLeaf);
		const disabledRef = (0, vue.computed)(() => props.tmNode.disabled);
		const labelRef = (0, vue.computed)(() => props.tmNode.rawNode[labelFieldRef.value]);
		const isShallowLoadedRef = (0, vue.computed)(() => {
			return props.tmNode.shallowLoaded;
		});
		function handleClick(e) {
			if (disabledRef.value) return;
			const { value: remote } = remoteRef;
			const { value: loadingKeySet } = loadingKeySetRef;
			const { value: onLoad } = onLoadRef;
			const { value } = valueRef;
			const { value: isLeaf } = isLeafRef;
			const { value: isShallowLoaded } = isShallowLoadedRef;
			if (!(0, seemly.happensIn)(e, "checkbox")) {
				if (remote && !isShallowLoaded && !loadingKeySet.has(value) && onLoad) {
					addLoadingKey(value);
					onLoad(props.tmNode.rawNode).then(() => {
						deleteLoadingKey(value);
					}).catch(() => {
						deleteLoadingKey(value);
					});
				}
				updateHoverKey(value);
				updateKeyboardKey(value);
			}
			if (isLeaf) toggleCheckbox();
		}
		function handleMouseEnter() {
			if (!useHoverTriggerRef.value || disabledRef.value) return;
			const { value } = valueRef;
			updateHoverKey(value);
			updateKeyboardKey(value);
		}
		function handleMouseMove() {
			if (!useHoverTriggerRef.value) return;
			handleMouseEnter();
		}
		function handleCheckboxUpdateValue() {
			const { value: isLeaf } = isLeafRef;
			if (!isLeaf) toggleCheckbox();
		}
		function toggleCheckbox() {
			const { value: multiple } = multipleRef;
			const { value } = valueRef;
			if (multiple) {
				if (indeterminateRef.value || checkedRef.value) doUncheck(value);
				else doCheck(value);
			} else {
				doCheck(value);
				closeMenu(true);
			}
		}
		return {
			checkStrategy: mergedCheckStrategyRef,
			multiple: multipleRef,
			cascade: cascadeRef,
			checked: checkedRef,
			indeterminate: indeterminateRef,
			hoverPending: hoverPendingRef,
			keyboardPending: keyboardPendingRef,
			isLoading: isLoadingRef,
			showCheckbox: showCheckboxRef,
			isLeaf: isLeafRef,
			disabled: disabledRef,
			label: labelRef,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedTheme: mergedThemeRef,
			spinProps: spinPropsRef,
			handleClick,
			handleCheckboxUpdateValue,
			mergedHandleMouseEnter: mergedHandleMouseEnterRef,
			mergedHandleMouseMove: mergedHandleMouseMoveRef,
			renderLabel: renderLabelRef,
			renderPrefix: renderPrefixRef,
			renderSuffix: renderSuffixRef
		};
	},
	render() {
		const { mergedClsPrefix, showCheckbox, renderLabel, renderPrefix, renderSuffix } = this;
		let prefixNode = null;
		if (showCheckbox || renderPrefix) {
			const originalNode = this.showCheckbox ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_checkbox_src_Checkbox.default, {
				key: 1,
				focusable: false,
				"data-checkbox": true,
				disabled: this.disabled,
				checked: this.checked,
				indeterminate: this.indeterminate,
				theme: this.mergedTheme.peers.Checkbox,
				themeOverrides: this.mergedTheme.peerOverrides.Checkbox,
				onUpdateChecked: this.handleCheckboxUpdateValue
			}, null, 8, [
				"disabled",
				"checked",
				"indeterminate",
				"theme",
				"themeOverrides",
				"onUpdateChecked"
			])) : null;
			prefixNode = ((prefixNode) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 2,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-cascader-option__prefix`)
				}, [renderPrefix ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderPrefix({
					option: this.tmNode.rawNode,
					checked: this.checked,
					node: originalNode
				}))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => originalNode)], 64))], 2);
			})(prefixNode);
		}
		let suffixNode = null;
		const originalSuffixChild = ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-cascader-option-icon-placeholder`) }, [!this.isLeaf ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_loading_src_Loading.default, (0, vue.mergeProps)({
			key: 0,
			clsPrefix: mergedClsPrefix,
			scale: .85,
			strokeWidth: 24,
			show: this.isLoading,
			class: `${mergedClsPrefix}-cascader-option-icon`
		}, this.spinProps), { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			clsPrefix: mergedClsPrefix,
			key: "arrow",
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-cascader-option-icon ${mergedClsPrefix}-cascader-option-icon--arrow`)
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ChevronRight)) }, 1032, ["clsPrefix", "class"])) }, 1040, [
			"clsPrefix",
			"show",
			"class"
		])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [this.checkStrategy === "child" && !(this.multiple && this.cascade) ? ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
			key: 0,
			name: "fade-in-scale-up-transition"
		}, { default: () => this.checked ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			key: 3,
			clsPrefix: mergedClsPrefix,
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-cascader-option-icon ${mergedClsPrefix}-cascader-option-icon--checkmark`)
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Checkmark)) }, 1032, ["clsPrefix", "class"])) : null }, 1024)) : require_vdom.normalizeVNode(() => null)], 64))], 2));
		suffixNode = ((suffixNode) => {
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-cascader-option__suffix`) }, [renderSuffix ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderSuffix({
				option: this.tmNode.rawNode,
				checked: this.checked,
				node: originalSuffixChild
			}))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => originalSuffixChild)], 64))], 2);
		})(suffixNode);
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-cascader-option`,
				this.keyboardPending || this.hoverPending && `${mergedClsPrefix}-cascader-option--pending`,
				this.disabled && `${mergedClsPrefix}-cascader-option--disabled`,
				this.showCheckbox && `${mergedClsPrefix}-cascader-option--show-prefix`
			]),
			onMouseenter: this.mergedHandleMouseEnter,
			onMousemove: this.mergedHandleMouseMove,
			onClick: this.handleClick
		}, [
			require_vdom.normalizeVNode(() => prefixNode),
			(0, vue.createElementVNode)("span", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-cascader-option__label`) }, [renderLabel ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderLabel(this.tmNode.rawNode, this.checked))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => this.label)], 64))], 2),
			require_vdom.normalizeVNode(() => suffixNode)
		], 42, _hoisted_1);
	}
});
//#endregion
module.exports = CascaderOption_default;
