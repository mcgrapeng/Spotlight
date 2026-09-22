import { Transition, TransitionGroup, defineComponent, h } from "vue";
//#region src/_internal/fade-in-expand-transition/src/FadeInExpandTransition.ts
var FadeInExpandTransition_default = defineComponent({
  name: "FadeInExpandTransition",
  props: {
    appear: Boolean,
    group: Boolean,
    mode: String,
    onLeave: Function,
    onAfterLeave: Function,
    onAfterEnter: Function,
    width: Boolean,
    reverse: Boolean
  },
  setup(props, {
    slots
  }) {
    function handleBeforeLeave(el) {
      if (props.width) el.style.maxWidth = `${el.offsetWidth}px`;else el.style.maxHeight = `${el.offsetHeight}px`;
      el.offsetWidth;
    }
    function handleLeave(el) {
      if (props.width) el.style.maxWidth = "0";else el.style.maxHeight = "0";
      el.offsetWidth;
      const {
        onLeave
      } = props;
      if (onLeave) onLeave();
    }
    function handleAfterLeave(el) {
      if (props.width) el.style.maxWidth = "";else el.style.maxHeight = "";
      const {
        onAfterLeave
      } = props;
      if (onAfterLeave) onAfterLeave();
    }
    function handleEnter(el) {
      el.style.transition = "none";
      if (props.width) {
        const memorizedWidth = el.offsetWidth;
        el.style.maxWidth = "0";
        el.offsetWidth;
        el.style.transition = "";
        el.style.maxWidth = `${memorizedWidth}px`;
      } else if (props.reverse) {
        el.style.maxHeight = `${el.offsetHeight}px`;
        el.offsetHeight;
        el.style.transition = "";
        el.style.maxHeight = "0";
      } else {
        const memorizedHeight = el.offsetHeight;
        el.style.maxHeight = "0";
        el.offsetWidth;
        el.style.transition = "";
        el.style.maxHeight = `${memorizedHeight}px`;
      }
      el.offsetWidth;
    }
    function handleAfterEnter(el) {
      if (props.width) el.style.maxWidth = "";else if (!props.reverse) el.style.maxHeight = "";
      props.onAfterEnter?.();
    }
    return () => {
      const {
        group,
        width,
        appear,
        mode
      } = props;
      const type = group ? TransitionGroup : Transition;
      const resolvedProps = {
        name: width ? "fade-in-width-expand-transition" : "fade-in-height-expand-transition",
        appear,
        onEnter: handleEnter,
        onAfterEnter: handleAfterEnter,
        onBeforeLeave: handleBeforeLeave,
        onLeave: handleLeave,
        onAfterLeave: handleAfterLeave
      };
      if (!group) resolvedProps.mode = mode;
      return h(type, resolvedProps, slots);
    };
  }
});
//#endregion
export { FadeInExpandTransition_default as default };