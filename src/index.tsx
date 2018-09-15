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
    font-family: "Noto Sans", "Noto Sans CJK JP", Roboto ,sans-serif;
  }
`
const Background = styled.div`
  height: 100%;
  background: ${props => props.theme.baseBackground};
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
