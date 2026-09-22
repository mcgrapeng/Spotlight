import { Size } from "../../avatar/src/interface.js";
import { AvatarGroupAvatarSlotProps, AvatarGroupOption, AvatarGroupRestSlotProps } from "./public-types.js";
import { CSSProperties, VNode } from "vue";
//#region src/avatar-group/src/generic-public-types.d.ts
interface ResolvableAvatarGroupProps<T extends AvatarGroupOption = AvatarGroupOption> {
  options?: T[];
  vertical?: boolean;
  expandOnHover?: boolean;
  size?: Size;
  max?: number;
  maxStyle?: string | CSSProperties;
}
type GAvatarGroupProps<T extends AvatarGroupOption> = ResolvableAvatarGroupProps<T>;
interface GAvatarGroupSlots<T extends AvatarGroupOption> {
  avatar?: (props: AvatarGroupAvatarSlotProps<T>) => VNode[];
  rest?: (props: AvatarGroupRestSlotProps<T>) => VNode[];
  default?: () => VNode[];
}
//#endregion
export { GAvatarGroupProps, GAvatarGroupSlots };