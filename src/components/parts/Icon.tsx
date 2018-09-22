import { ThemedStyledProps } from "styled-components"
import styled, { css } from "../../appearance/styled"
import { Theme } from "../../appearance/theme"
import { StylesFunc } from "../../appearance/utils"
import { SizeProps } from "./"
import Flexbox from "./Flexbox"

export type IconProps = {
  [key: string]: any
} & SizeProps

type ThemedStylesProps = ThemedStyledProps<IconProps, Theme>
type Styles = StylesFunc<ThemedStylesProps>

const iconSize: Styles = ({ theme, size }) => css`
  > .mdi-icon {
    width: ${size === "big" ? "1.8em" : "1.3em"};
    height: ${size === "big" ? "1.8em" : "1.3em"};
    margin-right: 0.1em;
    margin-left: -0.2em;
  }
`

const Icon = styled(Flexbox)<IconProps>`
  justify-content: center;
  align-items: center;

  ${iconSize};
`

Icon.displayName = "Icon"

export default Icon
