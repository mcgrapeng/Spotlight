//#region src/menu/src/use-menu-child-props.ts
const useMenuChildProps = {
  internalKey: {
    type: [String, Number],
    required: true
  },
  root: Boolean,
  isGroup: Boolean,
  level: {
    type: Number,
    required: true
  },
  title: [String, Function],
  extra: [String, Function]
};
//#endregion
export { useMenuChildProps };