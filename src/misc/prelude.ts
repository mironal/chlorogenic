// tslint:disable:ban-types

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

/**
 * No side effects.
 */
export const removeItemAtIndexInArray = <T>(array: T[], index: number) => {
  // https://redux.js.org/recipes/structuringreducers/immutableupdatepatterns
  const a = array.slice()
  a.splice(index, 1)
  return a
}

export const removeItemInArray = <T>(array: T[], item: T) =>
  array.filter(i => i !== item)

export const replaceItemInArray = <T>(array: T[], from: T, to: T) =>
  array.map(i => (i === from ? to : i))

export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]

export type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>

export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>
