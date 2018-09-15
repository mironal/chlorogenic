import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import HeaderMenu from "../components/HeaderMenu"
import { models } from "../store"
import { Button } from "../UX"

type Props = ReturnType<typeof margeProps>

const View = ({ signOut }: Props) => (
  <HeaderMenu
    left="chlorogenic"
    right={
      <Button onClick={signOut} negative={true}>
        Sign out
      </Button>
    }
  />
)

const mapState = ({  }: RematchRootState<models>) => ({})

const mapDispatch = ({ auth: { signOut } }: RematchDispatch<models>) => ({
  signOut,
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
