import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import { Container, Message, Tab } from "semantic-ui-react"
import "./App.css"
import Add from "./panes/Add"
import Auth from "./panes/Auth"
import Project from "./panes/Project"
import { models } from "./store"

type AppProps = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

class App extends React.Component<AppProps> {
  public componentDidMount() {
    this.props.add({ tab: "AuthPane" })
    if (this.props.authed) {
      this.props.add({ tab: "AddPane", pos: 0, select: true })
    }
  }
  public componentDidUpdate(prevProps: AppProps) {
    if (!prevProps.authed && this.props.authed) {
      this.props.add({ tab: "AddPane", pos: 0, select: true })
    }
  }
  public render() {
    const { error, user, tabs, tabIndex } = this.props
    const panes = tabs.map(t => {
      if (t === "AddPane") {
        return { menuItem: "Add", render: () => <Add /> }
      } else if (t === "AuthPane") {
        return { menuItem: "Auth", render: () => <Auth /> }
      }
      return {
        menuItem: `${t.slug}`,
        render: () => <Project project={t} />,
      }
    })
    const header = user ? <p>{user.displayName}</p> : null

    return (
      <Container>
        {error && <Message negative={true}>{error.message}</Message>}
        {header}
        <Tab
          panes={panes}
          activeIndex={tabIndex}
          onTabChange={(_, data) => this.props.select(data.activeIndex)}
        />
      </Container>
    )
  }
}

const mapState = (state: RematchRootState<models>) => ({
  error: state.github.error,
  tabs: state.tab.tabs,
  tabIndex: state.tab.activeTabIndex,
  authed: typeof state.auth.accessToken === "string",
  user: state.auth.user,
})
const mapDispatch = ({ tab: { add, select } }: RematchDispatch<models>) => ({
  select,
  add,
})

export default connect(
  mapState,
  mapDispatch,
)(App)
