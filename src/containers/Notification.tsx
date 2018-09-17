import { RematchDispatch, RematchRootState } from "@rematch/core"
import CloseIcon from "mdi-react/CloseIcon"
import React from "react"
import { connect } from "react-redux"
import { models } from "../store"
import { Button, Flexbox, VFlexbox } from "../UX"
import styled from "../UX/Styled"
type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

const MessageContainer = styled(Flexbox)<{ type: Props["type"] }>`
  justify-content: center;
  align-items: center;
  background: ${({ theme, type }) => {
    if (type === "error") {
      return theme.redColor
    } else if (type === "success") {
      return theme.greenColor
    }
    return theme.backgroundColor
  }};
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
`

const Message = styled(VFlexbox)`
  min-width: 20vw;
  max-width: 80vw;
  min-height: 2em;
`

const View = ({ message, description, type, clear }: Props) =>
  message ? (
    <MessageContainer type={type}>
      <Message>
        {message}
        {description && <span>{description}</span>}
      </Message>
      <Button transparent={true} onClick={clear}>
        <CloseIcon />
      </Button>
    </MessageContainer>
  ) : null

const mapState = ({ notification }: RematchRootState<models>) => ({
  ...notification,
})
const mapDispatch = ({ notification: { clear } }: RematchDispatch<models>) => ({
  clear,
})

export default connect(
  mapState,
  mapDispatch,
)(View)
