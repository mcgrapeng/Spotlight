//#region src/auto-complete/src/utils.ts
function mapAutoCompleteOptionsToSelectOptions(options) {
  return options.map(convertAutoCompleteOptionToSelectOption);
}
function convertAutoCompleteOptionToSelectOption(option) {
  if (typeof option === "string") return {
    label: option,
    value: option
  };else if (option.type === "group") return {
    type: "group",
    label: option.label ?? option.name,
    value: option.value ?? option.name,
    key: option.key || option.name,
    children: option.children.map(groupOption => convertAutoCompleteOptionToSelectOption(groupOption))
  };else return option;
}
//#endregion
export { mapAutoCompleteOptionsToSelectOptions };