import firebase from "firebase"
import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { ThemeProvider } from "styled-components"
import App from "./App"
import "./index.css"
import registerServiceWorker from "./registerServiceWorker"
import { store } from "./store"
import styled, { injectGlobal } from "./UX/Styled"
import { theme } from "./UX/theme"

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_apiKey,
  authDomain: process.env.REACT_APP_FIREBASE_authDomain,
  databaseURL: process.env.REACT_APP_FIREBASE_databaseURL,
  messagingSenderId: process.env.REACT_APP_FIREBASE_messagingSenderId,
  projectId: process.env.REACT_APP_FIREBASE_projectId,
  storageBucket: process.env.REACT_APP_FIREBASE_storageBucket,
}

if (process.env.NODE_ENV !== "production") {
  Object.values(config).forEach(v => {
    if (v === undefined) {
      throw new Error(
        `Invalid firebase config. please check .env file: ${JSON.stringify(
          config,
        )}`,
      )
    }
  })
}

firebase.initializeApp(config)

// tslint:disable-next-line:no-unused-expression
injectGlobal`
  html {
    height: 100%;
  }
  body {
    height: 100%;
    margin: 0;
    font-family: "Noto Sans", "Noto Sans CJK JP", "Roboto" ,sans-serif;
  }

  input {
    font-family: inherit;
    outline: 0;
    line-height: 1.2em;
    border: 1px solid rgba(34,36,38,.15);
    border-radius: 0.3em;
    box-shadow: none;
    padding: 0.2em;
    font-size: 1em;
  }
`
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
`

const Root = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme.main}>
      <Background>
        <App />
      </Background>
    </ThemeProvider>
  </Provider>
)

ReactDOM.render(<Root />, document.getElementById("root") as HTMLElement)
registerServiceWorker()
