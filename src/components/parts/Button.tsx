import * as Color from "color"
import { ThemedStyledProps } from "styled-components"
import { StylesFunc } from "../../appearance/utils"
import { SizeProps } from "./props"

import styled, { css } from "../../appearance/styled"
import { Theme } from "../../appearance/theme"

export type ButtonProps = {
  [key: string]: any
  transparent?: boolean
  disabled?: boolean
  negative?: boolean
  positive?: boolean
} & SizeProps

type ThemedStylesProps = ThemedStyledProps<ButtonProps, Theme>
type Styles = StylesFunc<ThemedStylesProps>

const buttonActiveStyle = (color: string) => css`
  :focus {
    outline: none;
    border: inherit;
  }
  :active {
    outline: none;
    border: inherit;
    background: ${Color(color)
      .darken(0.1)
      .toString()};
  }
`

const disabledColor = (color: string, disabled?: boolean): string =>
  disabled
    ? Color(color)
        .grayscale()
        .toString()
    : color

const normalStyles: Styles = ({ theme, disabled }) => css`
  color: ${theme.textColor};
  border: solid 1px ${theme.secondaryBaseColor};
  background: ${disabledColor(theme.secondaryBaseColor, disabled)};
  ${buttonActiveStyle(theme.baseColor)};
`
const disabledStyles: Styles = () => css`
  cursor: default;
`
const positiveStyles: Styles = ({ theme, disabled }) => css`
  color: ${theme.textColor};
  border: solid 1px ${theme.greenColor};
  background: ${disabledColor(theme.greenColor, disabled)};
  ${buttonActiveStyle(theme.greenColor)};
`
const negativeStyles: Styles = ({ theme, disabled }) => css`
  color: ${theme.textColor};
  border: solid 1px ${theme.redColor};
  background: ${disabledColor(theme.redColor, disabled)};
  ${buttonActiveStyle(theme.redColor)};
`

const transparentStyles: Styles = ({}) => css`
  background: transparent;
  border: 0;
  ${buttonActiveStyle("transparent")};
`

const Button = styled.button<ButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.3em;
  border: 0;
  font-size: ${({ size }) => {
    let baseSize = 1
    switch (size) {
      case "small":
        baseSize *= 0.8
        break
      case "big":
        baseSize *= 1.5
        break
    }
    return `${baseSize}em`
  }};
  cursor: pointer;
  margin: 0.2em;
  padding: ${({ size }) => {
    if (size) {
      return "0.4em"
    }
    return "0.6em"
  }};
  ${normalStyles}
  ${({ positive }) => positive && positiveStyles}
  ${({ negative }) => negative && negativeStyles}
  ${({ transparent }) => transparent && transparentStyles}
  ${({ disabled }) => disabled && disabledStyles}
}
`

Button.displayName = "Button"
export default Button
