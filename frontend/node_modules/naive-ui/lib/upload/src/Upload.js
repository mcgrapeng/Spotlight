Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_upload_styles_light = require("../styles/light.js");
const require_upload_src_interface = require("./interface.js");
const require_upload_src_styles_index_cssr = require("./styles/index.cssr.js");
require("./UploadDragger.js");
const require_upload_src_utils = require("./utils.js");
const require_upload_src_UploadTrigger = require("./UploadTrigger.js");
const require_upload_src_UploadFileList = require("./UploadFileList.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
//#region src/upload/src/Upload.tsx
const _hoisted_1 = [
	"accept",
	"multiple",
	"onChange",
	"webkitdirectory",
	"directory"
];
/**
* fils status ['pending', 'uploading', 'finished', 'removed', 'error']
*/
function createXhrHandlers(inst, file, xhr) {
	const { doChange, xhrMap } = inst;
	let percentage = 0;
	function handleXHRError(e) {
		let fileAfterChange = Object.assign({}, file, {
			status: "error",
			percentage
		});
		xhrMap.delete(file.id);
		fileAfterChange = require_upload_src_utils.createSettledFileInfo(inst.onError?.({
			file: fileAfterChange,
			event: e
		}) || fileAfterChange);
		doChange(fileAfterChange, e);
	}
	function handleXHRLoad(e) {
		if (inst.isErrorState) {
			if (inst.isErrorState(xhr)) {
				handleXHRError(e);
				return;
			}
		} else if (xhr.status < 200 || xhr.status >= 300) {
			handleXHRError(e);
			return;
		}
		let fileAfterChange = Object.assign({}, file, {
			status: "finished",
			percentage
		});
		xhrMap.delete(file.id);
		fileAfterChange = require_upload_src_utils.createSettledFileInfo(inst.onFinish?.({
			file: fileAfterChange,
			event: e
		}) || fileAfterChange);
		doChange(fileAfterChange, e);
	}
	return {
		handleXHRLoad,
		handleXHRError,
		handleXHRAbort(e) {
			const fileAfterChange = Object.assign({}, file, {
				status: "removed",
				file: null,
				percentage
			});
			xhrMap.delete(file.id);
			doChange(fileAfterChange, e);
		},
		handleXHRProgress(e) {
			const fileAfterChange = Object.assign({}, file, { status: "uploading" });
			if (e.lengthComputable) {
				const progress = Math.ceil(e.loaded / e.total * 100);
				fileAfterChange.percentage = progress;
				percentage = progress;
			}
			doChange(fileAfterChange, e);
		}
	};
}
function customSubmitImpl(options) {
	const { inst, file, data, headers, withCredentials, action, customRequest } = options;
	const { doChange } = options.inst;
	let percentage = 0;
	customRequest({
		file,
		data,
		headers,
		withCredentials,
		action,
		onProgress(event) {
			const fileAfterChange = Object.assign({}, file, { status: "uploading" });
			const progress = event.percent;
			fileAfterChange.percentage = progress;
			percentage = progress;
			doChange(fileAfterChange);
		},
		onFinish() {
			let fileAfterChange = Object.assign({}, file, {
				status: "finished",
				percentage
			});
			fileAfterChange = require_upload_src_utils.createSettledFileInfo(inst.onFinish?.({ file: fileAfterChange }) || fileAfterChange);
			doChange(fileAfterChange);
		},
		onError() {
			let fileAfterChange = Object.assign({}, file, {
				status: "error",
				percentage
			});
			fileAfterChange = require_upload_src_utils.createSettledFileInfo(inst.onError?.({ file: fileAfterChange }) || fileAfterChange);
			doChange(fileAfterChange);
		}
	});
}
function registerHandler(inst, file, request) {
	const handlers = createXhrHandlers(inst, file, request);
	request.onabort = handlers.handleXHRAbort;
	request.onerror = handlers.handleXHRError;
	request.onload = handlers.handleXHRLoad;
	if (request.upload) request.upload.onprogress = handlers.handleXHRProgress;
}
function unwrapFunctionValue(data, file) {
	if (typeof data === "function") return data({ file });
	if (data) return data;
	return {};
}
function setHeaders(request, headers, file) {
	const headersObject = unwrapFunctionValue(headers, file);
	if (!headersObject) return;
	Object.keys(headersObject).forEach((key) => {
		request.setRequestHeader(key, headersObject[key]);
	});
}
function appendData(formData, data, file) {
	const dataObject = unwrapFunctionValue(data, file);
	if (!dataObject) return;
	Object.keys(dataObject).forEach((key) => {
		formData.append(key, dataObject[key]);
	});
}
function submitImpl(inst, fieldName, file, { method, action, withCredentials, responseType, headers, data }) {
	const request = new XMLHttpRequest();
	request.responseType = responseType;
	inst.xhrMap.set(file.id, request);
	request.withCredentials = withCredentials;
	const formData = new FormData();
	appendData(formData, data, file);
	if (file.file !== null) formData.append(fieldName, file.file);
	registerHandler(inst, file, request);
	if (action !== void 0) {
		request.open(method.toUpperCase(), action);
		setHeaders(request, headers, file);
		request.send(formData);
		const fileAfterChange = Object.assign({}, file, { status: "uploading" });
		inst.doChange(fileAfterChange);
	}
}
const uploadProps = {
	...require__mixins_use_theme.default.props,
	name: {
		type: String,
		default: "file"
	},
	accept: String,
	action: String,
	customRequest: Function,
	directory: Boolean,
	directoryDnd: {
		type: Boolean,
		default: void 0
	},
	method: {
		type: String,
		default: "POST"
	},
	multiple: Boolean,
	showFileList: {
		type: Boolean,
		default: true
	},
	data: [Object, Function],
	headers: [Object, Function],
	withCredentials: Boolean,
	responseType: {
		type: String,
		default: ""
	},
	disabled: {
		type: Boolean,
		default: void 0
	},
	onChange: Function,
	onRemove: Function,
	onFinish: Function,
	onError: Function,
	onRetry: Function,
	onBeforeUpload: Function,
	isErrorState: Function,
	/** currently not used */
	onDownload: Function,
	customDownload: Function,
	defaultUpload: {
		type: Boolean,
		default: true
	},
	fileList: Array,
	"onUpdate:fileList": [Function, Array],
	onUpdateFileList: [Function, Array],
	fileListClass: String,
	fileListStyle: [String, Object],
	defaultFileList: {
		type: Array,
		default: () => []
	},
	showCancelButton: {
		type: Boolean,
		default: true
	},
	showRemoveButton: {
		type: Boolean,
		default: true
	},
	showDownloadButton: Boolean,
	showRetryButton: {
		type: Boolean,
		default: true
	},
	showPreviewButton: {
		type: Boolean,
		default: true
	},
	alwaysShowActions: Boolean,
	listType: {
		type: String,
		default: "text"
	},
	onPreview: Function,
	shouldUseThumbnailUrl: {
		type: Function,
		default: (file) => {
			if (!require_upload_src_utils.environmentSupportFile) return false;
			return require_upload_src_utils.isImageFile(file);
		}
	},
	createThumbnailUrl: Function,
	abstract: Boolean,
	max: Number,
	showTrigger: {
		type: Boolean,
		default: true
	},
	imageGroupProps: Object,
	inputProps: Object,
	triggerClass: String,
	triggerStyle: [String, Object],
	renderIcon: Function
};
var Upload_default = (0, vue.defineComponent)({
	name: "Upload",
	props: uploadProps,
	setup(props) {
		if (props.abstract && props.listType === "image-card") require__utils_naive_warn.throwError("upload", "when the list-type is image-card, abstract is not supported.");
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Upload", "-upload", require_upload_src_styles_index_cssr, require_upload_styles_light.default, props, mergedClsPrefixRef);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Upload", mergedRtlRef, mergedClsPrefixRef);
		const formItem = require__mixins_use_form_item.default(props);
		const uncontrolledFileListRef = (0, vue.ref)(props.defaultFileList);
		const controlledFileListRef = (0, vue.toRef)(props, "fileList");
		const inputElRef = (0, vue.ref)(null);
		const draggerInsideRef = { value: false };
		const dragOverRef = (0, vue.ref)(false);
		const xhrMap = /* @__PURE__ */ new Map();
		const _mergedFileListRef = (0, vooks.useMergedState)(controlledFileListRef, uncontrolledFileListRef);
		const mergedFileListRef = (0, vue.computed)(() => _mergedFileListRef.value.map(require_upload_src_utils.createSettledFileInfo));
		const maxReachedRef = (0, vue.computed)(() => {
			const { max } = props;
			if (max !== void 0) return mergedFileListRef.value.length >= max;
			return false;
		});
		function openOpenFileDialog() {
			inputElRef.value?.click();
		}
		function handleFileInputChange(e) {
			const target = e.target;
			handleFileAddition(target.files ? Array.from(target.files).map((file) => ({
				file,
				entry: null,
				source: "input"
			})) : null, e);
			target.value = "";
		}
		function doUpdateFileList(files) {
			const { "onUpdate:fileList": _onUpdateFileList, onUpdateFileList } = props;
			if (_onUpdateFileList) require__utils_vue_call.call(_onUpdateFileList, files);
			if (onUpdateFileList) require__utils_vue_call.call(onUpdateFileList, files);
			uncontrolledFileListRef.value = files;
		}
		const mergedMultipleRef = (0, vue.computed)(() => props.multiple || props.directory);
		const doChange = (fileAfterChange, event, options = {
			append: false,
			remove: false
		}) => {
			const { append, remove } = options;
			const fileListAfterChange = Array.from(mergedFileListRef.value);
			const fileIndex = fileListAfterChange.findIndex((file) => file.id === fileAfterChange.id);
			if (append || remove || ~fileIndex) {
				if (append) fileListAfterChange.push(fileAfterChange);
				else if (remove) fileListAfterChange.splice(fileIndex, 1);
				else fileListAfterChange.splice(fileIndex, 1, fileAfterChange);
				const { onChange } = props;
				if (onChange) onChange({
					file: fileAfterChange,
					fileList: fileListAfterChange,
					event
				});
				doUpdateFileList(fileListAfterChange);
			} else if (process.env.NODE_ENV !== "production") require__utils_naive_warn.warn("upload", "File has no corresponding id in current file list.");
		};
		let customRequestDoChangeChain = Promise.resolve();
		const scheduleDoChange = (file, event, options) => {
			customRequestDoChangeChain = customRequestDoChangeChain.then(async () => {
				await (0, vue.nextTick)();
				doChange(file, event, options);
			});
		};
		function handleFileAddition(fileAndEntries, e) {
			if (!fileAndEntries || fileAndEntries.length === 0) return;
			const { onBeforeUpload } = props;
			fileAndEntries = mergedMultipleRef.value ? fileAndEntries : [fileAndEntries[0]];
			const { max, accept } = props;
			fileAndEntries = fileAndEntries.filter(({ file, source }) => {
				if (source === "dnd" && accept?.trim()) return require_upload_src_utils.matchType(file.name, file.type, accept);
				else return true;
			});
			if (max) fileAndEntries = fileAndEntries.slice(0, max - mergedFileListRef.value.length);
			const batchId = (0, seemly.createId)();
			Promise.all(fileAndEntries.map(async ({ file, entry }) => {
				const fileInfo = {
					id: (0, seemly.createId)(),
					batchId,
					name: file.name,
					status: "pending",
					percentage: 0,
					file,
					url: null,
					type: file.type,
					thumbnailUrl: null,
					fullPath: entry?.fullPath ?? `/${file.webkitRelativePath || file.name}`
				};
				if (!onBeforeUpload || await onBeforeUpload({
					file: fileInfo,
					fileList: mergedFileListRef.value
				}) !== false) return fileInfo;
				return null;
			})).then(async (fileInfos) => {
				let nextTickChain = Promise.resolve();
				fileInfos.forEach((fileInfo) => {
					nextTickChain = nextTickChain.then(vue.nextTick).then(() => {
						if (fileInfo) doChange(fileInfo, e, { append: true });
					});
				});
				await nextTickChain;
			}).then(() => {
				if (props.defaultUpload) submit();
			});
		}
		function submit({ fileId, retry = false } = {}) {
			const { method, action, withCredentials, headers, data, name: fieldName } = props;
			const filesToUpload = fileId !== void 0 ? mergedFileListRef.value.filter((file) => file.id === fileId) : mergedFileListRef.value;
			const shouldReupload = retry || fileId !== void 0;
			filesToUpload.forEach((file) => {
				const { status } = file;
				if (status === "pending" || status === "error" && shouldReupload) {
					if (props.customRequest) customSubmitImpl({
						inst: {
							doChange: scheduleDoChange,
							xhrMap,
							onFinish: props.onFinish,
							onError: props.onError
						},
						file,
						action,
						withCredentials,
						headers,
						data,
						customRequest: props.customRequest
					});
					else submitImpl({
						doChange,
						xhrMap,
						onFinish: props.onFinish,
						onError: props.onError,
						isErrorState: props.isErrorState
					}, fieldName, file, {
						method,
						action,
						withCredentials,
						responseType: props.responseType,
						headers,
						data
					});
				}
			});
		}
		function getFileThumbnailUrlResolver(file) {
			if (file.thumbnailUrl) return file.thumbnailUrl;
			const { createThumbnailUrl } = props;
			if (createThumbnailUrl) return createThumbnailUrl(file.file, file) ?? (file.url || "");
			if (file.url) return file.url;
			else if (file.file) return require_upload_src_utils.createImageDataUrl(file.file);
			return "";
		}
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self: { draggerColor, draggerBorder, draggerBorderHover, itemColorHover, itemColorHoverError, itemTextColorError, itemTextColorSuccess, itemTextColor, itemIconColor, itemDisabledOpacity, lineHeight, borderRadius, fontSize, itemBorderImageCardError, itemBorderImageCard } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-border-radius": borderRadius,
				"--n-dragger-border": draggerBorder,
				"--n-dragger-border-hover": draggerBorderHover,
				"--n-dragger-color": draggerColor,
				"--n-font-size": fontSize,
				"--n-item-color-hover": itemColorHover,
				"--n-item-color-hover-error": itemColorHoverError,
				"--n-item-disabled-opacity": itemDisabledOpacity,
				"--n-item-icon-color": itemIconColor,
				"--n-item-text-color": itemTextColor,
				"--n-item-text-color-error": itemTextColorError,
				"--n-item-text-color-success": itemTextColorSuccess,
				"--n-line-height": lineHeight,
				"--n-item-border-image-card-error": itemBorderImageCardError,
				"--n-item-border-image-card": itemBorderImageCard
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("upload", void 0, cssVarsRef, props) : void 0;
		(0, vue.provide)(require_upload_src_interface.uploadInjectionKey, {
			mergedClsPrefixRef,
			mergedThemeRef: themeRef,
			showCancelButtonRef: (0, vue.toRef)(props, "showCancelButton"),
			showDownloadButtonRef: (0, vue.toRef)(props, "showDownloadButton"),
			showRemoveButtonRef: (0, vue.toRef)(props, "showRemoveButton"),
			showRetryButtonRef: (0, vue.toRef)(props, "showRetryButton"),
			onRemoveRef: (0, vue.toRef)(props, "onRemove"),
			onDownloadRef: (0, vue.toRef)(props, "onDownload"),
			customDownloadRef: (0, vue.toRef)(props, "customDownload"),
			mergedFileListRef,
			triggerClassRef: (0, vue.toRef)(props, "triggerClass"),
			triggerStyleRef: (0, vue.toRef)(props, "triggerStyle"),
			shouldUseThumbnailUrlRef: (0, vue.toRef)(props, "shouldUseThumbnailUrl"),
			renderIconRef: (0, vue.toRef)(props, "renderIcon"),
			xhrMap,
			submit,
			doChange,
			showPreviewButtonRef: (0, vue.toRef)(props, "showPreviewButton"),
			alwaysShowActionsRef: (0, vue.toRef)(props, "alwaysShowActions"),
			onPreviewRef: (0, vue.toRef)(props, "onPreview"),
			getFileThumbnailUrlResolver,
			listTypeRef: (0, vue.toRef)(props, "listType"),
			dragOverRef,
			openOpenFileDialog,
			draggerInsideRef,
			handleFileAddition,
			mergedDisabledRef: formItem.mergedDisabledRef,
			maxReachedRef,
			fileListClassRef: (0, vue.toRef)(props, "fileListClass"),
			fileListStyleRef: (0, vue.toRef)(props, "fileListStyle"),
			abstractRef: (0, vue.toRef)(props, "abstract"),
			acceptRef: (0, vue.toRef)(props, "accept"),
			cssVarsRef: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClassRef: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender,
			showTriggerRef: (0, vue.toRef)(props, "showTrigger"),
			imageGroupPropsRef: (0, vue.toRef)(props, "imageGroupProps"),
			mergedDirectoryDndRef: (0, vue.computed)(() => {
				return props.directoryDnd ?? props.directory;
			}),
			onRetryRef: (0, vue.toRef)(props, "onRetry")
		});
		const exposedMethods = {
			clear: () => {
				uncontrolledFileListRef.value = [];
			},
			submit,
			openOpenFileDialog
		};
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			draggerInsideRef,
			rtlEnabled: rtlEnabledRef,
			inputElRef,
			mergedTheme: themeRef,
			dragOver: dragOverRef,
			mergedMultiple: mergedMultipleRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender,
			handleFileInputChange,
			...exposedMethods
		};
	},
	render() {
		const { draggerInsideRef, mergedClsPrefix, $slots, directory, onRender } = this;
		if ($slots.default && !this.abstract) {
			if ($slots.default()[0]?.type?.["__UPLOAD_DRAGGER__"]) draggerInsideRef.value = true;
		}
		const inputNode = ((0, vue.openBlock)(), (0, vue.createElementBlock)("input", (0, vue.mergeProps)(this.inputProps, {
			ref: "inputElRef",
			type: "file",
			class: `${mergedClsPrefix}-upload-file-input`,
			accept: this.accept,
			multiple: this.mergedMultiple,
			onChange: this.handleFileInputChange,
			webkitdirectory: directory || void 0,
			directory: directory || void 0
		}), null, 16, _hoisted_1));
		if (this.abstract) return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => $slots.default?.()), ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Teleport, { to: "body" }, require_vdom.normalizeSlots(inputNode), 1024))], 64);
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-upload`,
				this.rtlEnabled && `${mergedClsPrefix}-upload--rtl`,
				draggerInsideRef.value && `${mergedClsPrefix}-upload--dragger-inside`,
				this.dragOver && `${mergedClsPrefix}-upload--drag-over`,
				this.themeClass
			]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [
			require_vdom.normalizeVNode(() => inputNode),
			require_vdom.normalizeVNode(() => this.showTrigger && this.listType !== "image-card" && ((0, vue.openBlock)(), (0, vue.createBlock)(require_upload_src_UploadTrigger, null, require_vdom.normalizeSlots($slots), 1024))),
			require_vdom.normalizeVNode(() => this.showFileList && ((0, vue.openBlock)(), (0, vue.createBlock)(require_upload_src_UploadFileList, null, require_vdom.normalizeSlots($slots), 1024)))
		], 6);
	}
});
//#endregion
exports.default = Upload_default;
exports.uploadProps = uploadProps;
