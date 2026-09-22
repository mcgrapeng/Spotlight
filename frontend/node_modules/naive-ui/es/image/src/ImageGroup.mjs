import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
import { throwError } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { normalizeSlots } from "../../vue-jsx-vapor/vdom.mjs";
import { imagePreviewSharedProps } from "./interface.mjs";
import ImagePreview_default from "./ImagePreview.mjs";
import { createId } from "seemly";
import { computed, createBlock, defineComponent, openBlock, provide, ref, toRef } from "vue";
import { useMergedState } from "vooks";
//#region src/image/src/ImageGroup.tsx
const imageGroupInjectionKey = createInjectionKey("n-image-group");
const imageGroupProps = {
  ...imagePreviewSharedProps,
  srcList: Array,
  current: Number,
  defaultCurrent: {
    type: Number,
    default: 0
  },
  show: {
    type: Boolean,
    default: void 0
  },
  defaultShow: Boolean,
  onUpdateShow: [Function, Array],
  "onUpdate:show": [Function, Array],
  onUpdateCurrent: [Function, Array],
  "onUpdate:current": [Function, Array]
};
var ImageGroup_default = defineComponent({
  name: "ImageGroup",
  props: imageGroupProps,
  setup(props) {
    const {
      mergedClsPrefixRef
    } = useConfig(props);
    const groupId = `c${createId()}`;
    const previewInstRef = ref(null);
    const uncontrolledShowRef = ref(props.defaultShow);
    const controlledShowRef = toRef(props, "show");
    const mergedShowRef = useMergedState(controlledShowRef, uncontrolledShowRef);
    const registeredImageUrlMap = ref(/* @__PURE__ */new Map());
    const mergedImageUrlMap = computed(() => {
      if (props.srcList) {
        const map = /* @__PURE__ */new Map();
        props.srcList.forEach((url, index) => {
          map.set(`p${index}`, url);
        });
        return map;
      }
      return registeredImageUrlMap.value;
    });
    const imageIdListRef = computed(() => Array.from(mergedImageUrlMap.value.keys()));
    const imageCountGetter = () => imageIdListRef.value.length;
    function registerImageUrl(id, url) {
      if (props.srcList) throwError("image-group", "`n-image` can't be placed inside `n-image-group` when image group's `src-list` prop is set.");
      const sid = `r${id}`;
      if (!registeredImageUrlMap.value.has(`r${sid}`)) registeredImageUrlMap.value.set(sid, url);
      return function unregisterPreviewUrl() {
        if (!registeredImageUrlMap.value.has(sid)) registeredImageUrlMap.value.delete(sid);
      };
    }
    const uncontrolledCurrentRef = ref(props.defaultCurrent);
    const controlledCurrentRef = toRef(props, "current");
    const mergedCurrentRef = useMergedState(controlledCurrentRef, uncontrolledCurrentRef);
    const setCurrentIndex = index => {
      if (index !== mergedCurrentRef.value) {
        const {
          onUpdateCurrent,
          "onUpdate:current": _onUpdateCurrent
        } = props;
        if (onUpdateCurrent) call(onUpdateCurrent, index);
        if (_onUpdateCurrent) call(_onUpdateCurrent, index);
        uncontrolledCurrentRef.value = index;
      }
    };
    const currentId = computed(() => imageIdListRef.value[mergedCurrentRef.value]);
    const setCurrentId = nextId => {
      const nextIndex = imageIdListRef.value.indexOf(nextId);
      if (nextIndex !== mergedCurrentRef.value) setCurrentIndex(nextIndex);
    };
    const currentUrl = computed(() => mergedImageUrlMap.value.get(currentId.value));
    function doUpdateShow(value) {
      const {
        onUpdateShow,
        "onUpdate:show": _onUpdateShow
      } = props;
      if (onUpdateShow) call(onUpdateShow, value);
      if (_onUpdateShow) call(_onUpdateShow, value);
      uncontrolledShowRef.value = value;
    }
    function onClose() {
      doUpdateShow(false);
    }
    const nextIndex = computed(() => {
      const findNext = (start, end) => {
        for (let i = start; i <= end; i++) {
          const id = imageIdListRef.value[i];
          if (mergedImageUrlMap.value.get(id)) return i;
        }
      };
      const next = findNext(mergedCurrentRef.value + 1, imageCountGetter() - 1);
      return next === void 0 ? findNext(0, mergedCurrentRef.value - 1) : next;
    });
    const prevIndex = computed(() => {
      const findPrev = (start, end) => {
        for (let i = start; i >= end; i--) {
          const id = imageIdListRef.value[i];
          if (mergedImageUrlMap.value.get(id)) return i;
        }
      };
      const prev = findPrev(mergedCurrentRef.value - 1, 0);
      return prev === void 0 ? findPrev(imageCountGetter() - 1, mergedCurrentRef.value + 1) : prev;
    });
    function go(step) {
      if (step === 1) {
        prevIndex.value !== void 0 && setCurrentIndex(nextIndex.value);
        props.onPreviewNext?.();
      } else {
        nextIndex.value !== void 0 && setCurrentIndex(prevIndex.value);
        props.onPreviewPrev?.();
      }
    }
    provide(imageGroupInjectionKey, {
      mergedClsPrefixRef,
      registerImageUrl,
      setThumbnailEl: el => {
        previewInstRef.value?.setThumbnailEl(el);
      },
      toggleShow: imageId => {
        doUpdateShow(true);
        setCurrentId(imageId);
      },
      groupId,
      renderToolbarRef: toRef(props, "renderToolbar")
    });
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      previewInstRef,
      mergedShow: mergedShowRef,
      src: currentUrl,
      onClose,
      next: () => {
        go(1);
      },
      prev: () => {
        go(-1);
      }
    };
  },
  render() {
    return openBlock(), createBlock(ImagePreview_default, {
      theme: this.theme,
      themeOverrides: this.themeOverrides,
      ref: "previewInstRef",
      onPrev: this.prev,
      onNext: this.next,
      src: this.src,
      show: this.mergedShow,
      showToolbar: this.showToolbar,
      showToolbarTooltip: this.showToolbarTooltip,
      renderToolbar: this.renderToolbar,
      keepDragOffset: this.keepDragOffset,
      onClose: this.onClose
    }, normalizeSlots(this.$slots), 1032, ["theme", "themeOverrides", "onPrev", "onNext", "src", "show", "showToolbar", "showToolbarTooltip", "renderToolbar", "keepDragOffset", "onClose"]);
  }
});
//#endregion
export { ImageGroup_default as default, imageGroupInjectionKey, imageGroupProps };