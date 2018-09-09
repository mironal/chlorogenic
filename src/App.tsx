import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import { Container, Message, Segment } from "semantic-ui-react"
import Dashboard from "./containers/Dashboard"
import Notification from "./containers/Notification"

import { models } from "./store"

type AppProps = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

class App extends React.Component<AppProps> {
  public componentDidMount() {
    const { token, panelCount } = this.props
    if (token && panelCount === 0) {
      this.props.add({
        index: 0,
        active: true,
        panel: {
          name: "First",
          token,
        },
      })
    }
  }
  public render() {
    return (
      <Container>
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
const mapDispatch = ({ dashboard: { add } }: RematchDispatch<models>) => ({
  add,
})

export default connect(
  mapState,
  mapDispatch,
)(App)
