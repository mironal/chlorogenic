import { RematchDispatch, RematchRootState } from "@rematch/core"

import * as React from "react"
import { connect, Provider } from "react-redux"

import Dashboard from "./containers/Dashboard"

import styled, { ThemeProvider } from "./appearance/styled"
import { theme } from "./appearance/theme"
import { Flexbox, VFlexbox } from "./components/parts"
import Header from "./containers/Header"
import Modal from "./Modal"
import { models, store } from "./store"

type SignInComponentType = typeof import("./containers/SignIn")["default"]

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

const Content = styled(Flexbox)`
  height: auto;
  min-height: 100%;

  > * {
    flex-grow: 1;
  }
`
Content.displayName = "AppContent"

const LoaidngContainer = styled(Flexbox)`
  height: 100vh;
  justify-content: center;
  align-items: center;
`

const Background = styled.div`
  color: ${({ theme: t }) => t.textColor};
  min-height: 100%;
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
interface State {
  SignInComponent?: SignInComponentType
}
class AppComponent extends React.PureComponent<Props, State> {
  public state: State = {}
  public componentDidMount() {
    this.props.subscribe()
  }

  public componentDidUpdate(prevProps: Props) {
    if (
      !prevProps.needLoadSignInComponent &&
      this.props.needLoadSignInComponent &&
      !this.state.SignInComponent
    ) {
      import("./containers/SignIn").then(comp =>
        this.setState({ SignInComponent: comp.default }),
      )
    }
  }

  public componentWillUnmount() {
    this.props.unsubscribe()
  }
  public render() {
    const { authed, loading } = this.props
    if (loading) {
      return (
        <LoaidngContainer>
          <h1>Loading... (◍•ᴗ•◍)</h1>
        </LoaidngContainer>
      )
    }
    const { SignInComponent } = this.state

    if (!authed && !SignInComponent) {
      return (
        <LoaidngContainer>
          <h1>Loading... (◍•ᴗ•◍)</h1>
        </LoaidngContainer>
      )
    }
    if (!authed && SignInComponent) {
      return (
        <VFlexbox>
          <SignInComponent />
        </VFlexbox>
      )
    }

    return (
      <VFlexbox>
        {authed && <Header />}
        <Content>{authed && <Dashboard />}</Content>
        <Modal />
      </VFlexbox>
    )
  }
}
const mapState = ({
  loadings: { userConfigLoading: loading },
  userConfig: { user },
}: RematchRootState<models>) => ({
  loading,
  authed: loading === false && !!user,
  needLoadSignInComponent: loading === false && !user,
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
