import { RematchDispatch, RematchRootState } from "@rematch/core"

import React from "react"
import { connect, Provider } from "react-redux"

import Dashboard from "./containers/Dashboard"

import styled, { ThemeProvider } from "./appearance/styled"
import { theme } from "./appearance/theme"
import { Flexbox, VFlexbox } from "./components/parts"
import Header from "./containers/Header"
import SignIn from "./containers/SignIn"
import Modal from "./Modal"
import { models, store } from "./store"

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

const Background = styled.div`
  color: ${({ theme: t }) => t.textColor};
  height: 100%;
  background: ${props => props.theme.secondaryBackgroundColor};

  a {
    color: ${({ theme: t }) => t.secondaryBaseColor};

    &:visited {
      color: ${({ theme: t }) => t.baseColor};
    }
  }

  input {
    &:placeholder-shown {
      color: ${({ theme: t }) => t.secondaryTextColor};
    }
    color: ${({ theme: t }) => t.textColor};
    background: ${({ theme: t }) => t.secondaryBackgroundColor};
  }
`
Background.displayName = "Background"

class AppComponent extends React.PureComponent<Props> {
  public componentDidMount() {
    this.props.subscribe()
  }

  public componentWillUnmount() {
    this.props.unsubscribe()
  }
  public render() {
    const { authed, loading } = this.props
    if (loading) {
      return <p>Loading...</p>
    }
    return (
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
  }
}
const mapState = ({
  loadings: { userConfigLoading: loading },
  userConfig: { user },
}: RematchRootState<models>) => ({
  loading,
  authed: loading === false && !!user,
})
const mapDispatch = ({
  userConfig: { subscribe, unsubscribe },
}: RematchDispatch<models>) => ({
  subscribe,
  unsubscribe,
})

const ConnectedApp = connect(
  mapState,
  mapDispatch,
)(AppComponent)

const App: React.SFC = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme.main}>
      <Background>
        <ConnectedApp />
      </Background>
    </ThemeProvider>
  </Provider>
)

App.displayName = "App"

export default App
