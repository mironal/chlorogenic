import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import { Button } from "semantic-ui-react"
import { createEmptyGithubProjectPanel } from "../models/dashboard"
import { models } from "../store"

type Props = ReturnType<typeof margeProps>

const View = ({ user, signOut, signIn, addNew }: Props) => (
  <div>
    {user && <span>{user.displayName}</span>}
    {user && <Button onClick={addNew}>Add new Panel</Button>}
    {user && <Button onClick={signOut}>Sign out</Button>}
    {!user && <Button onClick={signIn}>Sign In</Button>}
  </div>
)

const mapState = ({
  auth: { user, accessToken },
}: RematchRootState<models>) => ({ user, token: accessToken || "" })
const mapDispatch = ({
  auth: { signOut, signIn },
  dashboard: { add },
}: RematchDispatch<models>) => ({
  signOut,
  signIn,
  add,
})

const margeProps = (
  { token, ...rest }: ReturnType<typeof mapState>,
  { add, ...fns }: ReturnType<typeof mapDispatch>,
) => ({
  ...rest,
  ...fns,
  addNew: () =>
    add({
      index: 0,
      active: true,
      panel: createEmptyGithubProjectPanel("Untitled", token),
    }),
})

export default connect(
  mapState,
  mapDispatch,
  margeProps,
)(View)
