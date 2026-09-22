Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_create_ref_setter = require("../../_utils/vue/create-ref-setter.js");
const require__utils_vue_keep = require("../../_utils/vue/keep.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_popover_src_Popover = require("../../popover/src/Popover.js");
const require_dropdown_styles_light = require("../styles/light.js");
const require_dropdown_src_context = require("./context.js");
const require_dropdown_src_DropdownMenu = require("./DropdownMenu.js");
const require_dropdown_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
let vooks = require("vooks");
let treemate = require("treemate");
//#region src/dropdown/src/Dropdown.tsx
const dropdownBaseProps = {
	animated: {
		type: Boolean,
		default: true
	},
	keyboard: {
		type: Boolean,
		default: true
	},
	size: String,
	inverted: Boolean,
	placement: {
		type: String,
		default: "bottom"
	},
	onSelect: [Function, Array],
	options: {
		type: Array,
		default: () => []
	},
	menuProps: Function,
	showArrow: Boolean,
	renderLabel: Function,
	renderIcon: Function,
	renderOption: Function,
	nodeProps: Function,
	labelField: {
		type: String,
		default: "label"
	},
	keyField: {
		type: String,
		default: "key"
	},
	childrenField: {
		type: String,
		default: "children"
	},
	value: [String, Number]
};
const popoverPropKeys = Object.keys(require_popover_src_Popover.popoverBaseProps);
const dropdownProps = {
	...require_popover_src_Popover.popoverBaseProps,
	...dropdownBaseProps,
	...require__mixins_use_theme.default.props
};
var Dropdown_default = (0, vue.defineComponent)({
	name: "Dropdown",
	inheritAttrs: false,
	props: dropdownProps,
	setup(props) {
		const uncontrolledShowRef = (0, vue.ref)(false);
		const mergedShowRef = (0, vooks.useMergedState)((0, vue.toRef)(props, "show"), uncontrolledShowRef);
		const treemateRef = (0, vue.computed)(() => {
			const { keyField, childrenField } = props;
			return (0, treemate.createTreeMate)(props.options, {
				getKey(node) {
					return node[keyField];
				},
				getDisabled(node) {
					return node.disabled === true;
				},
				getIgnored(node) {
					return node.type === "divider" || node.type === "render";
				},
				getChildren(node) {
					return node[childrenField];
				}
			});
		});
		const tmNodesRef = (0, vue.computed)(() => {
			return treemateRef.value.treeNodes;
		});
		const hoverKeyRef = (0, vue.ref)(null);
		const keyboardKeyRef = (0, vue.ref)(null);
		const lastToggledSubmenuKeyRef = (0, vue.ref)(null);
		const pendingKeyRef = (0, vue.computed)(() => {
			return hoverKeyRef.value ?? keyboardKeyRef.value ?? lastToggledSubmenuKeyRef.value ?? null;
		});
		const pendingKeyPathRef = (0, vue.computed)(() => treemateRef.value.getPath(pendingKeyRef.value).keyPath);
		const activeKeyPathRef = (0, vue.computed)(() => treemateRef.value.getPath(props.value).keyPath);
		const keyboardEnabledRef = (0, vooks.useMemo)(() => {
			return props.keyboard && mergedShowRef.value;
		});
		(0, vooks.useKeyboard)({ keydown: {
			ArrowUp: {
				prevent: true,
				handler: handleKeydownUp
			},
			ArrowRight: {
				prevent: true,
				handler: handleKeydownRight
			},
			ArrowDown: {
				prevent: true,
				handler: handleKeydownDown
			},
			ArrowLeft: {
				prevent: true,
				handler: handleKeydownLeft
			},
			Enter: {
				prevent: true,
				handler: handleKeydownEnter
			},
			Escape: handleKeydownEsc
		} }, keyboardEnabledRef);
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const mergedSizeRef = (0, vue.computed)(() => {
			return props.size || mergedComponentPropsRef?.value?.Dropdown?.size || "medium";
		});
		const themeRef = require__mixins_use_theme.default("Dropdown", "-dropdown", require_dropdown_src_styles_index_cssr, require_dropdown_styles_light.default, props, mergedClsPrefixRef);
		(0, vue.provide)(require_dropdown_src_context.dropdownInjectionKey, {
			labelFieldRef: (0, vue.toRef)(props, "labelField"),
			childrenFieldRef: (0, vue.toRef)(props, "childrenField"),
			renderLabelRef: (0, vue.toRef)(props, "renderLabel"),
			renderIconRef: (0, vue.toRef)(props, "renderIcon"),
			hoverKeyRef,
			keyboardKeyRef,
			lastToggledSubmenuKeyRef,
			pendingKeyPathRef,
			activeKeyPathRef,
			animatedRef: (0, vue.toRef)(props, "animated"),
			mergedShowRef,
			nodePropsRef: (0, vue.toRef)(props, "nodeProps"),
			renderOptionRef: (0, vue.toRef)(props, "renderOption"),
			menuPropsRef: (0, vue.toRef)(props, "menuProps"),
			doSelect,
			doUpdateShow
		});
		(0, vue.watch)(mergedShowRef, (value) => {
			if (!props.animated && !value) clearPendingState();
		});
		function doSelect(key, node) {
			const { onSelect } = props;
			if (onSelect) require__utils_vue_call.call(onSelect, key, node);
		}
		function doUpdateShow(value) {
			const { "onUpdate:show": _onUpdateShow, onUpdateShow } = props;
			if (_onUpdateShow) require__utils_vue_call.call(_onUpdateShow, value);
			if (onUpdateShow) require__utils_vue_call.call(onUpdateShow, value);
			uncontrolledShowRef.value = value;
		}
		function clearPendingState() {
			hoverKeyRef.value = null;
			keyboardKeyRef.value = null;
			lastToggledSubmenuKeyRef.value = null;
		}
		function handleKeydownEsc() {
			doUpdateShow(false);
		}
		function handleKeydownLeft() {
			handleKeydown("left");
		}
		function handleKeydownRight() {
			handleKeydown("right");
		}
		function handleKeydownUp() {
			handleKeydown("up");
		}
		function handleKeydownDown() {
			handleKeydown("down");
		}
		function handleKeydownEnter() {
			const pendingNode = getPendingNode();
			if (pendingNode?.isLeaf && mergedShowRef.value) {
				doSelect(pendingNode.key, pendingNode.rawNode);
				doUpdateShow(false);
			}
		}
		function getPendingNode() {
			const { value: treeMate } = treemateRef;
			const { value: pendingKey } = pendingKeyRef;
			if (!treeMate || pendingKey === null) return null;
			return treeMate.getNode(pendingKey) ?? null;
		}
		function handleKeydown(direction) {
			const { value: pendingKey } = pendingKeyRef;
			const { value: { getFirstAvailableNode } } = treemateRef;
			let nextKeyboardKey = null;
			if (pendingKey === null) {
				const firstNode = getFirstAvailableNode();
				if (firstNode !== null) nextKeyboardKey = firstNode.key;
			} else {
				const currentNode = getPendingNode();
				if (currentNode) {
					let nextNode;
					switch (direction) {
						case "down":
							nextNode = currentNode.getNext();
							break;
						case "up":
							nextNode = currentNode.getPrev();
							break;
						case "right":
							nextNode = currentNode.getChild();
							break;
						case "left": nextNode = currentNode.getParent();
					}
					if (nextNode) nextKeyboardKey = nextNode.key;
				}
			}
			if (nextKeyboardKey !== null) {
				hoverKeyRef.value = null;
				keyboardKeyRef.value = nextKeyboardKey;
			}
		}
		const cssVarsRef = (0, vue.computed)(() => {
			const { inverted } = props;
			const size = mergedSizeRef.value;
			const { common: { cubicBezierEaseInOut }, self } = themeRef.value;
			const { padding, dividerColor, borderRadius, optionOpacityDisabled, [require__utils_cssr_index.createKey("optionIconSuffixWidth", size)]: optionIconSuffixWidth, [require__utils_cssr_index.createKey("optionSuffixWidth", size)]: optionSuffixWidth, [require__utils_cssr_index.createKey("optionIconPrefixWidth", size)]: optionIconPrefixWidth, [require__utils_cssr_index.createKey("optionPrefixWidth", size)]: optionPrefixWidth, [require__utils_cssr_index.createKey("fontSize", size)]: fontSize, [require__utils_cssr_index.createKey("optionHeight", size)]: optionHeight, [require__utils_cssr_index.createKey("optionIconSize", size)]: optionIconSize } = self;
			const vars = {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-font-size": fontSize,
				"--n-padding": padding,
				"--n-border-radius": borderRadius,
				"--n-option-height": optionHeight,
				"--n-option-prefix-width": optionPrefixWidth,
				"--n-option-icon-prefix-width": optionIconPrefixWidth,
				"--n-option-suffix-width": optionSuffixWidth,
				"--n-option-icon-suffix-width": optionIconSuffixWidth,
				"--n-option-icon-size": optionIconSize,
				"--n-divider-color": dividerColor,
				"--n-option-opacity-disabled": optionOpacityDisabled
			};
			if (inverted) {
				vars["--n-color"] = self.colorInverted;
				vars["--n-option-color-hover"] = self.optionColorHoverInverted;
				vars["--n-option-color-active"] = self.optionColorActiveInverted;
				vars["--n-option-text-color"] = self.optionTextColorInverted;
				vars["--n-option-text-color-hover"] = self.optionTextColorHoverInverted;
				vars["--n-option-text-color-active"] = self.optionTextColorActiveInverted;
				vars["--n-option-text-color-child-active"] = self.optionTextColorChildActiveInverted;
				vars["--n-prefix-color"] = self.prefixColorInverted;
				vars["--n-suffix-color"] = self.suffixColorInverted;
				vars["--n-group-header-text-color"] = self.groupHeaderTextColorInverted;
			} else {
				vars["--n-color"] = self.color;
				vars["--n-option-color-hover"] = self.optionColorHover;
				vars["--n-option-color-active"] = self.optionColorActive;
				vars["--n-option-text-color"] = self.optionTextColor;
				vars["--n-option-text-color-hover"] = self.optionTextColorHover;
				vars["--n-option-text-color-active"] = self.optionTextColorActive;
				vars["--n-option-text-color-child-active"] = self.optionTextColorChildActive;
				vars["--n-prefix-color"] = self.prefixColor;
				vars["--n-suffix-color"] = self.suffixColor;
				vars["--n-group-header-text-color"] = self.groupHeaderTextColor;
			}
			return vars;
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("dropdown", (0, vue.computed)(() => `${mergedSizeRef.value[0]}${props.inverted ? "i" : ""}`), cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			mergedTheme: themeRef,
			mergedSize: mergedSizeRef,
			tmNodes: tmNodesRef,
			mergedShow: mergedShowRef,
			handleAfterLeave: () => {
				if (!props.animated) return;
				clearPendingState();
			},
			doUpdateShow,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const renderPopoverBody = (className, ref, style, onMouseenter, onMouseleave) => {
			const { mergedClsPrefix, menuProps } = this;
			this.onRender?.();
			const menuNodeProps = menuProps?.(void 0, this.tmNodes.map((v) => v.rawNode)) || {};
			const dropdownProps = {
				ref: require__utils_vue_create_ref_setter.createRefSetter(ref),
				class: [
					className,
					`${mergedClsPrefix}-dropdown`,
					`${mergedClsPrefix}-dropdown--${this.mergedSize}-size`,
					this.themeClass
				],
				clsPrefix: mergedClsPrefix,
				tmNodes: this.tmNodes,
				style: [...style, this.cssVars],
				showArrow: this.showArrow,
				arrowStyle: this.arrowStyle,
				scrollable: this.scrollable,
				onMouseenter,
				onMouseleave
			};
			return (0, vue.h)(require_dropdown_src_DropdownMenu, (0, vue.mergeProps)(this.$attrs, dropdownProps, menuNodeProps));
		};
		const { mergedTheme } = this;
		const popoverProps = {
			show: this.mergedShow,
			theme: mergedTheme.peers.Popover,
			themeOverrides: mergedTheme.peerOverrides.Popover,
			internalOnAfterLeave: this.handleAfterLeave,
			internalRenderBody: renderPopoverBody,
			onUpdateShow: this.doUpdateShow,
			"onUpdate:show": void 0
		};
		return (0, vue.openBlock)(), (0, vue.createBlock)(require_popover_src_Popover.default, require__utils_vue_keep.keep(this.$props, popoverPropKeys, popoverProps), {
			_: 1,
			trigger: require_vdom.normalizeSlot(() => this.$slots.default?.())
		}, 16);
	}
});
//#endregion
exports.default = Dropdown_default;
exports.dropdownProps = dropdownProps;
