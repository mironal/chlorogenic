import { css } from "./styled"
export type StylesFunc<T> = (props: T) => ReturnType<typeof css>
