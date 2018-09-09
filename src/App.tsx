import { RematchDispatch, RematchRootState } from "@rematch/core"

import React from "react"
import { connect } from "react-redux"

import { Container } from "semantic-ui-react"
import Dashboard from "./containers/Dashboard"
import Notification from "./containers/Notification"

import Header from "./containers/Header"
import { models } from "./store"

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

const App = ({ authed, panelCount }: Props) => (
  <Container>
    <Header />
    <Notification />
    {!authed && <p>Please Sign in with GitHub</p>}
    {authed && panelCount === 0 && <p>Please Add new Panel</p>}
    {authed && panelCount > 0 && <Dashboard />}
  </Container>
)

const mapState = (state: RematchRootState<models>) => ({
  authed: typeof state.auth.token === "string",
  panelCount: state.dashboard.panels.length,
})
const mapDispatch = ({  }: RematchDispatch<models>) => ({})

export default connect(
  mapState,
  mapDispatch,
)(App)
