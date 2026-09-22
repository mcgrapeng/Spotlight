import { download } from "../../_utils/dom/download.mjs";
import { warn } from "../../_utils/naive/warn.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import IconSwitchTransition_default from "../../_internal/icon-switch-transition/src/IconSwitchTransition.mjs";
import Attach_default from "../../_internal/icons/Attach.mjs";
import Cancel_default from "../../_internal/icons/Cancel.mjs";
import Download_default from "../../_internal/icons/Download.mjs";
import Eye_default from "../../_internal/icons/Eye.mjs";
import Retry_default from "../../_internal/icons/Retry.mjs";
import Trash_default from "../../_internal/icons/Trash.mjs";
import Button from "../../button/src/Button.mjs";
import Image_default from "../../image/src/Image.mjs";
import { uploadInjectionKey } from "./interface.mjs";
import { renderDocumentIcon, renderImageIcon } from "./icons.mjs";
import UploadProgress_default from "./UploadProgress.mjs";
import { isImageFile } from "./utils.mjs";
import { Fragment, computed, createBlock, createElementBlock, createElementVNode, defineComponent, inject, openBlock, ref, watchEffect } from "vue";
import { useMemo } from "vooks";
//#region src/upload/src/UploadFile.tsx
const _hoisted_1 = ["href", "onClick"];
const _hoisted_2 = ["href", "onClick"];
const _hoisted_3 = ["onClick"];
const buttonThemeOverrides = {
  paddingMedium: "0 3px",
  heightMedium: "24px",
  iconSizeMedium: "18px"
};
var UploadFile_default = defineComponent({
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
    const NUpload = inject(uploadInjectionKey);
    const imageRef = ref(null);
    const thumbnailUrlRef = ref("");
    const progressStatusRef = computed(() => {
      const {
        file
      } = props;
      if (file.status === "finished") return "success";
      if (file.status === "error") return "error";
      return "info";
    });
    const buttonTypeRef = computed(() => {
      const {
        file
      } = props;
      if (file.status === "error") return "error";
    });
    const showProgressRef = computed(() => {
      const {
        file
      } = props;
      return file.status === "uploading";
    });
    const showCancelButtonRef = computed(() => {
      if (!NUpload.showCancelButtonRef.value) return false;
      const {
        file
      } = props;
      return ["uploading", "pending", "error"].includes(file.status);
    });
    const showRemoveButtonRef = computed(() => {
      if (!NUpload.showRemoveButtonRef.value) return false;
      const {
        file
      } = props;
      return ["finished"].includes(file.status);
    });
    const showDownloadButtonRef = computed(() => {
      if (!NUpload.showDownloadButtonRef.value) return false;
      const {
        file
      } = props;
      return ["finished"].includes(file.status);
    });
    const showRetryButtonRef = computed(() => {
      if (!NUpload.showRetryButtonRef.value) return false;
      const {
        file
      } = props;
      return ["error"].includes(file.status);
    });
    const mergedThumbnailUrlRef = useMemo(() => {
      return thumbnailUrlRef.value || props.file.thumbnailUrl || props.file.url;
    });
    const showPreviewButtonRef = computed(() => {
      if (!NUpload.showPreviewButtonRef.value) return false;
      const {
        file: {
          status
        },
        listType
      } = props;
      return ["finished"].includes(status) && mergedThumbnailUrlRef.value && listType === "image-card";
    });
    async function handleRetryClick() {
      const onRetry = NUpload.onRetryRef.value;
      if (onRetry) {
        if ((await onRetry({
          file: props.file
        })) === false) return;
      }
      NUpload.submit({
        fileId: props.file.id
      });
    }
    function handleRemoveOrCancelClick(e) {
      e.preventDefault();
      const {
        file
      } = props;
      if (["finished", "pending", "error"].includes(file.status)) handleRemove(file);else if (["uploading"].includes(file.status)) handleAbort(file);else warn("upload", "The button clicked type is unknown.");
    }
    function handleDownloadClick(e) {
      e.preventDefault();
      handleDownload(props.file);
    }
    function handleRemove(file) {
      const {
        xhrMap,
        doChange,
        onRemoveRef: {
          value: onRemove
        },
        mergedFileListRef: {
          value: mergedFileList
        }
      } = NUpload;
      Promise.resolve(onRemove ? onRemove({
        file: Object.assign({}, file),
        fileList: mergedFileList,
        index: props.index
      }) : true).then(result => {
        if (result === false) return;
        const fileAfterChange = Object.assign({}, file, {
          status: "removed"
        });
        xhrMap.delete(file.id);
        doChange(fileAfterChange, void 0, {
          remove: true
        });
      });
    }
    function handleDownload(file) {
      const {
        onDownloadRef: {
          value: onDownload
        },
        customDownloadRef: {
          value: customDownload
        }
      } = NUpload;
      Promise.resolve(onDownload ? onDownload(Object.assign({}, file)) : true).then(res => {
        if (res !== false) {
          if (customDownload) customDownload(Object.assign({}, file));else download(file.url, file.name);
        }
      });
    }
    function handleAbort(file) {
      const {
        xhrMap
      } = NUpload;
      xhrMap.get(file.id)?.abort();
      handleRemove(Object.assign({}, file));
    }
    function handlePreviewClick(e) {
      const {
        onPreviewRef: {
          value: onPreview
        }
      } = NUpload;
      if (onPreview) onPreview(props.file, {
        event: e
      });else if (props.listType === "image-card") {
        const {
          value
        } = imageRef;
        if (!value) return;
        value.showPreview();
      }
    }
    const deriveFileThumbnailUrl = async () => {
      const {
        listType
      } = props;
      if (listType !== "image" && listType !== "image-card") return;
      if (NUpload.shouldUseThumbnailUrlRef.value(props.file)) thumbnailUrlRef.value = await NUpload.getFileThumbnailUrlResolver(props.file);
    };
    watchEffect(() => {
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
    const {
      clsPrefix,
      mergedTheme,
      listType,
      file,
      renderIcon
    } = this;
    let icon;
    const isImageType = listType === "image";
    if (isImageType || listType === "image-card") icon = !this.shouldUseThumbnailUrl(file) || !this.mergedThumbnailUrl ? (openBlock(), createElementBlock("span", {
      key: 1,
      class: normalizeClass$1(`${clsPrefix}-upload-file-info__thumbnail`)
    }, [renderIcon ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => renderIcon(file))], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [isImageFile(file) ? (openBlock(), createBlock(Icon_default, {
      key: 0,
      clsPrefix
    }, {
      default: renderImageIcon
    }, 1032, ["clsPrefix"])) : (openBlock(), createBlock(Icon_default, {
      key: 1,
      clsPrefix
    }, {
      default: renderDocumentIcon
    }, 1032, ["clsPrefix"]))], 64))], 2)) : (openBlock(), createElementBlock("a", {
      key: 2,
      rel: "noopener noreferer",
      target: "_blank",
      href: file.url || void 0,
      class: normalizeClass$1(`${clsPrefix}-upload-file-info__thumbnail`),
      onClick: this.handlePreviewClick
    }, [listType === "image-card" ? (openBlock(), createBlock(Image_default, {
      key: 0,
      src: this.mergedThumbnailUrl || void 0,
      previewSrc: file.url || void 0,
      alt: file.name,
      ref: "imageRef"
    }, null, 8, ["src", "previewSrc", "alt"])) : (openBlock(), createElementBlock("img", {
      key: 1,
      src: this.mergedThumbnailUrl || void 0,
      alt: file.name
    }, null, 8, ["src", "alt"]))], 10, _hoisted_1));else icon = (icon => {
      return openBlock(), createElementBlock("span", {
        key: 3,
        class: normalizeClass$1(`${clsPrefix}-upload-file-info__thumbnail`)
      }, [renderIcon ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => renderIcon(file))], 64)) : (openBlock(), createBlock(Icon_default, {
        key: 1,
        clsPrefix
      }, {
        default: () => (openBlock(), createBlock(Attach_default))
      }, 1032, ["clsPrefix"]))], 2);
    })(icon);
    const progress = (openBlock(), createBlock(UploadProgress_default, {
      show: this.showProgress,
      percentage: file.percentage || 0,
      status: this.progressStatus
    }, null, 8, ["show", "percentage", "status"]));
    const showName = listType === "text" || listType === "image";
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${clsPrefix}-upload-file`, `${clsPrefix}-upload-file--${this.progressStatus}-status`, file.url && file.status !== "error" && listType !== "image-card" && `${clsPrefix}-upload-file--with-url`, `${clsPrefix}-upload-file--${listType}-type`, this.alwaysShowActions && `${clsPrefix}-upload-file--always-show-actions`])
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${clsPrefix}-upload-file-info`)
    }, [normalizeVNode(() => icon), createElementVNode("div", {
      class: normalizeClass$1(`${clsPrefix}-upload-file-info__name`)
    }, [normalizeVNode(() => showName && (file.url && file.status !== "error" ? (openBlock(), createElementBlock("a", {
      key: 4,
      rel: "noopener noreferer",
      target: "_blank",
      href: file.url || void 0,
      onClick: this.handlePreviewClick
    }, [normalizeVNode(() => file.name)], 8, _hoisted_2)) : (openBlock(), createElementBlock("span", {
      key: 5,
      onClick: this.handlePreviewClick
    }, [normalizeVNode(() => file.name)], 8, _hoisted_3)))), normalizeVNode(() => isImageType && progress)], 2), createElementVNode("div", {
      class: normalizeClass$1([`${clsPrefix}-upload-file-info__action`, `${clsPrefix}-upload-file-info__action--${listType}-type`, this.alwaysShowActions && `${clsPrefix}-upload-file-info__action--always-show`])
    }, [this.showPreviewButton ? (openBlock(), createBlock(Button, {
      key: "preview",
      quaternary: true,
      type: this.buttonType,
      onClick: this.handlePreviewClick,
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      builtinThemeOverrides: buttonThemeOverrides
    }, {
      icon: () => (openBlock(), createBlock(Icon_default, {
        clsPrefix
      }, {
        default: () => (openBlock(), createBlock(Eye_default))
      }, 1032, ["clsPrefix"]))
    }, 1032, ["type", "onClick", "theme", "themeOverrides", "builtinThemeOverrides"])) : normalizeVNode(() => null), normalizeVNode(() => (this.showRemoveButton || this.showCancelButton) && !this.disabled && (openBlock(), createBlock(Button, {
      key: "cancelOrTrash",
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      quaternary: true,
      builtinThemeOverrides: buttonThemeOverrides,
      type: this.buttonType,
      onClick: this.handleRemoveOrCancelClick
    }, {
      icon: () => (openBlock(), createBlock(IconSwitchTransition_default, null, {
        default: () => this.showRemoveButton ? (openBlock(), createBlock(Icon_default, {
          clsPrefix,
          key: "trash"
        }, {
          default: () => (openBlock(), createBlock(Trash_default))
        }, 1032, ["clsPrefix"])) : (openBlock(), createBlock(Icon_default, {
          clsPrefix,
          key: "cancel"
        }, {
          default: () => (openBlock(), createBlock(Cancel_default))
        }, 1032, ["clsPrefix"]))
      }, 1024))
    }, 1032, ["theme", "themeOverrides", "builtinThemeOverrides", "type", "onClick"]))), normalizeVNode(() => this.showRetryButton && !this.disabled && (openBlock(), createBlock(Button, {
      key: "retry",
      quaternary: true,
      type: this.buttonType,
      onClick: this.handleRetryClick,
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      builtinThemeOverrides: buttonThemeOverrides
    }, {
      icon: () => (openBlock(), createBlock(Icon_default, {
        clsPrefix
      }, {
        default: () => (openBlock(), createBlock(Retry_default))
      }, 1032, ["clsPrefix"]))
    }, 1032, ["type", "onClick", "theme", "themeOverrides", "builtinThemeOverrides"]))), this.showDownloadButton ? (openBlock(), createBlock(Button, {
      key: "download",
      quaternary: true,
      type: this.buttonType,
      onClick: this.handleDownloadClick,
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      builtinThemeOverrides: buttonThemeOverrides
    }, {
      icon: () => (openBlock(), createBlock(Icon_default, {
        clsPrefix
      }, {
        default: () => (openBlock(), createBlock(Download_default))
      }, 1032, ["clsPrefix"]))
    }, 1032, ["type", "onClick", "theme", "themeOverrides", "builtinThemeOverrides"])) : normalizeVNode(() => null)], 2)], 2), normalizeVNode(() => !isImageType && progress)], 2);
  }
});
//#endregion
export { UploadFile_default as default };