// tslint:disable:ban-types

export const pipelinePromiseAction = <R>(
  fn: () => Promise<R>,
  catchFn: (error: Error) => void,
  thenFn?: () => void,
) => () =>
  fn()
    .then(thenFn)
    .catch(catchFn)

export const pipelinePromiseAction1 = <A, R>(
  fn: (a: A) => Promise<R>,
  catchFn: (error: Error) => void,
  thenFn?: () => void,
) => (a: A) =>
  fn(a)
    .then(thenFn)
    .catch(catchFn)

export const pipelinePromiseAction2 = <A, B, R>(
  fn: (a: A, b: B) => Promise<R>,
  catchFn: (error: Error) => void,
  thenFn?: () => void,
) => (a: A, b: B) =>
  fn(a, b)
    .then(thenFn)
    .catch(catchFn)

export const pipelinePromiseAction3 = <A, B, C, R>(
  fn: (a: A, b: B, c: C) => Promise<R>,
  catchFn: (error: Error) => void,
  thenFn?: () => void,
) => (a: A, b: B, c: C) =>
  fn(a, b, c)
    .then(thenFn)
    .catch(catchFn)

/**
 * No side effects.
 *
 */
export const addItemAtIndexToArray = <T>(
  array: T[],
  index: number,
  item: T,
) => {
  // https://redux.js.org/recipes/structuringreducers/immutableupdatepatterns
  const a = array.slice()
  a.splice(index, 0, item)
  return a
}

export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]

export type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>

export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>

export const pick = <T extends {}, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> =>
  keys.reduce(
    (a, key) => ({
      ...a,
      [key]: obj[key],
    }),
    {} as any,
  )
