import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import { Message } from "semantic-ui-react"
import { models } from "../store"

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

const View = ({ type, message, description, clear }: Props) => (
  <Message
    onDismiss={clear}
    hidden={type === undefined}
    success={type === "success"}
    error={type === "error"}
    header={message}
    content={description}
  />
)

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
