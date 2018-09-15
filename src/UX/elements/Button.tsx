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
    border: none;
  }
  :active {
    outline: none;
    border: none;
    background: ${Color(color)
      .darken(0.1)
      .toString()};
  }
`

const normalStyles: Styles = ({ theme }) => css`
  color: ${theme.text};
  background: ${theme.background};
  ${buttonActiveStyle(theme.background)};
`
const disabledStyles: Styles = () => css`
  cursor: "default";
`
const positiveStyles: Styles = ({ theme }) => css`
  background: ${theme.positive};
  ${buttonActiveStyle(theme.positive)};
`
const negativeStyles: Styles = ({ theme }) => css`
  background: ${theme.negative};
  ${buttonActiveStyle(theme.negative)};
`

const Button = styled.button<ButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0;
  border-radius: 2px;
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
  margin: 0.4em;
  padding: ${({ size }) => {
    if (size) {
      return "0.4em"
    }
    return "0.8em"
  }};
  ${normalStyles}
  ${({ disabled }) => disabled && disabledStyles}
  ${({ positive }) => positive && positiveStyles}
  ${({ negative }) => negative && negativeStyles}
}
`

Button.displayName = "Button"
export default Button
