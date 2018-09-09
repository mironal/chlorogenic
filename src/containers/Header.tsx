import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import { Button } from "semantic-ui-react"
import { models } from "../store"

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

const View = ({ user, signOut }: Props) => (
  <div>
    <span>{user && user.displayName}</span>
    <Button onClick={signOut}>Signout</Button>
  </div>
)

const mapState = ({ auth: { user } }: RematchRootState<models>) => ({ user })
const mapDispatch = ({ auth: { signOut } }: RematchDispatch<models>) => ({
  signOut,
})

export default connect(
  mapState,
  mapDispatch,
)(View)
