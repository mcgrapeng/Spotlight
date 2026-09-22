const require__utils_composable_use_lock_html_scroll = require("../../_utils/composable/use-lock-html-scroll.js");
const require__utils_dom_download = require("../../_utils/dom/download.js");
const require_config_provider_src_context = require("../../config-provider/src/context.js");
const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_empty_src_Empty = require("../../empty/src/Empty.js");
const require_popover_src_Popover = require("../../popover/src/Popover.js");
const require_input_src_Input = require("../../input/src/Input.js");
const require_button_src_Button = require("../../button/src/Button.js");
const require_collapse_src_Collapse = require("../../collapse/src/Collapse.js");
const require_collapse_src_CollapseItem = require("../../collapse/src/CollapseItem.js");
const require_color_picker_src_ColorPicker = require("../../color-picker/src/ColorPicker.js");
const require_config_provider_src_ConfigProvider = require("../../config-provider/src/ConfigProvider.js");
const require_icon_src_Icon = require("../../icon/src/Icon.js");
const require_divider_src_Divider = require("../../divider/src/Divider.js");
const require_space_src_Space = require("../../space/src/Space.js");
const require_element_src_Element = require("../../element/src/Element.js");
const require_grid_src_GridItem = require("../../grid/src/GridItem.js");
const require_grid_src_Grid = require("../../grid/src/Grid.js");
const require_themes_light = require("../../themes/light.js");
const require_theme_editor_src_MaximizeIcon = require("./MaximizeIcon.js");
const require_theme_editor_src_MinimizeIcon = require("./MinimizeIcon.js");
let vue = require("vue");
let lodash_es = require("lodash");
//#region src/theme-editor/src/ThemeEditor.tsx
const _hoisted_1 = {
	viewBox: "0 0 16 16",
	fill: "none",
	xmlns: "http://www.w3.org/2000/svg",
	style: {
		width: "1em",
		height: "1em",
		color: "currentColor"
	}
};
const _hoisted_2 = ["onChange"];
function renderColorWandIcon() {
	return (() => {
		const _cache = require_vdom.createVNodeCache("1dd5bbb6aa2858e7");
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
			(0, vue.createElementVNode)("path", {
				d: "M13.5 1C13.7761 1 14 1.22386 14 1.5V2H14.5C14.7761 2 15 2.22386 15 2.5C15 2.77614 14.7761 3 14.5 3H14V3.5C14 3.77614 13.7761 4 13.5 4C13.2239 4 13 3.77614 13 3.5V3H12.5C12.2239 3 12 2.77614 12 2.5C12 2.22386 12.2239 2 12.5 2H13V1.5C13 1.22386 13.2239 1 13.5 1Z",
				fill: "currentColor"
			}, null, -1),
			(0, vue.createElementVNode)("path", {
				d: "M3.5 3C3.77615 3 4 3.22386 4 3.5V4H4.5C4.77615 4 5 4.22386 5 4.5C5 4.77614 4.77615 5 4.5 5H4V5.5C4 5.77614 3.77615 6 3.5 6C3.22386 6 3 5.77614 3 5.5V5H2.5C2.22386 5 2 4.77614 2 4.5C2 4.22386 2.22386 4 2.5 4H3V3.5C3 3.22386 3.22386 3 3.5 3Z",
				fill: "currentColor"
			}, null, -1),
			(0, vue.createElementVNode)("path", {
				d: "M12.5 12C12.7761 12 13 11.7761 13 11.5C13 11.2239 12.7761 11 12.5 11H12V10.5C12 10.2239 11.7761 10 11.5 10C11.2239 10 11 10.2239 11 10.5V11H10.5C10.2239 11 10 11.2239 10 11.5C10 11.7761 10.2239 12 10.5 12H11V12.5C11 12.7761 11.2239 13 11.5 13C11.7761 13 12 12.7761 12 12.5V12H12.5Z",
				fill: "currentColor"
			}, null, -1),
			(0, vue.createElementVNode)("path", {
				d: "M8.72956 4.56346C9.4771 3.81592 10.6891 3.81592 11.4367 4.56347C12.1842 5.31102 12.1842 6.52303 11.4367 7.27058L4.26679 14.4404C3.51924 15.1879 2.30723 15.1879 1.55968 14.4404C0.812134 13.6928 0.812138 12.4808 1.55969 11.7333L8.72956 4.56346ZM8.25002 6.4572L2.26679 12.4404C1.90977 12.7974 1.90977 13.3763 2.26679 13.7333C2.62381 14.0903 3.20266 14.0903 3.55968 13.7333L9.54292 7.75009L8.25002 6.4572ZM10.25 7.04299L10.7295 6.56347C11.0866 6.20645 11.0866 5.6276 10.7296 5.27057C10.3725 4.91355 9.79368 4.91355 9.43666 5.27057L8.95713 5.7501L10.25 7.04299Z",
				fill: "currentColor"
			}, null, -1)
		])]);
	})();
}
function showColorPicker(key) {
	if (key.includes("pacity")) return false;
	if (key.includes("color") || key.includes("Color")) return true;
	return false;
}
var ThemeEditor_default = (0, vue.defineComponent)({
	name: "ThemeEditor",
	inheritAttrs: false,
	setup() {
		const isMaximized = (0, vue.ref)(false);
		const fileInputRef = (0, vue.ref)(null);
		const NConfigProvider = (0, vue.inject)(require_config_provider_src_context.configProviderInjectionKey, null);
		const overridesRef = (0, vue.ref)(JSON.parse(localStorage["naive-ui-theme-overrides"] || "{}"));
		const theme = (0, vue.computed)(() => {
			const mergedTheme = NConfigProvider?.mergedThemeRef.value || require_themes_light.lightTheme;
			const mergedThemeOverrides = NConfigProvider?.mergedThemeOverridesRef.value;
			const common = (0, lodash_es.merge)({}, mergedTheme.common || require_themes_light.lightTheme.common, mergedThemeOverrides?.common, overridesRef.value.common || {});
			const overrides = { common };
			for (const key of Object.keys(require_themes_light.lightTheme)) {
				if (key === "common") continue;
				overrides[key] = mergedTheme[key]?.self?.(common) || require_themes_light.lightTheme[key].self?.(common);
				if (mergedThemeOverrides && overrides[key]) (0, lodash_es.merge)(overrides[key], mergedThemeOverrides[key]);
			}
			return overrides;
		});
		const themeCommonDefaultRef = (0, vue.computed)(() => {
			return NConfigProvider?.mergedThemeRef.value?.common || require_themes_light.lightTheme.common;
		});
		const showPanelRef = (0, vue.ref)(false);
		const tempOverridesRef = (0, vue.ref)(JSON.parse(localStorage["naive-ui-theme-overrides"] || "{}"));
		const varNamePatternRef = (0, vue.ref)("");
		const compNamePatternRef = (0, vue.ref)("");
		const tempVarNamePatternRef = (0, vue.ref)("");
		const tempCompNamePatternRef = (0, vue.ref)("");
		function applyTempOverrides() {
			overridesRef.value = (0, lodash_es.cloneDeep)((0, vue.toRaw)(tempOverridesRef.value));
		}
		function setTempOverrides(compName, varName, value) {
			const { value: tempOverrides } = tempOverridesRef;
			if (!(compName in tempOverrides)) tempOverrides[compName] = {};
			const compOverrides = tempOverrides[compName];
			if (value) compOverrides[varName] = value;
			else delete compOverrides[varName];
		}
		function handleClearAllClick() {
			tempOverridesRef.value = {};
			overridesRef.value = {};
		}
		function handleImportClick() {
			const { value: fileInput } = fileInputRef;
			if (!fileInput) return;
			fileInput.click();
		}
		function toggleMaximized() {
			isMaximized.value = !isMaximized.value;
		}
		function handleInputFileChange() {
			const { value: fileInput } = fileInputRef;
			if (!fileInput) return;
			const file = fileInput.files?.[0];
			if (!file) return;
			file.text().then((value) => {
				overridesRef.value = JSON.parse(value);
				tempOverridesRef.value = JSON.parse(value);
			}).catch((e) => {
				alert("Imported File is Invalid");
				console.error(e);
			}).finally(() => {
				fileInput.value = "";
			});
		}
		function handleExportClick() {
			const url = URL.createObjectURL(new Blob([JSON.stringify(overridesRef.value, void 0, 2)]));
			require__utils_dom_download.download(url, "naive-ui-theme-overrides.json");
			URL.revokeObjectURL(url);
		}
		(0, vue.watch)(overridesRef, (value) => {
			localStorage["naive-ui-theme-overrides"] = JSON.stringify(value);
		});
		return {
			locale: require__mixins_use_locale("ThemeEditor").localeRef,
			themeCommonDefault: themeCommonDefaultRef,
			theme,
			showPanel: showPanelRef,
			tempOverrides: tempOverridesRef,
			overrides: overridesRef,
			compNamePattern: compNamePatternRef,
			tempCompNamePattern: tempCompNamePatternRef,
			varNamePattern: varNamePatternRef,
			tempVarNamePattern: tempVarNamePatternRef,
			fileInputRef,
			applyTempOverrides,
			setTempOverrides,
			handleClearAllClick,
			handleExportClick,
			handleImportClick,
			handleInputFileChange,
			toggleMaximized,
			isMaximized
		};
	},
	render() {
		return (0, vue.openBlock)(), (0, vue.createBlock)(require_config_provider_src_ConfigProvider.default, { themeOverrides: this.overrides }, { default: () => [((0, vue.openBlock)(), (0, vue.createBlock)(require_popover_src_Popover.default, {
			scrollable: true,
			arrowPointToCenter: true,
			trigger: "manual",
			show: this.showPanel,
			displayDirective: "show",
			placement: "top-end",
			style: (0, vue.normalizeStyle)({
				width: this.isMaximized ? "calc(100vw - 80px)" : "288px",
				height: "calc(100vh - 200px)",
				padding: 0
			})
		}, {
			trigger: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require_element_src_Element.default, {
				style: (0, vue.normalizeStyle)([{
					position: "fixed",
					zIndex: 10,
					bottom: "40px",
					right: `calc(40px + ${require__utils_composable_use_lock_html_scroll.lockHtmlScrollRightCompensationRef.value})`,
					width: "44px",
					height: "44px",
					fontSize: "26px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					borderRadius: "50%",
					backgroundColor: "var(--popover-color)",
					color: "var(--text-color-2)",
					transition: "color .3s var(--cubic-bezier-ease-in-out), background-color .3s var(--cubic-bezier-ease-in-out), box-shadow .3s var(--cubic-bezier-ease-in-out)",
					boxShadow: "0 2px 8px 0px rgba(0, 0, 0, .12)",
					cursor: "pointer"
				}, this.$attrs.style]),
				onClick: () => {
					this.showPanel = !this.showPanel;
				}
			}, { default: renderColorWandIcon }, 1032, ["style", "onClick"])),
			default: () => ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [
				(0, vue.createElementVNode)("input", {
					type: "file",
					ref: "fileInputRef",
					style: {
						display: "block",
						width: 0,
						height: 0,
						visibility: "hidden"
					},
					onChange: this.handleInputFileChange
				}, null, 40, _hoisted_2),
				(0, vue.createVNode)(require_space_src_Space.default, { vertical: true }, {
					_: 1,
					default: require_vdom.normalizeSlot(() => [
						((0, vue.openBlock)(), (0, vue.createBlock)(require_space_src_Space.default, {
							align: "center",
							justify: "space-between",
							style: {
								marginBottom: "8px",
								fontSize: "18px",
								fontWeight: 500
							}
						}, {
							_: 1,
							default: require_vdom.normalizeSlot(() => ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [(0, vue.createElementVNode)("span", null, [require_vdom.normalizeVNode(() => this.locale.title)]), ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
								onClick: this.toggleMaximized,
								secondary: true,
								circle: true,
								size: "tiny"
							}, {
								_: 1,
								icon: require_vdom.normalizeSlot(() => ((0, vue.openBlock)(), (0, vue.createBlock)(require_icon_src_Icon.NIcon, { component: this.isMaximized ? require_theme_editor_src_MinimizeIcon.MinimizeIcon : require_theme_editor_src_MaximizeIcon.MaximizeIcon }, null, 8, ["component"])))
							}, 8, ["onClick"]))], 64)))
						})),
						this.locale.filterCompName,
						((0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_Input.default, {
							onChange: () => {
								this.compNamePattern = this.tempCompNamePattern;
							},
							onInput: (value) => {
								this.tempCompNamePattern = value;
							},
							value: this.tempCompNamePattern,
							placeholder: this.locale.filterCompName
						}, null, 8, [
							"onChange",
							"onInput",
							"value",
							"placeholder"
						])),
						this.locale.filterVarName,
						((0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_Input.default, {
							onChange: (value) => {
								this.varNamePattern = value;
							},
							onInput: (value) => {
								this.tempVarNamePattern = value;
							},
							value: this.tempVarNamePattern,
							placeholder: this.locale.filterVarName
						}, null, 8, [
							"onChange",
							"onInput",
							"value",
							"placeholder"
						])),
						((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
							size: "small",
							onClick: () => {
								this.compNamePattern = "";
								this.varNamePattern = "";
								this.tempCompNamePattern = "";
								this.tempVarNamePattern = "";
							},
							block: true
						}, {
							_: 1,
							default: require_vdom.normalizeSlot(() => this.locale.clearSearch)
						}, 8, ["onClick"])),
						((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
							size: "small",
							onClick: this.handleClearAllClick,
							block: true
						}, {
							_: 1,
							default: require_vdom.normalizeSlot(() => this.locale.clearAllVars)
						}, 8, ["onClick"])),
						((0, vue.openBlock)(), (0, vue.createBlock)(require_space_src_Space.default, { itemStyle: { flex: 1 } }, {
							_: 1,
							default: require_vdom.normalizeSlot(() => ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
								block: true,
								size: "small",
								onClick: this.handleImportClick
							}, {
								_: 1,
								default: require_vdom.normalizeSlot(() => this.locale.import)
							}, 8, ["onClick"])), ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
								block: true,
								size: "small",
								onClick: this.handleExportClick
							}, {
								_: 1,
								default: require_vdom.normalizeSlot(() => this.locale.export)
							}, 8, ["onClick"]))], 64)))
						}))
					])
				}),
				(0, vue.createVNode)(require_divider_src_Divider.default),
				(0, vue.createVNode)(require_collapse_src_Collapse.default, null, { default: () => {
					const { theme, compNamePattern, varNamePattern } = this;
					const themeKeys = Object.keys(theme);
					const compNamePatternLower = compNamePattern.toLowerCase();
					const varNamePatternLower = varNamePattern.toLowerCase();
					let filteredItemsCount = 0;
					const collapsedItems = themeKeys.filter((themeKey) => {
						return themeKey.toLowerCase().includes(compNamePatternLower);
					}).map((themeKey) => {
						const componentTheme = themeKey === "common" ? this.themeCommonDefault : theme[themeKey];
						if (componentTheme === void 0) return null;
						const varKeys = Object.keys(componentTheme).filter((key) => {
							return key !== "name" && key.toLowerCase().includes(varNamePatternLower);
						});
						if (!varKeys.length) return null;
						filteredItemsCount += 1;
						return (0, vue.openBlock)(), (0, vue.createBlock)(require_collapse_src_CollapseItem.default, {
							title: themeKey,
							name: themeKey
						}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require_grid_src_Grid.default, {
							xGap: 32,
							yGap: 16,
							responsive: "screen",
							cols: this.isMaximized ? "1 xs:1 s:2 m:3 l:4" : 1
						}, { default: () => varKeys.map((varKey) => ((0, vue.openBlock)(), (0, vue.createBlock)(require_grid_src_GridItem.default, null, { default: () => ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
							key: `${varKey}Label`,
							style: { wordBreak: "break-word" }
						}, [require_vdom.normalizeVNode(() => varKey)])), showColorPicker(varKey) ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_color_picker_src_ColorPicker.default, {
							key: varKey,
							modes: ["rgb", "hex"],
							value: this.tempOverrides?.[themeKey]?.[varKey] || componentTheme[varKey],
							onComplete: this.applyTempOverrides,
							onUpdateValue: (value) => {
								this.setTempOverrides(themeKey, varKey, value);
							}
						}, { action: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
							size: "small",
							disabled: componentTheme[varKey] === this.tempOverrides?.[themeKey]?.[varKey],
							onClick: () => {
								this.setTempOverrides(themeKey, varKey, componentTheme[varKey]);
								this.applyTempOverrides();
							}
						}, { default: () => this.locale.restore }, 1032, ["disabled", "onClick"])) }, 1032, [
							"value",
							"onComplete",
							"onUpdateValue"
						])) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_Input.default, {
							key: varKey,
							onChange: this.applyTempOverrides,
							onUpdateValue: (value) => {
								this.setTempOverrides(themeKey, varKey, value);
							},
							value: this.tempOverrides?.[themeKey]?.[varKey] || "",
							placeholder: componentTheme[varKey]
						}, null, 8, [
							"onChange",
							"onUpdateValue",
							"value",
							"placeholder"
						]))], 64)) }, 1024))) }, 1032, ["cols"])) }, 1032, ["title", "name"]);
					});
					if (!filteredItemsCount) return (0, vue.openBlock)(), (0, vue.createBlock)(require_empty_src_Empty.default, { key: 1 });
					return collapsedItems;
				} }, 1024)
			], 64))
		}, 1032, ["show", "style"])), this.$slots.default?.()] }, 1032, ["themeOverrides"]);
	}
});
//#endregion
module.exports = ThemeEditor_default;
