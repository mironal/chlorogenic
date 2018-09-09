import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import { Button, Dropdown } from "semantic-ui-react"
import { models } from "../store"

type Props = ReturnType<typeof margeProps>

const View = ({
  user,
  active,
  signOut,
  signIn,
  addNew,
  onChangePanel,
  panels,
}: Props) => (
  <div>
    {user && <span>{user.displayName}</span>}
    {user && <Button onClick={addNew}>Add new Panel</Button>}
    {user &&
      panels.length > 0 && (
        <Dropdown
          defaultValue={active.uid}
          placeholder="Select panel"
          onChange={(e, { value }) => onChangePanel(`${value}`)}
          options={panels.map(p => ({
            text: p.name || "Untitled",
            value: p.uid,
          }))}
        />
      )}
    {user && <Button onClick={signOut}>Sign out</Button>}
    {!user && <Button onClick={signIn}>Sign In</Button>}
  </div>
)

const mapState = ({
  auth: { user, accessToken },
  dashboard: { panels, activePanelIndex },
}: RematchRootState<models>) => ({
  user,
  token: accessToken || "",
  panels,
  active: panels[activePanelIndex],
})

const mapDispatch = ({
  auth: { signOut, signIn },
  dashboard: { addNew, setActive },
}: RematchDispatch<models>) => ({
  signOut,
  signIn,
  addNew,
  setActive,
})

const margeProps = (
  { token, panels, ...rest }: ReturnType<typeof mapState>,
  { setActive, addNew, ...fns }: ReturnType<typeof mapDispatch>,
) => ({
  ...rest,
  ...fns,
  panels,
  onChangePanel: (uid: string) => {
    setActive({ uid })
  },
  addNew: () => addNew({ token }),
})

export default connect(
  mapState,
  mapDispatch,
  margeProps,
)(View)
