import { omit } from "../../_utils/vue/omit.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { messageApiInjectionKey, messageProviderInjectionKey } from "./context.mjs";
import MessageEnvironment_default from "./MessageEnvironment.mjs";
import { createId } from "seemly";
import { Fragment, Teleport, createBlock, createElementBlock, createElementVNode, defineComponent, mergeProps, normalizeStyle, openBlock, provide, reactive, ref } from "vue";
//#region src/message/src/MessageProvider.tsx
const messageProviderProps = {
  ...useTheme.props,
  to: [String, Object],
  duration: {
    type: Number,
    default: 3e3
  },
  keepAliveOnHover: Boolean,
  max: Number,
  placement: {
    type: String,
    default: "top"
  },
  closable: Boolean,
  containerClass: String,
  containerStyle: [String, Object]
};
var MessageProvider_default = defineComponent({
  name: "MessageProvider",
  props: messageProviderProps,
  setup(props) {
    const {
      mergedClsPrefixRef
    } = useConfig(props);
    const messageListRef = ref([]);
    const messageRefs = ref({});
    const api = {
      create(content, options) {
        return create(content, {
          type: "default",
          ...options
        });
      },
      info(content, options) {
        return create(content, {
          ...options,
          type: "info"
        });
      },
      success(content, options) {
        return create(content, {
          ...options,
          type: "success"
        });
      },
      warning(content, options) {
        return create(content, {
          ...options,
          type: "warning"
        });
      },
      error(content, options) {
        return create(content, {
          ...options,
          type: "error"
        });
      },
      loading(content, options) {
        return create(content, {
          ...options,
          type: "loading"
        });
      },
      destroyAll
    };
    provide(messageProviderInjectionKey, {
      props,
      mergedClsPrefixRef
    });
    provide(messageApiInjectionKey, api);
    function create(content, options) {
      const key = createId();
      const messageReactive = reactive({
        ...options,
        content,
        key,
        destroy: () => {
          messageRefs.value[key]?.hide();
        }
      });
      const {
        max
      } = props;
      if (max && messageListRef.value.length >= max) messageListRef.value.shift();
      messageListRef.value.push(messageReactive);
      return messageReactive;
    }
    function handleAfterLeave(key) {
      messageListRef.value.splice(messageListRef.value.findIndex(message => message.key === key), 1);
      delete messageRefs.value[key];
    }
    function destroyAll() {
      Object.values(messageRefs.value).forEach(messageInstRef => {
        messageInstRef.hide();
      });
    }
    return Object.assign({
      mergedClsPrefix: mergedClsPrefixRef,
      messageRefs,
      messageList: messageListRef,
      handleAfterLeave
    }, api);
  },
  render() {
    return openBlock(), createElementBlock(Fragment, null, [normalizeVNode(() => this.$slots.default?.()), this.messageList.length ? (openBlock(), createBlock(Teleport, {
      key: 0,
      to: this.to ?? "body"
    }, [createElementVNode("div", {
      class: normalizeClass$1([`${this.mergedClsPrefix}-message-container`, `${this.mergedClsPrefix}-message-container--${this.placement}`, this.containerClass]),
      key: "message-container",
      style: normalizeStyle(this.containerStyle)
    }, [normalizeVNode(() => this.messageList.map(message => {
      return openBlock(), createBlock(MessageEnvironment_default, mergeProps({
        ref: inst => {
          if (inst) this.messageRefs[message.key] = inst;
        },
        internalKey: message.key,
        onInternalAfterLeave: this.handleAfterLeave
      }, omit(message, ["destroy"], void 0), {
        duration: message.duration === void 0 ? this.duration : message.duration,
        keepAliveOnHover: message.keepAliveOnHover === void 0 ? this.keepAliveOnHover : message.keepAliveOnHover,
        closable: message.closable === void 0 ? this.closable : message.closable
      }), null, 16, ["internalKey", "onInternalAfterLeave", "duration", "keepAliveOnHover", "closable"]);
    }))], 6)], 8, ["to"])) : normalizeVNode(() => null)], 64);
  }
});
//#endregion
export { MessageProvider_default as default, messageProviderProps };