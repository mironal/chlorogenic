import { RematchRootState } from "@rematch/core"

import React from "react"
import { connect } from "react-redux"

import Dashboard from "./containers/Dashboard"

import Header from "./containers/Header"
import SignIn from "./containers/SignIn"
import Modal from "./Modal"
import { models } from "./store"
import { Flexbox, VFlexbox } from "./UX"
import styled from "./UX/Styled"

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

const Container = styled(VFlexbox)`
  height: 100%;
  width: 100%;
`
Container.displayName = "AppContainer"

const Content = styled(Flexbox)`
  height: 100%;

  > * {
    flex-grow: 1;
  }
`
Content.displayName = "AppContent"

const App: React.SFC<Props> = ({ authed }) => (
  <>
    <Container>
      {authed && <Header />}
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

App.displayName = "App"
