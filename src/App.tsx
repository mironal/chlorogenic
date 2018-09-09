import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import { Container } from "semantic-ui-react"
import Dashboard from "./containers/Dashboard"
import Notification from "./containers/Notification"

import Header from "./containers/Header"
import { models } from "./store"

type AppProps = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

class App extends React.Component<AppProps> {
  public render() {
    return (
      <Container>
        <Header />
        <Notification />
        <Dashboard />
      </Container>
    )
  }
}

const mapState = (state: RematchRootState<models>) => ({
  token: state.auth.accessToken,
  user: state.auth.user,
  panelCount: state.dashboard.panels.length,
})
const mapDispatch = ({  }: RematchDispatch<models>) => ({})

export default connect(
  mapState,
  mapDispatch,
)(App)
