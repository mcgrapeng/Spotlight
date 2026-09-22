//#region src/number-animation/src/utils.ts
const easeOut = t => 1 - (1 - t) ** 5;
function tween(props) {
  const {
    from,
    to,
    duration,
    onUpdate,
    onFinish
  } = props;
  const startTime = performance.now();
  const tick = () => {
    const current = performance.now();
    const elapsedTime = Math.min(current - startTime, duration);
    const currentValue = from + (to - from) * easeOut(elapsedTime / duration);
    if (elapsedTime === duration) {
      onFinish();
      return;
    }
    onUpdate(currentValue);
    requestAnimationFrame(tick);
  };
  tick();
}
//#endregion
export { tween };