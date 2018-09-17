import Color from "color"
import { css, ThemedStyledProps } from "styled-components"

import styled from "../../UX/Styled"
import { Theme } from "../../UX/theme"
import { StylesFunc } from "../../UX/UI"
import { SizeProps } from "../props"

export type ButtonProps = {
  [key: string]: any

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

const normalStyles: Styles = ({ theme }) => css`
  color: ${theme.textColor};
  background: ${theme.secondaryBaseColor};
  ${buttonActiveStyle(theme.baseColor)};
`
const disabledStyles: Styles = () => css`
  cursor: "default";
`
const positiveStyles: Styles = ({ theme }) => css`
  color: ${theme.textColor};
  background: ${theme.greenColor};
  ${buttonActiveStyle(theme.greenColor)};
`
const negativeStyles: Styles = ({ theme }) => css`
  color: ${theme.textColor};
  background: ${theme.redColor};
  ${buttonActiveStyle(theme.redColor)};
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
  ${({ disabled }) => disabled && disabledStyles}
  ${({ positive }) => positive && positiveStyles}
  ${({ negative }) => negative && negativeStyles}
}
`

Button.displayName = "Button"
export default Button
