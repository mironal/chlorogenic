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
  width: 100%;
`

const Content = styled(Flexbox)`
  height: 100%;
  margin-right: 1em;
`

const App = ({ authed }: Props) => (
  <>
    <Container>
      {authed && <Header />}
      <Notification />
      <Content>
        {!authed && <SignIn />}
        {authed && <Dashboard />}
      </Content>
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
