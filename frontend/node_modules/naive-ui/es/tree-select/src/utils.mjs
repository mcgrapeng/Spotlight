//#region src/tree-select/src/utils.ts
function treeOption2SelectOption(tmNode, labelField) {
  const {
    rawNode
  } = tmNode;
  return {
    ...rawNode,
    label: rawNode[labelField],
    value: tmNode.key
  };
}
function treeOption2SelectOptionWithPath(tmNode, path, separator, labelField) {
  const {
    rawNode
  } = tmNode;
  return {
    ...rawNode,
    value: tmNode.key,
    label: path.map(v => v.rawNode[labelField]).join(separator)
  };
}
//#endregion
export { treeOption2SelectOption, treeOption2SelectOptionWithPath };