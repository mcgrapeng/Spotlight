import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
import { omit } from "../../_utils/vue/omit.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import notificationLight from "../styles/light.mjs";
import { notificationProviderInjectionKey } from "./context.mjs";
import { NotificationContainer } from "./NotificationContainer.mjs";
import { NotificationEnvironment } from "./NotificationEnvironment.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { createId } from "seemly";
import { Fragment, Teleport, createBlock, createElementBlock, defineComponent, mergeProps, normalizeStyle, openBlock, provide, reactive, ref } from "vue";
//#region src/notification/src/NotificationProvider.tsx
const notificationApiInjectionKey = createInjectionKey("n-notification-api");
const notificationProviderProps = {
  ...useTheme.props,
  containerClass: String,
  containerStyle: [String, Object],
  to: [String, Object],
  scrollable: {
    type: Boolean,
    default: true
  },
  max: Number,
  placement: {
    type: String,
    default: "top-right"
  },
  keepAliveOnHover: Boolean
};
var NotificationProvider_default = defineComponent({
  name: "NotificationProvider",
  props: notificationProviderProps,
  setup(props) {
    const {
      mergedClsPrefixRef
    } = useConfig(props);
    const notificationListRef = ref([]);
    const notificationRefs = {};
    const leavingKeySet = /* @__PURE__ */new Set();
    function create(options) {
      const key = createId();
      const destroy = () => {
        leavingKeySet.add(key);
        if (notificationRefs[key]) notificationRefs[key].hide();
      };
      const notificationReactive = reactive({
        ...options,
        key,
        destroy,
        hide: destroy,
        deactivate: destroy
      });
      const {
        max
      } = props;
      if (max && notificationListRef.value.length - leavingKeySet.size >= max) {
        let someoneMountedRemoved = false;
        let index = 0;
        for (const notification of notificationListRef.value) {
          if (!leavingKeySet.has(notification.key)) {
            if (notificationRefs[notification.key]) {
              notification.destroy();
              someoneMountedRemoved = true;
            }
            break;
          }
          index++;
        }
        if (!someoneMountedRemoved) notificationListRef.value.splice(index, 1);
      }
      notificationListRef.value.push(notificationReactive);
      return notificationReactive;
    }
    const apis = ["info", "success", "warning", "error"].map(type => {
      return options => create({
        ...options,
        type
      });
    });
    function handleAfterLeave(key) {
      leavingKeySet.delete(key);
      notificationListRef.value.splice(notificationListRef.value.findIndex(notification => notification.key === key), 1);
    }
    const themeRef = useTheme("Notification", "-notification", index_cssr_default, notificationLight, props, mergedClsPrefixRef);
    const api = {
      create,
      info: apis[0],
      success: apis[1],
      warning: apis[2],
      error: apis[3],
      open,
      destroyAll
    };
    const wipTransitionCountRef = ref(0);
    provide(notificationApiInjectionKey, api);
    provide(notificationProviderInjectionKey, {
      props,
      mergedClsPrefixRef,
      mergedThemeRef: themeRef,
      wipTransitionCountRef
    });
    function open(options) {
      return create(options);
    }
    function destroyAll() {
      Object.values(notificationListRef.value).forEach(notification => {
        notification.hide();
      });
    }
    return Object.assign({
      mergedClsPrefix: mergedClsPrefixRef,
      notificationList: notificationListRef,
      notificationRefs,
      handleAfterLeave
    }, api);
  },
  render() {
    const {
      placement
    } = this;
    return openBlock(), createElementBlock(Fragment, null, [normalizeVNode(() => this.$slots.default?.()), this.notificationList.length ? (openBlock(), createBlock(Teleport, {
      key: 0,
      to: this.to ?? "body"
    }, [(openBlock(), createBlock(NotificationContainer, {
      class: normalizeClass$1(this.containerClass),
      style: normalizeStyle(this.containerStyle),
      scrollable: this.scrollable && placement !== "top" && placement !== "bottom",
      placement
    }, {
      default: () => {
        return this.notificationList.map(notification => {
          return openBlock(), createBlock(NotificationEnvironment, mergeProps({
            ref: inst => {
              const refKey = notification.key;
              if (inst === null) delete this.notificationRefs[refKey];else this.notificationRefs[refKey] = inst;
            }
          }, omit(notification, ["destroy", "hide", "deactivate"]), {
            internalKey: notification.key,
            onInternalAfterLeave: this.handleAfterLeave,
            keepAliveOnHover: notification.keepAliveOnHover === void 0 ? this.keepAliveOnHover : notification.keepAliveOnHover
          }), null, 16, ["internalKey", "onInternalAfterLeave", "keepAliveOnHover"]);
        });
      }
    }, 1032, ["class", "style", "scrollable", "placement"]))], 8, ["to"])) : normalizeVNode(() => null)], 64);
  }
});
//#endregion
export { NotificationProvider_default as default, notificationApiInjectionKey, notificationProviderProps };