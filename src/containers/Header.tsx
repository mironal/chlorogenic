import { RematchDispatch, RematchRootState } from "@rematch/core"
import CloseIcon from "mdi-react/CloseIcon"
import React from "react"
import { connect } from "react-redux"
import styled from "../appearance/styled"
import { HeaderMenu } from "../components"
import { Button, Flexbox, VFlexbox } from "../components/parts"
import { NotificationModel } from "../models/notification"
import { models } from "../store"

type Props = ReturnType<typeof margeProps>

const MessageContainer = styled(Flexbox)<{ type: NotificationModel["type"] }>`
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  min-width: 20vw;
  max-width: 80vw;
  min-height: 2em;
  max-height: 2.9em;
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

  button {
    margin-left: auto;
  }
`
const Message = styled(VFlexbox)<{ type: NotificationModel["type"] }>`
  text-align: center;
  flex-grow: 1;
`

const View = ({ clear, signOut, message, description, type }: Props) => (
  <HeaderMenu
    left="chlorogenic"
    center={
      message && (
        <MessageContainer type={type}>
          <Message type={type}>
            {message}
            {description && <span>{description}</span>}
          </Message>
          <Button transparent={true} onClick={clear}>
            <CloseIcon size={12} />
          </Button>
        </MessageContainer>
      )
    }
    right={
      <Button size="small" onClick={signOut} negative={true}>
        Sign out
      </Button>
    }
  />
)

const mapState = ({ notification }: RematchRootState<models>) => ({
  ...notification,
})

const mapDispatch = ({
  auth: { signOut },
  notification: { clear },
}: RematchDispatch<models>) => ({
  signOut,
  clear,
})

const margeProps = (
  { ...rest }: ReturnType<typeof mapState>,
  { ...fns }: ReturnType<typeof mapDispatch>,
) => ({
  ...rest,
  ...fns,
})

export default connect(
  mapState,
  mapDispatch,
  margeProps,
)(View)
