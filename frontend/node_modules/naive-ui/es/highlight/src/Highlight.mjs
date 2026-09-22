import useConfig from "../../_mixins/use-config.mjs";
import { splitAndMarkByRegex } from "./utils.mjs";
import { computed, defineComponent, h } from "vue";
//#region src/highlight/src/Highlight.tsx
const highlightProps = {
  highlightTag: {
    type: String,
    default: "mark"
  },
  caseSensitive: Boolean,
  autoEscape: {
    type: Boolean,
    default: true
  },
  text: String,
  patterns: {
    type: Array,
    default: () => []
  },
  highlightClass: String,
  highlightStyle: [Object, String]
};
var Highlight_default = defineComponent({
  name: "Highlight",
  props: highlightProps,
  setup(props) {
    const {
      mergedClsPrefixRef
    } = useConfig();
    const escapeRegExp = text => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return {
      highlightedNode: computed(() => {
        const mergedClsPrefix = mergedClsPrefixRef.value;
        let children = [];
        const {
          patterns,
          text
        } = props;
        if (patterns.length === 0 || !text) children = [text];else {
          const {
            highlightTag,
            caseSensitive,
            autoEscape,
            highlightClass,
            highlightStyle
          } = props;
          const pattern = patterns.map(word => autoEscape ? escapeRegExp(word) : word).join("|");
          const regex = new RegExp(`(${pattern})`, caseSensitive ? "g" : "gi");
          children = splitAndMarkByRegex(text, regex).map(({
            text,
            isMatch
          }) => {
            if (isMatch) return h(highlightTag, {
              class: [`${mergedClsPrefix}-highlight__mark`, highlightClass],
              style: highlightStyle
            }, text);
            return text;
          });
        }
        return h("span", {
          class: `${mergedClsPrefix}-highlight`
        }, children);
      }),
      mergedClsPrefix: mergedClsPrefixRef
    };
  },
  render() {
    return this.highlightedNode;
  }
});
//#endregion
export { Highlight_default as default, highlightProps };