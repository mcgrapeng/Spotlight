//#region src/_utils/ts/ts.d.ts
type ThemeRelatedProps = 'theme' | 'themeOverrides' | 'builtinThemeOverrides';
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
type Expect<T extends true> = T;
//#endregion
export { Equal, Expect, ThemeRelatedProps };