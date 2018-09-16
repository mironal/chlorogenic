import { RematchRootState } from "@rematch/core"

import React from "react"
import { connect } from "react-redux"

import Dashboard from "./containers/Dashboard"
import Notification from "./containers/Notification"

import Header from "./containers/Header"
import SignIn from "./containers/SignIn"
import Modal from "./Modal"
import { models } from "./store"
import { Flexbox } from "./UX"
import styled from "./UX/Styled"

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

const Container = styled(Flexbox)`
  flex-direction: column;
  height: 100%;
`

const App = ({ authed }: Props) => (
  <>
    <Container>
      <Header />
      <Notification />
      {!authed && <SignIn />}
      {authed && <Dashboard />}
    </Container>
    <Modal />
  </>
)

const mapState = (state: RematchRootState<models>) => ({
  authed: typeof state.auth.token === "string",
})
const mapDispatch = ({}) => ({})

export default connect(
  mapState,
  mapDispatch,
)(App)
