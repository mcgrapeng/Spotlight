import { CNode, CProperties } from "css-render";
//#region src/_utils/cssr/index.d.ts
declare const namespace = "n";
declare const prefix = ".n-";
declare const c: import("css-render").createCNode<import("css-render").CSelector>, find: import("css-render").CFindTarget;
declare const cB: import("css-render").createCNode<string | import("css-render").CLazySelector<string>>, cE: import("css-render").createCNode<string | import("css-render").CLazySelector<string>>, cM: import("css-render").createCNode<string | import("css-render").CLazySelector<string>>, cNotM: import("css-render").createCNode<string | import("css-render").CLazySelector<string>>;
declare function insideModal(style: CNode): CNode;
declare function insidePopover(style: CNode): CNode;
declare function asModal(style: CProperties): CNode;
declare const cCB: typeof cB;
declare function createKey<P extends string, S extends string>(prefix: P, suffix: S): S extends 'default' ? P : `${P}${Capitalize<S>}`;
//#endregion
export { asModal, c, cB, cCB, cE, cM, cNotM, createKey, find, insideModal, insidePopover, namespace, prefix };