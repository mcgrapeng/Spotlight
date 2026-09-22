import { plugin } from "@css-render/plugin-bem";
import { CssRender } from "css-render";
//#region src/_utils/cssr/index.ts
const namespace = "n";
const prefix = `.n-`;
const elementPrefix = "__";
const modifierPrefix = "--";
const cssr = CssRender();
const plugin$1 = plugin({
  blockPrefix: prefix,
  elementPrefix,
  modifierPrefix
});
cssr.use(plugin$1);
const {
  c,
  find
} = cssr;
const {
  cB,
  cE,
  cM,
  cNotM
} = plugin$1;
function insideModal(style) {
  return c(({
    props: {
      bPrefix
    }
  }) => `${bPrefix || prefix}modal, ${bPrefix || prefix}drawer`, [style]);
}
function insidePopover(style) {
  return c(({
    props: {
      bPrefix
    }
  }) => `${bPrefix || prefix}popover`, [style]);
}
function asModal(style) {
  return c(({
    props: {
      bPrefix
    }
  }) => `&${bPrefix || prefix}modal`, style);
}
const cCB = (...args) => {
  return c(">", [cB(...args)]);
};
function createKey(prefix, suffix) {
  return prefix + (suffix === "default" ? "" : suffix.replace(/^[a-z]/, startChar => startChar.toUpperCase()));
}
//#endregion
export { asModal, c, cB, cCB, cE, cM, cNotM, createKey, find, insideModal, insidePopover, namespace, prefix };