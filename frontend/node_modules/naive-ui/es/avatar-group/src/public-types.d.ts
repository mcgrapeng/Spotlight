//#region src/avatar-group/src/public-types.d.ts
interface AvatarGroupAvatarSlotProps<T extends AvatarGroupOption = AvatarGroupOption> {
  option: T;
}
interface AvatarGroupRestSlotProps<T extends AvatarGroupOption = AvatarGroupOption> {
  options: Array<T>;
  rest: number;
}
interface AvatarGroupOption {
  src: string;
}
//#endregion
export { AvatarGroupAvatarSlotProps, AvatarGroupOption, AvatarGroupRestSlotProps };