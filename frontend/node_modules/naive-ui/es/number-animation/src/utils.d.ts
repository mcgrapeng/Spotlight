//#region src/number-animation/src/utils.d.ts
interface TweenProps {
  from: number;
  to: number;
  duration: number;
  onUpdate: (currentValue: number) => void;
  onFinish: () => void;
}
declare function tween(props: TweenProps): void;
//#endregion
export { TweenProps, tween };