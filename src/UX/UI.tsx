import { css } from "styled-components"

export type StylesFunc<T> = (props: T) => ReturnType<typeof css>
