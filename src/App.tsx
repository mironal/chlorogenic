import { RematchDispatch, RematchRootState } from "@rematch/core"

import * as React from "react"
import { connect, Provider } from "react-redux"

import styled, { ThemeProvider } from "./appearance/styled"
import { theme } from "./appearance/theme"
import { Flexbox } from "./components/parts"
import { MainRouter } from "./routes"
import { models, store } from "./store"

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

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
      return (
        <LoaidngContainer>
          <h1>Loading... (◍•ᴗ•◍)</h1>
        </LoaidngContainer>
      )
    }
    return <MainRouter authed={authed} />
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
