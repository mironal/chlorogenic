import { RematchRootState } from "@rematch/core"

import React from "react"
import { connect, Provider } from "react-redux"

import Dashboard from "./containers/Dashboard"

import Header from "./containers/Header"
import SignIn from "./containers/SignIn"
import Modal from "./Modal"
import { models, store } from "./store"
import { Flexbox, VFlexbox } from "./UX"
import styled, { ThemeProvider } from "./UX/Styled"
import { theme } from "./UX/theme"

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

const AppComp: React.SFC<Props> = ({ authed }) => (
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
AppComp.displayName = "AppComp"

const mapState = (state: RematchRootState<models>) => ({
  authed: typeof state.auth.token === "string",
})
const mapDispatch = ({}) => ({})

const ConnectedApp = connect(
  mapState,
  mapDispatch,
)(AppComp)

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
