import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import { models } from "../store"
import { Flexbox } from "../UX"

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

const View = ({ type, message, description, clear }: Props) => (
  <Flexbox>{message}</Flexbox>
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
