const require__utils_dom_download = require("../../_utils/dom/download.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icon_switch_transition_src_IconSwitchTransition = require("../../_internal/icon-switch-transition/src/IconSwitchTransition.js");
const require__internal_icons_Attach = require("../../_internal/icons/Attach.js");
const require__internal_icons_Cancel = require("../../_internal/icons/Cancel.js");
const require__internal_icons_Download = require("../../_internal/icons/Download.js");
const require__internal_icons_Eye = require("../../_internal/icons/Eye.js");
const require__internal_icons_Retry = require("../../_internal/icons/Retry.js");
const require__internal_icons_Trash = require("../../_internal/icons/Trash.js");
const require_button_src_Button = require("../../button/src/Button.js");
const require_image_src_Image = require("../../image/src/Image.js");
const require_upload_src_interface = require("./interface.js");
const require_upload_src_icons = require("./icons.js");
const require_upload_src_UploadProgress = require("./UploadProgress.js");
const require_upload_src_utils = require("./utils.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/upload/src/UploadFile.tsx
const _hoisted_1 = ["href", "onClick"];
const _hoisted_2 = ["href", "onClick"];
const _hoisted_3 = ["onClick"];
const buttonThemeOverrides = {
	paddingMedium: "0 3px",
	heightMedium: "24px",
	iconSizeMedium: "18px"
};
var UploadFile_default = (0, vue.defineComponent)({
	name: "UploadFile",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		file: {
			type: Object,
			required: true
		},
		listType: {
			type: String,
			required: true
		},
		index: {
			type: Number,
			required: true
		}
	},
	setup(props) {
		const NUpload = (0, vue.inject)(require_upload_src_interface.uploadInjectionKey);
		const imageRef = (0, vue.ref)(null);
		const thumbnailUrlRef = (0, vue.ref)("");
		const progressStatusRef = (0, vue.computed)(() => {
			const { file } = props;
			if (file.status === "finished") return "success";
			if (file.status === "error") return "error";
			return "info";
		});
		const buttonTypeRef = (0, vue.computed)(() => {
			const { file } = props;
			if (file.status === "error") return "error";
		});
		const showProgressRef = (0, vue.computed)(() => {
			const { file } = props;
			return file.status === "uploading";
		});
		const showCancelButtonRef = (0, vue.computed)(() => {
			if (!NUpload.showCancelButtonRef.value) return false;
			const { file } = props;
			return [
				"uploading",
				"pending",
				"error"
			].includes(file.status);
		});
		const showRemoveButtonRef = (0, vue.computed)(() => {
			if (!NUpload.showRemoveButtonRef.value) return false;
			const { file } = props;
			return ["finished"].includes(file.status);
		});
		const showDownloadButtonRef = (0, vue.computed)(() => {
			if (!NUpload.showDownloadButtonRef.value) return false;
			const { file } = props;
			return ["finished"].includes(file.status);
		});
		const showRetryButtonRef = (0, vue.computed)(() => {
			if (!NUpload.showRetryButtonRef.value) return false;
			const { file } = props;
			return ["error"].includes(file.status);
		});
		const mergedThumbnailUrlRef = (0, vooks.useMemo)(() => {
			return thumbnailUrlRef.value || props.file.thumbnailUrl || props.file.url;
		});
		const showPreviewButtonRef = (0, vue.computed)(() => {
			if (!NUpload.showPreviewButtonRef.value) return false;
			const { file: { status }, listType } = props;
			return ["finished"].includes(status) && mergedThumbnailUrlRef.value && listType === "image-card";
		});
		async function handleRetryClick() {
			const onRetry = NUpload.onRetryRef.value;
			if (onRetry) {
				if (await onRetry({ file: props.file }) === false) return;
			}
			NUpload.submit({ fileId: props.file.id });
		}
		function handleRemoveOrCancelClick(e) {
			e.preventDefault();
			const { file } = props;
			if ([
				"finished",
				"pending",
				"error"
			].includes(file.status)) handleRemove(file);
			else if (["uploading"].includes(file.status)) handleAbort(file);
			else require__utils_naive_warn.warn("upload", "The button clicked type is unknown.");
		}
		function handleDownloadClick(e) {
			e.preventDefault();
			handleDownload(props.file);
		}
		function handleRemove(file) {
			const { xhrMap, doChange, onRemoveRef: { value: onRemove }, mergedFileListRef: { value: mergedFileList } } = NUpload;
			Promise.resolve(onRemove ? onRemove({
				file: Object.assign({}, file),
				fileList: mergedFileList,
				index: props.index
			}) : true).then((result) => {
				if (result === false) return;
				const fileAfterChange = Object.assign({}, file, { status: "removed" });
				xhrMap.delete(file.id);
				doChange(fileAfterChange, void 0, { remove: true });
			});
		}
		function handleDownload(file) {
			const { onDownloadRef: { value: onDownload }, customDownloadRef: { value: customDownload } } = NUpload;
			Promise.resolve(onDownload ? onDownload(Object.assign({}, file)) : true).then((res) => {
				if (res !== false) {
					if (customDownload) customDownload(Object.assign({}, file));
					else require__utils_dom_download.download(file.url, file.name);
				}
			});
		}
		function handleAbort(file) {
			const { xhrMap } = NUpload;
			xhrMap.get(file.id)?.abort();
			handleRemove(Object.assign({}, file));
		}
		function handlePreviewClick(e) {
			const { onPreviewRef: { value: onPreview } } = NUpload;
			if (onPreview) onPreview(props.file, { event: e });
			else if (props.listType === "image-card") {
				const { value } = imageRef;
				if (!value) return;
				value.showPreview();
			}
		}
		const deriveFileThumbnailUrl = async () => {
			const { listType } = props;
			if (listType !== "image" && listType !== "image-card") return;
			if (NUpload.shouldUseThumbnailUrlRef.value(props.file)) thumbnailUrlRef.value = await NUpload.getFileThumbnailUrlResolver(props.file);
		};
		(0, vue.watchEffect)(() => {
			deriveFileThumbnailUrl();
		});
		return {
			mergedTheme: NUpload.mergedThemeRef,
			progressStatus: progressStatusRef,
			buttonType: buttonTypeRef,
			showProgress: showProgressRef,
			disabled: NUpload.mergedDisabledRef,
			showCancelButton: showCancelButtonRef,
			showRemoveButton: showRemoveButtonRef,
			showDownloadButton: showDownloadButtonRef,
			showRetryButton: showRetryButtonRef,
			showPreviewButton: showPreviewButtonRef,
			alwaysShowActions: NUpload.alwaysShowActionsRef,
			mergedThumbnailUrl: mergedThumbnailUrlRef,
			shouldUseThumbnailUrl: NUpload.shouldUseThumbnailUrlRef,
			renderIcon: NUpload.renderIconRef,
			imageRef,
			handleRemoveOrCancelClick,
			handleDownloadClick,
			handleRetryClick,
			handlePreviewClick
		};
	},
	render() {
		const { clsPrefix, mergedTheme, listType, file, renderIcon } = this;
		let icon;
		const isImageType = listType === "image";
		if (isImageType || listType === "image-card") icon = !this.shouldUseThumbnailUrl(file) || !this.mergedThumbnailUrl ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
			key: 1,
			class: require_vdom.normalizeClass(`${clsPrefix}-upload-file-info__thumbnail`)
		}, [renderIcon ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderIcon(file))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_upload_src_utils.isImageFile(file) ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			key: 0,
			clsPrefix
		}, { default: require_upload_src_icons.renderImageIcon }, 1032, ["clsPrefix"])) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			key: 1,
			clsPrefix
		}, { default: require_upload_src_icons.renderDocumentIcon }, 1032, ["clsPrefix"]))], 64))], 2)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("a", {
			key: 2,
			rel: "noopener noreferer",
			target: "_blank",
			href: file.url || void 0,
			class: require_vdom.normalizeClass(`${clsPrefix}-upload-file-info__thumbnail`),
			onClick: this.handlePreviewClick
		}, [listType === "image-card" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_image_src_Image.default, {
			key: 0,
			src: this.mergedThumbnailUrl || void 0,
			previewSrc: file.url || void 0,
			alt: file.name,
			ref: "imageRef"
		}, null, 8, [
			"src",
			"previewSrc",
			"alt"
		])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("img", {
			key: 1,
			src: this.mergedThumbnailUrl || void 0,
			alt: file.name
		}, null, 8, ["src", "alt"]))], 10, _hoisted_1));
		else icon = ((icon) => {
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
				key: 3,
				class: require_vdom.normalizeClass(`${clsPrefix}-upload-file-info__thumbnail`)
			}, [renderIcon ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderIcon(file))], 64)) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
				key: 1,
				clsPrefix
			}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Attach)) }, 1032, ["clsPrefix"]))], 2);
		})(icon);
		const progress = ((0, vue.openBlock)(), (0, vue.createBlock)(require_upload_src_UploadProgress, {
			show: this.showProgress,
			percentage: file.percentage || 0,
			status: this.progressStatus
		}, null, 8, [
			"show",
			"percentage",
			"status"
		]));
		const showName = listType === "text" || listType === "image";
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass([
			`${clsPrefix}-upload-file`,
			`${clsPrefix}-upload-file--${this.progressStatus}-status`,
			file.url && file.status !== "error" && listType !== "image-card" && `${clsPrefix}-upload-file--with-url`,
			`${clsPrefix}-upload-file--${listType}-type`,
			this.alwaysShowActions && `${clsPrefix}-upload-file--always-show-actions`
		]) }, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-upload-file-info`) }, [
			require_vdom.normalizeVNode(() => icon),
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-upload-file-info__name`) }, [require_vdom.normalizeVNode(() => showName && (file.url && file.status !== "error" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("a", {
				key: 4,
				rel: "noopener noreferer",
				target: "_blank",
				href: file.url || void 0,
				onClick: this.handlePreviewClick
			}, [require_vdom.normalizeVNode(() => file.name)], 8, _hoisted_2)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
				key: 5,
				onClick: this.handlePreviewClick
			}, [require_vdom.normalizeVNode(() => file.name)], 8, _hoisted_3)))), require_vdom.normalizeVNode(() => isImageType && progress)], 2),
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass([
				`${clsPrefix}-upload-file-info__action`,
				`${clsPrefix}-upload-file-info__action--${listType}-type`,
				this.alwaysShowActions && `${clsPrefix}-upload-file-info__action--always-show`
			]) }, [
				this.showPreviewButton ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
					key: "preview",
					quaternary: true,
					type: this.buttonType,
					onClick: this.handlePreviewClick,
					theme: mergedTheme.peers.Button,
					themeOverrides: mergedTheme.peerOverrides.Button,
					builtinThemeOverrides: buttonThemeOverrides
				}, { icon: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Eye)) }, 1032, ["clsPrefix"])) }, 1032, [
					"type",
					"onClick",
					"theme",
					"themeOverrides",
					"builtinThemeOverrides"
				])) : require_vdom.normalizeVNode(() => null),
				require_vdom.normalizeVNode(() => (this.showRemoveButton || this.showCancelButton) && !this.disabled && ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
					key: "cancelOrTrash",
					theme: mergedTheme.peers.Button,
					themeOverrides: mergedTheme.peerOverrides.Button,
					quaternary: true,
					builtinThemeOverrides: buttonThemeOverrides,
					type: this.buttonType,
					onClick: this.handleRemoveOrCancelClick
				}, { icon: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_switch_transition_src_IconSwitchTransition, null, { default: () => this.showRemoveButton ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
					clsPrefix,
					key: "trash"
				}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Trash)) }, 1032, ["clsPrefix"])) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
					clsPrefix,
					key: "cancel"
				}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Cancel)) }, 1032, ["clsPrefix"])) }, 1024)) }, 1032, [
					"theme",
					"themeOverrides",
					"builtinThemeOverrides",
					"type",
					"onClick"
				]))),
				require_vdom.normalizeVNode(() => this.showRetryButton && !this.disabled && ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
					key: "retry",
					quaternary: true,
					type: this.buttonType,
					onClick: this.handleRetryClick,
					theme: mergedTheme.peers.Button,
					themeOverrides: mergedTheme.peerOverrides.Button,
					builtinThemeOverrides: buttonThemeOverrides
				}, { icon: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Retry)) }, 1032, ["clsPrefix"])) }, 1032, [
					"type",
					"onClick",
					"theme",
					"themeOverrides",
					"builtinThemeOverrides"
				]))),
				this.showDownloadButton ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
					key: "download",
					quaternary: true,
					type: this.buttonType,
					onClick: this.handleDownloadClick,
					theme: mergedTheme.peers.Button,
					themeOverrides: mergedTheme.peerOverrides.Button,
					builtinThemeOverrides: buttonThemeOverrides
				}, { icon: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Download)) }, 1032, ["clsPrefix"])) }, 1032, [
					"type",
					"onClick",
					"theme",
					"themeOverrides",
					"builtinThemeOverrides"
				])) : require_vdom.normalizeVNode(() => null)
			], 2)
		], 2), require_vdom.normalizeVNode(() => !isImageType && progress)], 2);
	}
});
//#endregion
module.exports = UploadFile_default;
