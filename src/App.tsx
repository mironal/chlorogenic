import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import { Container, Tab, TabProps } from "semantic-ui-react"
import "./App.css"
import Add from "./panes/Add"
import Auth from "./panes/Auth"
import { models } from "./store"

type AppProps = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

class App extends React.Component<AppProps> {
  public render() {
    const { authed, user } = this.props

    const panes: TabProps["panes"] = []
    if (authed) {
      panes.push({ menuItem: "Add", render: () => <Add /> })
    }
    panes.push({ menuItem: "Auth", render: () => <Auth /> })
    const header = user ? <p>{user.displayName}</p> : null

    return (
      <Container>
        {header}
        <Tab panes={panes} />
      </Container>
    )
  }
}

const mapState = (state: RematchRootState<models>) => ({
  authed: typeof state.auth.accessToken === "string",
  user: state.auth.user,
})
const mapDispatch = ({  }: RematchDispatch<models>) => ({})

export default connect(
  mapState,
  mapDispatch,
)(App)
